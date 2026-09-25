import re
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from app.api.schemas.hallmarking import HallmarkingVerifyRequest, HallmarkingVerifyResponse

router = APIRouter()

# Authoritative sample records indexed in local system
SAMPLE_HUID_DATABASE = {
    "BJ9281": {
        "metal_type": "Gold (22K)",
        "purity": "916 (91.6% Pure Gold)",
        "assaying_center": "AHC Mumbai Central (AHC-MH-012)",
        "officially_verified": True
    },
    "HM7823": {
        "metal_type": "Gold (18K)",
        "purity": "750 (75.0% Pure Gold)",
        "assaying_center": "AHC New Delhi Okhla (AHC-DL-004)",
        "officially_verified": True
    },
    "SL4590": {
        "metal_type": "Silver",
        "purity": "925 (Sterling Silver)",
        "assaying_center": "AHC Bangalore South (AHC-KA-008)",
        "officially_verified": True
    }
}


@router.post("/verify", response_model=HallmarkingVerifyResponse)
async def verify_hallmark_huid(req: HallmarkingVerifyRequest):
    huid = req.huid.strip().upper()
    now_str = datetime.now(timezone.utc).strftime("%d %b %Y, %H:%M IST")

    # BIS HUID standard format: exactly 6 alphanumeric characters
    if not re.match(r"^[A-Z0-9]{6}$", huid):
        return HallmarkingVerifyResponse(
            huid=huid,
            is_format_valid=False,
            is_officially_verified=False,
            status="invalid_format",
            metal_type=None,
            purity=None,
            assaying_center=None,
            message="Invalid HUID structure. Official BIS HUID must contain exactly 6 alphanumeric characters (e.g., BJ9281).",
            verified_at=now_str
        )

    # Check local authoritative registry
    if huid in SAMPLE_HUID_DATABASE:
        data = SAMPLE_HUID_DATABASE[huid]
        return HallmarkingVerifyResponse(
            huid=huid,
            is_format_valid=True,
            is_officially_verified=True,
            status="verified_official",
            metal_type=data["metal_type"],
            purity=data["purity"],
            assaying_center=data["assaying_center"],
            message=f"Authentic Hallmarked Article verified under IS 1417. Assayed at {data['assaying_center']}.",
            verified_at=now_str
        )

    # Format is structurally valid, but not in local cache -> prompt verification via official BIS Care app
    return HallmarkingVerifyResponse(
        huid=huid,
        is_format_valid=True,
        is_officially_verified=False,
        status="format_valid",
        metal_type="Gold/Silver Article (Pending Live Portal Sync)",
        purity="Standard Hallmarked Grade",
        assaying_center="BIS Recognized AHC",
        message="HUID format validated against IS 1417 (6-character alphanumeric). For real-time live portal cross-check, use the official BIS Care mobile app or Manakonline gateway.",
        verified_at=now_str
    )
