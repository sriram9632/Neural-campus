from datetime import datetime, timezone

from fastapi import Request

from database import db


def get_client_ip(request: Request) -> str | None:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    if request.client:
        return request.client.host
    return None


async def record_login_activity(
    user: dict,
    request: Request,
    event: str,
    *,
    success: bool = True,
) -> None:
    await db.login_logs.insert_one(
        {
            "user_id": str(user["_id"]),
            "name": user["name"],
            "email": user.get("email"),
            "auth_type": user["auth_type"],
            "event": event,
            "success": success,
            "ip_address": get_client_ip(request),
            "user_agent": request.headers.get("user-agent"),
            "logged_at": datetime.now(timezone.utc),
        }
    )


async def record_failed_login(
    email: str,
    request: Request,
    auth_type: str = "credentials",
) -> None:
    await db.login_logs.insert_one(
        {
            "user_id": None,
            "name": None,
            "email": email,
            "auth_type": auth_type,
            "event": "login_failed",
            "success": False,
            "ip_address": get_client_ip(request),
            "user_agent": request.headers.get("user-agent"),
            "logged_at": datetime.now(timezone.utc),
        }
    )
