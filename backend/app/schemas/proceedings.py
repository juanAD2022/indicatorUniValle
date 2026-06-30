from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProceedingResponse(BaseModel):
    id: int
    file_path: str
    original_name: str
    document_type: str
    document_category: str
    upload_date: Optional[datetime] = None
    version: str
    format: str
    observation: Optional[str] = None
    category_id: int
    user_id: int

    class Config:
        from_attributes = True


class ProceedingCreate(BaseModel):
    category_id: int
    document_type: str
    document_category: str
    version: str
    format: str
    observation: Optional[str] = None
    user_id: int
