from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from ..security import CurrentUserDep
from ..models import User, Card, List, Board
from ..db.database import get_db
from .. import schemas

router = APIRouter(
    prefix="/cards",
    tags=["Cards"]
)


@router.post("/{card_id}/move", response_model=schemas.Card)
def move_card(
    card_id: int,
    move_data: schemas.CardMove,
    db: Session = Depends(get_db),
    current_user: User = CurrentUserDep
):
    """
    Move a card to a different list (within the same board or to another).
    Verify that the current user owns both the source and destination lists.
    """
    card = db.query(Card).options(
        joinedload(Card.list)
        .joinedload(List.board)
        .joinedload(Board.user)
    ).filter(Card.id == card_id).first()

    # Check card and list
    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Card not found"
        )

    card_owner: User = card.list.board.user

    if card_owner.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot move this card."
        )

    destination_list = db.query(List).options(
        joinedload(List.board)
        .joinedload(Board.user)
    ).filter(List.id == move_data.destination_list_id).first()

    if not destination_list:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="List not found"
        )

    destination_list_owner = destination_list.board.user

    if destination_list_owner.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot move the card to the destination list."
        )

    # Move the card
    card.list_id = destination_list.id

    db.add(card)
    db.commit()
    db.refresh(card)

    return card
