from fastapi import APIRouter
from database import db
from models.course_model import Course

router = APIRouter()


@router.post("/course")
async def create_course(course: Course):
    result = await db.courses.insert_one(course.dict())
    return {"message": "Course created", "id": str(result.inserted_id)}


@router.get("/courses/{department_id}")
async def get_courses(department_id: str):
    courses = []
    async for course in db.courses.find({"department_id": department_id}):
        course["_id"] = str(course["_id"])
        courses.append(course)
    return courses
