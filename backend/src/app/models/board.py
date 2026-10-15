from typing import TYPE_CHECKING, Literal

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..db.database import Base
from ..models.list import List

if TYPE_CHECKING:
    from .tag import Tag
    from .user import User

BackgroundType = Literal["image", "gradient", "solid"]


class Board(Base):
    __tablename__ = "boards"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    description: Mapped[str | None] = mapped_column(String(255))

    image_url: Mapped[str | None] = mapped_column(String(255))  # deprecated
    background_type: Mapped[BackgroundType | None] = mapped_column()
    background_value: Mapped[str | None] = mapped_column(String(511))
    background_blur_hash: Mapped[str | None] = mapped_column(String(511))

    is_inbox: Mapped[bool] = mapped_column(default=False)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship(back_populates="boards")

    lists: Mapped[list["List"]] = relationship(
        back_populates="board",
        cascade="all, delete-orphan",
        order_by=[List.position.asc(), List.name.asc()],
    )

    tags: Mapped[list["Tag"]] = relationship(
        back_populates="board", cascade="all, delete-orphan"
    )

    def __str__(self) -> str:
        return f"<{self.__class__.__name__}: {self.name}>"
