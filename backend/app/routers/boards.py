from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..db.database import get_db
from .. import schemas
from .. import security
from ..models import User, Board, List

router = APIRouter(
    prefix="/boards",
    tags=["Boards"]
)

CurrentUserDep = Depends(security.get_current_user)


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
    current_user: User = CurrentUserDep
):
    """
    Get all the boards of the authenticated user.
    """
    return current_user.boards


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

    db.delete(list_to_delete)
    db.commit()

    return
