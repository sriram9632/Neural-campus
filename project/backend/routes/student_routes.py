from bson import ObjectId
from fastapi import APIRouter, HTTPException
from database import db
from models.student_model import Student

router = APIRouter()

@router.post("/student")
async def create_student(student: Student):

    result = await db.students.insert_one(student.dict())

    return {
        "message": "Student created",
        "id": str(result.inserted_id)
    }


@router.get("/students/{department_id}")
async def get_students(department_id: str):

    students = []

    async for student in db.students.find(
        {"department_id": department_id}
    ):
        student["_id"] = str(student["_id"])
        students.append(student)

    return students


@router.put("/student/{student_id}")
async def update_student(student_id: str, student: Student):
    result = await db.students.update_one(
        {"_id": ObjectId(student_id)},
        {"$set": student.dict()},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student updated"}


@router.delete("/student/{student_id}")
async def delete_student(student_id: str):
    result = await db.students.delete_one({"_id": ObjectId(student_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student deleted"}