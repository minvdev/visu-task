from app.models import User, Board, List


def test_register_user(client, db_session):
    user_data = {
        "username": "newuser",
        "email": "new@example.com",
        "password": "securepassword"
    }

    response = client.post("/auth/register", json=user_data)

    # --- Basic verifications ---
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == user_data["username"]
    assert data["email"] == user_data["email"]
    assert "password" not in data

    # --- User created verification ---
    user = db_session.query(User).filter(
        User.email == user_data["email"]).first()
    assert user is not None

    # --- Inbox board logic verification ---
    inbox = db_session.query(Board).filter(
        Board.user_id == user.id, Board.is_inbox == True).first()
    assert inbox is not None
    assert inbox.name == "Inbox"

    # --- Incoming list logic verification ---
    incoming_list = db_session.query(List).filter(
        List.board_id == inbox.id).first()
    assert incoming_list is not None
    assert incoming_list.name == "Incoming"


def test_login_user(client):
    # 1. Create user first
    client.post("/auth/register", json={
        "username": "loginuser",
        "email": "login@example.com",
        "password": "mypassword"
    })

    # 2. Try to login
    response = client.post("/auth/login", data={
        "username": "loginuser",
        "password": "mypassword"
    })

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client):
    client.post("/auth/register", json={
        "username": "user2", "email": "u2@ex.com", "password": "password"
    })

    response = client.post("/auth/login", data={
        "username": "user2",
        "password": "WRONGpassword"
    })

    assert response.status_code == 401
