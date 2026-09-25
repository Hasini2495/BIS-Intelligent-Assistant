import logging
from typing import List, Any, Optional, Dict
from google import genai
from google.genai import types
from google.genai.errors import APIError

from app.llm.base import BaseLLMProvider
from app.config import get_settings

logger = logging.getLogger(__name__)

LANGUAGE_NAMES = {
    "te": "Telugu (తెలుగు)",
    "hi": "Hindi (हिन्दी)",
    "ta": "Tamil (தமிழ்)",
    "kn": "Kannada (ಕನ್ನಡ)",
    "ml": "Malayalam (മലയാളം)",
    "mr": "Marathi (मराठी)",
    "bn": "Bengali (বাংলা)",
    "gu": "Gujarati (ગુજરાતી)",
    "or": "Odia (ଓଡ଼ିଆ)",
    "pa": "Punjabi (ਪੰਜਾਬੀ)",
    "ur": "Urdu (اردو)",
    "en": "English"
}

BIS_SYSTEM_PROMPT = """You are the official AI Assistant for the Bureau of Indian Standards (BIS - भारतीय मानक ब्यूरो), the National Standards Body of India established under the BIS Act, 2016.

Your purpose is to provide authentic, authoritative, and helpful guidance on:
- Indian Standards (IS specifications, codes of practice, guides)
- Product Certification Schemes (ISI Mark Scheme I, Compulsory Registration Scheme CRS Scheme II, Foreign Manufacturers Certification Scheme FMCS)
- Hallmarking Scheme for Gold & Silver Jewellery/Artefacts (IS 1417, IS 2112, HUID)
- Laboratory Testing, recognition, and conformity assessment procedures
- General BIS citizen & industry services (e-BIS, Manakonline, Know Your Standards, Care App)

CRITICAL GROUNDING AND CITATION ACCURACY RULES:
1. Ground your technical details STRICTLY in the provided BIS Evidence Context.
2. NEVER fabricate, hallucinate, extrapolate, or guess standard numbers, clause designations, test parameters, limits, chemical percentages, or mandatory deadlines.
3. Every factual claim MUST be attributed using bracketed citation indices such as [1], [2] matching the specific evidence excerpt that supports that exact claim.
4. DO NOT attribute facts to an evidence item if that evidence item does not contain them. For example, do not cite a Scope clause (Clause 1) for concrete grades or cement specifications if the scope text does not describe those.
5. If the provided evidence does not contain sufficient information to answer the user's question, do not speculate. State clearly that the current official records do not contain adequate details, and direct the user to verify at https://www.manakonline.in or contact the nearest BIS Branch Office.
6. Provide structured, professional formatting using clean Markdown headings, bullet points, and tables where comparative criteria or limits are explained.
7. Language handling: If an Indian language is requested, write the complete conversational and explanatory text in that language, but ALWAYS preserve formal standard designations in English alphanumeric format (e.g. "IS 456:2000", "IS 10500:2012", "IS 302-2-3:2007", "HUID", "Clause 26.4").
"""

class GeminiLLMProvider(BaseLLMProvider):
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        settings = get_settings()
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model = model or getattr(settings, "GEMINI_MODEL", "gemini-2.5-flash")
        
        if not self.api_key:
            logger.warning("GEMINI_API_KEY is not configured.")
            self.client = None
        else:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.error(f"Failed to initialize Google GenAI Client: {e}")
                self.client = None

    def _build_context_prompt(self, context: List[Any]) -> str:
        if not context:
            return "NO RELEVANT BIS EVIDENCE FOUND IN DATABASE."
        
        context_lines = ["--- BEGIN OFFICIAL BIS EVIDENCE CONTEXT ---"]
        for idx, ev in enumerate(context):
            citation_idx = getattr(ev, "citation_index", idx + 1)
            std_num = getattr(ev, "standard_number", "")
            title = getattr(ev, "document_title", getattr(ev, "title", ""))
            clause = getattr(ev, "clause", "")
            section = getattr(ev, "section", "")
            text = getattr(ev, "text", getattr(ev, "content", ""))
            page = getattr(ev, "page", None)
            
            ref_parts = [f"[{citation_idx}]"]
            if std_num:
                ref_parts.append(f"Standard: {std_num}")
            if title:
                ref_parts.append(f"Title: {title}")
            if clause:
                ref_parts.append(f"Clause: {clause}")
            elif section:
                ref_parts.append(f"Section: {section}")
            if page:
                ref_parts.append(f"Page: {page}")
                
            header = " | ".join(ref_parts)
            context_lines.append(f"{header}\nEvidence Text: {text.strip()}\n")
            
        context_lines.append("--- END OFFICIAL BIS EVIDENCE CONTEXT ---")
        return "\n".join(context_lines)

    def generate(
        self,
        prompt: str,
        context: List[Any],
        language: str = "en",
        history: Optional[List[Dict[str, str]]] = None
    ) -> str:
        if not self.client:
            raise RuntimeError(
                "Gemini LLM Provider is not properly configured. "
                "Please verify that GEMINI_API_KEY is set in your backend environment."
            )

        context_str = self._build_context_prompt(context)
        lang_code = language.lower().strip()
        lang_name = LANGUAGE_NAMES.get(lang_code, lang_code.capitalize())

        # Build conversational history if available
        messages_prompt = []
        if history:
            messages_prompt.append("RECENT CONVERSATION HISTORY:")
            for turn in history[-6:]:
                role = "User" if turn.get("role") == "user" else "Assistant"
                content = turn.get("content", "").strip()
                messages_prompt.append(f"{role}: {content}")
            messages_prompt.append("")

        lang_instruction = ""
        if lang_code not in ["en", "english"]:
            lang_instruction = (
                f"\n\nCRITICAL LANGUAGE DIRECTIVE:\n"
                f"You MUST formulate your entire response in {lang_name}.\n"
                f"All explanations, headings, and bullet points must be in {lang_name}.\n"
                f"Keep official standard designations like 'IS 456:2000', 'IS 10500:2012', clause numbers, citations [1], and URLs in their standard format.\n"
            )

        user_content = (
            f"{context_str}\n\n"
            f"{chr(10).join(messages_prompt)}"
            f"USER QUERY: {prompt}\n"
            f"TARGET LANGUAGE: {lang_name}"
            f"{lang_instruction}\n\n"
            f"Formulate a grounded, authoritative answer based exclusively on the BIS evidence above. "
            f"Cite each specific fact with its exact bracketed evidence index like [1], [2]. "
            f"Do not cite a clause for facts that are not present in its evidence text."
        )

        try:
            config = types.GenerateContentConfig(
                system_instruction=BIS_SYSTEM_PROMPT,
                temperature=0.15,
                max_output_tokens=2048,
            )
            
            response = self.client.models.generate_content(
                model=self.model,
                contents=user_content,
                config=config,
            )
            
            if response and response.text:
                return response.text.strip()
            else:
                return (
                    "Official BIS documentation does not provide sufficient detail to answer this query. "
                    "Please verify at https://www.manakonline.in or consult your nearest BIS Branch Office."
                )

        except APIError as api_err:
            logger.error(f"Gemini API error: {api_err}")
            raise RuntimeError(f"Gemini API error: {api_err.message if hasattr(api_err, 'message') else str(api_err)}")
        except Exception as e:
            logger.error(f"Error calling Gemini API: {e}")
            raise RuntimeError(f"Failed to generate response with Gemini: {str(e)}")
