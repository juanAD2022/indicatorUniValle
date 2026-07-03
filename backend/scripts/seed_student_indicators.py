"""
Seed script for student_indicators table - Pregrado 2019-2026
Generates ~800 realistic records (50 per semester)

Usage:
    cd /home/juan/proyect/indicatorUniValle
    python backend/scripts/seed_student_indicators.py
"""

import random
import sys
import os

import pymysql

# Database configuration (matches docker-compose.yml)
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", "3306")),
    "user": os.getenv("DB_USER", "juan"),
    "password": os.getenv("DB_PASSWORD", "12345678"),
    "database": os.getenv("DB_NAME", "indicator"),
    "charset": "utf8mb4",
}

# Distribution of states per year (realistic with pandemic effect)
# [matriculados, graduados, retirados, desertores, reingresados]
DISTRIBUTION_BY_YEAR = {
    2019: [30, 8, 5, 4, 3],
    2020: [25, 7, 8, 6, 4],  # Pandemic start
    2021: [24, 6, 9, 7, 4],  # Pandemic peak
    2022: [28, 8, 6, 5, 3],  # Recovery
    2023: [30, 8, 5, 4, 3],
    2024: [31, 8, 5, 3, 3],
    2025: [32, 7, 4, 4, 3],
    2026: [32, 8, 4, 3, 3],
}

GENERO_DISTRIBUCION = ["M"] * 55 + ["F"] * 45
COLEGIO_DISTRIBUCION = ["PUBLICO"] * 70 + ["PRIVADO"] * 30
ESTRATO_DISTRIBUCION = [1] * 10 + [2] * 25 + [3] * 40 + [4] * 20 + [5] * 4 + [6] * 1
VINCULACION_BASE = ["ADMISION"] * 85 + ["REINGRESO"] * 12 + ["AMNISTIA"] * 3

TESIS_ESTADOS = ["SIN_INICIAR", "EN_PROCESO", "APROBADA"]
TESIS_ESTADOS_GRADUADO = ["APROBADA"]


def random_promedio():
    """Generate a realistic GPA with normal distribution around 3.5."""
    while True:
        val = random.gauss(3.5, 0.6)
        if 0.5 <= val <= 5.0:
            return round(val, 2)


def random_pensum_pct(semestres):
    """Generate curriculum percentage correlated with semesters."""
    base = min(semestres * 10, 100)
    noise = random.randint(-10, 10)
    return max(10, min(100, base + noise))


def random_semestres(estado):
    """Generate semesters based on status."""
    if estado == "MATRICULADO":
        return random.randint(1, 8)
    elif estado == "GRADUADO":
        return random.randint(8, 12)
    elif estado in ("RETIRADO", "DESERTOR"):
        return random.randint(1, 7)
    else:  # REINGRESADO
        return random.randint(3, 10)


def generate_record(periodo, estado):
    """Generate a single student indicator record."""
    semestres = random_semestres(estado)

    tesis_estado = "SIN_INICIAR"
    tesis_nota = None
    if estado == "GRADUADO":
        tesis_estado = random.choice(TESIS_ESTADOS_GRADUADO)
        tesis_nota = round(random.uniform(3.5, 5.0), 2)

    return {
        "periodo": periodo,
        "estado": estado,
        "vinculacion": random.choice(VINCULACION_BASE),
        "bra": random.randint(0, 1),
        "semestres_cursados": str(semestres),
        "pensum_aprobado_pct": random_pensum_pct(semestres),
        "promedio_acumulado": random_promedio(),
        "colegio_origen": random.choice(COLEGIO_DISTRIBUCION),
        "sexo": random.choice(GENERO_DISTRIBUCION),
        "estrato": random.choice(ESTRATO_DISTRIBUCION),
        "tesis_estado": tesis_estado,
        "tesis_nota": tesis_nota,
        "acompanamiento_bra": random.random() < 0.15,
        "practica_profesional": random.random() < 0.30,
        "tipo_programa": "PREGRADO",
    }


def insert_records(conn, records):
    """Insert records into student_indicators table."""
    sql = """
        INSERT INTO student_indicators (
            periodo, estado, vinculacion, bra, semestres_cursados,
            pensum_aprobado_pct, promedio_acumulado, colegio_origen,
            sexo, estrato, tesis_estado, tesis_nota,
            acompanamiento_bra, practica_profesional, tipo_programa
        ) VALUES (
            %(periodo)s, %(estado)s, %(vinculacion)s, %(bra)s, %(semestres_cursados)s,
            %(pensum_aprobado_pct)s, %(promedio_acumulado)s, %(colegio_origen)s,
            %(sexo)s, %(estrato)s, %(tesis_estado)s, %(tesis_nota)s,
            %(acompanamiento_bra)s, %(practica_profesional)s, %(tipo_programa)s
        )
    """
    with conn.cursor() as cursor:
        cursor.executemany(sql, records)
    conn.commit()


def main():
    print("=" * 60)
    print("  Seed: Student Indicators - Pregrado 2019-2026")
    print("=" * 60)

    try:
        conn = pymysql.connect(**DB_CONFIG)
        print(f"\n[OK] Connected to MySQL: {DB_CONFIG['database']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}")
    except pymysql.Error as e:
        print(f"\n[ERROR] Cannot connect to MySQL: {e}")
        sys.exit(1)

    # Clear existing pregrado data
    with conn.cursor() as cursor:
        cursor.execute("DELETE FROM student_indicators WHERE tipo_programa = 'PREGRADO'")
        deleted = cursor.rowcount
        conn.commit()
    print(f"[OK] Cleared {deleted} existing PREGRADO records")

    total_records = 0

    for year in range(2019, 2027):
        for semester in [1, 2]:
            periodo = f"{year}-{semester}"
            distribution = DISTRIBUTION_BY_YEAR[year]

            states = (
                ["MATRICULADO"] * distribution[0]
                + ["GRADUADO"] * distribution[1]
                + ["RETIRADO"] * distribution[2]
                + ["DESERTOR"] * distribution[3]
                + ["REINGRESADO"] * distribution[4]
            )
            random.shuffle(states)

            records = [generate_record(periodo, estado) for estado in states]
            insert_records(conn, records)

            count = len(records)
            total_records += count
            print(f"  {periodo}: {count} records (M:{distribution[0]} G:{distribution[1]} R:{distribution[2]} D:{distribution[3]} Re:{distribution[4]})")

    conn.close()

    print(f"\n{'=' * 60}")
    print(f"  DONE! Total records inserted: {total_records}")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
