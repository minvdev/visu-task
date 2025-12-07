from fastapi import FastAPI
from .routers import auth, boards, inbox, cards, users


app = FastAPI(
    title="VisualTask API",
    description="API for manage Kanban-like projects",
    version="0.1.0"
)

app.include_router(auth.router)
app.include_router(boards.router)
app.include_router(inbox.router)
app.include_router(cards.router)
app.include_router(users.router)
