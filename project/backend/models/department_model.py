from pydantic import BaseModel

class Department(BaseModel):
    college_id: str
    name: str
    