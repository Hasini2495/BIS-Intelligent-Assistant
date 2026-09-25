import pytest
from unittest.mock import MagicMock
from app.llm.base import BaseLLMProvider
from app.llm.demo_provider import DemoLLMProvider
from app.llm.gemini_provider import GeminiLLMProvider
from app.llm.factory import LLMProviderFactory
from app.api.schemas.chat import EvidenceSnippetResponse

def test_demo_llm_provider():
    provider = DemoLLMProvider()
    ev = [
        EvidenceSnippetResponse(
            id="chk-1",
            sourceId="src-1",
            text="Mild exposure requires 20mm cover.",
            standardNumber="IS 456:2000",
            clause="26.4",
            citationIndex=1,
            relevance="high"
        )
    ]
    answer = provider.generate(prompt="What is concrete cover?", context=ev, language="en")
    assert "[1]" in answer
    assert "IS 456:2000" in answer
    assert "20mm" in answer

def test_llm_factory():
    demo = LLMProviderFactory.create("demo")
    assert isinstance(demo, DemoLLMProvider)

    gemini = LLMProviderFactory.create("gemini")
    assert isinstance(gemini, GeminiLLMProvider)

def test_gemini_provider_mocked():
    provider = GeminiLLMProvider(api_key="test-api-key", model="gemini-2.5-flash")
    # Mock the client
    mock_client = MagicMock()
    mock_response = MagicMock()
    mock_response.text = "Under **IS 456:2000** Clause 26.4 [1], nominal cover for mild exposure is 20 mm."
    mock_client.models.generate_content.return_value = mock_response
    provider.client = mock_client

    ev = [
        EvidenceSnippetResponse(
            id="chk-1",
            sourceId="src-1",
            text="Mild exposure requires 20mm nominal cover.",
            standardNumber="IS 456:2000",
            clause="26.4",
            citationIndex=1,
            relevance="high"
        )
    ]
    res = provider.generate("What is nominal cover in IS 456?", context=ev, language="en")
    assert "IS 456:2000" in res
    assert "[1]" in res
    mock_client.models.generate_content.assert_called_once()
