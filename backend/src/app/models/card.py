from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from ..db.database import Base


class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)
    text = Column(String(255), nullable=True)
    is_done = Column(Boolean, nullable=False, index=True, default=False)
    position = Column(Integer, nullable=False, index=True, default=1)
    due_date = Column(DateTime, nullable=True)

    list_id = Column(Integer, ForeignKey("lists.id"), nullable=False)
    list = relationship("List", back_populates="cards")

    tags = relationship("Tag", secondary="card_tags", back_populates="cards")

    def __str__(self):
        return f'<{self.__class__.__name__}: {self.name}>'
