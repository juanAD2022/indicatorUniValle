import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.database import SessionLocal, engine, Base
from app.models.user import User
from app.services.auth_service import get_password_hash

Base.metadata.create_all(bind=engine)

USERS = [
    {
        "username": "administrador",
        "email": "administrador@correo.univalle.edu.co",
        "full_name": "Administrador",
        "password": "UniValle2024",
        "role": "admin",
    },
    {
        "username": "jose.n.tovar",
        "email": "jose.n.tovar@correo.univalle.edu.co",
        "full_name": "José N. Tovar",
        "password": "UniValle2024",
        "role": "director_escuela",
    },
    {
        "username": "andres.echoa",
        "email": "andres.echoa@correo.univalle.edu.co",
        "full_name": "Andrés Echoa",
        "password": "UniValle2024",
        "role": "coordinador_lab",
    },
    {
        "username": "jaime.mosquera",
        "email": "jaime.mosquera@correo.univalle.edu.co",
        "full_name": "Jaime Mosquera",
        "password": "UniValle2024",
        "role": "admin",
    },
    {
        "username": "pregrado.estadistica",
        "email": "pregrado.estadistica@correo.univalle.edu.co",
        "full_name": "Secretaria Pregrado Estadistica",
        "password": "UniValle2024",
        "role": "secretaria_pregrado",
    },
    {
        "username": "posgraduo.estadistica",
        "email": "posgraduo.estadistica@correo.univalle.edu.co",
        "full_name": "Secretaria Posgrado Estadistica",
        "password": "UniValle2024",
        "role": "secretaria_posgrado",
    },
    {
        "username": "lu.pereira",
        "email": "lu.pereira@correo.univalle.edu.co",
        "full_name": "Lu Pereira",
        "password": "UniValle2024",
        "role": "coordinador_posgrado",
    },
    {
        "username": "direccion.estadistica",
        "email": "direccion.estadistica@correo.univalle.edu.co",
        "full_name": "Secretaria Escuela Estadistica",
        "password": "UniValle2024",
        "role": "secretaria_escuela",
    },
    {
        "username": "jennyfer.portilla",
        "email": "jennyfer.portilla@correo.univalle.edu.co",
        "full_name": "Jennyfer Portilla",
        "password": "UniValle2024",
        "role": "coordinador_extension",
    },
    {
        "username": "inferior.estadistica",
        "email": "inferior.estadistica@correo.univalle.edu.co",
        "full_name": "Grupo Inferior Estadistica",
        "password": "UniValle2024",
        "role": "grupo_inferior",
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
