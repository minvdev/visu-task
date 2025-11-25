from pydantic import BaseModel, Field, ConfigDict

from .common import BoardSubschema, CardSubschema


class TagBase(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=50)
    color: str = Field(..., min_length=7, max_length=7)


class TagCreate(TagBase):
    pass


class TagUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=50)
    color: str | None = Field(None, min_length=7, max_length=7)


class Tag(TagBase):
    id: int
    board_id: int
    board: BoardSubschema
    cards: list[CardSubschema] = []

    model_config = ConfigDict(from_attributes=True)
