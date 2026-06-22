from pydantic import BaseModel


class Course(BaseModel):
    department_id: str
    name: str
    code: str
    credits: int
