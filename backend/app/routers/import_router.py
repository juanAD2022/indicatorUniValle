from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, Header, Query
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from app.database.database import get_db
from app.config import SECRET_KEY, ALGORITHM
from app.schemas.import_schema import ImportPreviewResponse, ImportConfirmRequest, ImportConfirmResponse
from app.services.import_service import preview_import, execute_import
from app.services.posgrado_import_service import preview_posgrado_import, execute_posgrado_import
from app.services.grupo_inferir_import_service import preview_grupo_inferir_import, execute_grupo_inferir_import
from app.services.base_laboratorio_import_service import preview_base_laboratorio_import, execute_base_laboratorio_import
from app.services.gestion_directiva_import_service import preview_gestion_directiva_import, execute_gestion_directiva_import
from app.services.extension_social_import_service import preview_extension_social_import, execute_extension_social_import
from app.services.profesor_import_service import preview_profesor_import, execute_profesor_import
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
    tipo_programa: str = Query(..., description="Tipo de programa: PREGRADO, POSGRADO o ESPECIALIZACION"),
    authorization: str = Header(None),
    db: Session = Depends(get_db),
):
    print(f"DEBUG: Received file: {file.filename}, Content-Type: {file.content_type}, tipo_programa: {tipo_programa}")
    if not file.filename.endswith((".xlsx", ".xls")):
        raise HTTPException(status_code=400, detail="Solo se permiten archivos Excel (.xlsx)")

    if tipo_programa not in ("PREGRADO", "POSGRADO", "ESPECIALIZACION", "GRUPO_INFERIR", "BASE_LABORATORIO", "GESTION_DIRECTIVA", "EXTENSION_SOCIAL", "PROFESOR"):
        raise HTTPException(status_code=400, detail="tipo_programa debe ser PREGRADO, POSGRADO, ESPECIALIZACION, GRUPO_INFERIR, BASE_LABORATORIO, GESTION_DIRECTIVA, EXTENSION_SOCIAL o PROFESOR")

    token = _extract_token(authorization)
    user = _get_current_user(db, token)

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="El archivo está vacío")

    import io
    file_obj = io.BytesIO(contents)

    try:
        if tipo_programa == "POSGRADO":
            result = preview_posgrado_import(db, file_obj, file.filename)
        elif tipo_programa == "GRUPO_INFERIR":
            result = preview_grupo_inferir_import(db, file_obj, file.filename)
        elif tipo_programa == "BASE_LABORATORIO":
            result = preview_base_laboratorio_import(db, file_obj, file.filename)
        elif tipo_programa == "GESTION_DIRECTIVA":
            result = preview_gestion_directiva_import(db, file_obj, file.filename)
        elif tipo_programa == "EXTENSION_SOCIAL":
            result = preview_extension_social_import(db, file_obj, file.filename)
        elif tipo_programa == "PROFESOR":
            result = preview_profesor_import(db, file_obj, file.filename)
        else:
            result = preview_import(db, file_obj, file.filename, tipo_programa)
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
        if body.tipo_programa == "POSGRADO":
            result = execute_posgrado_import(db, body.rows, user.id, user.username)
        elif body.tipo_programa == "GRUPO_INFERIR":
            result = execute_grupo_inferir_import(db, body.rows, user.id, user.username)
        elif body.tipo_programa == "BASE_LABORATORIO":
            result = execute_base_laboratorio_import(db, body.rows, user.id, user.username)
        elif body.tipo_programa == "GESTION_DIRECTIVA":
            result = execute_gestion_directiva_import(db, body.rows, user.id, user.username)
        elif body.tipo_programa == "EXTENSION_SOCIAL":
            result = execute_extension_social_import(db, body.rows, user.id, user.username)
        elif body.tipo_programa == "PROFESOR":
            result = execute_profesor_import(db, body.rows, user.id, user.username)
        else:
            result = execute_import(db, body.rows, user.id, user.username, body.tipo_programa)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al ejecutar la importación: {str(e)}")

    return ImportConfirmResponse(**result)
