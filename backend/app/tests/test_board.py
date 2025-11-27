from sqlalchemy.orm import joinedload

from ..models import Board, List, Card, Tag
from .conftest import check_models_count, check_board_count


# --- BOARDS TESTS ---

def test_create_and_get_board(client, auth_headers, db_session):
    """
    Tests:
    1. Create a new board.
    2. Get the list of boards (and verify it does NOT include the Inbox).
    """
    # 1. Create Board
    response = client.post(
        "/boards/",
        json={"name": "Project Alpha", "description": "Test Board"},
        headers=auth_headers
    )
    assert response.status_code == 201
    board_id = response.json()["id"]

    # 2. Get Boards
    response = client.get("/boards/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    # There should be 1 board (Project Alpha)
    # The Inbox should NOT appear here thanks to the is_inbox=False filter
    assert len(data) == 1
    assert data[0]["name"] == "Project Alpha"
    assert data[0]["id"] == board_id


def test_update_and_delete_board(client, auth_headers):
    # 1. Setup: Create a board
    res = client.post(
        "/boards/", json={"name": "To Delete"}, headers=auth_headers)
    board_id = res.json()["id"]

    # 2. Update (PATCH)
    response = client.patch(
        f"/boards/{board_id}",
        json={"name": "Updated Name"},
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Updated Name"

    # 3. Delete (DELETE)
    response = client.delete(f"/boards/{board_id}", headers=auth_headers)
    assert response.status_code == 204

    # 4. Verify it no longer exists (404)
    # Note: Since get_board_or_404 is used internally in PATCH/DELETE,
    # attempting a PATCH now should return 404.
    response = client.patch(
        f"/boards/{board_id}", json={}, headers=auth_headers)
    assert response.status_code == 404


def test_inbox_board_protection(client, auth_headers, db_session):
    """
    Verifies that the Inbox cannot be modified or deleted.
    """
    # Get Inbox ID (using the specific route we created)
    res = client.get("/inbox/", headers=auth_headers)
    assert res.status_code == 200
    inbox_id = res.json()["id"]

    # Attempt to Modify Inbox -> 403 Forbidden
    res = client.patch(
        f"/boards/{inbox_id}",
        json={"name": "Hacked Inbox"},
        headers=auth_headers
    )
    assert res.status_code == 403

    # Attempt to Delete Inbox -> 403 Forbidden
    res = client.delete(f"/boards/{inbox_id}", headers=auth_headers)
    assert res.status_code == 403


def test_board_cascade(client, auth_headers, db_session, fill_data):
    """
    Tests the CASCADE DELETE functionality of the Board model.

    Scenario:
    1. Setup: Environment with 3 Boards, 10 Tags, 4 Lists, and 9 Cards.
       - Target: 'First Board' [ID 2] (contains 2 Lists, 3 Cards, 5 Tags).
    2. Action: Delete 'First Board'.
    3. Verify: 
       - The target board and all its descendants are removed.
       - 'Inbox' and 'Second Board' remain intact.
       - Final counts: 2 Boards, 5 Tags, 2 Lists, and 6 Cards.
    """
    db = db_session

    expected_models_count = {Board: 3, Tag: 10, List: 4, Card: 9}
    check_models_count(db, expected_models_count)

    board_to_delete_id = db.query(Board).filter(
        Board.name == "First Board").first().id

    expected_board_count = {
        "board_count": 1,
        "tag_count": 5,
        "list_count": 2,
        "card_count": 3,
    }
    check_board_count(db, board_id=board_to_delete_id, **expected_board_count)

    response = client.delete(
        f"/boards/{board_to_delete_id}", headers=auth_headers)
    assert response.status_code == 204

    expected_board_count = {
        "board_count": 0,
        "tag_count": 0,
        "list_count": 0,
        "card_count": 0,
    }
    check_board_count(db, board_id=board_to_delete_id, **expected_board_count)

    expected_models_count = {Board: 2, Tag: 5, List: 2, Card: 6}
    check_models_count(db, expected_models_count)


# --- LISTS TESTS ---

def test_create_and_get_lists(client, auth_headers):
    # 1. Setup: Create board
    res_board = client.post(
        "/boards/", json={"name": "List Test Board"}, headers=auth_headers)
    board_id = res_board.json()["id"]

    # 2. Create List
    res = client.post(
        f"/boards/{board_id}/lists",
        json={"name": "To Do"},
        headers=auth_headers
    )
    assert res.status_code == 201
    list_id = res.json()["id"]

    # 3. Get Board Lists
    res = client.get(f"/boards/{board_id}/lists", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()

    assert len(data) == 1
    assert data[0]["name"] == "To Do"
    assert data[0]["id"] == list_id


def test_update_and_delete_list(client, auth_headers):
    # 1. Setup
    res_board = client.post(
        "/boards/", json={"name": "Board"}, headers=auth_headers)
    board_id = res_board.json()["id"]
    res_list = client.post(
        f"/boards/{board_id}/lists", json={"name": "Original"}, headers=auth_headers)
    list_id = res_list.json()["id"]

    # 2. Update List
    res = client.patch(
        f"/boards/{board_id}/lists/{list_id}",
        json={"name": "Modified"},
        headers=auth_headers
    )
    assert res.status_code == 200
    assert res.json()["name"] == "Modified"

    # 3. Delete List
    res = client.delete(
        f"/boards/{board_id}/lists/{list_id}", headers=auth_headers)
    assert res.status_code == 204

    # 4. Verify
    res = client.get(f"/boards/{board_id}/lists", headers=auth_headers)
    assert len(res.json()) == 0


def test_inbox_list_protection(client, auth_headers, db_session):
    """
    Verifies special rules for Inbox lists.
    """
    # Get Inbox and its 'Incoming' list
    res_inbox = client.get("/inbox/", headers=auth_headers)
    inbox_id = res_inbox.json()["id"]

    # The Inbox should already have the "Incoming" list (created upon registration)
    lists = res_inbox.json()["lists"]
    assert len(lists) == 1
    incoming_list_id = lists[0]["id"]

    # 1. Attempt to Create ANOTHER list in the Inbox -> 403
    res = client.post(
        f"/boards/{inbox_id}/lists",
        json={"name": "Forbidden List"},
        headers=auth_headers
    )
    assert res.status_code == 403

    # 2. Attempt to Delete the 'Incoming' list -> 403
    res = client.delete(
        f"/boards/{inbox_id}/lists/{incoming_list_id}",
        headers=auth_headers
    )
    assert res.status_code == 403


def test_list_cascade(client, auth_headers, db_session, fill_data):
    """
    Tests the CASCADE DELETE functionality of the List model.

    Scenario:
    1. Setup: Environment with 3 Boards, 10 Tags, 4 Lists, and 9 Cards.
       - Target: 'List 2' (Second list of 'First Board') [ID 3] (contains 2 Cards).
    2. Action: Delete 'List 2'.
    3. Verify: 
       - The target list and all its cards are removed.
       - The target list's parent (board) remain intact.
       - The target list's parent (board) has its tags intact.
       - 'Inbox' and 'Second Board' remain intact.
       - Final counts: 3 Boards, 10 Tags, 3 Lists, and 7 Cards.
    """
    db = db_session

    expected_models_count = {Board: 3, Tag: 10, List: 4, Card: 9}
    check_models_count(db, expected_models_count)

    list_to_delete = db.query(List).options(
        joinedload(List.board)
    ).filter(
        List.name == "List 2"
    ).first()

    parent_board_id = list_to_delete.board_id

    expected_board_count = {
        "board_count": 1,
        "tag_count": 5,
        "list_count": 2,
        "card_count": 3,
    }
    check_board_count(db, board_id=parent_board_id, **expected_board_count)

    response = client.delete(
        f"/boards/{parent_board_id}/lists/{list_to_delete.id}", headers=auth_headers)
    assert response.status_code == 204

    expected_board_count["list_count"] = 1
    expected_board_count["card_count"] = 1
    check_board_count(db, board_id=parent_board_id, **expected_board_count)

    expected_models_count[List] = 3
    expected_models_count[Card] = 7
    check_models_count(db, expected_models_count)


# --- CARDS TESTS ---

def test_create_and_get_cards(client, auth_headers):
    # 1. Setup: Board + List
    res_board = client.post(
        "/boards/", json={"name": "Card Board"}, headers=auth_headers)
    board_id = res_board.json()["id"]
    res_list = client.post(
        f"/boards/{board_id}/lists", json={"name": "List 1"}, headers=auth_headers)
    list_id = res_list.json()["id"]

    # 2. Create Card
    res = client.post(
        f"/boards/{board_id}/lists/{list_id}/cards",
        json={"name": "My Task", "text": "Description"},
        headers=auth_headers
    )
    assert res.status_code == 201
    card_data = res.json()
    assert card_data["name"] == "My Task"
    assert card_data["position"] == 1  # Default auto-positioning

    # 3. Get Cards from the list
    res = client.get(
        f"/boards/{board_id}/lists/{list_id}/cards", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 1
    assert data[0]["id"] == card_data["id"]


def test_update_and_delete_card(client, auth_headers):
    # 1. Setup
    res_board = client.post(
        "/boards/", json={"name": "B"}, headers=auth_headers)
    board_id = res_board.json()["id"]
    res_list = client.post(
        f"/boards/{board_id}/lists", json={"name": "L"}, headers=auth_headers)
    list_id = res_list.json()["id"]
    res_card = client.post(
        f"/boards/{board_id}/lists/{list_id}/cards", json={"name": "C"}, headers=auth_headers)
    card_id = res_card.json()["id"]

    # 2. Update Card
    res = client.patch(
        f"/boards/{board_id}/lists/{list_id}/cards/{card_id}",
        json={"name": "C Updated", "is_done": True},
        headers=auth_headers
    )
    assert res.status_code == 200
    assert res.json()["name"] == "C Updated"
    assert res.json()["is_done"] is True

    # 3. Delete Card
    res = client.delete(
        f"/boards/{board_id}/lists/{list_id}/cards/{card_id}", headers=auth_headers)
    assert res.status_code == 204

    # 4. Verify
    res = client.get(
        f"/boards/{board_id}/lists/{list_id}/cards", headers=auth_headers)
    assert len(res.json()) == 0


def test_card_cascade(client, auth_headers, db_session, fill_data):
    """
    Tests the CASCADE DELETE functionality of the Card model.

    Scenario:
    1. Setup: Environment with 3 Boards, 10 Tags, 4 Lists, and 9 Cards.
       - Target: 'Task 5' ('First Board' -> 'List 2' -> 'Task 5', the first card).
    2. Action: Delete 'Task 5'.
    3. Verify: 
       - The target card.
       - The target card's parent (list) remain intact.
       - The board and tags are intact too.
       - 'Inbox' and 'Second Board' remain intact.
       - Final counts: 3 Boards, 10 Tags, 4 Lists, and 8 Cards.
    """
    db = db_session

    expected_models_count = {Board: 3, Tag: 10, List: 4, Card: 9}
    check_models_count(db, expected_models_count)

    card_to_delete = db.query(Card).options(
        joinedload(Card.list)
    ).filter(
        Card.name == "Task 5"
    ).first()
    parent_list_id = card_to_delete.list.id
    parent_board_id = card_to_delete.list.board_id

    expected_board_count = {
        "board_count": 1,
        "tag_count": 5,
        "list_count": 2,
        "card_count": 3,
    }
    check_board_count(db, board_id=parent_board_id, **expected_board_count)

    response = client.delete(
        f"/boards/{parent_board_id}/lists/{parent_list_id}/cards/{card_to_delete.id}",
        headers=auth_headers
    )
    assert response.status_code == 204

    expected_board_count["card_count"] = 2
    check_board_count(db, board_id=parent_board_id, **expected_board_count)

    expected_models_count[Card] = 8
    check_models_count(db, expected_models_count)


# --- CARDS TESTS ---

def test_create_and_get_tags(client, auth_headers):
    # 1. Setup: Create board
    board_id = client.post(
        "/boards/", json={"name": "List Test Board"}, headers=auth_headers).json()["id"]

    # 2. Check if the default tag creation works
    response = client.get(f"/boards/{board_id}/tags", headers=auth_headers)
    assert response.status_code == 200
    tags_count = len(response.json())
    assert tags_count > 0

    # 3. Create Tag
    response = client.post(
        f"/boards/{board_id}/tags",
        json={"color": "#ffffff", "name": "Important"},
        headers=auth_headers
    )
    assert response.status_code == 201
    created_tag_id = response.json()["id"]

    # 4. Get Board Tags
    response = client.get(f"/boards/{board_id}/tags", headers=auth_headers)
    assert response.status_code == 200
    fetched_tags = response.json()
    assert len(fetched_tags) == tags_count + 1

    fetched_tag = [tag for tag in fetched_tags if tag["id"]
                   == created_tag_id][0]

    assert fetched_tag["name"] == "Important"
    assert fetched_tag["color"] == "#ffffff"


def test_update_and_delete_tag(client, auth_headers):
    # 1. Setup: Create board
    board_id = client.post(
        "/boards/",
        json={"name": "List Test Board"},
        headers=auth_headers
    ).json()["id"]

    default_tags_count = len(client.get(
        f"/boards/{board_id}/tags", headers=auth_headers).json())

    tag_id = client.post(
        f"/boards/{board_id}/tags",
        json={"color": "#ffffff", "name": "Important"},
        headers=auth_headers
    ).json()["id"]

    # 2. Update List
    all_tags = client.patch(
        f"/boards/{board_id}/tags/{tag_id}",
        json={"name": "Super Important"},
        headers=auth_headers
    )
    assert all_tags.status_code == 200
    assert all_tags.json()["name"] == "Super Important"

    # 3. Delete List
    all_tags = client.delete(
        f"/boards/{board_id}/tags/{tag_id}", headers=auth_headers)
    assert all_tags.status_code == 204

    # 4. Verify
    all_tags = client.get(
        f"/boards/{board_id}/tags", headers=auth_headers).json()
    assert len(all_tags) == default_tags_count


def test_inbox_tag_protection(client, auth_headers, db_session):
    """
    Verifies special rules for Inbox with tags.
    """
    # Get Inbox and its 'Incoming' list
    inbox = client.get("/inbox/", headers=auth_headers).json()
    inbox_id = inbox["id"]

    # The Inbox should not have tags associated
    inbox_tags = inbox["tags"]
    assert len(inbox_tags) == 0

    # 1. Attempt to Create a new tag in the Inbox -> 403
    response = client.post(
        f"/boards/{inbox_id}/tags",
        json={"color": "#ff0000",  "name": "Forbidden Tag"},
        headers=auth_headers
    )
    assert response.status_code == 403


def test_tag_cascade(client, auth_headers, db_session, fill_data):
    """
    Tests the CASCADE DELETE functionality of the Tag model.

    Scenario:
    1. Setup: Environment with 3 Boards, 10 Tags, 4 Lists, and 9 Cards.
       - Assign the five tags of the board to the cards of the board.
       - Target: The first tag of 'First Board'.
    2. Action: Delete The first tag of 'First Board'.
    3. Verify: 
       - The target tag and all its links are removed.
       - The board, lists and cards remains intact.
       - Only the card <-> tag ​​relationship should be removed
       - Final counts: 3 Boards, 9 Tags, 4 Lists, and 9 Cards.
    """
    db = db_session

    board = db.query(Board).options(
        joinedload(Board.tags)).filter(
        Board.name == "First Board").first()

    board_id = board.id
    tag_id = board.tags[0].id

    board_cards = db.query(Card).join(Card.list).filter(
        List.board_id == board_id).all()
    board_tags = db.query(Tag).filter(Tag.board_id == board_id).all()

    for card in board_cards:
        for tag in board_tags:
            card.tags.append(tag)
    db.commit()

    expected_models_count = {Board: 3, Tag: 10, List: 4, Card: 9}
    check_models_count(db, expected_models_count)

    expected_board_count = {
        "board_count": 1,
        "tag_count": 5,
        "list_count": 2,
        "card_count": 3,
    }
    check_board_count(db, board_id=board_id, **expected_board_count)

    response = client.delete(
        f"/boards/{board_id}/tags/{tag_id}", headers=auth_headers)
    assert response.status_code == 204

    expected_board_count["tag_count"] = 4
    check_board_count(db, board_id=board_id, **expected_board_count)

    expected_models_count[Tag] = 9
    check_models_count(db, expected_models_count)
