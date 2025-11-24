from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..db.database import get_db
from .. import schemas
from ..security import CurrentUserDep
from ..models import User, Board, List, Card

router = APIRouter(
    prefix="/boards",
    tags=["Boards"]
)


# --- HELPER FUNCTIONS ---
def get_board_or_404(
    board_id: int,
    db: Session,
    current_user: User
) -> Board:
    """
    Search for the board of the given id and verifies if the current user is the owner of the board.
    Raise 404 if not found.
    Raise 403 if not the owner.
    """
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=f"Board with id {board_id} not found."
        )
    if board.user_id != current_user.id:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            detail=f"You do not have permission to modify this board."
        )

    return board


def get_list_or_404(
    board_id: int,
    list_id: int,
    db: Session,
    current_user: User
) -> List:
    """
    Search for the list of the given `list_id` and verifies:
    - If the board with `board_id` exists and have permission to modify it (using `get_board_or_404`).
    - If exists a list with the given `list_id`.
    - If the list belongs to the board.

    Raise 404 if list or board is not found or if does not belong to the board.
    Check `get_board_or_404` for more details.
    """
    board = get_board_or_404(board_id, db, current_user)

    found_list = db.query(List).filter(List.id == list_id).first()
    if not found_list:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=f"List with id {list_id} not found."
        )

    if board.id != found_list.board_id:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=f"List with id {list_id} does not belong to board with id {board_id}."
        )

    return found_list


def get_card_or_404(
    board_id: int,
    list_id: int,
    card_id: int,
    db: Session,
    current_user: User
) -> Card:
    """
    Search for the card of the given `card_id` and verifies:
    - If exists a list with the given `list_id` and belongs to the board (using `get_list_or_404`).
    - If the board with `board_id` exists and have permission to modify it (using `get_board_or_404` that is implicity included in `get_list_or_404` call).
    - If exists a card with the given `card_id` and belongs to the list.

    Raise 404 if any (card, list or board) is not found or if does not belong to the list and board respectively.
    Check `get_list_or_404` and `get_board_or_404` for more details.
    """
    found_list = get_list_or_404(board_id, list_id, db, current_user)

    found_card = db.query(Card).filter(Card.id == card_id).first()
    if not found_card:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=f"Card with id {card_id} not found."
        )

    if found_card.list_id != found_list.id:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=f"Card with id {card_id} does not belong to list with id {list_id}."
        )

    return found_card


# --- CRUD ROUTES FOR BOARDS ---
@router.post("/", response_model=schemas.Board, status_code=status.HTTP_201_CREATED)
def create_board(
    board_data: schemas.BoardCreate,
    db: Session = Depends(get_db),
    current_user: User = CurrentUserDep
):
    """
    Create a new board.
    The new board will be automatically assigned to the authenticated user.
    """
    board = Board(
        **board_data.model_dump(),
        user=current_user
    )

    db.add(board)
    db.commit()
    db.refresh(board)
    return board


@router.get("/", response_model=list[schemas.Board])
def get_user_boards(
    db: Session = Depends(get_db),
    current_user: User = CurrentUserDep
):
    """
    Get all the boards of the authenticated user.
    """
    boards = db.query(Board).filter(
        Board.user_id == current_user.id,
        Board.is_inbox == False
    ).all()

    return boards


@router.patch("/{board_id}", response_model=schemas.Board)
def update_board(
    board_id: int,
    board_data: schemas.BoardUpdate,
    db: Session = Depends(get_db),
    current_user: User = CurrentUserDep
):
    """
    Update an existing board with the send fields.
    Only the owner of the board can update it.
    """

    board = get_board_or_404(board_id, db, current_user)

    if board.is_inbox:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The inbox data cannot be modified."
        )

    update_data = board_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(board, key, value)

    db.add(board)
    db.commit()
    db.refresh(board)

    return board


@router.delete("/{board_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_board(
    board_id: int,
    db: Session = Depends(get_db),
    current_user: User = CurrentUserDep
):
    """
    Deletes an existing board.
    Only the owner of the board can delete it.
    """

    board = get_board_or_404(board_id, db, current_user)

    if board.is_inbox:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The inbox cannot be deleted."
        )

    db.delete(board)
    db.commit()

    return


# --- CRUD ROUTES FOR LISTS ---
@router.post("/{board_id}/lists", response_model=schemas.List, status_code=status.HTTP_201_CREATED)
def create_list(
    board_id: int,
    list_data: schemas.ListCreate,
    db: Session = Depends(get_db),
    current_user: User = CurrentUserDep
):
    """
    Create a new list.
    The new list will be automatically assigned to the board with the given `board_id`.
    Only the owner of the board with the given `board_id` can add the new list.
    """
    board = get_board_or_404(board_id, db, current_user)

    if board.is_inbox:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot create a new list in the Inbox."
        )

    new_list = List(
        **list_data.model_dump(),
        board=board
    )

    db.add(new_list)
    db.commit()
    db.refresh(new_list)
    return new_list


@router.get("/{board_id}/lists", response_model=list[schemas.List])
def get_board_lists(
    board_id: int,
    db: Session = Depends(get_db),
    current_user: User = CurrentUserDep
):
    """
    Get all the lists of the board.
    Only the owner of the board with the given `board_id` can get it
    """
    board = get_board_or_404(board_id, db, current_user)
    return board.lists


@router.patch("/{board_id}/lists/{list_id}", response_model=schemas.List)
def update_list(
    board_id: int,
    list_id: int,
    list_data: schemas.ListUpdate,
    db: Session = Depends(get_db),
    current_user: User = CurrentUserDep
):
    """
    Update an existing list with the send fields.
    Only the owner of the board with the given `board_id` can update it.
    """

    list_to_update = get_list_or_404(board_id, list_id, db, current_user)

    board: Board = list_to_update.board
    if board.is_inbox:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The inbox list data cannot be modified."
        )

    update_data = list_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(list_to_update, key, value)

    db.add(list_to_update)
    db.commit()
    db.refresh(list_to_update)

    return list_to_update


@router.delete("/{board_id}/lists/{list_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_list(
    board_id: int,
    list_id: int,
    db: Session = Depends(get_db),
    current_user: User = CurrentUserDep
):
    """
    Deletes an existing list.
    Only the owner of the board with the given `board_id` can delete it.
    """

    list_to_delete = get_list_or_404(board_id, list_id, db, current_user)

    board: Board = list_to_delete.board
    if board.is_inbox:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The inbox list cannot be deleted."
        )

    db.delete(list_to_delete)
    db.commit()

    return


# --- CRUD ROUTES FOR CARDS ---
@router.post("/{board_id}/lists/{list_id}/cards", response_model=schemas.Card, status_code=status.HTTP_201_CREATED)
def create_card(
    board_id: int,
    list_id: int,
    card_data: schemas.CardCreate,
    db: Session = Depends(get_db),
    current_user: User = CurrentUserDep
):
    """
    Create a new card.
    The new card will be automatically assigned to the list with the given `list_id`.
    Only the owner of the board with the given `board_id` can add a new card.
    """
    board_list = get_list_or_404(board_id, list_id, db, current_user)

    max_position = db.query(func.max(Card.position)).filter(
        Card.list_id == list_id
    ).scalar()

    position = (max_position or 0) + 1

    new_card = Card(
        **card_data.model_dump(),
        list=board_list,
        position=position,
    )

    db.add(new_card)
    db.commit()
    db.refresh(new_card)
    return new_card


@router.get("/{board_id}/lists/{list_id}/cards", response_model=list[schemas.Card])
def get_list_cards(
    board_id: int,
    list_id: int,
    db: Session = Depends(get_db),
    current_user: User = CurrentUserDep
):
    """
    Get all the cards of the list.
    Only the owner of the board with the given `board_id` can get it
    """
    board_list = get_list_or_404(board_id, list_id, db, current_user)
    return board_list.cards


@router.patch("/{board_id}/lists/{list_id}/cards/{card_id}", response_model=schemas.Card)
def update_card(
    board_id: int,
    list_id: int,
    card_id: int,
    card_data: schemas.CardUpdate,
    db: Session = Depends(get_db),
    current_user: User = CurrentUserDep
):
    """
    Update an existing card with the send fields.
    Only the owner of the board with the given `board_id` can update it.
    """

    card_to_update = get_card_or_404(
        board_id, list_id, card_id, db, current_user)

    update_data = card_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(card_to_update, key, value)

    db.add(card_to_update)
    db.commit()
    db.refresh(card_to_update)

    return card_to_update


@router.delete("/{board_id}/lists/{list_id}/cards/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_card(
    board_id: int,
    list_id: int,
    card_id: int,
    db: Session = Depends(get_db),
    current_user: User = CurrentUserDep
):
    """
    Deletes an existing card.
    Only the owner of the board with the given `board_id` can delete it.
    """

    card_to_delete = get_card_or_404(
        board_id, list_id, card_id, db, current_user)

    db.delete(card_to_delete)
    db.commit()

    return
