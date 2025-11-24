from pydantic import BaseModel, Field, ConfigDict
from .common import BoardSubschema, CardSubschema


class ListBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class ListCreate(ListBase):
    pass


class ListUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)


class List(ListBase):
    id: int
    board_id: int
    board: BoardSubschema
    cards: list[CardSubschema] = []

    model_config = ConfigDict(from_attributes=True)
