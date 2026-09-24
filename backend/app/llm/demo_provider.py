from app.llm.base import BaseLLMProvider
from typing import List, Any

class DemoLLMProvider(BaseLLMProvider):
    def generate(self, prompt: str, context: List[Any], language: str) -> str:
        if not context:
            return "I don't have enough information to answer that."
        
        answer = "Based on the retrieved standards:\n"
        for idx, ev in enumerate(context):
            answer += f"[{idx+1}] {ev.title}: {ev.content}\n"
            
        return answer
