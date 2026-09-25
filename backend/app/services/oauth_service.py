import logging
from typing import Tuple, Dict, Any, Optional
import httpx
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"


def is_google_oauth_configured() -> bool:
    return bool(settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET)


def get_google_auth_url() -> Tuple[bool, str]:
    if not is_google_oauth_configured():
        return False, "Google sign-in is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env."
    
    redirect_uri = settings.GOOGLE_REDIRECT_URI or "http://localhost:5173/auth/google/callback"
    scope = "openid email profile"
    url = (
        f"{GOOGLE_AUTH_URL}?client_id={settings.GOOGLE_CLIENT_ID}"
        f"&redirect_uri={redirect_uri}"
        f"&response_type=code"
        f"&scope={scope}"
        f"&access_type=offline"
        f"&prompt=consent"
    )
    return True, url


async def exchange_google_code_for_user(code: str) -> Tuple[bool, str, Optional[Dict[str, Any]]]:
    if not is_google_oauth_configured():
        return False, "Google sign-in is not configured.", None

    redirect_uri = settings.GOOGLE_REDIRECT_URI or "http://localhost:5173/auth/google/callback"
    payload = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": redirect_uri,
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            token_resp = await client.post(GOOGLE_TOKEN_URL, data=payload)
            if token_resp.status_code != 200:
                logger.error(f"Google token exchange failed: {token_resp.text}")
                return False, "Failed to exchange authorization code with Google.", None
            
            token_data = token_resp.json()
            access_token = token_data.get("access_token")
            if not access_token:
                return False, "No access token received from Google.", None

            userinfo_resp = await client.get(
                GOOGLE_USERINFO_URL,
                headers={"Authorization": f"Bearer {access_token}"}
            )
            if userinfo_resp.status_code != 200:
                return False, "Failed to fetch user profile from Google.", None

            user_data = userinfo_resp.json()
            return True, "Success", user_data
    except Exception as e:
        logger.error(f"Error communicating with Google OAuth: {e}")
        return False, f"Google OAuth communication error: {str(e)}", None
