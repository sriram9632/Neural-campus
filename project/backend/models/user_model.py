from pydantic import BaseModel, EmailStr, Field


class SignUpRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class SignInRequest(BaseModel):
    email: EmailStr
    password: str


class GmailOtpRequest(BaseModel):
    email: EmailStr


class GmailVerifyRequest(BaseModel):
    email: EmailStr
    otp: str = Field(min_length=6, max_length=6)


class AuthResponse(BaseModel):
    token: str
    user: dict
