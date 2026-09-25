import uuid
import logging
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
    get_current_active_user,
)
from app.models.user import User, UserSession
from app.services.otp_service import (
    generate_and_dispatch_otp,
    verify_user_otp,
    get_otp_provider,
)
from app.services.oauth_service import (
    is_google_oauth_configured,
    get_google_auth_url,
    exchange_google_code_for_user,
)
from app.api.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    UserResponse,
    LoginResponse,
    Verify2FALoginRequest,
    ProfileUpdateRequest,
    ChangePasswordRequest,
    TwoFactorStatusResponse,
    TwoFactorSetupResponse,
    TwoFactorEnableRequest,
    TwoFactorDisableRequest,
    GoogleOAuthUrlResponse,
    GoogleOAuthCallbackRequest,
    SessionItemResponse,
)

logger = logging.getLogger(__name__)
router = APIRouter()


def _user_to_response(user: User) -> UserResponse:
    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role or "user",
        phone=user.phone,
        organization=user.organization,
        department=user.department,
        is_2fa_enabled=bool(user.is_2fa_enabled),
        two_factor_method=user.two_factor_method or "none",
        is_active=bool(user.is_active),
        created_at=user.created_at.isoformat() if user.created_at else None,
    )


@router.post("/register", response_model=LoginResponse)
async def register(req: UserRegisterRequest, db: AsyncSession = Depends(get_session)):
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")
    
    # Check if user already exists
    existing = await db.execute(select(User).where(User.email == req.email.lower().strip()))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="An account with this email address already exists.")

    user_id = f"usr_{uuid.uuid4().hex[:12]}"
    user = User(
        id=user_id,
        name=req.name.strip(),
        email=req.email.lower().strip(),
        hashed_password=get_password_hash(req.password),
        role=req.role or "user",
        phone=req.phone,
        organization=req.organization,
        department=req.department,
        is_2fa_enabled=False,
        two_factor_method="none",
        is_active=True,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    return LoginResponse(
        access_token=token,
        token_type="bearer",
        user=_user_to_response(user),
        requires_2fa=False,
        message="Registration successful"
    )


@router.post("/login", response_model=LoginResponse)
async def login(req: UserLoginRequest, db: AsyncSession = Depends(get_session)):
    email_clean = req.email.lower().strip()
    result = await db.execute(select(User).where(User.email == email_clean))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email address or password.")

    if not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email address or password.")

    if not user.is_active:
        raise HTTPException(status_code=400, detail="This account has been deactivated.")

    # Check 2FA requirement
    if user.is_2fa_enabled:
        target = user.phone if user.two_factor_method == "sms" and user.phone else user.email
        success, msg, v_id = await generate_and_dispatch_otp(
            db=db,
            user=user,
            purpose="login_2fa",
            target=target
        )
        if not success:
            raise HTTPException(status_code=503, detail=msg)
        return LoginResponse(
            requires_2fa=True,
            verification_id=v_id,
            two_factor_method=user.two_factor_method,
            message=f"Two-Factor Authentication code sent to registered {user.two_factor_method.upper()}."
        )

    # Issue JWT token
    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    return LoginResponse(
        access_token=token,
        token_type="bearer",
        user=_user_to_response(user),
        requires_2fa=False,
        message="Login successful"
    )


@router.post("/2fa/verify-login", response_model=LoginResponse)
async def verify_2fa_login(req: Verify2FALoginRequest, db: AsyncSession = Depends(get_session)):
    valid, msg, user = await verify_user_otp(
        db=db,
        verification_id=req.verification_id,
        submitted_code=req.code.strip(),
        purpose="login_2fa"
    )
    if not valid or not user:
        raise HTTPException(status_code=400, detail=msg)

    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    return LoginResponse(
        access_token=token,
        token_type="bearer",
        user=_user_to_response(user),
        requires_2fa=False,
        message="Two-Factor Authentication verified successfully."
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_active_user)):
    return _user_to_response(current_user)


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    req: ProfileUpdateRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_session)
):
    if req.name is not None and req.name.strip():
        current_user.name = req.name.strip()
    if req.phone is not None:
        current_user.phone = req.phone.strip()
    if req.organization is not None:
        current_user.organization = req.organization.strip()
    if req.department is not None:
        current_user.department = req.department.strip()

    await db.commit()
    await db.refresh(current_user)
    return _user_to_response(current_user)


@router.post("/change-password")
async def change_password(
    req: ChangePasswordRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_session)
):
    if not verify_password(req.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password entered is incorrect.")

    if len(req.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters.")

    if req.new_password != req.confirm_password:
        raise HTTPException(status_code=400, detail="New password and confirmation password do not match.")

    current_user.hashed_password = get_password_hash(req.new_password)
    await db.commit()
    return {"message": "Password changed successfully."}


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_active_user)):
    return {"message": "Logged out successfully."}


# ==========================================
# 2FA Settings & Verification Endpoints
# ==========================================
@router.get("/2fa/status", response_model=TwoFactorStatusResponse)
async def get_2fa_status(current_user: User = Depends(get_current_active_user)):
    provider = get_otp_provider()
    # Check if provider is configured
    configured = not isinstance(provider, type(None))
    return TwoFactorStatusResponse(
        enabled=bool(current_user.is_2fa_enabled),
        method=current_user.two_factor_method or "none",
        phone=current_user.phone,
        email=current_user.email,
        provider_configured=configured
    )


@router.post("/2fa/setup", response_model=TwoFactorSetupResponse)
async def setup_2fa(
    method: str = "sms",
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_session)
):
    target = current_user.phone if method == "sms" and current_user.phone else current_user.email
    if not target:
        raise HTTPException(status_code=400, detail=f"No {method.upper()} contact registered on your account.")

    success, msg, v_id = await generate_and_dispatch_otp(
        db=db,
        user=current_user,
        purpose="enable_2fa",
        target=target
    )
    if not success:
        return TwoFactorSetupResponse(success=False, message=msg, verification_id=None)

    return TwoFactorSetupResponse(
        success=True,
        message=f"Verification code sent to {target}.",
        verification_id=v_id
    )


@router.post("/2fa/enable")
async def enable_2fa(
    req: TwoFactorEnableRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_session)
):
    valid, msg, user = await verify_user_otp(
        db=db,
        verification_id=req.verification_id,
        submitted_code=req.code.strip(),
        purpose="enable_2fa"
    )
    if not valid or not user or user.id != current_user.id:
        raise HTTPException(status_code=400, detail=msg)

    current_user.is_2fa_enabled = True
    current_user.two_factor_method = "sms" if current_user.phone else "email"
    await db.commit()
    return {"message": "Two-Factor Authentication enabled successfully."}


@router.post("/2fa/disable")
async def disable_2fa(
    req: TwoFactorDisableRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_session)
):
    if not verify_password(req.password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect account password.")

    current_user.is_2fa_enabled = False
    current_user.two_factor_method = "none"
    await db.commit()
    return {"message": "Two-Factor Authentication disabled successfully."}


# ==========================================
# Google OAuth Endpoints
# ==========================================
@router.get("/google/url", response_model=GoogleOAuthUrlResponse)
async def google_auth_url():
    configured, result = get_google_auth_url()
    if not configured:
        return GoogleOAuthUrlResponse(
            configured=False,
            url=None,
            message="Google sign-in is not configured. Please configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env."
        )
    return GoogleOAuthUrlResponse(configured=True, url=result, message=None)


@router.post("/google/callback", response_model=LoginResponse)
async def google_callback(req: GoogleOAuthCallbackRequest, db: AsyncSession = Depends(get_session)):
    if not is_google_oauth_configured():
        raise HTTPException(
            status_code=400,
            detail="Google sign-in is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env."
        )

    success, msg, google_user = await exchange_google_code_for_user(req.code)
    if not success or not google_user:
        raise HTTPException(status_code=400, detail=msg)

    email = google_user.get("email", "").lower().strip()
    name = google_user.get("name") or email.split("@")[0]
    if not email:
        raise HTTPException(status_code=400, detail="No email provided by Google account.")

    # Find or create user
    res = await db.execute(select(User).where(User.email == email))
    user = res.scalar_one_or_none()
    if not user:
        user = User(
            id=f"usr_{uuid.uuid4().hex[:12]}",
            name=name,
            email=email,
            hashed_password=get_password_hash(uuid.uuid4().hex),
            role="user",
            is_active=True,
            is_2fa_enabled=False,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    return LoginResponse(
        access_token=token,
        token_type="bearer",
        user=_user_to_response(user),
        requires_2fa=False,
        message="Google authentication successful."
    )


# ==========================================
# Sessions Management
# ==========================================
@router.get("/sessions", response_model=List[SessionItemResponse])
async def get_active_sessions(current_user: User = Depends(get_current_active_user)):
    return [
        SessionItemResponse(
            id=f"sess_{current_user.id[:8]}_current",
            device="Current Web Browser (Desktop)",
            ip_address="127.0.0.1",
            created_at=datetime.now(timezone.utc).strftime("%d %b %Y, %H:%M IST"),
            is_current=True,
        )
    ]
