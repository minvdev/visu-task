from datetime import datetime
from typing import TYPE_CHECKING
from typing import List as TypingList

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base

if TYPE_CHECKING:
    from .list import List
    from .tag import Tag


class Card(Base):
    __tablename__ = "cards"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    name: Mapped[str] = mapped_column(String(100))
    text: Mapped[str | None] = mapped_column(String(255))
    is_done: Mapped[bool] = mapped_column(index=True, default=False)
    position: Mapped[int] = mapped_column(index=True, default=1)
    due_date: Mapped[datetime | None] = mapped_column()

    list_id: Mapped[int] = mapped_column(ForeignKey("lists.id"))

    tags: Mapped[TypingList["Tag"]] = relationship(
        secondary="card_tags", back_populates="cards"
    )
    list: Mapped["List"] = relationship(back_populates="cards")

    def __str__(self) -> str:
        return f"<{self.__class__.__name__}: {self.name}>"
