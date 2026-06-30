from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProceedingResponse(BaseModel):
    id: int
    file_path: str
    original_name: str
    category_id: int
    upload_date: Optional[datetime] = None
    observation: Optional[str] = None
    user_id: int

    class Config:
        from_attributes = True


class ProceedingCreate(BaseModel):
    category_id: int
    observation: Optional[str] = None
    user_id: int
