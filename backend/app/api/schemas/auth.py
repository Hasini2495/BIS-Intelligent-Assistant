from typing import Optional, List
from pydantic import BaseModel, ConfigDict, EmailStr
from app.api.schemas.common import CamelModel

class UserRegisterRequest(CamelModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = None
    organization: Optional[str] = None
    department: Optional[str] = None
    role: Optional[str] = "user"

class UserLoginRequest(CamelModel):
    email: str
    password: str
    remember_me: Optional[bool] = True

class UserResponse(CamelModel):
    id: str
    name: str
    email: str
    role: str
    phone: Optional[str] = None
    organization: Optional[str] = None
    department: Optional[str] = None
    is_2fa_enabled: bool
    two_factor_method: str
    is_active: bool
    created_at: Optional[str] = None

class LoginResponse(CamelModel):
    access_token: Optional[str] = None
    token_type: Optional[str] = "bearer"
    user: Optional[UserResponse] = None
    requires_2fa: bool = False
    verification_id: Optional[str] = None
    two_factor_method: Optional[str] = None
    message: Optional[str] = None

class Verify2FALoginRequest(CamelModel):
    verification_id: str
    code: str

class ProfileUpdateRequest(CamelModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    organization: Optional[str] = None
    department: Optional[str] = None

class ChangePasswordRequest(CamelModel):
    current_password: str
    new_password: str
    confirm_password: str

class TwoFactorStatusResponse(CamelModel):
    enabled: bool
    method: str
    phone: Optional[str] = None
    email: Optional[str] = None
    provider_configured: bool

class TwoFactorSetupResponse(CamelModel):
    success: bool
    message: str
    verification_id: Optional[str] = None

class TwoFactorEnableRequest(CamelModel):
    verification_id: str
    code: str

class TwoFactorDisableRequest(CamelModel):
    password: str

class GoogleOAuthUrlResponse(CamelModel):
    configured: bool
    url: Optional[str] = None
    message: Optional[str] = None

class GoogleOAuthCallbackRequest(CamelModel):
    code: str

class SessionItemResponse(CamelModel):
    id: str
    device: Optional[str] = "Current Browser"
    ip_address: Optional[str] = "127.0.0.1"
    created_at: str
    is_current: bool = False
