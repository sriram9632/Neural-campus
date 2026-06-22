from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Header, HTTPException, Request

from database import db
from models.user_model import (
    AuthResponse,
    GmailOtpRequest,
    GmailVerifyRequest,
    SignInRequest,
    SignUpRequest,
)
from config import smtp_configured
from utils.auth_utils import (
    create_access_token,
    decode_access_token,
    generate_otp,
    hash_password,
    is_gmail,
    otp_expires_at,
    verify_password,
)
from utils.email_service import send_otp_email
from utils.login_logger import record_failed_login, record_login_activity

router = APIRouter(prefix="/auth", tags=["auth"])


def _user_response(user: dict) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user.get("email"),
        "auth_type": user["auth_type"],
    }


def _auth_response(user: dict) -> AuthResponse:
    token = create_access_token(
        str(user["_id"]),
        user.get("email") or "",
        user["name"],
        user["auth_type"],
    )
    return AuthResponse(token=token, user=_user_response(user))


async def _get_current_user(authorization: str | None) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.split(" ", 1)[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


@router.post("/signup", response_model=AuthResponse)
async def signup(body: SignUpRequest, request: Request):
    email = body.email.lower().strip()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = {
        "name": body.name.strip(),
        "email": email,
        "password_hash": hash_password(body.password),
        "auth_type": "credentials",
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.users.insert_one(user)
    user["_id"] = result.inserted_id
    await record_login_activity(user, request, event="signup")
    return _auth_response(user)


@router.post("/login", response_model=AuthResponse)
async def login(body: SignInRequest, request: Request):
    email = body.email.lower().strip()
    user = await db.users.find_one({"email": email, "auth_type": "credentials"})
    if not user or not verify_password(body.password, user["password_hash"]):
        await record_failed_login(email, request)
        raise HTTPException(status_code=401, detail="Invalid email or password")

    await record_login_activity(user, request, event="login")
    return _auth_response(user)


@router.post("/guest", response_model=AuthResponse)
async def guest_login(request: Request):
    guest_id = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S%f")
    user = {
        "name": f"Guest {guest_id[-6:]}",
        "email": None,
        "auth_type": "guest",
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.users.insert_one(user)
    user["_id"] = result.inserted_id
    await record_login_activity(user, request, event="guest")
    return _auth_response(user)


@router.post("/gmail/send-otp")
async def send_gmail_otp(body: GmailOtpRequest):
    email = body.email.lower().strip()
    if not is_gmail(email):
        raise HTTPException(status_code=400, detail="Please use a Gmail address (@gmail.com)")

    if not smtp_configured():
        raise HTTPException(
            status_code=503,
            detail="Email service not configured. Add SMTP credentials to backend/.env",
        )

    otp = generate_otp()
    await db.otp_codes.delete_many({"email": email})
    await db.otp_codes.insert_one(
        {
            "email": email,
            "otp": otp,
            "expires_at": otp_expires_at(),
            "created_at": datetime.now(timezone.utc),
        }
    )

    try:
        await send_otp_email(email, otp)
    except Exception:
        await db.otp_codes.delete_many({"email": email})
        raise HTTPException(
            status_code=502,
            detail="Failed to send OTP email. Check SMTP settings and try again.",
        )

    return {
        "message": "OTP sent to your Gmail. Check your inbox.",
        "email": email,
    }


@router.post("/gmail/verify-otp", response_model=AuthResponse)
async def verify_gmail_otp(body: GmailVerifyRequest, request: Request):
    email = body.email.lower().strip()
    if not is_gmail(email):
        raise HTTPException(status_code=400, detail="Please use a Gmail address (@gmail.com)")

    record = await db.otp_codes.find_one({"email": email, "otp": body.otp})
    if not record:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    expires_at = record["expires_at"]
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        await db.otp_codes.delete_one({"_id": record["_id"]})
        raise HTTPException(status_code=400, detail="OTP expired. Request a new one.")

    await db.otp_codes.delete_one({"_id": record["_id"]})

    user = await db.users.find_one({"email": email, "auth_type": "gmail"})
    is_new_user = not user
    if not user:
        name = email.split("@")[0].replace(".", " ").title()
        user = {
            "name": name,
            "email": email,
            "auth_type": "gmail",
            "created_at": datetime.now(timezone.utc),
        }
        result = await db.users.insert_one(user)
        user["_id"] = result.inserted_id

    await record_login_activity(user, request, event="signup" if is_new_user else "gmail")
    return _auth_response(user)


@router.get("/me")
async def get_me(authorization: str | None = Header(default=None)):
    user = await _get_current_user(authorization)
    return _user_response(user)


@router.get("/login-logs")
async def get_login_logs(authorization: str | None = Header(default=None)):
    user = await _get_current_user(authorization)
    logs = []

    async for entry in db.login_logs.find({"user_id": str(user["_id"])}).sort(
        "logged_at", -1
    ).limit(50):
        entry["_id"] = str(entry["_id"])
        logs.append(entry)

    return logs
