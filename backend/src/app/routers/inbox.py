from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas
from app.db import get_db
from app.models import Board, User
from app.security import CurrentUserDep

router = APIRouter(prefix="/inbox", tags=["Inbox"])


@router.get(
    "", response_model=schemas.Inbox, responses={404: {"model": schemas.HTTPError}}
)
def get_inbox(db: Session = Depends(get_db), current_user: User = CurrentUserDep):
    inbox = (
        db.query(Board).filter(Board.user_id == current_user.id, Board.is_inbox).first()
    )

    if not inbox:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inbox not found for the current user.",
        )

    return inbox
