from pydantic_settings import BaseSettings
from pydantic import ConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"
    DEFAULT_TAGS_COLORS: list[str] = [
        "#d62828",
        "#f77f00",
        "#fcbf49",
        "#00b4d8",
        "#a7c957"
    ]

    model_config = ConfigDict(
        env_file="backend/.env",
        env_file_encoding="utf-8"
    )


settings = Settings()
