from pydantic import BaseModel


class Urls(BaseModel):
    raw: str
    full: str
    regular: str
    small: str
    thumb: str


class Links(BaseModel):
    html: str
    download: str
    self: str
    download_location: str


class Photo(BaseModel):
    id: str
    blur_hash: str | None
    urls: Urls
    links: Links
    description: str | None
    width: int
    height: int
    color: str | None


class PaginatedPhotos(BaseModel):
    total: int
    total_pages: int
    results: list[Photo]
