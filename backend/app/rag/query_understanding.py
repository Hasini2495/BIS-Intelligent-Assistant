import re
from typing import Dict, Any, List, Optional
from app.api.schemas.chat import EntityResponse, QueryAnalysisResponse

class QueryUnderstanding:
    """
    Analyzes user queries for BIS intent, extracted entities, language,
    and resolves follow-up questions using conversational context.
    """

    def _detect_language(self, text: str, fallback: str = "en") -> str:
        # Detect Indian language script from unicode ranges
        for char in text:
            code = ord(char)
            if 0x0C00 <= code <= 0x0C7F:
                return "te"  # Telugu
            elif 0x0900 <= code <= 0x097F:
                return "hi"  # Hindi / Devanagari
            elif 0x0B80 <= code <= 0x0BFF:
                return "ta"  # Tamil
            elif 0x0C80 <= code <= 0x0CFF:
                return "kn"  # Kannada
            elif 0x0D00 <= code <= 0x0D7F:
                return "ml"  # Malayalam
            elif 0x0980 <= code <= 0x09FF:
                return "bn"  # Bengali
            elif 0x0A80 <= code <= 0x0AFF:
                return "gu"  # Gujarati
            elif 0x0B00 <= code <= 0x0B7F:
                return "or"  # Odia
            elif 0x0A00 <= code <= 0x0A7F:
                return "pa"  # Punjabi
            elif 0x0600 <= code <= 0x06FF:
                return "ur"  # Urdu
        return fallback or "en"

    def _resolve_followup(
        self,
        text: str,
        history: Optional[List[Dict[str, str]]] = None
    ) -> tuple[str, List[EntityResponse]]:
        inherited_entities: List[EntityResponse] = []
        if not history:
            return text, inherited_entities

        # Look backwards through history to find the most recent standard or topic discussed
        last_standard = None
        last_scheme = None
        last_topic = None

        for turn in reversed(history[-6:]):
            content = turn.get("content", "")
            std_match = re.search(r"\b(IS\s*[-:]?\s*\d+(?:[-:]\d+)?(?::\d{4})?)\b", content, re.IGNORECASE)
            if std_match and not last_standard:
                last_standard = std_match.group(1).upper()
            
            for scheme in ["ISI Mark", "CRS", "Hallmarking", "FMCS", "HUID"]:
                if scheme.lower() in content.lower() and not last_scheme:
                    last_scheme = scheme

        # Detect pronouns or elliptical questions
        text_lower = text.lower()
        followup_patterns = [
            r"\bit\b",
            r"\bthis standard\b",
            r"\bthis code\b",
            r"\bthis\b",
            r"\bits\b",
            r"\bthe standard\b",
            r"\bthe code\b",
            r"\bdoes it say\b",
            r"\bwhat about\b",
            r"\btell me more\b"
        ]

        is_followup = any(re.search(pat, text_lower) for pat in followup_patterns)
        has_direct_standard = bool(re.search(r"\b(IS\s*[-:]?\s*\d+)\b", text, re.IGNORECASE))

        rewritten = text
        if (is_followup or not has_direct_standard) and last_standard:
            # Replace pronouns with the actual standard name or prepend it
            if re.search(r"\bit\b", text, re.IGNORECASE):
                rewritten = re.sub(r"\b(it|this|this standard|this code)\b", last_standard, text, flags=re.IGNORECASE)
            else:
                rewritten = f"{last_standard} {text}"
            
            inherited_entities.append(EntityResponse(
                type="standard_number",
                value=last_standard,
                normalized_value=re.sub(r"\s+", " ", last_standard),
                confidence=0.95
            ))
        elif (is_followup or not has_direct_standard) and last_scheme:
            rewritten = f"{last_scheme} {text}"
            inherited_entities.append(EntityResponse(
                type="scheme",
                value=last_scheme,
                normalized_value=last_scheme,
                confidence=0.92
            ))

        return rewritten, inherited_entities

    def analyze_query(
        self,
        text: str,
        language: str = "en",
        history: Optional[List[Dict[str, str]]] = None
    ) -> QueryAnalysisResponse:
        text_clean = text.strip()
        detected_lang = self._detect_language(text_clean, fallback=language)

        # Resolve follow-up query using conversation history
        rewritten_query, inherited_entities = self._resolve_followup(text_clean, history)
        analysis_text = rewritten_query
        analysis_lower = analysis_text.lower()

        entities: List[EntityResponse] = list(inherited_entities)

        # 1. Standard Numbers
        std_matches = re.finditer(r"\b(IS\s*[-:]?\s*\d+(?:[-:]\d+)?(?::\d{4})?)\b", analysis_text, re.IGNORECASE)
        for m in std_matches:
            val = m.group(1).upper()
            if not any(e.value == val for e in entities):
                entities.append(EntityResponse(
                    type="standard_number",
                    value=val,
                    normalized_value=re.sub(r"\s+", " ", val),
                    confidence=0.98
                ))

        # 2. Scheme Identification
        schemes = {
            "isi": ("scheme", "ISI Mark Scheme I"),
            "crs": ("scheme", "Compulsory Registration Scheme"),
            "compulsory registration": ("scheme", "Compulsory Registration Scheme"),
            "hallmark": ("scheme", "Hallmarking Scheme"),
            "fmcs": ("scheme", "Foreign Manufacturers Certification Scheme"),
            "huid": ("scheme", "Hallmark Unique Identification"),
        }
        for kw, (etype, norm) in schemes.items():
            if kw in analysis_lower:
                if not any(e.value == kw.upper() for e in entities):
                    entities.append(EntityResponse(
                        type=etype,
                        value=kw.upper(),
                        normalized_value=norm,
                        confidence=0.95
                    ))

        # 3. Product / Material Entities
        products = {
            "drinking water": "Packaged / Potable Water",
            "water": "Water",
            "concrete": "Plain and Reinforced Concrete",
            "cement": "Portland Cement",
            "iron": "Electric Iron / Domestic Appliances",
            "led": "Self-ballasted LED Lamps",
            "lamp": "Electric Lighting",
            "gold": "Gold Jewellery",
            "silver": "Silver Jewellery",
            "steel": "Structural Steel",
            "earthquake": "Earthquake Resistant Structures",
            "wind": "Wind Loads",
        }
        for prod_kw, norm in products.items():
            if prod_kw in analysis_lower:
                entities.append(EntityResponse(
                    type="product" if "concrete" not in prod_kw else "material",
                    value=prod_kw,
                    normalized_value=norm,
                    confidence=0.90
                ))

        # 4. Locations & Labs
        locations = ["delhi", "sahibabad", "mumbai", "chennai", "kolkata", "chandigarh", "ghaziabad"]
        for loc in locations:
            if loc in analysis_lower:
                entities.append(EntityResponse(
                    type="location",
                    value=loc.capitalize(),
                    normalized_value=loc.capitalize(),
                    confidence=0.92
                ))

        if "lab" in analysis_lower or "laboratory" in analysis_lower:
            entities.append(EntityResponse(
                type="laboratory",
                value="BIS Laboratory",
                normalized_value="BIS Laboratory Network",
                confidence=0.88
            ))

        # 5. Intent Determination
        intent = "general_bis_info"
        confidence = 0.85

        if any(e.type == "standard_number" for e in entities):
            if any(w in analysis_lower for w in ["clause", "explain", "cover", "grade", "durability", "limit", "parameter", "what does it say"]):
                intent = "standard_explanation"
                confidence = 0.95
            elif "compare" in analysis_lower or "difference" in analysis_lower:
                intent = "standard_comparison"
                confidence = 0.92
            else:
                intent = "standard_search"
                confidence = 0.95
        elif any(e.type == "scheme" for e in entities):
            if "process" in analysis_lower or "apply" in analysis_lower or "how to" in analysis_lower:
                intent = "certification_process"
                confidence = 0.94
            elif "hallmark" in analysis_lower:
                intent = "hallmarking"
                confidence = 0.96
            else:
                intent = "certification"
                confidence = 0.90
        elif "lab" in analysis_lower or "test" in analysis_lower:
            if "test" in analysis_lower:
                intent = "testing"
                confidence = 0.88
            else:
                intent = "laboratory"
                confidence = 0.90
        elif "recommend" in analysis_lower or "which standard" in analysis_lower:
            intent = "standard_recommendation"
            confidence = 0.91
        elif "service" in analysis_lower or "portal" in analysis_lower or "manak" in analysis_lower:
            intent = "bis_service"
            confidence = 0.88

        return QueryAnalysisResponse(
            intent=intent,
            intentConfidence=confidence,
            entities=entities,
            detectedLanguage=detected_lang,
            rewrittenQuery=rewritten_query if rewritten_query != text_clean else None
        )
