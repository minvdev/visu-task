from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..db.database import get_db
from ..security import CurrentUserDep
from ..models import User, Board
from .. import schemas

router = APIRouter(
    prefix="/inbox",
    tags=["Inbox"]
)


@router.get("/", response_model=schemas.Inbox)
def get_inbox(
    db: Session = Depends(get_db),
    current_user: User = CurrentUserDep
):
    inbox = db.query(Board).filter(
        Board.user_id == current_user.id,
        Board.is_inbox == True
    ).first()

    if not inbox:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inbox not found for the current user."
        )

    return inbox
