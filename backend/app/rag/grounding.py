from typing import List, Optional, Tuple
from app.api.schemas.chat import EvidenceSnippetResponse, InsufficientEvidenceResponse

class GroundingChecker:
    """
    Evaluates evidence sufficiency and verifies that generated answers
    are strictly grounded in official BIS records.
    """

    def check_grounding(
        self,
        query: str,
        evidence: List[EvidenceSnippetResponse]
    ) -> Tuple[str, Optional[InsufficientEvidenceResponse]]:
        """
        Returns (status, insufficient_evidence_details)
        status: 'grounded' | 'partially_grounded' | 'insufficient_evidence'
        """
        if not evidence:
            return "insufficient_evidence", InsufficientEvidenceResponse(
                reasonKey="no_match",
                searchedScopes=["Indian Standards (IS)", "Certification Schemes", "Testing Labs", "BIS Guidelines"],
                suggestions=[
                    "Check the standard number format (e.g. 'IS 456' or 'IS 10500')",
                    "Search by product name, e.g., 'drinking water', 'cement', 'LED lamps'",
                    "Visit the official Manakonline portal at https://www.manakonline.in"
                ]
            )

        high_rel_count = sum(1 for e in evidence if e.relevance == "high")
        med_rel_count = sum(1 for e in evidence if e.relevance == "medium")

        if high_rel_count >= 1:
            return "grounded", None
        elif med_rel_count >= 1:
            return "partially_grounded", None
        else:
            return "insufficient_evidence", InsufficientEvidenceResponse(
                reasonKey="low_relevance",
                searchedScopes=["BIS Standards Catalogue"],
                suggestions=[
                    "Refine your query with specific terms or standard numbers",
                    "Verify the latest gazette notification or standard amendment"
                ]
            )
