import aiosmtplib
from email.mime.text import MIMEText

from app.config import EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, FRONTEND_URL


async def send_reset_email(email: str, token: str) -> bool:
    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"

    subject = "Recuperación de contraseña - Indicator UniValle"

    body = (
        "Hola,\n\n"
        "Recibimos una solicitud para restablecer tu contraseña.\n\n"
        f"Haz clic en el siguiente enlace para crear una nueva contraseña:\n\n"
        f"{reset_link}\n\n"
        "Este enlace expira en 15 minutos.\n\n"
        "Si no solicitaste este cambio, ignora este mensaje.\n\n"
        "Saludos,\n"
        "Equipo Indicator UniValle"
    )

    message = MIMEText(body, "plain", "utf-8")
    message["From"] = EMAIL_USER
    message["To"] = email
    message["Subject"] = subject

    try:
        await aiosmtplib.send(
            message,
            hostname=EMAIL_HOST,
            port=EMAIL_PORT,
            start_tls=True,
            username=EMAIL_USER,
            password=EMAIL_PASSWORD,
        )
        return True
    except Exception:
        return False
