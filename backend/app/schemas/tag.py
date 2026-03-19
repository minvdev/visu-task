from pydantic import BaseModel, Field, ConfigDict
from typing import Annotated

from .common import BoardSubschema, CardSubschema


HexColor = Annotated[
    str,
    Field(
        pattern=r'^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$',
        description="Hex color code (e.g. #FF0000)"
    )
]


class TagBase(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=50)
    color: str = HexColor


class TagCreate(TagBase):
    pass


class TagUpdate(TagBase):
    name: str | None = Field(None, min_length=1, max_length=50)
    color: str | None = Field(None, min_length=4, max_length=7)


class Tag(TagBase):
    id: int
    board_id: int
    board: BoardSubschema
    cards: list[CardSubschema] = []

    model_config = ConfigDict(from_attributes=True)
