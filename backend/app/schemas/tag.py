from pydantic import BaseModel, Field, field_validator, ConfigDict

from .common import BoardSubschema, CardSubschema


class TagBase(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=50)
    color: str = Field(..., min_length=4, max_length=7,
                       description="Hex color code (e.g. #FF0000)")

    @field_validator('color')
    @classmethod
    def validate_hex_color(cls, v):
        if not v.startswith("#"):
            raise ValueError("Color must start with '#'")
        return v


class TagCreate(TagBase):
    pass


class TagUpdate(TagBase):
    name: str | None = Field(None, min_length=1, max_length=50)
    color: str | None = Field(None, min_length=4, max_length=7)


class Tag(TagBase):
    id: int
    board_id: int
    board: BoardSubschema
    cards: list[CardSubschema] = []

    model_config = ConfigDict(from_attributes=True)
