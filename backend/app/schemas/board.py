from pydantic import BaseModel, Field, ConfigDict
from .common import UserSubschema, ListSubschema, TagSubschema, InboxList
from .tag import HexColor


class BoardBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str | None = Field(None, max_length=255)
    image_url: str | None = Field(None, max_length=255)


class BoardCreate(BoardBase):
    default_tag_colors: list[HexColor] = []


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


class Inbox(BoardBase):
    id: int
    user_id: int
    user: UserSubschema
    tags: list[TagSubschema] = []
    lists: list[InboxList] = []

    model_config = ConfigDict(from_attributes=True)
