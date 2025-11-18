from pydantic import BaseModel, Field


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
