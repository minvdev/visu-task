from pydantic import BaseModel, Field


class ListBoard(BaseModel):
    id: int
    name: str
    description: str | None

    class Config:
        from_attributes = True


class Card(BaseModel):
    id: int
    name: str
    text: str | None
    is_done: bool

    class Config:
        from_attributes = True


class ListBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class ListCreate(ListBase):
    pass


class ListUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)


class List(ListBase):
    id: int
    board_id: int
    board: ListBoard
    cards: list[Card] = []

    class Config:
        from_attributes = True
