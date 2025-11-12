from passlib.context import CryptContext
from datetime import timedelta, datetime, timezone
from .core.config import settings
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from pydantic import ValidationError
from .db import database
from .models import User
from .schemas import token as token_schema


# --- 1. Password hashing ---
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    """Hash a password in plain text."""
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    """Verify a plain text password against a hash."""
    return pwd_context.verify(password, password_hash)


# --- 2. OAuth2 config and JWT ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """Create a new access token (JWT)."""
    to_encode = data.copy()
    default_delta_exp = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    def calc_expires(delta: timedelta):
        return datetime.now(timezone.utc) + delta

    to_encode["exp"] = calc_expires(expires_delta or default_delta_exp)
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)) -> User:
    """
    Dependency that enforces authentication for protected endpoints.

    Usage:
        current_user: User = Depends(get_current_user)

    Behavior:
    1. Depends(oauth2_scheme) extracts the Bearer token from the Authorization header.
    2. The token is decoded and validated (signature, algorithm, expiration) against SECRET_KEY/ALGORITHM.
    3. The payload must contain an identifier (e.g. 'sub' or a user id) used to load the user from the database via the provided Session.
    4. If token validation fails, is expired, or the user is not found, the function raises an HTTPException (401 Unauthorized) so the request is rejected.
    5. On success, the function returns the SQLAlchemy User instance representing the authenticated user.
    """

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="The credentials could not be validated",
        headers={"WWW-Authenticate": "Bearer"}
    )

    try:
        payload = jwt.decode(token, settings.SECRET_KEY,
                             algorithms=[settings.ALGORITHM])
        token_data = token_schema.TokenData(username=payload.get("sub"))

        if token_data.username is None:
            raise credentials_exception

    except (JWTError, ValidationError):
        raise credentials_exception

    # Search the user in the database
    user = db.query(User).filter(User.username == token_data.username).first()

    if user is None:
        raise credentials_exception

    return user
