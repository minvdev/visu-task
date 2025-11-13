from pydantic import BaseModel, EmailStr, Field
from .board import BoardBase


class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=64)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=256)


class User(BaseModel):
    id: int
    username: str
    email: EmailStr
    boards: list[BoardBase] = []

    class Config:
        from_attributes = True
