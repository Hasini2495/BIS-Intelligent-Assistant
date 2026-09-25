import re
import math
from typing import List, Dict, Any, Optional
from collections import Counter

from app.retrieval.base import BaseRetriever
from app.api.schemas.chat import EvidenceSnippetResponse
from app.api.schemas.sources import SourceResponse
from app.api.schemas.standards import StandardReferenceResponse
from app.services.seed_service import (
    SEED_STANDARDS,
    SEED_DOCUMENTS,
    SEED_SCHEMES,
    SEED_LABS,
    SEED_SERVICES
)

class BISRetriever(BaseRetriever):
    """
    Lightweight, high-precision local BIS domain retriever.
    Performs multi-stage retrieval:
    1. Query entity and standard number extraction.
    2. Exact standard and clause matching with prioritized boosting.
    3. BM25 / TF-IDF passage ranking across BIS standards, schemes, labs, and documents.
    4. Evidence selection and formatting with full citation metadata.
    """

    def __init__(self):
        self._chunks: List[Dict[str, Any]] = []
        self._build_index()

    def _build_index(self):
        self._chunks = []

        # 1. Index standards & their clauses
        for std in SEED_STANDARDS:
            std_num = std["standard_number"]
            title = std["title"]
            source_id = f"src_{std['id']}"
            scope = std.get("scope", "")
            description = std.get("description", "")

            # General Standard overview chunk
            self._add_chunk(
                chunk_id=f"chk_{std['id']}_overview",
                source_id=source_id,
                title=f"{std_num} - {title}",
                standard_number=std_num,
                section="Scope and Overview",
                clause="1",
                page=1,
                version=std.get("revision", f"{std.get('year', '')}"),
                date=f"{std.get('year', 2020)}-01-01",
                text=f"{std_num}: {title}. Scope: {scope}. Description: {description}",
                standard_ref={
                    "id": std["id"],
                    "standardNumber": std_num,
                    "title": title,
                    "status": std.get("status", "active")
                }
            )

            # Detailed clauses chunks
            for clause in std.get("clauses", []):
                clause_num = clause.get("number", "")
                clause_title = clause.get("title", "")
                clause_text = clause.get("text", "")
                page = clause.get("page", 2)
                
                self._add_chunk(
                    chunk_id=f"chk_{std['id']}_{clause['id']}",
                    source_id=source_id,
                    title=f"{std_num} - {title}",
                    standard_number=std_num,
                    section=clause_title,
                    clause=clause_num,
                    page=page,
                    version=std.get("revision", f"{std.get('year', '')}"),
                    date=f"{std.get('year', 2020)}-01-01",
                    text=f"{std_num} Clause {clause_num} [{clause_title}]: {clause_text}",
                    standard_ref={
                        "id": std["id"],
                        "standardNumber": std_num,
                        "title": title,
                        "status": std.get("status", "active")
                    }
                )

        # 2. Index Documents & Sections
        for doc in SEED_DOCUMENTS:
            doc_id = doc["id"]
            title = doc["title"]
            std_num = doc.get("standard_number", "")
            for sec in doc.get("sections", []):
                self._add_chunk(
                    chunk_id=f"chk_doc_{doc_id}_{sec['id']}",
                    source_id=f"src_{doc_id}",
                    title=title,
                    standard_number=std_num,
                    section=sec.get("title", ""),
                    clause=sec.get("number", ""),
                    page=sec.get("page", 1),
                    version=doc.get("version", "1.0"),
                    date=doc.get("publication_date", "2023-01-01"),
                    text=f"Document '{title}' ({std_num}) Section {sec.get('number', '')} {sec.get('title', '')}: {sec.get('content', '')}",
                    standard_ref={
                        "id": doc_id,
                        "standardNumber": std_num or "BIS Guideline",
                        "title": title,
                        "status": "active"
                    } if std_num else None
                )

        # 3. Index Certification Schemes
        for sch in SEED_SCHEMES:
            sch_id = sch["id"]
            sch_name = sch["name"]
            proc_steps = " -> ".join([f"Step {p['order']}: {p['title']} ({p['description']})" for p in sch.get("process", [])])
            req_docs = ", ".join([f"{d['name']} (Mandatory: {d['is_mandatory']})" for d in sch.get("required_documents", [])])
            tests = "; ".join([f"{t['test_name']} ({t.get('description', '')})" for t in sch.get("testing_requirements", [])])
            faqs = " ".join([f"Q: {f['question']} A: {f['answer']}" for f in sch.get("faqs", [])])

            self._add_chunk(
                chunk_id=f"chk_sch_{sch_id}",
                source_id=f"src_sch_{sch_id}",
                title=f"BIS Certification Scheme: {sch_name}",
                standard_number=sch.get("short_name", "BIS Scheme"),
                section="Scheme Requirements and Process",
                clause="Process & Eligibility",
                page=1,
                version="Official 2024",
                date="2024-01-01",
                text=(
                    f"Scheme: {sch_name} ({sch.get('short_name', '')}). Description: {sch['description']}. "
                    f"Audience: {', '.join(sch.get('audience', []))}. Eligibility: {', '.join(sch.get('eligibility', []))}. "
                    f"Application Process: {proc_steps}. Required Documentation: {req_docs}. "
                    f"Testing Requirements: {tests}. Frequently Asked Questions: {faqs}"
                )
            )

        # 4. Index Testing & Laboratories
        for lab in SEED_LABS:
            lab_id = lab["id"]
            lab_name = lab["name"]
            scopes = ", ".join(lab.get("scopes", []))
            disciplines = ", ".join(lab.get("disciplines", []))
            contact = lab.get("contact", {})
            contact_str = f"Phone: {contact.get('phone', 'N/A')}, Email: {contact.get('email', 'N/A')}"

            self._add_chunk(
                chunk_id=f"chk_lab_{lab_id}",
                source_id=f"src_lab_{lab_id}",
                title=f"BIS Laboratory: {lab_name}",
                standard_number="BIS Lab Network",
                section="Testing Scope & Recognition",
                clause="Accreditation",
                page=1,
                version="Recognized",
                date="2024-01-01",
                text=(
                    f"Laboratory: {lab_name}, Location: {lab.get('city', '')}, {lab.get('state', '')} ({lab.get('region', '')}). "
                    f"Recognition: {lab.get('recognition_type', '')} (Ref: {lab.get('recognition_number', '')}, Valid Until: {lab.get('valid_until', '')}). "
                    f"Testing Disciplines: {disciplines}. Scope: {scopes}. Contact: {contact_str}"
                )
            )

        # 5. Index BIS Services
        for srv in SEED_SERVICES:
            srv_id = srv["id"]
            srv_name = srv["name"]
            steps = " -> ".join([f"{p['title']}: {p['description']}" for p in srv.get("how_to_avail", [])])

            self._add_chunk(
                chunk_id=f"chk_srv_{srv_id}",
                source_id=f"src_srv_{srv_id}",
                title=f"BIS Service: {srv_name}",
                standard_number="BIS Services",
                section=srv.get("category", "General"),
                clause="How to Avail",
                page=1,
                version="Portal 2024",
                date="2024-01-01",
                text=f"BIS Service: {srv_name}. Category: {srv.get('category', '')}. Description: {srv.get('description', '')}. How to avail: {steps}"
            )

        # Precompute vocabulary and document frequencies for BM25
        self._doc_count = len(self._chunks)
        self._avg_dl = sum(len(c["tokens"]) for c in self._chunks) / max(1, self._doc_count)
        self._df = Counter()
        for c in self._chunks:
            self._df.update(set(c["tokens"]))

    def _tokenize(self, text: str) -> List[str]:
        return [w.lower() for w in re.findall(r"\b[a-zA-Z0-9_\-\:]{2,}\b", text)]

    def _add_chunk(
        self,
        chunk_id: str,
        source_id: str,
        title: str,
        standard_number: str,
        section: str,
        clause: str,
        page: int,
        version: str,
        date: str,
        text: str,
        standard_ref: Optional[Dict[str, Any]] = None
    ):
        tokens = self._tokenize(f"{title} {standard_number} {section} {clause} {text}")
        self._chunks.append({
            "id": chunk_id,
            "source_id": source_id,
            "title": title,
            "standard_number": standard_number,
            "section": section,
            "clause": clause,
            "page": page,
            "version": version,
            "date": date,
            "text": text,
            "tokens": tokens,
            "token_counts": Counter(tokens),
            "standard_ref": standard_ref
        })

    def _extract_standards_from_query(self, query: str) -> List[str]:
        # Matches IS 456, IS:10500, IS10500, IS 302-2-3, etc.
        patterns = [
            r"\bIS\s*[-:]?\s*(\d+(?:[-:]\d+)*)\b",
            r"\bIS(\d{3,5})\b"
        ]
        found = []
        for pat in patterns:
            for match in re.finditer(pat, query, re.IGNORECASE):
                num = match.group(1).replace(" ", "")
                found.append(f"IS {num}")
                found.append(num)
        return list(set(found))

    def retrieve(
        self,
        query: str,
        filters: Optional[List[str]] = None,
        top_k: int = 5
    ) -> List[EvidenceSnippetResponse]:
        results, _, _ = self.retrieve_with_context(query, filters, top_k)
        return results

    def retrieve_with_context(
        self,
        query: str,
        filters: Optional[List[str]] = None,
        top_k: int = 5
    ) -> tuple[List[EvidenceSnippetResponse], List[SourceResponse], List[StandardReferenceResponse]]:
        query_tokens = self._tokenize(query)
        if not query_tokens:
            return [], [], []

        query_standards = self._extract_standards_from_query(query)
        query_lower = query.lower()

        STOPWORDS = {
            "what", "is", "the", "under", "bis", "standards", "standard", "does", "say",
            "about", "for", "and", "or", "to", "in", "of", "with", "are", "tell", "me", "how", "can"
        }
        substantive_tokens = [t for t in query_tokens if t not in STOPWORDS]
        active_tokens = substantive_tokens if substantive_tokens else query_tokens

        scores: List[tuple[float, Dict[str, Any]]] = []

        k1 = 1.5
        b = 0.75

        for chunk in self._chunks:
            score = 0.0
            chunk_tokens = chunk["tokens"]
            chunk_counts = chunk["token_counts"]
            doc_len = len(chunk_tokens)
            std_num = chunk.get("standard_number", "").lower()
            text_lower = chunk["text"].lower()

            # 1. Exact standard number matching bonus
            for std_match in query_standards:
                std_clean = std_match.lower().replace(" ", "").replace("-", "")
                std_chunk_clean = std_num.replace(" ", "").replace("-", "")
                if std_clean in std_chunk_clean or std_match.lower() in std_num:
                    score += 15.0
                elif std_match.lower() in text_lower:
                    score += 8.0

            # 2. Clause specific matching bonus
            clause = chunk.get("clause", "").lower()
            if clause and len(clause) > 1 and f"clause {clause}" in query_lower:
                score += 12.0
            elif clause and len(clause) > 1 and clause in query_lower:
                score += 6.0

            # 3. Scheme specific matching bonus
            if "isi" in query_lower and "isi" in std_num:
                score += 8.0
            if "crs" in query_lower and ("crs" in std_num or "compulsory" in text_lower):
                score += 8.0
            if ("hallmark" in query_lower or "gold" in query_lower) and ("hallmark" in text_lower or "1417" in std_num):
                score += 8.0
            if "lab" in query_lower and "lab" in chunk["source_id"]:
                score += 6.0

            # 4. BM25 ranking across query tokens
            for token in active_tokens:
                tf = chunk_counts.get(token, 0)
                if tf > 0:
                    df = self._df.get(token, 1)
                    # IDF formula
                    idf = math.log((self._doc_count - df + 0.5) / (df + 0.5) + 1.0)
                    tf_component = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (doc_len / self._avg_dl)))
                    score += idf * tf_component

            if score > 2.0:
                scores.append((score, chunk))

        scores.sort(key=lambda x: x[0], reverse=True)

        selected_evidence: List[EvidenceSnippetResponse] = []
        selected_sources: List[SourceResponse] = []
        selected_standards: List[StandardReferenceResponse] = []
        seen_source_ids = set()
        seen_standard_ids = set()

        for idx, (score, chunk) in enumerate(scores[:top_k]):
            relevance_label = "high" if score >= 8.0 else ("medium" if score >= 4.0 else "low")
            citation_idx = idx + 1

            evidence_item = EvidenceSnippetResponse(
                id=chunk["id"],
                sourceId=chunk["source_id"],
                text=chunk["text"],
                standardNumber=chunk.get("standard_number"),
                section=chunk.get("section"),
                clause=chunk.get("clause"),
                page=chunk.get("page"),
                relevance=relevance_label,
                citationIndex=citation_idx
            )
            selected_evidence.append(evidence_item)

            if chunk["source_id"] not in seen_source_ids:
                seen_source_ids.add(chunk["source_id"])
                source_resp = SourceResponse(
                    id=chunk["source_id"],
                    citationIndex=citation_idx,
                    title=chunk["title"],
                    documentId=chunk["source_id"].replace("src_", ""),
                    documentName=chunk["title"],
                    sourceType="indian_standard" if "IS" in chunk.get("standard_number", "") else "scheme_document",
                    standardNumber=chunk.get("standard_number"),
                    section=chunk.get("section"),
                    clause=chunk.get("clause"),
                    page=chunk.get("page"),
                    version=chunk.get("version"),
                    authority="Bureau of Indian Standards",
                    publicationDate=chunk.get("date"),
                    lastIndexedAt="2026-09-24T00:00:00Z",
                    url="https://www.manakonline.in",
                    isOfficial=True,
                    isDemo=False,
                    relevance=relevance_label,
                    relevanceScore=min(1.0, round(score / 20.0, 2)),
                    excerpt=chunk["text"][:280] + ("..." if len(chunk["text"]) > 280 else "")
                )
                selected_sources.append(source_resp)

            std_ref = chunk.get("standard_ref")
            if std_ref and std_ref["id"] not in seen_standard_ids:
                seen_standard_ids.add(std_ref["id"])
                selected_standards.append(StandardReferenceResponse(
                    id=std_ref["id"],
                    standardNumber=std_ref["standardNumber"],
                    title=std_ref["title"],
                    status=std_ref["status"]
                ))

        return selected_evidence, selected_sources, selected_standards
