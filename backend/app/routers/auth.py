from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.user import UserLogin, Token, ForgotPasswordRequest, ResetPasswordRequest
from app.config import ACCESS_TOKEN_EXPIRE_MINUTES
from app.services.auth_service import (
    authenticate_user,
    create_access_token,
    create_reset_token,
    verify_reset_token,
    get_password_hash,
)
from app.services.email_service import send_reset_email
from app.models.user import User

router = APIRouter(prefix="/api/v1", tags=["auth"])


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, credentials.username, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role},
        expires_delta=access_token_expires,
    )
    return Token(access_token=access_token, token_type="bearer")


@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()

    if user:
        token = create_reset_token(user.email)
        await send_reset_email(user.email, token)

    return {"message": "Si el correo está registrado, recibirás un enlace de recuperación."}


@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    email = verify_reset_token(request.token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token inválido o expirado.",
        )

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado.",
        )

    user.hashed_password = get_password_hash(request.new_password)
    db.commit()

    return {"message": "Contraseña actualizada correctamente."}
