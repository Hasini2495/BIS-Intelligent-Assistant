from typing import List, Dict, Any

class GroundingChecker:
    def check_grounding(self, answer: str, evidence: List[Any]) -> str:
        if not evidence:
            return "insufficient_evidence"
        return "success"
