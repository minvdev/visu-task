from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..db.database import get_db
from .. import schemas
from .. import security
from ..models import User, Board

router = APIRouter(
    prefix="/boards",
    tags=["Board"]
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
