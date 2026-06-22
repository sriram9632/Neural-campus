from pydantic import BaseModel


class Faculty(BaseModel):
    department_id: str
    name: str
    email: str
    designation: str
