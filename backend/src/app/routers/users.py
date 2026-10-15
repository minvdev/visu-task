from fastapi import APIRouter

from .. import schemas
from ..models import User
from ..security import CurrentUserDep

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=schemas.User)
def get_current_user(current_user: User = CurrentUserDep):
    return current_user
