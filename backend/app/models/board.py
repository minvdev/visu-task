from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from ..db.database import Base
from ..models.list import List


class Board(Base):
    __tablename__ = "boards"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    image_url = Column(String(255), nullable=True)
    is_inbox = Column(Boolean, nullable=False, default=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="boards")

    lists = relationship("List", back_populates="board",
                         cascade="all, delete-orphan",
                         order_by=[List.position.asc(), List.name.asc()])

    tags = relationship("Tag", back_populates="board",
                        cascade="all, delete-orphan")

    def __str__(self):
        return f'<{self.__class__.__name__}: {self.name}>'
