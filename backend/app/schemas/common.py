from __future__ import annotations
from typing import Optional, Literal
from typing_extensions import deprecated
from pydantic import BaseModel, ConfigDict, computed_field
from datetime import datetime

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
    background_type: Optional[Literal["image", "gradient", "solid"]]
    background_value: str | None
    background_blur_hash: str | None

    @computed_field
    @property
    @deprecated("'image_url' is deprecated")
    def image_url(self) -> str | None:
        return self.background_value

    model_config = ConfigDict(from_attributes=True)


class ListSubschema(BaseModel):
    id: int
    name: str
    position: int
    board_id: int

    model_config = ConfigDict(from_attributes=True)


class CardSubschema(BaseModel):
    id: int
    name: str
    text: str | None
    is_done: bool
    position: int
    due_date: datetime | None
    tags: list[TagSubschema]

    model_config = ConfigDict(from_attributes=True)


class InboxList(BaseModel):
    id: int
    name: str
    cards: list[CardSubschema] = []

    model_config = ConfigDict(from_attributes=True)


class TagSubschema(BaseModel):
    id: int
    name: str | None
    color: str

    model_config = ConfigDict(from_attributes=True)
