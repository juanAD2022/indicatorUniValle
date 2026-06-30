from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, Header
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from app.database.database import get_db
from app.config import SECRET_KEY, ALGORITHM
from app.schemas.import_schema import ImportPreviewResponse, ImportConfirmRequest, ImportConfirmResponse
from app.services.import_service import preview_import, execute_import
from app.models.user import User

router = APIRouter(prefix="/api/v1/import", tags=["import"])


def _get_current_user(db: Session, token: str) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Token inválido")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user


def _extract_token(authorization: str) -> str:
    if authorization and authorization.startswith("Bearer "):
        return authorization[7:]
    return ""


@router.post("/preview", response_model=ImportPreviewResponse)
async def import_preview(
    file: UploadFile = File(...),
    authorization: str = Header(None),
    db: Session = Depends(get_db),
):
    print(f"DEBUG: Received file: {file.filename}, Content-Type: {file.content_type}")
    if not file.filename.endswith((".xlsx", ".xls")):
        raise HTTPException(status_code=400, detail="Solo se permiten archivos Excel (.xlsx)")

    token = _extract_token(authorization)
    user = _get_current_user(db, token)

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="El archivo está vacío")

    import io
    file_obj = io.BytesIO(contents)

    try:
        result = preview_import(db, file_obj, file.filename)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al procesar el archivo: {str(e)}")

    return result


@router.post("/confirm", response_model=ImportConfirmResponse)
async def import_confirm(
    body: ImportConfirmRequest,
    authorization: str = Header(None),
    db: Session = Depends(get_db),
):
    token = _extract_token(authorization)
    user = _get_current_user(db, token)

    try:
        result = execute_import(db, body.rows, user.id, user.username)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al ejecutar la importación: {str(e)}")

    return ImportConfirmResponse(**result)
