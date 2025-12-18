from pydantic import BaseModel, Field, ConfigDict
from .common import UserSubschema, ListSubschema, TagSubschema


class BoardBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str | None = Field(None, max_length=255)
    image_url: str | None = Field(None, max_length=255)


class BoardCreate(BoardBase):
    pass


class BoardUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    description: str | None = Field(None, max_length=255)
    image_url: str | None = Field(None, max_length=255)


class Board(BoardBase):
    id: int
    user_id: int
    user: UserSubschema
    tags: list[TagSubschema] = []
    lists: list[ListSubschema] = []

    model_config = ConfigDict(from_attributes=True)
