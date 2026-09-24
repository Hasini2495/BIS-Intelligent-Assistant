import re
from typing import Dict, Any, List
from app.utils.text import extract_keywords

class QueryUnderstanding:
    def analyze_query(self, text: str, language: str) -> Dict[str, Any]:
        keywords = extract_keywords(text)
        intent = "general_qa"
        
        text_lower = text.lower()
        if "standard" in text_lower or "is " in text_lower:
            intent = "standards_search"
        elif "certification" in text_lower or "scheme" in text_lower:
            intent = "certification_info"
        elif "lab" in text_lower or "test" in text_lower:
            intent = "laboratory_search"
            
        return {
            "intent": intent,
            "entities": keywords,
            "detected_language": language
        }
