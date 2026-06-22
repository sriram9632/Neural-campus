from bson import ObjectId
from fastapi import APIRouter, HTTPException
from database import db
from models.faculty_model import Faculty

router = APIRouter()


@router.post("/faculty")
async def create_faculty(faculty: Faculty):
    result = await db.faculty.insert_one(faculty.dict())
    return {"message": "Faculty created", "id": str(result.inserted_id)}


@router.get("/faculty/{department_id}")
async def get_faculty(department_id: str):
    faculty_list = []
    async for member in db.faculty.find({"department_id": department_id}):
        member["_id"] = str(member["_id"])
        faculty_list.append(member)
    return faculty_list


@router.put("/faculty/{faculty_id}")
async def update_faculty(faculty_id: str, faculty: Faculty):
    result = await db.faculty.update_one(
        {"_id": ObjectId(faculty_id)},
        {"$set": faculty.dict()},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Faculty not found")
    return {"message": "Faculty updated"}


@router.delete("/faculty/{faculty_id}")
async def delete_faculty(faculty_id: str):
    result = await db.faculty.delete_one({"_id": ObjectId(faculty_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Faculty not found")
    return {"message": "Faculty deleted"}
