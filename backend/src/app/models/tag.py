from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship

from ..db.database import Base

card_tags = Table(
    'card_tags',
    Base.metadata,
    Column('card_id', Integer, ForeignKey(
        "cards.id", ondelete="CASCADE"), primary_key=True),
    Column('tag_id', Integer, ForeignKey(
        "tags.id", ondelete="CASCADE"), primary_key=True)
)


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=True)
    color = Column(String(7), nullable=False)

    board_id = Column(Integer, ForeignKey("boards.id"), nullable=False)
    board = relationship("Board", back_populates="tags")

    cards = relationship("Card", secondary=card_tags, back_populates="tags")

    def __str__(self):
        return f'<{self.__class__}: {self.name if self.name else self.color}>'
