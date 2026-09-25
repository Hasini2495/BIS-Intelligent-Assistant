from app.llm.base import BaseLLMProvider
from typing import List, Any, Optional, Dict

class DemoLLMProvider(BaseLLMProvider):
    def generate(
        self,
        prompt: str,
        context: List[Any],
        language: str = "en",
        history: Optional[List[Dict[str, str]]] = None
    ) -> str:
        if not context:
            if language.lower() in ["te", "telugu"]:
                return (
                    "అధికారిక BIS రికార్డులలో ఈ ప్రశ్నకు తగినంత సమాచారం అందుబాటులో లేదు. "
                    "దయచేసి https://www.manakonline.in లో ధృవీకరించండి లేదా సమీప BIS బ్రాంచ్ కార్యాలయాన్ని సంప్రదించండి."
                )
            return (
                "Official BIS documentation does not provide sufficient detail to answer this query. "
                "Please verify at https://www.manakonline.in or consult your nearest BIS Branch Office."
            )

        lang_lower = language.lower()
        if lang_lower in ["te", "telugu"]:
            answer = "### భారతీయ ప్రమాణాల బ్యూరో (BIS) — సాంకేతిక మార్గదర్శకాలు\n\n"
            answer += f"మీ ప్రశ్న **{prompt}** కి సంబంధించి, సంబంధిత భారతీయ ప్రమాణాల నిబంధనలు ఇక్కడ ఇవ్వబడ్డాయి:\n\n"
            for idx, ev in enumerate(context):
                std_num = getattr(ev, "standard_number", None) or getattr(ev, "title", "BIS Standard")
                clause = getattr(ev, "clause", None)
                clause_str = f" (Clause {clause})" if clause else ""
                text = getattr(ev, "text", getattr(ev, "content", ""))
                citation_idx = getattr(ev, "citation_index", idx + 1)
                answer += f"- **[{citation_idx}] {std_num}{clause_str}**: {text}\n"
            answer += "\n\n*గమనిక: తాజా గెజిట్ నోటిఫికేషన్‌లు మరియు సవరణల కోసం manakonline.in ని చూడండి.*"
            return answer

        answer = "### Bureau of Indian Standards — Technical Advisory\n\n"
        answer += f"In response to your query regarding **{prompt}**, the following verified BIS provisions apply:\n\n"
        for idx, ev in enumerate(context):
            std_num = getattr(ev, "standard_number", None) or getattr(ev, "title", "BIS Standard")
            clause = getattr(ev, "clause", None)
            clause_str = f" (Clause {clause})" if clause else ""
            text = getattr(ev, "text", getattr(ev, "content", ""))
            citation_idx = getattr(ev, "citation_index", idx + 1)
            answer += f"- **[{citation_idx}] {std_num}{clause_str}**: {text}\n"

        answer += "\n\n*Note: Manufacturers and consumers should ensure compliance with the latest gazette notifications and amendments.*"
        return answer
