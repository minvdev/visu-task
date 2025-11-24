from pydantic import BaseModel, Field, ConfigDict
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


class CardMove(BaseModel):
    destination_list_id: int = Field(
        ..., description="The ID of the list to which you want to move the card.")
    destination_list_position: int | None = Field(
        None, ge=1, description="The new position of the list (gather or equal than 1)")


class Card(CardBase):
    is_done: bool
    position: int
    id: int
    list_id: int
    list: ListSubschema

    model_config = ConfigDict(from_attributes=True)
