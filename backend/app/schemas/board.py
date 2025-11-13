from pydantic import BaseModel, Field


class BoardUser(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True


class BoardBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str | None = Field(None, max_length=255)


class BoardCreate(BoardBase):
    pass


class BoardUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    description: str | None = Field(None, max_length=255)


class Board(BoardBase):
    id: int
    user_id: int
    user: BoardUser

    class Config:
        from_attributes = True
