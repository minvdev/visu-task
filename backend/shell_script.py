from app.db.database import SessionLocal
from app.models import User, Board, List, Card, Tag
from app.security import get_password_hash, verify_password

db = SessionLocal()

print("------------------------------------------------------------")
print("Interactive Shell for VisuTask")
print("------------------------------------------------------------")
print(
    f"Available items: db, {User.__name__}, {Board.__name__}, {List.__name__}, {Card.__name__}, {Tag.__name__}")
print(f"Utilities: {get_password_hash.__name__}, {verify_password.__name__}")
print("------------------------------------------------------------")
