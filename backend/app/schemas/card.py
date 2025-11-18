from pydantic import BaseModel, Field
from .common import ListSubschema


class CardBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    text: str | None = Field(None, max_length=255)


class CardCreate(CardBase):
    pass


class CardUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    text: str | None = Field(None, max_length=255)
    is_done: bool | None = None


class Card(CardBase):
    is_done: bool
    id: int
    list_id: int
    list: ListSubschema

    class Config:
        from_attributes = True
