from fastapi import APIRouter

from app import schemas
from app.models import User
from app.security import CurrentUserDep

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=schemas.User)
def get_current_user(current_user: User = CurrentUserDep):
    return current_user
