from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.config  # noqa: F401 - carga .env al inicio
from app.database.database import engine, Base
from app.routers import auth, student_indicator, import_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Indicator UniValle API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(student_indicator.router)
app.include_router(import_router.router)


@app.get("/")
async def root():
    return {"message": "Indicator UniValle API"}
