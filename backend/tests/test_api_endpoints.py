import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_chat_endpoint_contract(client: AsyncClient):
    payload = {
        "message": "What is the minimum concrete cover under IS 456 for mild exposure?",
        "language": "en"
    }
    response = await client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Top-level ChatResponse
    assert "message" in data
    assert "conversationId" in data
    assert "conversationTitle" in data
    conv_id = data["conversationId"]

    # MessageResponse
    msg = data["message"]
    assert msg["id"]
    assert msg["conversationId"] == conv_id
    assert msg["role"] == "assistant"
    assert msg["status"] == "complete"
    assert "content" in msg
    assert "answer" in msg

    # GroundedAnswer
    ans = msg["answer"]
    assert ans["status"] in ["grounded", "partially_grounded"]
    assert ans["answerMarkdown"]
    assert len(ans["evidence"]) > 0
    ev0 = ans["evidence"][0]
    assert "sourceId" in ev0
    assert "citationIndex" in ev0
    assert "relevance" in ev0
    assert "text" in ev0
    assert len(ans["relevantStandards"]) > 0
    assert len(ans["sources"]) > 0
    assert "disclaimerKeys" in ans
    assert "generatedAt" in ans

@pytest.mark.asyncio
async def test_regression_is456_question(client: AsyncClient):
    res = await client.post("/api/chat", json={"message": "What is IS 456?", "language": "en"})
    assert res.status_code == 200
    data = res.json()
    ans = data["message"]["answer"]
    assert ans["status"] == "grounded"
    assert any("IS 456" in s["standardNumber"] for s in ans["relevantStandards"])
    assert any("IS 456" in (e.get("standardNumber") or "") for e in ans["evidence"])
    assert "IS 456" in data["message"]["content"]

@pytest.mark.asyncio
async def test_regression_is456_followup_question(client: AsyncClient):
    # Turn 1
    t1 = await client.post("/api/chat", json={"message": "What is IS 456?", "language": "en"})
    assert t1.status_code == 200
    conv_id = t1.json()["conversationId"]

    # Turn 2: Follow-up using pronoun "it"
    t2 = await client.post("/api/chat", json={
        "message": "What does it say about concrete?",
        "conversationId": conv_id,
        "language": "en"
    })
    assert t2.status_code == 200
    t2_data = t2.json()
    assert t2_data["conversationId"] == conv_id
    analysis = t2_data["message"].get("analysis", {})
    # Context understanding must rewrite or link "it" to IS 456
    assert "IS 456" in (analysis.get("rewrittenQuery") or "") or any("IS 456" in e["value"] for e in analysis.get("entities", []))
    # Must retrieve concrete-related clauses (e.g. Clause 6 or Clause 5)
    evidence = t2_data["message"]["answer"]["evidence"]
    assert len(evidence) > 0
    assert any("concrete" in e["text"].lower() for e in evidence)

@pytest.mark.asyncio
async def test_regression_is10500_question(client: AsyncClient):
    res = await client.post("/api/chat", json={"message": "What is IS 10500?", "language": "en"})
    assert res.status_code == 200
    data = res.json()
    ans = data["message"]["answer"]
    assert ans["status"] == "grounded"
    # Ensure it answers the question with Drinking Water specs, NOT a generic help message
    assert "I can assist you with comprehensive information" not in data["message"]["content"]
    assert any("10500" in s["standardNumber"] for s in ans["relevantStandards"])
    assert any("drinking water" in e["text"].lower() or "10500" in (e.get("standardNumber") or "") for e in ans["evidence"])

@pytest.mark.asyncio
async def test_regression_telugu_question(client: AsyncClient):
    res = await client.post("/api/chat", json={"message": "IS 456 అంటే ఏమిటి?", "language": "te"})
    assert res.status_code == 200
    data = res.json()
    msg = data["message"]
    # Language preservation
    assert msg["language"] == "te"
    assert msg["analysis"]["detectedLanguage"] == "te"
    assert len(msg["answer"]["evidence"]) > 0

@pytest.mark.asyncio
async def test_regression_insufficient_evidence(client: AsyncClient):
    res = await client.post("/api/chat", json={
        "message": "What is the warp drive antimatter dilution ratio under BIS standards?",
        "language": "en"
    })
    assert res.status_code == 200
    data = res.json()
    ans = data["message"]["answer"]
    assert ans["status"] == "insufficient_evidence"
    assert ans["insufficientEvidence"] is not None
    assert ans["insufficientEvidence"]["reasonKey"] in ["no_match", "low_relevance"]
    assert len(ans["insufficientEvidence"]["suggestions"]) > 0

@pytest.mark.asyncio
async def test_regression_citation_correctness_and_no_fabrication(client: AsyncClient):
    res = await client.post("/api/chat", json={"message": "What are the grades of concrete in IS 456?", "language": "en"})
    assert res.status_code == 200
    data = res.json()
    evidence = data["message"]["answer"]["evidence"]
    assert len(evidence) > 0
    for ev in evidence:
        assert ev["id"].startswith("chk_")
        assert ev["sourceId"]
        assert ev["text"]
        assert ev["citationIndex"] >= 1
        # No fabricated clause: clause must be a valid clause identifier or None
        if ev["clause"]:
            assert any(c in ev["clause"] for c in ["1", "5", "6", "8.2", "26.4", "34.2", "Process", "Accreditation", "How to Avail"])

@pytest.mark.asyncio
async def test_standards_endpoints(client: AsyncClient):
    res = await client.get("/api/standards")
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert data["total"] >= 6
    assert data["items"][0]["standardNumber"]

    std_id = data["items"][0]["id"]
    res_single = await client.get(f"/api/standards/{std_id}")
    assert res_single.status_code == 200
    assert res_single.json()["id"] == std_id

    res_num = await client.get("/api/standards/number/IS 456:2000")
    assert res_num.status_code == 200
    assert "IS 456" in res_num.json()["standardNumber"]

@pytest.mark.asyncio
async def test_certification_schemes_endpoint(client: AsyncClient):
    res = await client.get("/api/certification/schemes")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 4
    scheme_ids = [s["id"] for s in data]
    assert "isi-mark" in scheme_ids
    assert "crs" in scheme_ids
    assert "hallmarking" in scheme_ids

@pytest.mark.asyncio
async def test_labs_endpoint(client: AsyncClient):
    res = await client.get("/api/labs")
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert data["total"] >= 5
    assert any("Central Laboratory" in l["name"] or "Ghaziabad" in (l.get("city") or "") for l in data["items"])

@pytest.mark.asyncio
async def test_services_endpoint(client: AsyncClient):
    res = await client.get("/api/services")
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert data["total"] >= 4

@pytest.mark.asyncio
async def test_feedback_endpoint(client: AsyncClient):
    fb_payload = {
        "messageId": "msg-123",
        "conversationId": "conv-456",
        "rating": "helpful",
        "reasons": [],
        "comment": "Accurate response with proper clause citation"
    }
    res = await client.post("/api/feedback", json=fb_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["messageId"] == "msg-123"
    assert data["rating"] == "helpful"
