from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base

from .card import Card

if TYPE_CHECKING:
    from .board import Board


class List(Base):
    __tablename__ = "lists"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    position: Mapped[int] = mapped_column(index=True, default=1)

    board_id: Mapped[int] = mapped_column(ForeignKey("boards.id"))
    board: Mapped["Board"] = relationship(back_populates="lists")

    cards: Mapped[list["Card"]] = relationship(
        back_populates="list",
        cascade="all, delete-orphan",
        order_by=[Card.position.asc(), Card.name.asc()],
    )

    def __str__(self) -> str:
        return f"<{self.__class__.__name__}: {self.name}>"
