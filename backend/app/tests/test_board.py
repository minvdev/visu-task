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
    from json import dumps
    print(dumps(card_data, ensure_ascii=False, indent=2))
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
