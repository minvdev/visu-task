from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from ..db.database import Base


class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)
    text = Column(String(255), nullable=True)
    is_done = Column(Boolean, nullable=False, index=True, default=False)

    list_id = Column(Integer, ForeignKey("lists.id"), nullable=False)
    list = relationship("List", back_populates="cards")
