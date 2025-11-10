from fastapi import APIRouter

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@router.get("/register")
def register():
    return {"test": "register"}


@router.get("/login")
def login():
    return {"test": "login"}


@router.get("/logout")
def logout():
    return {"test": "logout"}
