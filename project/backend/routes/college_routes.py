from bson import ObjectId
from fastapi import APIRouter, HTTPException
from database import db
from models.college_model import College

router = APIRouter()

@router.post("/college")
async def create_college(college: College):

    result = await db.colleges.insert_one(college.dict())

    return {
        "message": "College created",
        "id": str(result.inserted_id)
    }


@router.get("/colleges")
async def get_colleges():

    colleges = []

    async for college in db.colleges.find():
        college["_id"] = str(college["_id"])
        colleges.append(college)

    return colleges


@router.put("/college/{college_id}")
async def update_college(college_id: str, college: College):
    result = await db.colleges.update_one(
        {"_id": ObjectId(college_id)},
        {"$set": college.dict()},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="College not found")
    return {"message": "College updated"}


@router.delete("/college/{college_id}")
async def delete_college(college_id: str):
    result = await db.colleges.delete_one({"_id": ObjectId(college_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="College not found")
    return {"message": "College deleted"}