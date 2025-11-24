from pydantic import BaseModel, ConfigDict

"""
This file contains all the necessary subschemas to be maintained from a single location.
These subschemas will be imported into the response models to be used inside of the main schemes.
"""


class UserSubschema(BaseModel):
    id: int
    username: str
    email: str

    model_config = ConfigDict(from_attributes=True)


class BoardSubschema(BaseModel):
    id: int
    name: str
    description: str | None

    model_config = ConfigDict(from_attributes=True)


class ListSubschema(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class CardSubschema(BaseModel):
    id: int
    name: str
    text: str | None
    is_done: bool
    position: int

    model_config = ConfigDict(from_attributes=True)
