import asyncio
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from config import (
    SMTP_FROM_EMAIL,
    SMTP_FROM_NAME,
    SMTP_HOST,
    SMTP_PASSWORD,
    SMTP_PORT,
    SMTP_USE_TLS,
    SMTP_USER,
    smtp_configured,
)


def _build_otp_email(to_email: str, otp: str) -> MIMEMultipart:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"{otp} is your Neural Campus verification code"
    msg["From"] = f"{SMTP_FROM_NAME} <{SMTP_FROM_EMAIL}>"
    msg["To"] = to_email

    text = f"""Neural Campus - Verification Code

Your one-time password (OTP) is: {otp}

This code expires in 10 minutes. Do not share it with anyone.

If you did not request this code, you can safely ignore this email.
"""

    html = f"""<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#020617;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#020617;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#0f172a;border:1px solid #06b6d433;border-radius:16px;padding:32px;">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <p style="margin:0;font-size:11px;letter-spacing:0.35em;color:#22d3ee;text-transform:uppercase;">Neural Campus</p>
              <h1 style="margin:8px 0 0;font-size:24px;color:#e2e8f0;">Verification Code</h1>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:16px 0;">
              <p style="margin:0 0 12px;font-size:14px;color:#94a3b8;">Use this code to sign in:</p>
              <div style="display:inline-block;padding:16px 32px;background:#020617;border:1px solid #06b6d466;border-radius:12px;">
                <span style="font-size:32px;font-weight:bold;letter-spacing:0.3em;color:#22d3ee;font-family:monospace;">{otp}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td align="center">
              <p style="margin:0;font-size:12px;color:#64748b;">Expires in 10 minutes. Never share this code.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    msg.attach(MIMEText(text, "plain"))
    msg.attach(MIMEText(html, "html"))
    return msg


def _send_email_sync(to_email: str, otp: str) -> None:
    msg = _build_otp_email(to_email, otp)

    if SMTP_USE_TLS:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=30) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_FROM_EMAIL, [to_email], msg.as_string())
    else:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=30) as server:
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_FROM_EMAIL, [to_email], msg.as_string())


async def send_otp_email(to_email: str, otp: str) -> None:
    if not smtp_configured():
        raise RuntimeError(
            "SMTP is not configured. Set SMTP_USER and SMTP_PASSWORD in backend/.env"
        )

    await asyncio.to_thread(_send_email_sync, to_email, otp)
