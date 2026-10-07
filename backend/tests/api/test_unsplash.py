from app.routers import unsplash as unsplash_router
from app.schemas import Photo, PaginatedPhotos, Urls, Links


def make_photo() -> Photo:
    return Photo(
        id="abc123",
        blur_hash="abc123bca321",
        urls=Urls(
            raw="https://images.unsplash.com/raw",
            full="https://images.unsplash.com/full",
            regular="https://images.unsplash.com/regular",
            small="https://images.unsplash.com/small",
            thumb="https://images.unsplash.com/thumb",
        ),
        links=Links(
            html="https://unsplash.com/photos/abc123",
            download="https://unsplash.com/photos/abc123/download",
            self="https://api.unsplash.com/photos/abc123",
            download_location="https://api.unsplash.com/photos/abc123/download",
        ),
        description="A photo",
        width=100,
        height=100,
        color="#0c408c",
    )


# --- Authentication ---

def test_get_photos_requires_authentication(client):
    response = client.get("/unsplash/photos")  # without auth headers
    assert response.status_code == 401


def test_search_photos_requires_authentication(client):
    response = client.get("/unsplash/photos/search", params={"query": "sea"})
    assert response.status_code == 401


# --- Parameter fowarding to the service ---


def test_get_photos_forwards_params_to_service(client, auth_headers, monkeypatch):
    received = {}

    async def fake_get_photos(page: int, per_page: int):
        received["page"] = page
        received["per_page"] = per_page
        return []

    monkeypatch.setattr(unsplash_router.unsplash_service,
                        "get_photos", fake_get_photos)

    response = client.get(
        "/unsplash/photos",
        params={"page": 3, "per_page": 10},
        headers=auth_headers
    )

    assert response.status_code == 200
    assert received == {"page": 3, "per_page": 10}


def test_search_photos_forwards_params_to_service(client, auth_headers, monkeypatch):
    received = {}

    async def fake_search_photos(query: str, page: int, per_page: int):
        received["query"] = query
        received["page"] = page
        received["per_page"] = per_page
        return PaginatedPhotos(total=0, total_pages=0, results=[])

    monkeypatch.setattr(unsplash_router.unsplash_service,
                        "search_photos", fake_search_photos)

    response = client.get(
        "/unsplash/photos/search",
        params={"query": "sea"},
        headers=auth_headers
    )

    assert response.status_code == 200
    assert received == {"query": "sea", "page": 1, "per_page": 30}


def test_search_photos_requires_query_param(client, auth_headers):
    response = client.get("/unsplash/photos/search", headers=auth_headers)
    assert response.status_code == 422


# --- Response serialization ---

def test_get_photos_returns_serialized_photos(client, auth_headers, monkeypatch):
    async def fake_get_photos(*_, **__):
        return [make_photo()]

    monkeypatch.setattr(unsplash_router.unsplash_service,
                        "get_photos", fake_get_photos)

    response = client.get("/unsplash/photos", headers=auth_headers)

    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["id"] == "abc123"


def test_search_photos_returns_serialized_paginated_photos(client, auth_headers, monkeypatch):
    async def fake_search_photos(*_, **__):
        return PaginatedPhotos(total=1, total_pages=1, results=[make_photo()])

    monkeypatch.setattr(unsplash_router.unsplash_service,
                        "search_photos", fake_search_photos)

    response = client.get("/unsplash/photos/search",
                          params={"query": "sea"}, headers=auth_headers)

    assert response.status_code == 200
    body = response.json()
    assert (body["total"], body["total_pages"]) == (1, 1)
    assert len(body["results"]) == 1
    assert body["results"][0]["id"] == "abc123"


# --- Error propagation ---

def test_get_photos_propagates_service_error(client, auth_headers, monkeypatch):
    from fastapi import HTTPException, status

    async def fake_get_photos(*_, **__):
        raise HTTPException(status.HTTP_502_BAD_GATEWAY,
                            detail="Unsplash API request failed")

    monkeypatch.setattr(unsplash_router.unsplash_service,
                        "get_photos", fake_get_photos)

    response = client.get("/unsplash/photos", headers=auth_headers)

    assert response.status_code == 502
    assert response.json()["detail"] == "Unsplash API request failed"


def test_search_photos_propagates_service_error(client, auth_headers, monkeypatch):
    from fastapi import HTTPException, status

    async def fake_search_photos(*_, **__):
        raise HTTPException(status.HTTP_502_BAD_GATEWAY,
                            detail="Unsplash API request failed")

    monkeypatch.setattr(unsplash_router.unsplash_service,
                        "search_photos", fake_search_photos)

    response = client.get("/unsplash/photos/search",
                          params={"query": "sea"}, headers=auth_headers)

    assert response.status_code == 502
    assert response.json()["detail"] == "Unsplash API request failed"
