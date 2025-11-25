from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import update, and_, func
from sqlalchemy.orm import Session, joinedload

from ..security import CurrentUserDep
from ..models import User, Card, List, Board, Tag
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
    Move a card between lists (or the same list, within the same board or to another).
    Also change the position of the card with (place the card at the bottom of the list if not specified).
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

    # === Move the card & Fix position ===
    origin_list_id = card.list_id
    dest_list_id = destination_list.id
    actual_card_position = card.position
    new_card_position = move_data.destination_list_position

    dest_list_count = db.query(func.count(Card.id)).filter(
        Card.list_id == dest_list_id).scalar() or 0

    # --- Case 1: Reorder in the same list ---
    if origin_list_id == dest_list_id:
        if new_card_position == card.position:
            return card

        if not new_card_position:
            new_card_position = dest_list_count

        if new_card_position < 1 or new_card_position > dest_list_count:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Position out of the range"
            )

        # 1. Add or substract one to the range affected by the ordering according to the destination of the new position
        db.execute(
            update(Card)
            .where(and_(
                Card.list_id == dest_list_id,
                Card.position >= min(actual_card_position, new_card_position),
                Card.position <= max(actual_card_position, new_card_position)
            ))
            .values({Card.position: Card.position - 1 if new_card_position > actual_card_position else Card.position + 1})
        )

    # --- Case 2: Reorder in other list ---
    else:
        if not new_card_position:
            new_card_position = dest_list_count + 1

        if new_card_position < 1 or new_card_position > dest_list_count + 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Position out of the range"
            )

        # 1. Fill in the space left by the card
        db.execute(
            update(Card)
            .where(and_(
                Card.list_id == origin_list_id,
                Card.position > actual_card_position
            ))
            .values({Card.position: Card.position - 1})
        )
        # 2. Leave space for the new card
        db.execute(
            update(Card)
            .where(and_(
                Card.list_id == dest_list_id,
                Card.position >= new_card_position
            ))
            .values({Card.position: Card.position + 1})
        )
        # 3. Assign the new list_id
        card.list_id = dest_list_id

    card.position = new_card_position

    db.add(card)
    db.commit()
    db.refresh(card)

    return card


@router.post("/{card_id}/tags/{tag_id}", response_model=schemas.Card, status_code=status.HTTP_201_CREATED)
def attach_tag(
    card_id: int,
    tag_id: int,
    db: Session = Depends(get_db),
    current_user: User = CurrentUserDep
):
    """
    Associate an existing tag with a card.
    """
    card = db.query(Card).options(
        joinedload(Card.list), joinedload(Card.tags)
    ).join(Card.list).join(List.board).filter(
        Card.id == card_id,
        Board.user_id == current_user.id,
        Board.is_inbox == False
    ).first()

    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Card not found"
        )

    tag = db.query(Tag).filter(
        Tag.id == tag_id,
        Tag.board_id == card.list.board_id
    ).first()

    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag not found"
        )

    if tag not in card.tags:
        card.tags.append(tag)
        db.commit()
        db.refresh(card)

    return card


@router.delete("/{card_id}/tags/{tag_id}", response_model=schemas.Card)
def detach_tag(
    card_id: int,
    tag_id: int,
    db: Session = Depends(get_db),
    current_user: User = CurrentUserDep
):
    """
    Removes an existing tag from a card.
    """
    card = db.query(Card).options(
        joinedload(Card.list), joinedload(Card.tags)
    ).join(Card.list).join(List.board).filter(
        Card.id == card_id,
        Board.user_id == current_user.id,
        Board.is_inbox == False
    ).first()

    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Card not found"
        )

    tag = db.query(Tag).filter(
        Tag.id == tag_id,
        Tag.board_id == card.list.board_id
    ).first()

    if not tag or not tag in card.tags:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag not found"
        )

    card.tags.remove(tag)
    db.commit()
    db.refresh(card)

    return card
