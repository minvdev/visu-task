from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, boards, inbox, cards


app = FastAPI(
    title="VisualTask API",
    description="API for manage Kanban-like projects",
    version="0.1.0"
)

app.include_router(auth.router)
app.include_router(boards.router)
app.include_router(inbox.router)
app.include_router(cards.router)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
