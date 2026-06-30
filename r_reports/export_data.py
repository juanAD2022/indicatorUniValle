"""
Exporta datos de student_indicators desde MySQL a CSV para que R los consuma.
Uso: python r_reports/export_data.py
"""
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
import pymysql
import csv

BACKEND_ENV = Path(__file__).resolve().parent.parent / "backend" / ".env"
load_dotenv(dotenv_path=BACKEND_ENV)

DATABASE_URL = os.getenv("DATABASE_URL", "")

def parse_mysql_url(url: str) -> dict:
    """Parsea mysql+pymysql://user:pass@host:port/db"""
    url = url.replace("mysql+pymysql://", "")
    if "@" in url:
        creds, rest = url.split("@", 1)
        user, password = creds.split(":", 1)
    else:
        user, password = "root", ""
        rest = url

    if "/" in rest:
        host_port, dbname = rest.split("/", 1)
    else:
        host_port, dbname = rest, ""

    if ":" in host_port:
        host, port = host_port.split(":", 1)
    else:
        host, port = host_port, "3306"

    return {
        "host": host,
        "port": int(port),
        "user": user,
        "password": password,
        "database": dbname,
    }


def export():
    if not DATABASE_URL:
        print("ERROR: DATABASE_URL no encontrada en backend/.env")
        sys.exit(1)

    config = parse_mysql_url(DATABASE_URL)
    print(f"Conectando a MySQL: {config['host']}:{config['port']}/{config['database']}")

    conn = pymysql.connect(
        host=config["host"],
        port=config["port"],
        user=config["user"],
        password=config["password"],
        database=config["database"],
        charset="utf8mb4",
    )

    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM student_indicators")
        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]

        output_dir = Path(__file__).resolve().parent / "data"
        output_dir.mkdir(exist_ok=True)
        output_file = output_dir / "student_indicators.csv"

        with open(output_file, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(columns)
            writer.writerows(rows)

        print(f"Exportados {len(rows)} registros a {output_file}")
    finally:
        conn.close()


if __name__ == "__main__":
    export()
