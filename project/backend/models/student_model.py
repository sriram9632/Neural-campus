from pydantic import BaseModel

class Student(BaseModel):
    department_id: str
    name: str
    age: int
    year: int
    