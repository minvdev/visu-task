from fastapi import APIRouter

from ..security import CurrentUserDep
from ..models import User
from .. import schemas

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/me", response_model=schemas.User)
def get_current_user(
    current_user: User = CurrentUserDep
):
    return current_user
