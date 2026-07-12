#!/usr/bin/env python3
"""Genera documento de despliegue del proyecto Indicator UniValle"""

from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH

def add_heading(doc, text, level=1):
    """Añade un encabezado con formato"""
    heading = doc.add_heading(text, level=level)
    heading.alignment = WD_ALIGN_PARAGRAPH.LEFT
    return heading

def add_code_block(doc, text):
    """Añade un bloque de código con formato monoespaciado"""
    paragraph = doc.add_paragraph()
    paragraph.style = 'Normal'
    run = paragraph.add_run(text)
    run.font.name = 'Courier New'
    run.font.size = Pt(9)
    run.font.color.rgb = RGBColor(0, 100, 0)
    return paragraph

def add_note(doc, text):
    """Añade una nota importante"""
    paragraph = doc.add_paragraph()
    run = paragraph.add_run("NOTA: " + text)
    run.bold = True
    run.font.color.rgb = RGBColor(204, 28, 28)  # Rojo UniValle
    return paragraph

def add_step(doc, number, title, description):
    """Añade un paso numerado"""
    paragraph = doc.add_paragraph()
    run = paragraph.add_run(f"Paso {number}: {title}")
    run.bold = True
    run.font.size = Pt(12)
    if description:
        doc.add_paragraph(description, style='List Bullet')

def main():
    doc = Document()
    
    # Configurar estilos
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Arial'
    font.size = Pt(11)
    
    # PORTADA
    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = title.add_run("MANUAL DE DESPLIEGUE")
    run.bold = True
    run.font.size = Pt(24)
    run.font.color.rgb = RGBColor(204, 28, 28)
    
    subtitle = doc.add_paragraph()
    subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = subtitle.add_run("Sistema de Indicadores - Escuela de Estadística\nUniversidad del Valle")
    run.font.size = Pt(16)
    run.font.color.rgb = RGBColor(21, 101, 192)
    
    doc.add_paragraph()
    doc.add_paragraph("Este documento describe el proceso completo para desplegar la aplicación Indicator UniValle utilizando Docker y Docker Compose.", style='List Bullet')
    doc.add_paragraph("Incluye instrucciones para Windows con WSL 2 y para NAS QNAP.", style='List Bullet')
    
    doc.add_page_break()
    
    # ============================================================
    # PARTE 1: DESPLIEGUE EN WINDOWS CON WSL 2
    # ============================================================
    
    add_heading(doc, "PARTE 1: DESPLIEGUE EN WINDOWS CON WSL 2", level=1)
    
    doc.add_paragraph("Este método es recomendado para desarrollo y pruebas en equipos Windows.")
    
    # SECCIÓN 1.1: WSL 2
    add_heading(doc, "1.1 Instalación de WSL 2", level=2)
    
    doc.add_paragraph("WSL (Windows Subsystem for Linux) permite ejecutar Linux nativamente en Windows.")
    
    add_step(doc, 1, "Abrir PowerShell como Administrador", 
             "Hacer clic derecho en el botón de inicio y seleccionar 'Windows PowerShell (Administrador)' o 'Terminal (Administrador)'")
    
    add_step(doc, 2, "Ejecutar el comando de instalación",
             "Este comando instalará WSL con la distribución Ubuntu por defecto:")
    add_code_block(doc, "wsl --install")
    
    add_step(doc, 3, "Reiniciar el equipo",
             "Es necesario reiniciar para completar la instalación")
    
    add_step(doc, 4, "Configurar Ubuntu",
             "Después del reinicio, se abrirá automáticamente una terminal de Ubuntu. Crear un nombre de usuario y contraseña:")
    add_code_block(doc, "Usuario: univalle\nContraseña: [elegir una segura]")
    
    add_note(doc, "Es importante recordar el usuario y contraseña de Ubuntu, ya que se usarán para acceder a Docker.")
    
    # SECCIÓN 1.2: DOCKER
    add_heading(doc, "1.2 Instalación de Docker Desktop", level=2)
    
    doc.add_paragraph("Docker Desktop es la herramienta que permite ejecutar contenedores Docker en Windows.")
    
    add_step(doc, 1, "Descargar Docker Desktop",
             "Ir a la página oficial y descargar el instalador:\nhttps://www.docker.com/products/docker-desktop/")
    
    add_step(doc, 2, "Ejecutar el instalador",
             "Durante la instalación, asegurarse de marcar la opción:\n'Use WSL 2 instead of Hyper-V'")
    
    add_step(doc, 3, "Reiniciar si es necesario",
             "Docker Desktop puede solicitar reiniciar el equipo")
    
    add_step(doc, 4, "Configurar Docker Desktop",
             "Abrir Docker Desktop y verificar en Settings > General que WSL 2 esté habilitado")
    
    add_step(doc, 5, "Habilitar integración con WSL 2",
             "Ir a Settings > Resources > WSL Integration y habilitar la integración con la distribución Ubuntu")
    
    add_step(doc, 6, "Verificar instalación",
             "Abrir una terminal de Ubuntu (WSL) y ejecutar:")
    add_code_block(doc, "docker --version\ndocker compose version")
    
    # SECCIÓN 1.3: CÓDIGO FUENTE
    add_heading(doc, "1.3 Obtener el Código Fuente", level=2)
    
    add_step(doc, 1, "Clonar el repositorio",
             "En la terminal de Ubuntu (WSL), ejecutar:")
    add_code_block(doc, "cd ~\ngit clone [URL_DEL_REPOSITORIO]\ncd indicatorUniValle")
    
    add_step(doc, 2, "Verificar estructura",
             "El proyecto debe contener los siguientes directorios:")
    add_code_block(doc, "backend/       # API con FastAPI\nfrontend/      # Aplicación con React\ndocker-compose.yml   # Configuración de Docker\n.env.example   # Plantilla de variables")
    
    # SECCIÓN 1.4: CONFIGURACIÓN .ENV
    add_heading(doc, "1.4 Configuración del Archivo .env", level=2)
    
    doc.add_paragraph("El archivo .env contiene todas las variables de configuración necesarias para el funcionamiento de la aplicación.")
    
    add_step(doc, 1, "Crear el archivo .env",
             "Copiar el archivo de ejemplo:")
    add_code_block(doc, "cp .env.example .env")
    
    add_step(doc, 2, "Editar el archivo .env",
             "Usar un editor de texto como nano o vim:")
    add_code_block(doc, "nano .env")
    
    doc.add_paragraph("El archivo debe contener las siguientes variables:")
    
    add_code_block(doc, """# SECRET_KEY: Clave secreta para JWT y seguridad
# Generar con: openssl rand -hex 32
SECRET_KEY=cambia-esto-por-un-secret-key-seguro

# DATABASE_URL: Conexión a MySQL
# Formato: mysql+pymysql://usuario:contraseña@db:3306/nombre_bd
DATABASE_URL=mysql+pymysql://appuser:apppassword@db:3306/indicador_univalle

# FRONTEND_URL: URL del frontend para CORS
FRONTEND_URL=http://localhost

# Configuración de correo (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-correo@gmail.com
EMAIL_PASSWORD=tu-app-password-de-16-caracteres

# Credenciales de MySQL (deben coincidir con DATABASE_URL)
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=indicador_univalle
MYSQL_USER=appuser
MYSQL_PASSWORD=apppassword""")
    
    add_note(doc, "IMPORTANTE: Las contraseñas de MySQL deben coincidir entre DATABASE_URL y las variables MYSQL_*.")
    
    # SECCIÓN 1.5: GMAIL APP PASSWORD
    add_heading(doc, "1.5 Configuración de Gmail App Password", level=2)
    
    doc.add_paragraph("Para enviar correos desde la aplicación, es necesario usar una 'Contraseña de Aplicación' de Google, NO la contraseña normal de Gmail.")
    
    add_heading(doc, "¿Qué es una App Password?", level=3)
    doc.add_paragraph("Google requiere autenticación de dos factores para el acceso SMTP. Las contraseñas de aplicación son códigos de 16 caracteres que permiten el acceso seguro.")
    
    add_heading(doc, "Pasos para obtener la App Password:", level=3)
    
    add_step(doc, 1, "Habilitar verificación en dos pasos",
             "Ir a https://myaccount.google.com/signinoptions/two-step-verification\nSeguir las instrucciones para activarla")
    
    add_step(doc, 2, "Generar App Password",
             "Ir a https://myaccount.google.com/apppasswords\nHacer clic en 'Select app' y elegir 'Mail'\nO elegir 'Other (Custom name)' y escribir 'Indicator UniValle'")
    
    add_step(doc, 3, "Copiar el código",
             "Google mostrará un código de 16 caracteres como:\nXXXX XXXX XXXX XXXX\nCopiar y pegar en el archivo .env en la variable EMAIL_PASSWORD")
    
    add_step(doc, 4, "Verificar en el .env",
             "Asegurar que el archivo .env contenga:")
    add_code_block(doc, "EMAIL_USER=tu-correo@gmail.com\nEMAIL_PASSWORD=abcd efgh ijkl mnop")
    
    add_note(doc, "La App Password se muestra UNA SOLA VEZ. Si se pierde, se debe generar una nueva.")
    
    # SECCIÓN 1.6: EJECUTAR
    add_heading(doc, "1.6 Construir y Ejecutar los Contenedores", level=2)
    
    add_step(doc, 1, "Verificar que Docker esté corriendo",
             "Abrir Docker Desktop y confirmar que el motor de Docker esté activo (barra inferior en verde)")
    
    add_step(doc, 2, "Construir y levantar",
             "En la terminal de Ubuntu (dentro del directorio del proyecto):")
    add_code_block(doc, "docker compose up --build -d")
    
    doc.add_paragraph("Este comando hará:")
    doc.add_paragraph("Descargar imágenes de MySQL, Python y Node.js", style='List Bullet')
    doc.add_paragraph("Construir la imagen del backend con FastAPI", style='List Bullet')
    doc.add_paragraph("Construir la imagen del frontend con React", style='List Bullet')
    doc.add_paragraph("Iniciar los 3 contenedores (db, backend, frontend)", style='List Bullet')
    
    add_step(doc, 3, "Verificar estado",
             "Comprobar que todos los contenedores estén corriendo:")
    add_code_block(doc, "docker compose ps")
    
    add_step(doc, 4, "Ver logs en caso de error",
             "Si algún contenedor no arranca, revisar los logs:")
    add_code_block(doc, "docker compose logs -f backend\ndocker compose logs -f frontend\ndocker compose logs -f db")
    
    # SECCIÓN 1.7: VERIFICAR
    add_heading(doc, "1.7 Verificar el Funcionamiento", level=2)
    
    doc.add_paragraph("Una vez que los contenedores estén corriendo, probar los siguientes accesos:")
    
    add_code_block(doc, """# Frontend (Interfaz de usuario)
http://localhost

# API del Backend (Documentación automática)
http://localhost:8000/docs

# MySQL (usar cliente como DBeaver o MySQL Workbench)
Host: localhost
Puerto: 3306
Usuario: appuser
Contraseña: apppassword
Base de datos: indicicador_univalle""")
    
    # SECCIÓN 1.8: COMANDOS ÚTILES
    add_heading(doc, "1.8 Comandos Útiles", level=2)
    
    add_code_block(doc, """# Detener todos los servicios (conservar datos)
docker compose down

# Detener y eliminar datos (incluyendo base de datos)
docker compose down -v

# Reiniciar un servicio específico
docker compose restart backend

# Ver logs en tiempo real
docker compose logs -f

# Acceder al contenedor del backend
docker compose exec backend bash

# Acceder al contenedor de la base de datos
docker compose exec db mysql -u root -p""")
    
    doc.add_page_break()
    
    # ============================================================
    # PARTE 2: DESPLIEGUE EN NAS QNAP
    # ============================================================
    
    add_heading(doc, "PARTE 2: DESPLIEGUE EN NAS QNAP", level=1)
    
    doc.add_paragraph("Este método es recomendado para producción en infraestructura propia (NAS QNAP).")
    
    # SECCIÓN 2.1: REQUISITOS
    add_heading(doc, "2.1 Requisitos del NAS", level=2)
    
    doc.add_paragraph("Para ejecutar Docker en un NAS QNAP, se requiere:")
    doc.add_paragraph("NAS QNAP con QTS 5.0 o superior", style='List Bullet')
    doc.add_paragraph("Mínimo 4GB de RAM (recomendado 8GB)", style='List Bullet')
    doc.add_paragraph("Procesador x86_64 (Intel/AMD) o ARM", style='List Bullet')
    doc.add_paragraph("Acceso administrativo a la interfaz web", style='List Bullet')
    doc.add_paragraph("Espacio en disco para volúmenes persistentes", style='List Bullet')
    
    # SECCIÓN 2.2: CONTAINER STATION
    add_heading(doc, "2.2 Instalación de Container Station", level=2)
    
    add_step(doc, 1, "Abrir App Center",
             "En el escritorio de QTS, hacer clic en 'App Center'")
    
    add_step(doc, 2, "Buscar Container Station",
             "En el campo de búsqueda escribir 'Container Station'")
    
    add_step(doc, 3, "Instalar",
             "Hacer clic en 'Instalar' y esperar a que se complete\nLa instalación puede tardar varios minutos")
    
    add_step(doc, 4, "Abrir Container Station",
             "Una vez instalado, hacer clic en 'Abrir' desde App Center o buscarlo en el menú principal")
    
    # SECCIÓN 2.3: PREPARAR ARCHIVOS
    add_heading(doc, "2.3 Preparar los Archivos del Proyecto", level=2)
    
    add_step(doc, 1, "Copiar proyecto al NAS",
             "Usar una de estas opciones:\na) File Station (interfaz web)\nb) Samba/SMB desde el explorador de archivos\nc) SFTP/SSH")
    
    add_step(doc, 2, "Crear carpeta para el proyecto",
             "Recomendado: /share/Container/indicatorUniValle/")
    
    add_step(doc, 3, "Copiar los archivos",
             "La estructura debe ser:")
    add_code_block(doc, """indicatorUniValle/
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
├── docker-compose.yml
└── .env""")
    
    # SECCIÓN 2.4: CONFIGURAR .ENV
    add_heading(doc, "2.4 Configurar el Archivo .env", level=2)
    
    add_step(doc, 1, "Crear el archivo",
             "Usar el editor de texto de File Station o copiar desde .env.example:")
    add_code_block(doc, "cp .env.example .env")
    
    add_step(doc, 2, "Editar las variables",
             "Abrir .env con el editor de texto y completar:")
    
    add_code_block(doc, """SECRET_KEY=clave-segura-generada-con-openssl
DATABASE_URL=mysql+pymysql://appuser:apppassword@db:3306/indicador_univalle
FRONTEND_URL=http://[IP_DEL_NAS]

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-correo@gmail.com
EMAIL_PASSWORD=tu-app-password-de-16-caracteres

MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=indicador_univalle
MYSQL_USER=appuser
MYSQL_PASSWORD=apppassword""")
    
    add_note(doc, "Para el despliegue en NAS, usar la IP local del NAS en FRONTEND_URL (ej: http://192.168.1.100)")
    
    # SECCIÓN 2.5: EJECUTAR
    add_heading(doc, "2.5 Ejecutar Docker Compose en QNAP", level=2)
    
    add_heading(doc, "Opción A: Usando la Interfaz Web (Recomendado)", level=3)
    
    add_step(doc, 1, "Crear nueva aplicación",
             "En Container Station, ir a 'Crear' > 'Aplicación'")
    
    add_step(doc, 2, "Configurar nombre",
             "Nombre: indicator-univalle\nDescripción: Sistema de indicadores estadísticos")
    
    add_step(doc, 3, "Pegar el docker-compose.yml",
             "Copiar el contenido del archivo docker-compose.yml en el editor YAML")
    
    add_step(doc, 4, "Configurar variables de entorno",
             "En la sección 'Environment', agregar las variables del archivo .env")
    
    add_step(doc, 5, "Configurar volúmenes",
             "Para persistencia de datos, mapear:\n- mysql_data → /share/Container/indicatorUniValle/data/mysql")
    
    add_step(doc, 6, "Crear y ejecutar",
             "Hacer clic en 'Crear' y esperar a que descargue las imágenes y construya los contenedores")
    
    add_heading(doc, "Opción B: Usando SSH (Avanzado)", level=3)
    
    add_step(doc, 1, "Habilitar SSH",
             "Panel de control > Red y archivos > Telnet/SSH > Permitir conexión SSH")
    
    add_step(doc, 2, "Conectar por SSH",
             "Desde una terminal en la PC:")
    add_code_block(doc, "ssh admin@[IP_DEL_NAS]")
    
    add_step(doc, 3, "Navegar al proyecto",
             "Ir a la carpeta donde se copió el proyecto:")
    add_code_block(doc, "cd /share/Container/indicatorUniValle")
    
    add_step(doc, 4, "Ejecutar Docker Compose",
             "Nota: En QNAP, docker compose puede estar como 'docker-compose':")
    add_code_block(doc, "docker compose up --build -d\n# o si no funciona:\ndocker-compose up --build -d")
    
    # SECCIÓN 2.6: PUERTOS Y FIREWALL
    add_heading(doc, "2.6 Configurar Puertos y Firewall", level=2)
    
    add_step(doc, 1, "Abrir puertos en el NAS",
             "Panel de control > Seguridad > Firewall\nPermitir:\n- Puerto 80 (HTTP - Frontend)\n- Puerto 8000 (API - Backend)\n- Puerto 3306 (MySQL - opcional, solo red local)")
    
    add_step(doc, 2, "Configurar reenvío de puertos (si se requiere acceso externo)",
             "En el router, redirigir:\n- Puerto 80 externo → Puerto 80 del NAS\n- Puerto 8000 externo → Puerto 8000 del NAS")
    
    # SECCIÓN 2.7: VERIFICAR
    add_heading(doc, "2.7 Verificar el Funcionamiento", level=2)
    
    doc.add_paragraph("Acceder desde un navegador web:")
    add_code_block(doc, """# Desde la red local:
http://[IP_DEL_NAS]
http://[IP_DEL_NAS]:8000/docs

# Desde internet (si configuraste reenvío de puertos):
http://[TU_DOMINIO_O_IP_PUBLICA]
http://[TU_DOMINIO_O_IP_PUBLICA]:8000/docs""")
    
    # SECCIÓN 2.8: COMANDOS ÚTILES QNAP
    add_heading(doc, "2.8 Comandos Útiles para QNAP", level=2)
    
    add_code_block(doc, """# Ver contenedores corriendo
docker compose ps

# Ver logs
docker compose logs -f

# Detener servicios
docker compose down

# Reiniciar
docker compose restart

# Acceder al backend
docker compose exec backend bash

# Acceder a MySQL
docker compose exec db mysql -u root -p

# Actualizar imágenes (pull)
docker compose pull

# Reconstruir después de cambios
docker compose up --build -d""")
    
    # SECCIÓN 2.9: SOLUCIÓN DE PROBLEMAS
    add_heading(doc, "2.9 Solución de Problemas Comunes", level=2)
    
    doc.add_paragraph("Problema: Los contenedores no arrancan", style='List Bullet')
    add_code_block(doc, "Verificar RAM disponible en Container Station > Overview\nVerificar que los puertos 80, 8000, 3306 no estén ocupados")
    
    doc.add_paragraph("Problema: No se puede acceder desde internet", style='List Bullet')
    add_code_block(doc, "Verificar reenvío de puertos en el router\nVerificar firewall del NAS\nVerificar que no haya bloqueo del ISP en puertos 80/8000")
    
    doc.add_paragraph("Problema: Error de permisos", style='List Bullet')
    add_code_block(doc, "En QNAP, los archivos deben pertenecer al usuario 'admin' o 'everyone'\nchmod -R 755 /share/Container/indicatorUniValle")
    
    doc.add_paragraph("Problema: La base de datos no persiste", style='List Bullet')
    add_code_block(doc, "Verificar que el volumen mysql_data esté correctamente mapeado\nAsegurar que la carpeta de destino exista")
    
    # ============================================================
    # ANEXOS
    # ============================================================
    
    doc.add_page_break()
    add_heading(doc, "ANEXO A: Generar SECRET_KEY segura", level=1)
    
    doc.add_paragraph("La SECRET_KEY se usa para firmar tokens JWT y cookies. Debe ser única y segura.")
    add_code_block(doc, "# En WSL (Ubuntu) o terminal del NAS:\nopenssl rand -hex 32")
    doc.add_paragraph("Copiar el resultado de 64 caracteres hexadecimales y pegarlo en el archivo .env")
    
    add_heading(doc, "ANEXO B: Estructura del Proyecto", level=1)
    
    add_code_block(doc, """indicatorUniValle/
├── backend/                 # API REST con FastAPI
│   ├── app/
│   │   ├── main.py         # Punto de entrada
│   │   ├── models/         # Modelos SQLAlchemy
│   │   ├── routers/        # Endpoints de la API
│   │   └── services/       # Lógica de negocio
│   ├── requirements.txt    # Dependencias Python
│   └── Dockerfile          # Imagen del backend
│
├── frontend/               # Aplicación web con React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas principales
│   │   ├── services/       # Llamadas a la API
│   │   └── models/         # Tipos TypeScript
│   ├── nginx.conf          # Configuración de Nginx
│   ├── package.json        # Dependencias Node.js
│   └── Dockerfile          # Imagen del frontend
│
├── docker-compose.yml      # Orquestación de contenedores
├── .env                    # Variables de entorno
└── .env.example            # Plantilla de variables""")
    
    add_heading(doc, "ANEXO C: Variables de Entorno Completas", level=1)
    
    add_code_block(doc, """# Seguridad
SECRET_KEY=clave-secreta-de-64-caracteres-hex

# Base de datos
DATABASE_URL=mysql+pymysql://appuser:apppassword@db:3306/indicador_univalle

# Frontend (para CORS)
FRONTEND_URL=http://localhost

# Correo electrónico (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=indicadores.univalle@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop

# MySQL
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=indicador_univalle
MYSQL_USER=appuser
MYSQL_PASSWORD=apppassword""")
    
    add_heading(doc, "ANEXO D: Contacto y Soporte", level=1)
    
    doc.add_paragraph("Para reportar problemas o solicitar soporte:")
    doc.add_paragraph("Crear un issue en el repositorio del proyecto", style='List Bullet')
    doc.add_paragraph("Contactar al administrador del sistema", style='List Bullet')
    doc.add_paragraph("Escuela de Estadística - Universidad del Valle", style='List Bullet')
    
    # Guardar documento
    output_path = "/home/juan/indicatorUniValle/doc/Manual_De_Despliegue_Indicator_UniValle.docx"
    doc.save(output_path)
    
    print(f"Documento generado exitosamente en: {output_path}")
    print(f"Tamaño: {len(open(output_path, 'rb').read()) / 1024:.1f} KB")

if __name__ == "__main__":
    main()
