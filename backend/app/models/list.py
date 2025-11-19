from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship

from ..db.database import Base


class List(Base):
    __tablename__ = "lists"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)

    board_id = Column(Integer, ForeignKey("boards.id"), nullable=False)
    board = relationship("Board", back_populates="lists")

    cards = relationship("Card", back_populates="list",
                         cascade="all, delete-orphan")

    def __str__(self):
        return f'<{self.__class__.__name__}: {self.name}>'
