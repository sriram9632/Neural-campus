from bson import ObjectId
from fastapi import APIRouter, HTTPException
from database import db
from models.department_model import Department

router = APIRouter()

@router.post("/department")
async def create_department(department: Department):

    result = await db.departments.insert_one(department.dict())

    return {
        "message": "Department created",
        "id": str(result.inserted_id)
    }


@router.get("/departments/{college_id}")
async def get_departments(college_id: str):

    departments = []

    async for dept in db.departments.find(
        {"college_id": college_id}
    ):
        dept["_id"] = str(dept["_id"])
        departments.append(dept)

    return departments


@router.put("/department/{department_id}")
async def update_department(department_id: str, department: Department):
    result = await db.departments.update_one(
        {"_id": ObjectId(department_id)},
        {"$set": department.dict()},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Department not found")
    return {"message": "Department updated"}


@router.delete("/department/{department_id}")
async def delete_department(department_id: str):
    result = await db.departments.delete_one({"_id": ObjectId(department_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Department not found")
    return {"message": "Department deleted"}