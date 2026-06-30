from pydantic import BaseModel


class CategoryResponse(BaseModel):
    id: int
    name: str
    base_path: str

    class Config:
        from_attributes = True


class CategoryCreate(BaseModel):
    name: str
    base_path: str
