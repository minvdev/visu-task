from fastapi import APIRouter

from app import schemas
from app.services import unsplash as unsplash_service
from app.security import CurrentUserDep

router = APIRouter(
    prefix="/unsplash",
    tags=["Unsplash"]
)


@router.get("/photos", response_model=list[schemas.Photo], responses={
    502: {"model": schemas.HTTPError, "description": "Unsplash API request failed"}
})
async def get_photos(page: int = 1, per_page: int = 30, _=CurrentUserDep):
    return await unsplash_service.get_photos(page, per_page)


@router.get("/photos/search", response_model=schemas.PaginatedPhotos, responses={
    502: {"model": schemas.HTTPError, "description": "Unsplash API request failed"}
})
async def search_photos(query: str, page: int = 1, per_page: int = 30, _=CurrentUserDep):
    return await unsplash_service.search_photos(query, page, per_page)
