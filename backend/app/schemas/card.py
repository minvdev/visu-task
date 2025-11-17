from pydantic import BaseModel, Field


class CardBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    text: str | None = Field(None, max_length=255)


class CardCreate(CardBase):
    pass


class CardUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    text: str | None = Field(None, max_length=255)
    is_done: bool | None = None


class List(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class Card(CardBase):
    is_done: bool
    id: int
    list_id: int
    list: List

    class Config:
        from_attributes = True
