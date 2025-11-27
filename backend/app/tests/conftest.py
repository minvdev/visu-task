import pytest
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.db.database import Base, get_db
from app.main import app
from app.models import Board, List, Card, Tag

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)

TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """
    Create a new database for each test.
    Ensures tests are independent.
    """
    Base.metadata.create_all(bind=engine)

    session = TestingSessionLocal()
    yield session

    session.close()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """
    Test client that use the test database.
    """
    def override_get_db():
        try:
            yield db_session
        finally:
            db_session.close()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        yield c

    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def auth_headers(client):
    """
    Register a user, make the login and returns the auth headers.
    """
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123"
    }
    client.post("/auth/register", json=user_data)

    login_data = {"username": "testuser", "password": "password123"}
    response = client.post("/auth/login", data=login_data)
    token = response.json()["access_token"]

    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="function")
def fill_data(client, auth_headers):
    """
    Create data for testing.
    [Inbox]                         [First Board]                       [Second Board]

    [Incoming]                      [List 1]    [List 2]                [List 3]

    [Task 1] [Task 2] [Task 3]      [Task 4]    [Task 5] [Task 6]       [Task 7] [Task 8] [Task 9]
    """
    default_headers, client.headers = client.headers, auth_headers

    def create_lists(board_id, list_names: list[str]) -> list[dict]:
        """
        Create `n` lists in the board where `n` is the number of names on the list.
        Also checks if the list was created.
        """
        url = f"/boards/{board_id}/lists/"
        created_lists = [client.post(
            url, json={"name": name}).json() for name in list_names]

        response = client.get(url)
        assert [list_item["name"]
                for list_item in response.json()] == list_names

        return created_lists

    def create_cards(board_id, list_id, card_names: list[str]):
        """
        Create `n` cards in the list where `n` is the number of names on the list.
        Also checks if the card was created.
        """
        url = f"/boards/{board_id}/lists/{list_id}/cards"

        for name in card_names:
            client.post(url, json={"name": name})

        response = client.get(url)
        assert [card["name"] for card in response.json()] == card_names

    cards_count = 1
    lists_count = 1
    # Inbox
    inbox = client.get("/inbox").json()
    inbox_id = inbox["id"]
    incoming_id = inbox["lists"][0]["id"]

    create_cards(inbox_id, incoming_id, [
                 f"Task {i}" for i in range(cards_count, cards_count+3)])
    cards_count += 3

    # First Board
    board = client.post("/boards", json={"name": "First Board"}).json()
    board_id = board["id"]

    lists = create_lists(
        board_id, [f"List {i}" for i in range(lists_count, lists_count+2)])
    lists_count += 2
    list_ids = [l["id"] for l in lists]

    create_cards(board_id, list_ids[0], [
                 f"Task {i}" for i in range(cards_count, cards_count+1)])
    cards_count += 1
    create_cards(board_id, list_ids[1], [
                 f"Task {i}" for i in range(cards_count, cards_count+2)])
    cards_count += 2

    # Second Board
    board = client.post("/boards", json={"name": "Second Board"}).json()
    board_id = board["id"]

    lists = create_lists(
        board_id, [f"List {i}" for i in range(lists_count, lists_count+1)])
    list_ids = [l["id"] for l in lists]

    create_cards(board_id, list_ids[0], [
                 f"Task {i}" for i in range(cards_count, cards_count+3)])

    client.headers = default_headers
