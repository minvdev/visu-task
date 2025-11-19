from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from ..db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(64), unique=True, index=True, nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    password_hash = Column(String(256), nullable=False)

    boards = relationship("Board", back_populates="user",
                          cascade="all, delete-orphan")

    def __str__(self):
        return f'<{self.__class__.__name__}: {self.username}>'
