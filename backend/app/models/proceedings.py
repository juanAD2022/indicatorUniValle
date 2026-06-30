from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class Proceeding(Base):
    __tablename__ = "proceedings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    file_path = Column(String(500), nullable=False)
    original_name = Column(String(255), nullable=False)
    document_type = Column(String(50), nullable=False)
    document_category = Column(String(50), nullable=False)
    upload_date = Column(DateTime, server_default=func.now())
    version = Column(String(10), nullable=False)
    format = Column(String(10), nullable=False)
    observation = Column(Text, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    category = relationship("Category", backref="proceedings")
    user = relationship("User", backref="proceedings")
