from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..schemas.user import User as user_schema, UserCreate as user_create_schema
from ..schemas.token import Token as token_schema
from ..db.database import get_db
from .. import security
from ..models.user import User

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@router.post("/register", response_model=user_schema, status_code=status.HTTP_201_CREATED)
def register_user(user_data: user_create_schema, db: Session = Depends(get_db)):
    """Create a new user in the database.
    - Validates that the email does not exist.
    - Validates that the username does not exist.
    - Hash the password.
    - Return the new created user after filter it.
    """

    # Verify username & email
    email_exists = db.query(User).filter(
        User.email == user_data.email).first()
    if email_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The email is already registered."
        )

    username_exists = db.query(User).filter(
        User.username == user_data.username).first()
    if username_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The username is already used."
        )

    # Hash password
    pasword_hash = security.get_password_hash(user_data.password)

    # Create user
    user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=pasword_hash,
    )

    # Store user in db
    db.add(user)
    db.commit()
    db.refresh(user)  # Ensures that the returned user have an id

    return user


@router.post("/login", response_model=token_schema)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Authenticates the user and returns a JWT.
    - Accepts login with 'username' OR 'email'.
    - Verifies the password.
    - Creates and returns an access token.
    """

    user = db.query(User).filter(User.username == form_data.username).first(
    ) or db.query(User).filter(User.email == form_data.username).first()

    if user is None or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="incorrect username or password",
            # standard of OAuth2
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_data = {"sub": user.username}
    access_token = security.create_access_token(token_data)

    return {"access_token": access_token, "token_type": "bearer"}
