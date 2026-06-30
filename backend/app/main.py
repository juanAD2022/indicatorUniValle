from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.config  # noqa: F401 - carga .env al inicio
from app.database.database import engine, Base, SessionLocal
from app.routers import auth, student_indicator, import_router, category, proceedings
from app.models.category import Category

Base.metadata.create_all(bind=engine)


def seed_categories():
    db = SessionLocal()
    try:
        for name, base_path in [("pregrado", "doc/pregrado"), ("posgrado", "doc/posgrado")]:
            exists = db.query(Category).filter(Category.name == name).first()
            if not exists:
                db.add(Category(name=name, base_path=base_path))
        db.commit()
    finally:
        db.close()


seed_categories()

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
app.include_router(category.router)
app.include_router(proceedings.router)


@app.get("/")
async def root():
    return {"message": "Indicator UniValle API"}
