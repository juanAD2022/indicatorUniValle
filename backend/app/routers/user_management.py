from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies import get_current_user, require_roles
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate, UserListResponse

router = APIRouter(prefix="/api/v1/users", tags=["users"])

VALID_ROLES = [
    "admin",
    "director_escuela",
    "secretaria_escuela",
    "coordinador_lab",
    "director_pregrado",
    "secretaria_pregrado",
    "coordinador_posgrado",
    "secretaria_posgrado",
    "grupo_inferir",
    "coordinador_extension",
]

# Dependency for admin + coordinador_lab
require_admin_or_coordinator = Depends(require_roles("admin", "coordinador_lab"))

# Dependency for admin only
require_admin = Depends(require_roles("admin"))


@router.get("", response_model=UserListResponse)
def list_users(
    role: Optional[str] = None,
    is_active: Optional[bool] = None,
    _: User = require_admin_or_coordinator,
    db: Session = Depends(get_db),
):
    query = db.query(User)

    if role is not None:
        query = query.filter(User.role == role)
    if is_active is not None:
        query = query.filter(User.is_active == is_active)

    users = query.order_by(User.created_at.desc()).all()
    return UserListResponse(
        users=[UserResponse.from_orm(u) for u in users],
        total=len(users),
    )


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    _: User = require_admin_or_coordinator,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado",
        )
    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    data: UserUpdate,
    current_user: User = require_admin_or_coordinator,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado",
        )

    # Coordinador_lab cannot modify an admin user
    if current_user.role == "coordinador_lab" and user.role == "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tiene permisos para modificar un usuario administrador.",
        )

    # Validate role if provided
    if data.role is not None:
        if data.role not in VALID_ROLES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Rol inválido. Roles válidos: {', '.join(VALID_ROLES)}",
            )
        user.role = data.role

    # Update email if provided
    if data.email is not None:
        # Check if email is already taken by another user
        existing = db.query(User).filter(User.email == data.email, User.id != user_id).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El correo electrónico ya está en uso por otro usuario.",
            )
        user.email = data.email

    db.commit()
    db.refresh(user)
    return user


@router.patch("/{user_id}/toggle-active", response_model=UserResponse)
def toggle_user_active(
    user_id: int,
    current_user: User = require_admin,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado",
        )

    # Prevent self-deactivation
    if current_user.id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puede desactivar su propia cuenta.",
        )

    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)
    return user
