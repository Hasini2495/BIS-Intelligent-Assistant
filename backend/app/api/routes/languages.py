from fastapi import APIRouter
from typing import List, Dict

router = APIRouter()

@router.get("", response_model=List[Dict[str, str]])
async def get_languages():
    from app.utils.demo_data import get_demo_languages
    return get_demo_languages()
