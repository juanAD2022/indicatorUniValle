"""
Migración: Agregar columna `tipo_programa` a la tabla `student_indicators` (MySQL).

Uso:
    cd backend
    python scripts/add_tipo_programa.py

Lee DATABASE_URL del .env (formato: mysql+pymysql://user:pass@host/db).
"""

import os
import sys
from pathlib import Path
from urllib.parse import urlparse

import pymysql
from dotenv import load_dotenv


def load_database_url() -> str:
    env_path = Path(__file__).resolve().parent.parent / ".env"
    load_dotenv(dotenv_path=env_path)
    url = os.getenv("DATABASE_URL")
    if not url:
        print("ERROR: DATABASE_URL no encontrada en .env")
        sys.exit(1)
    return url


def parse_mysql_url(url: str) -> dict:
    parsed = urlparse(url)
    return {
        "host": parsed.hostname or "localhost",
        "port": parsed.port or 3306,
        "user": parsed.username or "root",
        "password": parsed.password or "",
        "database": parsed.path.lstrip("/") or None,
    }


def column_exists(cursor, table: str, column: str, database: str) -> bool:
    cursor.execute(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS "
        "WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s AND COLUMN_NAME = %s",
        (database, table, column),
    )
    return cursor.fetchone() is not None


def migrate():
    raw_url = load_database_url()
    creds = parse_mysql_url(raw_url)

    if not creds["database"]:
        print("ERROR: No se pudo extraer el nombre de la base de datos de DATABASE_URL")
        sys.exit(1)

    print(f"Conectando a MySQL: {creds['host']}:{creds['port']}/{creds['database']}")

    conn = pymysql.connect(
        host=creds["host"],
        port=creds["port"],
        user=creds["user"],
        password=creds["password"],
        database=creds["database"],
    )
    cursor = conn.cursor()

    if column_exists(cursor, "student_indicators", "tipo_programa", creds["database"]):
        print("La columna 'tipo_programa' ya existe. Nada que hacer.")
        conn.close()
        return

    print("Agregando columna 'tipo_programa'...")
    cursor.execute(
        "ALTER TABLE student_indicators "
        "ADD COLUMN tipo_programa VARCHAR(20) NOT NULL DEFAULT 'PREGRADO'"
    )
    conn.commit()
    print("Columna 'tipo_programa' agregada exitosamente.")

    cursor.execute("SELECT COUNT(*) FROM student_indicators")
    total = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM student_indicators WHERE tipo_programa = 'PREGRADO'")
    pregrado = cursor.fetchone()[0]
    print(f"Registros totales: {total}")
    print(f"Registros con tipo_programa='PREGRADO': {pregrado}")

    conn.close()
    print("Migración completada.")


if __name__ == "__main__":
    migrate()
