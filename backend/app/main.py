from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, boards, inbox, cards, users


app = FastAPI(
    title="VisualTask API",
    description="API for manage Kanban-like projects",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(boards.router)
app.include_router(inbox.router)
app.include_router(cards.router)
app.include_router(users.router)
