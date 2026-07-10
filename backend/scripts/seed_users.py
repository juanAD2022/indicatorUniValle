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
        "email": "yeimy.marin@correounivalle.edu.co",
        "full_name": "ACTORES",
        "password": "UniValle2024",
        "role": "admin",
    },
    {
        "username": "director.escuela",
        "email": "jose.r.tovar@correounivalle.edu.co",
        "full_name": "ACTORES",
        "password": "UniValle2024",
        "role": "director_escuela",
    },
    {
        "username": "secretaria.escuela",
        "email": "direccion.estadistica@correounivalle.edu.co",
        "full_name": "ACTORES",
        "password": "UniValle2024",
        "role": "secretaria_escuela",
    },
    {
        "username": "coordinador.lab",
        "email": "cesar.ojeda@correounivalle.edu.co",
        "full_name": "ACTORES",
        "password": "UniValle2024",
        "role": "coordinador_lab",
    },
    {
        "username": "director.pregrado",
        "email": "jaime.mosquera@correounivalle.edu.co",
        "full_name": "ACTORES",
        "password": "UniValle2024",
        "role": "director_pregrado",
    },
    {
        "username": "secretaria.pregrado",
        "email": "pregrado.estadistica@correounivalle.edu.co",
        "full_name": "ACTORES",
        "password": "UniValle2024",
        "role": "secretaria_pregrado",
    },
    {
        "username": "coordinador.posgrado",
        "email": "luz.pereira@correounivalle.edu.co",
        "full_name": "ACTORES",
        "password": "UniValle2024",
        "role": "coordinador_posgrado",
    },
    {
        "username": "secretaria.posgrado",
        "email": "posgrado.estadistica@correounivalle.edu.co",
        "full_name": "ACTORES",
        "password": "UniValle2024",
        "role": "secretaria_posgrado",
    },
    {
        "username": "grupo.inferir",
        "email": "inferir.estadistica@correounivalle.edu.co",
        "full_name": "ACTORES",
        "password": "UniValle2024",
        "role": "grupo_inferir",
    },
    {
        "username": "coordinador.extension",
        "email": "jennyfer.portilla@correounivalle.edu.co",
        "full_name": "ACTORES",
        "password": "UniValle2024",
        "role": "coordinador_extension",
    },
]


def seed():
    db = SessionLocal()
    try:
        for user_data in USERS:
            existing_user = db.query(User).filter(
                User.username == user_data["username"]
            ).first()

            if existing_user:
                existing_user.email = user_data["email"]
                existing_user.full_name = user_data["full_name"]
                existing_user.hashed_password = get_password_hash(user_data["password"])
                existing_user.role = user_data["role"]
                existing_user.is_active = True
                print(f"Usuario '{user_data['username']}' actualizado")
            else:
                user = User(
                    username=user_data["username"],
                    email=user_data["email"],
                    full_name=user_data["full_name"],
                    hashed_password=get_password_hash(user_data["password"]),
                    role=user_data["role"],
                    is_active=True,
                )
                db.add(user)
                print(f"Usuario '{user_data['username']} creado")

        db.commit()
        print(f"Proceso completado. {len(USERS)} usuarios procesados")
    except Exception as e:
        db.rollback()
        print(f"Error al procesar usuarios: {e}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    seed()
