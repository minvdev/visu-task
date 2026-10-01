import httpx
from cachetools import TTLCache
from fastapi import HTTPException, status
from pydantic import BaseModel, ValidationError
from typing import TypeVar

from app.core.config import settings
from app.utils.async_cache import cached
from app.schemas import Photo, PaginatedPhotos


COLLECTION_ID = 317099
TTL = 3600  # 1 hour
T = TypeVar("T", bound=BaseModel)

_client: httpx.AsyncClient | None = None


def _get_client() -> httpx.AsyncClient:
    global _client
    if _client is None or _client.is_closed:
        _client = httpx.AsyncClient(
            base_url=settings.UNSPLASH_API_URL,
            headers={
                "Accept-Version": "v1",
                "Authorization": f"Client-ID {settings.UNSPLASH_API_KEY}"
            },
            timeout=10.0
        )
    return _client


collection_cache = TTLCache(maxsize=100, ttl=TTL)
search_cache = TTLCache(maxsize=100, ttl=TTL)


def _validate(model: T, data) -> T:
    try:
        return model.model_validate(data)
    except ValidationError:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unsplash API request failed"
        )


async def _get(path: str, params: dict) -> dict | list:
    try:
        response = await _get_client().get(path, params=params)
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unsplash API request failed"
        ) from exc
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Could not reach Unsplash API"
        ) from exc


@cached(cache=collection_cache)
async def get_photos(page: int, per_page: int) -> list[Photo]:
    raw_photos = await _get(
        f"/collections/{COLLECTION_ID}/photos",
        params={"page": page, "per_page": per_page, "order_by": "latest"}
    )
    return [_validate(Photo, raw) for raw in raw_photos]


@cached(cache=search_cache)
async def search_photos(query: str, page: int, per_page: int) -> PaginatedPhotos:
    raw_photos = await _get(
        f"/search/photos",
        params={"query": query, "page": page,
                "per_page": per_page, "content_filter": "high"}
    )
    return _validate(PaginatedPhotos, raw_photos)


# Lifespan function
async def close_client() -> None:
    if _client is not None and not _client.is_closed:
        await _client.aclose()
