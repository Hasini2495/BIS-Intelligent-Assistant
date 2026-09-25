from fastapi import APIRouter
from typing import List
from pydantic import Field
from app.api.schemas.common import CamelModel

class LanguageResponse(CamelModel):
    code: str
    name: str
    native_name: str = Field(..., alias="nativeName")
    direction: str = "ltr"
    script: str = "Latin"
    is_supported: bool = Field(True, alias="isSupported")
    supports_answers: bool = Field(True, alias="supportsAnswers")

router = APIRouter()

OFFICIAL_LANGUAGES = [
    {"code": "en", "name": "English", "nativeName": "English", "direction": "ltr", "script": "Latin", "isSupported": True, "supportsAnswers": True},
    {"code": "hi", "name": "Hindi", "nativeName": "हिन्दी", "direction": "ltr", "script": "Devanagari", "isSupported": True, "supportsAnswers": True},
    {"code": "te", "name": "Telugu", "nativeName": "తెలుగు", "direction": "ltr", "script": "Telugu", "isSupported": True, "supportsAnswers": True},
    {"code": "ta", "name": "Tamil", "nativeName": "தமிழ்", "direction": "ltr", "script": "Tamil", "isSupported": True, "supportsAnswers": True},
    {"code": "kn", "name": "Kannada", "nativeName": "ಕನ್ನಡ", "direction": "ltr", "script": "Kannada", "isSupported": True, "supportsAnswers": True},
    {"code": "ml", "name": "Malayalam", "nativeName": "മലയാളം", "direction": "ltr", "script": "Malayalam", "isSupported": True, "supportsAnswers": True},
    {"code": "mr", "name": "Marathi", "nativeName": "मराठी", "direction": "ltr", "script": "Devanagari", "isSupported": True, "supportsAnswers": True},
    {"code": "bn", "name": "Bengali", "nativeName": "বাংলা", "direction": "ltr", "script": "Bengali", "isSupported": True, "supportsAnswers": True},
    {"code": "gu", "name": "Gujarati", "nativeName": "ગુજરાતી", "direction": "ltr", "script": "Gujarati", "isSupported": True, "supportsAnswers": True},
    {"code": "or", "name": "Odia", "nativeName": "ଓଡ଼ିଆ", "direction": "ltr", "script": "Odia", "isSupported": True, "supportsAnswers": True},
    {"code": "pa", "name": "Punjabi", "nativeName": "ਪੰਜਾਬੀ", "direction": "ltr", "script": "Gurmukhi", "isSupported": True, "supportsAnswers": True},
    {"code": "ur", "name": "Urdu", "nativeName": "اردو", "direction": "rtl", "script": "Arabic", "isSupported": True, "supportsAnswers": True}
]

@router.get("", response_model=List[LanguageResponse])
async def get_languages():
    return [LanguageResponse(**lang) for lang in OFFICIAL_LANGUAGES]
