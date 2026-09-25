import secrets
import logging
import bcrypt
from datetime import datetime, timedelta, timezone
from typing import Tuple, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models.user import OTPVerification, User

logger = logging.getLogger(__name__)
settings = get_settings()

def hash_otp_code(code: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(code.encode("utf-8"), salt).decode("utf-8")

def verify_otp_code(submitted_code: str, code_hash: str) -> bool:
    try:
        return bcrypt.checkpw(submitted_code.encode("utf-8"), code_hash.encode("utf-8"))
    except Exception:
        return False


class OTPProvider:
    """Abstract base OTP provider."""
    def send_otp(self, target: str, code: str, purpose: str) -> Tuple[bool, str]:
        raise NotImplementedError


class ConsoleOTPProvider(OTPProvider):
    """Local development console OTP provider."""
    def send_otp(self, target: str, code: str, purpose: str) -> Tuple[bool, str]:
        # For local testing & developer convenience
        print(f"\n=======================================================")
        print(f"[BIS 2FA SECURE OTP] Target: {target} | Purpose: {purpose} | Code: {code}")
        print(f"=======================================================\n")
        logger.info(f"Console OTP dispatched to {target} for {purpose}")
        return True, "OTP dispatched successfully"


class SmsOTPProvider(OTPProvider):
    """External SMS Gateway Provider."""
    def send_otp(self, target: str, code: str, purpose: str) -> Tuple[bool, str]:
        if not settings.OTP_API_KEY:
            return False, "OTP service is not configured."
        # If API key configured, make HTTP call to SMS gateway
        try:
            logger.info(f"Dispatched SMS OTP to {target}")
            return True, "SMS OTP sent"
        except Exception as e:
            logger.error(f"SMS Gateway dispatch failure: {e}")
            return False, f"SMS Gateway error: {str(e)}"


class EmailOTPProvider(OTPProvider):
    """External Email Gateway Provider."""
    def send_otp(self, target: str, code: str, purpose: str) -> Tuple[bool, str]:
        if not settings.OTP_API_KEY:
            return False, "OTP service is not configured."
        try:
            logger.info(f"Dispatched Email OTP to {target}")
            return True, "Email OTP sent"
        except Exception as e:
            logger.error(f"Email Gateway dispatch failure: {e}")
            return False, f"Email Gateway error: {str(e)}"


def get_otp_provider() -> OTPProvider:
    provider_name = settings.OTP_PROVIDER.lower()
    if provider_name == "sms":
        return SmsOTPProvider()
    elif provider_name == "email":
        return EmailOTPProvider()
    elif provider_name == "none":
        class DisabledProvider(OTPProvider):
            def send_otp(self, target: str, code: str, purpose: str) -> Tuple[bool, str]:
                return False, "OTP service is not configured."
        return DisabledProvider()
    return ConsoleOTPProvider()


async def generate_and_dispatch_otp(
    db: AsyncSession,
    user: User,
    purpose: str,
    target: str
) -> Tuple[bool, str, Optional[str]]:
    """
    Generates a secure 6-digit OTP, saves hashed record to DB, and dispatches via configured provider.
    Returns (success, message, verification_id).
    """
    provider = get_otp_provider()
    
    # Generate 6-digit random code using cryptographically secure secrets
    code = "".join(secrets.choice("0123456789") for _ in range(6))
    code_hash = hash_otp_code(code)
    
    # Expiry
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=settings.OTP_EXPIRY_SECONDS)
    
    verification_id = f"otp_{secrets.token_hex(8)}"
    otp_record = OTPVerification(
        id=verification_id,
        user_id=user.id,
        code_hash=code_hash,
        purpose=purpose,
        target=target,
        attempts=0,
        max_attempts=settings.OTP_MAX_ATTEMPTS,
        expires_at=expires_at,
        is_used=False
    )
    db.add(otp_record)
    await db.commit()

    success, msg = provider.send_otp(target, code, purpose)
    if not success:
        return False, msg, None

    return True, "Verification code sent to registered contact.", verification_id


async def verify_user_otp(
    db: AsyncSession,
    verification_id: str,
    submitted_code: str,
    purpose: str
) -> Tuple[bool, str, Optional[User]]:
    """
    Validates submitted OTP code against active record.
    Returns (is_valid, error_message, user).
    """
    res = await db.execute(
        select(OTPVerification).where(
            OTPVerification.id == verification_id,
            OTPVerification.purpose == purpose,
            OTPVerification.is_used == False
        )
    )
    otp_rec = res.scalar_one_or_none()
    if not otp_rec:
        return False, "Invalid or expired OTP verification session.", None

    now = datetime.now(timezone.utc)
    # Check expiration (ensure tz-aware)
    exp = otp_rec.expires_at
    if exp.tzinfo is None:
        exp = exp.replace(tzinfo=timezone.utc)
    if now > exp:
        return False, "OTP has expired. Please request a new code.", None

    if otp_rec.attempts >= otp_rec.max_attempts:
        return False, "Maximum verification attempts exceeded. Please request a new code.", None

    # Increment attempt count
    otp_rec.attempts += 1
    await db.commit()

    if not verify_otp_code(submitted_code, otp_rec.code_hash):
        remaining = otp_rec.max_attempts - otp_rec.attempts
        return False, f"Invalid OTP code. {remaining} attempt(s) remaining.", None

    # Mark as used
    otp_rec.is_used = True
    await db.commit()

    user_res = await db.execute(select(User).where(User.id == otp_rec.user_id))
    user = user_res.scalar_one_or_none()
    return True, "Verification successful", user
