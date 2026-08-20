from pydantic import BaseModel, Field, ConfigDict, computed_field, model_validator
from typing import Optional, Literal, Any
from typing_extensions import deprecated
from .common import UserSubschema, ListSubschema, TagSubschema, InboxList
from .tag import HexColor


class BoardBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str | None = Field(None, max_length=255)
    background_type: Optional[Literal[
        "image", "gradient", "solid"]] = None
    background_value: Optional[str] = Field(None, max_length=511)
    background_blur_hash: Optional[str] = Field(None, max_length=511)

    @computed_field
    @property
    @deprecated("'image_url' is deprecated")
    def image_url(self) -> str | None:
        return self.background_value

    # Deprecated assignment of 'image_url' property
    @model_validator(mode="before")
    @classmethod
    def map_legacy_image_url(cls, data: Any) -> Any:
        if isinstance(data, dict) and data.get("image_url") is not None:
            data = dict(data)  # ensures immutability
            image_url = data.pop("image_url")
            data.setdefault("background_type", "image")
            data.setdefault("background_value", image_url)
        return data

    @model_validator(mode="after")
    def validate_background(self) -> "BoardBase":
        # background_type & background_value
        if bool(self.background_value) != bool(self.background_type):
            raise ValueError(
                "'background_type' and 'background_value' must be provided together")

        # background_blur_hash
        if (self.background_blur_hash and self.background_type != "image"):
            raise ValueError(
                "'background_blur_hash' cannot have a value when the background is not an image")
        return self


class BoardCreate(BoardBase):
    default_tag_colors: list[HexColor] = []


class BoardUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    description: str | None = Field(None, max_length=255)
    background_type: Optional[Literal[
        "image", "gradient", "solid"]] = None
    background_value: Optional[str] = Field(None, max_length=511)
    background_blur_hash: Optional[str] = Field(None, max_length=511)
    image_url: Optional[str] = Field(
        None, max_length=255, deprecated="User 'background_type' and 'background_ value' instead.")

    @model_validator(mode="before")
    @classmethod
    def map_legacy_image_url(cls, data: Any) -> Any:
        if isinstance(data, dict) and data.get("image_url") is not None:
            data = dict(data)
            image_url = data.pop("image_url")
            data.setdefault("background_type", "image")
            data.setdefault("background_value", image_url)
        return data

    @model_validator(mode="after")
    def validate_background(self) -> "BoardUpdate":
        fields_set = self.model_fields_set
        # fieldset is only the fields that was intentionally specified by the user

        # background_type & background_value
        if "background_type" in fields_set or "background_value" in fields_set:
            if bool(self.background_value) != bool(self.background_type):
                raise ValueError(
                    "'background_type' and 'background_value' must be provided together")

        # background_blur_hash
        if "background_blur_hash" in fields_set and self.background_blur_hash:
            if "background_type" in fields_set and self.background_type != "image":
                raise ValueError(
                    "'background_blur_hash' cannot have a value when the background is not an image")

        return self


class Board(BoardBase):
    id: int
    user_id: int
    user: UserSubschema
    tags: list[TagSubschema] = []
    lists: list[ListSubschema] = []

    model_config = ConfigDict(from_attributes=True)


class Inbox(BoardBase):
    id: int
    user_id: int
    user: UserSubschema
    tags: list[TagSubschema] = []
    lists: list[InboxList] = []

    model_config = ConfigDict(from_attributes=True)
