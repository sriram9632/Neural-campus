import config  # noqa: F401 — loads .env before routes

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.college_routes import router as college_router
from routes.department_routes import router as department_router
from routes.student_routes import router as student_router
from routes.course_routes import router as course_router
from routes.faculty_routes import router as faculty_router
from routes.auth_routes import router as auth_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(college_router)
app.include_router(department_router)
app.include_router(student_router)
app.include_router(course_router)
app.include_router(faculty_router)
app.include_router(auth_router)

from dotenv import load_dotenv
import os

load_dotenv()

print(os.getenv("SMTP_USER"))