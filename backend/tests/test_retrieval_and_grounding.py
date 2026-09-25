import pytest
from app.retrieval.bis_retriever import BISRetriever
from app.rag.grounding import GroundingChecker
from app.rag.query_understanding import QueryUnderstanding

def test_retriever_is456_clause_match():
    retriever = BISRetriever()
    evidence, sources, standards = retriever.retrieve_with_context("IS 456 clause 26.4 cover")
    assert len(evidence) > 0
    assert any("26.4" in (e.clause or "") for e in evidence)
    assert any("IS 456" in (e.standard_number or "") for e in evidence)
    assert len(standards) >= 1
    assert any("IS 456" in s.standard_number for s in standards)
    assert len(sources) >= 1
    # Check required evidence fields
    ev = evidence[0]
    assert ev.id
    assert ev.source_id
    assert ev.text
    assert ev.relevance in ["high", "medium", "low"]
    assert ev.citation_index >= 1

def test_retriever_drinking_water():
    retriever = BISRetriever()
    evidence, sources, standards = retriever.retrieve_with_context("drinking water permissible limits for pH and TDS")
    assert len(evidence) > 0
    assert any("10500" in (e.standard_number or "") for e in evidence)
    assert any("pH" in e.text for e in evidence)

def test_grounding_checker():
    retriever = BISRetriever()
    checker = GroundingChecker()

    # Good evidence
    ev, _, _ = retriever.retrieve_with_context("IS 456 concrete grades")
    status, insufficient_info = checker.check_grounding("IS 456 concrete grades", ev)
    assert status == "grounded"
    assert insufficient_info is None

    # Empty evidence
    status_empty, insufficient_empty = checker.check_grounding("quantum physics warp drive", [])
    assert status_empty == "insufficient_evidence"
    assert insufficient_empty is not None
    assert insufficient_empty.reason_key == "no_match"
    assert len(insufficient_empty.suggestions) > 0

def test_query_understanding():
    qu = QueryUnderstanding()

    res1 = qu.analyze_query("What is the cover required under IS 456:2000?")
    assert res1.intent in ["standard_explanation", "standard_search"]
    assert any(e.type == "standard_number" for e in res1.entities)

    res2 = qu.analyze_query("How to apply for ISI mark certification?")
    assert res2.intent in ["certification", "certification_process"]
    assert any(e.type == "scheme" for e in res2.entities)

    res3 = qu.analyze_query("Where is the BIS laboratory located in Sahibabad?")
    assert res3.intent in ["laboratory", "testing"]
    assert any(e.type == "laboratory" or e.type == "location" for e in res3.entities)
