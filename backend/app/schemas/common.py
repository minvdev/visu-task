from pydantic import BaseModel

"""
This file contains all the necessary subschemas to be maintained from a single location.
These subschemas will be imported into the response models to be used inside of the main schemes.
"""


class UserSubschema(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True


class BoardSubschema(BaseModel):
    id: int
    name: str
    description: str | None

    class Config:
        from_attributes = True


class ListSubschema(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class CardSubschema(BaseModel):
    id: int
    name: str
    text: str | None
    is_done: bool
    position: int

    class Config:
        from_attributes = True
