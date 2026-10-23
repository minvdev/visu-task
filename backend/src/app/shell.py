import code

from app.db import SessionLocal
from app.models import Board, Card, List, Tag, User
from app.security import get_password_hash, verify_password


def main() -> None:
    db = SessionLocal()

    namespace = {
        "db": db,
        "User": User,
        "Board": Board,
        "List": List,
        "Card": Card,
        "Tag": Tag,
        "get_password_hash": get_password_hash,
        "verify_password": verify_password,
    }

    banner = (
        "Interactive Shell for VisuTask\n"
        "Available items: db, User, Board, List, Card, Tag\n"
        "Utilities: get_password_hash, verify_password\n"
        "Type exit() or Ctrl-D to quit."
    )

    try:
        code.interact(banner=banner, local=namespace)
    finally:
        db.close()


if __name__ == "__main__":
    main()
