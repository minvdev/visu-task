from typing import TYPE_CHECKING

from sqlalchemy import Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..db.database import Base

if TYPE_CHECKING:
    from app.models import Board, Card


card_tags = Table(
    "card_tags",
    Base.metadata,
    Column(
        "card_id", Integer, ForeignKey("cards.id", ondelete="CASCADE"), primary_key=True
    ),
    Column(
        "tag_id", Integer, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True
    ),
)


class Tag(Base):
    __tablename__ = "tags"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str | None] = mapped_column(String(50))
    color: Mapped[str] = mapped_column(String(7))

    board_id: Mapped[int] = mapped_column(ForeignKey("boards.id"))
    board: Mapped["Board"] = relationship(back_populates="tags")

    cards: Mapped[list["Card"]] = relationship(
        secondary=card_tags, back_populates="tags"
    )

    def __str__(self) -> str:
        return f"<{self.__class__.__name__}: {self.name if self.name else self.color}>"
