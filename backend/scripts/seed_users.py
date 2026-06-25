import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.database import SessionLocal, engine, Base
from app.models.user import User
from app.services.auth_service import get_password_hash

Base.metadata.create_all(bind=engine)

USERS = [
    {
        "username": "admin",
        "email": "admin@univalle.edu.co",
        "full_name": "Administrador",
        "password": "admin123",
        "role": "admin",
    },
    {
        "username": "juan.perez",
        "email": "juan.perez@univalle.edu.co",
        "full_name": "Juan Pérez",
        "password": "clave123",
        "role": "user",
    },
    {
        "username": "maria.garcia",
        "email": "maria.garcia@univalle.edu.co",
        "full_name": "María García",
        "password": "clave123",
        "role": "editor",
    },
]


def seed():
    db = SessionLocal()
    try:
        for user_data in USERS:
            existing_username = db.query(User).filter(
                User.username == user_data["username"]
            ).first()
            if existing_username:
                print(f"ERROR: Usuario '{user_data['username']}' ya existe")
                sys.exit(1)

            existing_email = db.query(User).filter(
                User.email == user_data["email"]
            ).first()
            if existing_email:
                print(f"ERROR: Email '{user_data['email']}' ya existe")
                sys.exit(1)

        for user_data in USERS:
            user = User(
                username=user_data["username"],
                email=user_data["email"],
                full_name=user_data["full_name"],
                hashed_password=get_password_hash(user_data["password"]),
                role=user_data["role"],
                is_active=True,
            )
            db.add(user)

        db.commit()
        print(f"Se crearon {len(USERS)} usuarios exitosamente")
    except Exception as e:
        db.rollback()
        print(f"Error al crear usuarios: {e}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    seed()
