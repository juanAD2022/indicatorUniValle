import os
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies import get_current_user
from app.models.proceedings import Proceeding
from app.models.category import Category
from app.models.user import User
from app.schemas.proceedings import ProceedingResponse

router = APIRouter(prefix="/api/v1/proceedings", tags=["proceedings"])

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent


@router.post("/upload", response_model=ProceedingResponse, status_code=201)
def upload_proceeding(
    file: UploadFile = File(...),
    category_id: int = Form(...),
    observation: str = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    dest_dir = PROJECT_ROOT / category.base_path
    os.makedirs(dest_dir, exist_ok=True)

    ext = Path(file.filename).suffix
    filename = f"{uuid.uuid4().hex}{ext}"
    file_path = dest_dir / filename

    with open(file_path, "wb") as f:
        content = file.file.read()
        f.write(content)

    relative_path = f"{category.base_path}/{filename}"

    proceeding = Proceeding(
        file_path=relative_path,
        original_name=file.filename,
        category_id=category_id,
        observation=observation,
        user_id=current_user.id,
    )
    db.add(proceeding)
    db.commit()
    db.refresh(proceeding)
    return proceeding


@router.get("", response_model=list[ProceedingResponse])
def list_proceedings(
    category_id: int = None,
    user_id: int = None,
    db: Session = Depends(get_db),
):
    query = db.query(Proceeding)
    if category_id is not None:
        query = query.filter(Proceeding.category_id == category_id)
    if user_id is not None:
        query = query.filter(Proceeding.user_id == user_id)
    return query.order_by(Proceeding.upload_date.desc()).all()


@router.get("/{proceeding_id}", response_model=ProceedingResponse)
def get_proceeding(proceeding_id: int, db: Session = Depends(get_db)):
    proceeding = db.query(Proceeding).filter(Proceeding.id == proceeding_id).first()
    if not proceeding:
        raise HTTPException(status_code=404, detail="Proceeding not found")
    return proceeding


@router.get("/{proceeding_id}/download")
def download_proceeding(proceeding_id: int, db: Session = Depends(get_db)):
    proceeding = db.query(Proceeding).filter(Proceeding.id == proceeding_id).first()
    if not proceeding:
        raise HTTPException(status_code=404, detail="Proceeding not found")

    full_path = PROJECT_ROOT / proceeding.file_path
    if not os.path.exists(full_path):
        raise HTTPException(status_code=404, detail="File not found on disk")

    return FileResponse(
        path=str(full_path),
        filename=proceeding.original_name,
        media_type="application/octet-stream",
    )


@router.delete("/{proceeding_id}", status_code=204)
def delete_proceeding(proceeding_id: int, db: Session = Depends(get_db)):
    proceeding = db.query(Proceeding).filter(Proceeding.id == proceeding_id).first()
    if not proceeding:
        raise HTTPException(status_code=404, detail="Proceeding not found")

    full_path = PROJECT_ROOT / proceeding.file_path
    if os.path.exists(full_path):
        os.remove(full_path)

    db.delete(proceeding)
    db.commit()
    return None
