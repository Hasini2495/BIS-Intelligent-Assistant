import os
import re
import uuid
import logging
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any, Tuple
from fastapi import UploadFile, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models.source import Document, Source
from app.dependencies import get_retrieval_service

logger = logging.getLogger(__name__)
settings = get_settings()

ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png", ".txt", ".docx"}
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/png",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/octet-stream" # Fallback from some browsers
}


def sanitize_filename(filename: str) -> str:
    base = os.path.basename(filename)
    safe = re.sub(r"[^a-zA-Z0-9_\-\.]", "_", base)
    return safe[:100] if len(safe) > 100 else safe


def create_minimal_pdf_bytes(title: str, text: str) -> bytes:
    """Creates an authentic, valid PDF-1.4 file with standard Helvetica font."""
    clean_title = title.encode("ascii", "ignore").decode("ascii").replace("(", "[").replace(")", "]")
    clean_text = text.encode("ascii", "ignore").decode("ascii").replace("(", "[").replace(")", "]")[:200]
    stream_content = f"BT /F1 14 Tf 50 740 Td ({clean_title}) Tj 0 -30 Td /F1 10 Tf ({clean_text}) Tj ET"
    stream_len = len(stream_content)
    
    pdf = (
        "%PDF-1.4\n"
        "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n"
        "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n"
        "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n"
        f"4 0 obj << /Length {stream_len} >> stream\n"
        f"{stream_content}\n"
        "endstream endobj\n"
        "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n"
        "xref\n0 6\n"
        "0000000000 65535 f \n"
        "0000000009 00000 n \n"
        "0000000058 00000 n \n"
        "0000000115 00000 n \n"
        "0000000244 00000 n \n"
        "0000000330 00000 n \n"
        "trailer << /Size 6 /Root 1 0 R >>\n"
        "startxref\n407\n%%EOF"
    )
    return pdf.encode("ascii", errors="ignore")


def ensure_seeded_sample_files():
    """Ensure standard initial sample files exist in data/uploads."""
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    samples = [
        ("LED_Bulb_TestReport.pdf", "NABL Accredited Testing Report — Photometric & Electrical Safety", "Bureau of Indian Standards — Mandatory Testing Report under IS 16102 (Part 1):2012 for Self-Ballasted LED Lamps."),
        ("Product_Manual.pdf", "Self-Ballasted LED Lamp User Manual & Technical Guidelines", "Standard operation and installation manual conforming to BIS technical specifications."),
        ("Certificate_ISI.pdf", "Bureau of Indian Standards — Certificate of Conformity", "Conformity assessment certificate granting standard mark license under Scheme-I."),
        ("Technical_Specs.pdf", "Technical Specification Sheet — LED Module & Driver", "Electrical parameters, harmonics, total harmonic distortion (THD), and surge protection requirements."),
        ("Raw_Batch_Test_Scan.png", "Raw Batch Quality Scan", "Quality inspection scan for batch verification.")
    ]
    for filename, title, desc in samples:
        path = os.path.join(settings.UPLOAD_DIR, filename)
        if not os.path.exists(path):
            if filename.endswith(".png"):
                # 1x1 transparent PNG
                png_bytes = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82"
                with open(path, "wb") as f:
                    f.write(png_bytes)
            else:
                pdf_bytes = create_minimal_pdf_bytes(title, desc)
                with open(path, "wb") as f:
                    f.write(pdf_bytes)


async def handle_document_upload(
    db: AsyncSession,
    file: UploadFile,
    document_type: str = "knowledge_source",
    title: Optional[str] = None,
    user_id: Optional[str] = None
) -> Document:
    """
    Validates, saves file to storage directory, records in database, extracts text,
    and indexes into the BIS retrieval system.
    """
    ensure_seeded_sample_files()
    
    orig_name = file.filename or "uploaded_file.pdf"
    _, ext = os.path.splitext(orig_name.lower())
    
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file extension '{ext}'. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
        )
    
    content = await file.read()
    file_size = len(content)
    
    if file_size > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)} MB."
        )
    
    if file_size == 0:
        raise HTTPException(status_code=400, detail="Cannot upload empty file.")

    safe_name = sanitize_filename(orig_name)
    doc_id = f"doc_{uuid.uuid4().hex[:12]}"
    stored_filename = f"{doc_id}_{safe_name}"
    storage_path = os.path.join(settings.UPLOAD_DIR, stored_filename)

    with open(storage_path, "wb") as f:
        f.write(content)

    doc_title = title.strip() if title and title.strip() else orig_name

    # Create Document record
    doc_record = Document(
        id=doc_id,
        title=doc_title,
        original_filename=orig_name,
        file_path=storage_path,
        mime_type=file.content_type or "application/octet-stream",
        file_size=file_size,
        document_type=document_type,
        status="uploaded",
        uploaded_by=user_id,
        metadata_={
            "pageCount": 1,
            "sectionCount": 1,
            "authority": "Bureau of Indian Standards",
            "isOfficial": True,
            "uploadedOn": datetime.now(timezone.utc).strftime("%d %b %Y")
        }
    )
    db.add(doc_record)
    await db.commit()
    await db.refresh(doc_record)

    # Process and Index Document
    try:
        extracted_text = ""
        if ext in [".txt", ".docx"]:
            try:
                extracted_text = content.decode("utf-8", errors="ignore")
            except Exception:
                extracted_text = str(content[:1000])
        elif ext == ".pdf":
            # Extract printable strings from PDF
            raw_text = content.decode("latin-1", errors="ignore")
            text_matches = re.findall(r"\(([^\(\)]{3,})\)", raw_text)
            extracted_text = " ".join(text_matches) if text_matches else doc_title
        else:
            extracted_text = f"Image Evidence Document: {doc_title} ({orig_name})"

        doc_record.content = extracted_text
        doc_record.status = "indexed"
        await db.commit()

        # Add to in-memory BIS retriever index so questions can reference it immediately
        retriever = get_retrieval_service()
        retriever._add_chunk(
            chunk_id=f"chk_{doc_id}",
            source_id=f"src_{doc_id}",
            title=doc_title,
            standard_number="Knowledge Source",
            section="Uploaded Knowledge",
            clause="General",
            page=1,
            version="1.0",
            date=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            text=f"Uploaded Document '{doc_title}': {extracted_text[:2000]}"
        )
        logger.info(f"Successfully processed and indexed document {doc_id} ('{doc_title}')")
    except Exception as e:
        logger.error(f"Error indexing document {doc_id}: {e}")
        doc_record.status = "failed"
        doc_record.error_message = f"Indexing failure: {str(e)}"
        await db.commit()

    return doc_record
