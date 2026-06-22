from pydantic import BaseModel

class College(BaseModel):
    name: str
    location: str
    