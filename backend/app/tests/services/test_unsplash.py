import pytest
import respx
import httpx
import fastapi

from app.services import unsplash as unsplash_service
from app.core.config import settings
from app.schemas import Photo, PaginatedPhotos


PHOTOS_URL = f"{settings.UNSPLASH_API_URL}/collections/{unsplash_service.COLLECTION_ID}/photos"
SEARCH_URL = f"{settings.UNSPLASH_API_URL}/search/photos"

PHOTO_FIELDS = {
    "id",
    "blur_hash",
    "urls",
    "links",
    "description",
    "width",
    "height",
    "color",
}
URLS_FIELDS = {
    "raw",
    "full",
    "regular",
    "small",
    "thumb",
}
LINKS_FIELDS = {
    "html",
    "download",
    "self",
    "download_location",
}


def raw_photo() -> dict:
    return {
        "id": "abc123",
        "created_at": "2026-09-28T16:27:33.084Z",
        "width": 9010,
        "height": 5631,
        "color": "#0c408c",
        "blur_hash": "LU3J73bxkDjrXYkEflfjahayaya1",
        "description": "Kuala Lumpur during blue hour",
        "urls": {
            "raw": "https://images.unsplash.com/raw",
            "full": "https://images.unsplash.com/full",
            "regular": "https://images.unsplash.com/regular",
            "small": "https://images.unsplash.com/small",
            "thumb": "https://images.unsplash.com/thumb",
            "small_s3": "https://s3.amazonaws.com/small",
        },
        "links": {
            "self": "https://api.unsplash.com/photos/abc123",
            "html": "https://unsplash.com/photos/abc123",
            "download": "https://unsplash.com/photos/abc123/download",
            "download_location": "https://api.unsplash.com/photos/abc123/download",
        },
        "user": {"id": "JL0rTDa0lBM", "username": "yolobear", "bio": "..."},
        "more_stuff": "..."
    }


def raw_search_response() -> dict:
    return {"total": 1, "total_pages": 1, "results": [raw_photo()]}


def call_get_photos():
    return unsplash_service.get_photos(page=1, per_page=30)


def call_search_photos():
    return unsplash_service.search_photos(query="mountains", page=1, per_page=30)


@pytest.fixture(autouse=True)
def clear_caches():
    """Avoid cross-test contamination: caches are module singletons."""
    unsplash_service.collection_cache.clear()
    unsplash_service.search_cache.clear()
    yield
    unsplash_service.collection_cache.clear()
    unsplash_service.search_cache.clear()


# --- Success: request params and returned data ---

@pytest.mark.asyncio
@respx.mock
async def test_get_photos_success():
    route = respx.get(PHOTOS_URL).mock(
        return_value=httpx.Response(200, json=[raw_photo()])
    )

    result = await call_get_photos()

    assert route.called
    assert [photo.id for photo in result] == ["abc123"]

    sent_request = route.calls.last.request
    assert sent_request.url.params["page"] == "1"
    assert sent_request.url.params["per_page"] == "30"
    assert sent_request.url.params["order_by"] == "latest"


@pytest.mark.asyncio
@respx.mock
async def test_search_photos_success():
    route = respx.get(SEARCH_URL).mock(
        return_value=httpx.Response(200, json=raw_search_response())
    )

    result = await call_search_photos()

    assert route.called
    assert [photo.id for photo in result.results] == ["abc123"]

    sent_request = route.calls.last.request
    assert sent_request.url.params["query"] == "mountains"
    assert sent_request.url.params["page"] == "1"
    assert sent_request.url.params["per_page"] == "30"
    assert sent_request.url.params["content_filter"] == "high"


# --- Upstream errors ---

@pytest.mark.asyncio
@respx.mock
async def test_get_photos_raise_http_error():
    respx.get(PHOTOS_URL).mock(return_value=httpx.Response(500))

    with pytest.raises(fastapi.HTTPException):
        await call_get_photos()


@pytest.mark.asyncio
@respx.mock
async def test_search_photos_raise_http_error():
    respx.get(SEARCH_URL).mock(return_value=httpx.Response(500))

    with pytest.raises(fastapi.HTTPException):
        await call_search_photos()


# --- Cache hits ---

@pytest.mark.asyncio
@respx.mock
async def test_get_photos_uses_cache_on_second_call():
    route = respx.get(PHOTOS_URL).mock(
        return_value=httpx.Response(200, json=[raw_photo()])
    )

    result_1 = await call_get_photos()
    result_2 = await call_get_photos()

    assert result_1 == result_2
    assert route.call_count == 1


@pytest.mark.asyncio
@respx.mock
async def test_search_photos_uses_cache_on_second_call():
    route = respx.get(SEARCH_URL).mock(
        return_value=httpx.Response(200, json=raw_search_response())
    )

    result_1 = await call_search_photos()
    result_2 = await call_search_photos()

    assert result_1 == result_2
    assert route.call_count == 1


# --- Response filtering with the pydantic schemas ---

@pytest.mark.asyncio
@respx.mock
async def test_get_photos_returns_filtered_models():
    respx.get(PHOTOS_URL).mock(
        return_value=httpx.Response(200, json=[raw_photo()])
    )

    result = await call_get_photos()

    assert len(result) == 1
    assert isinstance(result[0], Photo)
    dumped = result[0].model_dump()
    assert set(dumped) == PHOTO_FIELDS
    assert set(dumped["urls"]) == URLS_FIELDS
    assert set(dumped["links"]) == LINKS_FIELDS


@pytest.mark.asyncio
@respx.mock
async def test_search_photos_returns_filtered_models():
    respx.get(SEARCH_URL).mock(
        return_value=httpx.Response(200, json=raw_search_response())
    )

    result = await call_search_photos()

    assert isinstance(result, PaginatedPhotos)
    assert (result.total, result.total_pages) == (1, 1)
    assert len(result.results) == 1
    dumped = result.results[0].model_dump()
    assert set(dumped) == PHOTO_FIELDS
    assert set(dumped["urls"]) == URLS_FIELDS
    assert set(dumped["links"]) == LINKS_FIELDS


@pytest.mark.parametrize(
    "call,url,payload,cache",
    [
        pytest.param(
            call_get_photos,
            PHOTOS_URL,
            [raw_photo()],
            unsplash_service.collection_cache,
            id="get_photos"
        ),
        pytest.param(
            call_search_photos,
            SEARCH_URL,
            raw_search_response(),
            unsplash_service.search_cache,
            id="search_photos"
        ),
    ]
)
@pytest.mark.asyncio
@respx.mock
async def test_cache_stores_filtered_result(call, url, payload, cache):
    respx.get(url).mock(return_value=httpx.Response(200, json=payload))

    result = await call()

    assert len(cache) == 1
    assert next(iter(cache.values())) == result
    # `next(iter(cache.values()))` obtiene el valor del primer "lugar" del caché


# --- Unexpected upstream payloads ---

@pytest.mark.parametrize(
    "call,url,payload,cache",
    [
        pytest.param(
            call_get_photos,
            PHOTOS_URL,
            [{"id": "abc123"}],
            unsplash_service.collection_cache,
            id="get_photos-missing-fields"
        ),
        pytest.param(
            call_get_photos,
            PHOTOS_URL,
            [{"total": 1}],
            unsplash_service.collection_cache,
            id="get_photos-wrong-top-level"
        ),
        pytest.param(
            call_search_photos,
            SEARCH_URL,
            {"total": 1, "total_pages": 1, "results": [{"id": "abc123"}]},
            unsplash_service.search_cache,
            id="search_photos-missing-fields"
        ),
        pytest.param(
            call_search_photos,
            SEARCH_URL,
            [raw_photo()],
            unsplash_service.search_cache,
            id="search_photos-wrong-top-level"
        ),
    ]
)
@pytest.mark.asyncio
@respx.mock
async def test_invalid_upstream_payload_returs_502_and_is_not_cached(call, url, payload, cache):
    respx.get(url).mock(return_value=httpx.Response(200, json=payload))

    with pytest.raises(fastapi.HTTPException) as exc_info:
        await call()

    assert exc_info.value.status_code == 502
    assert len(cache) == 0
