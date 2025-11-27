# --- CARD ISOLATED OPERATIONS ---

def test_card_due_date(client, auth_headers):
    # 1. Setup: Create Board + List + Card
    # Create Board
    board = client.post(
        "/boards/", json={"name": "House"}, headers=auth_headers).json()
    board_id = board["id"]

    # Create List
    list = client.post(f"/boards/{board_id}/lists",
                       json={"name": "Daily tasks"}, headers=auth_headers).json()
    list_id = list["id"]

    def fetch_card(card_id):
        """
        Return the fetched card with the 'card_id' from a get request to "/boards/{board_id}/lists/{list_id}/cards".
        """
        cards = client.get(
            f"/boards/{board_id}/lists/{list_id}/cards", headers=auth_headers).json()
        return [card for card in cards if card["id"] == card_id][0]

    # Create Card, due_date has not been set
    card_id = client.post(f"/boards/{board_id}/lists/{list_id}/cards",
                          json={"name": "Simple task"}, headers=auth_headers).json()["id"]
    card = fetch_card(card_id)
    assert not card["due_date"]

    # set due_date
    client.patch(f"/boards/{board_id}/lists/{list_id}/cards/{card_id}/",
                 json={"due_date": "2025-11-30T23:59:59"}, headers=auth_headers)
    card = fetch_card(card_id)
    assert card["due_date"] == "2025-11-30T23:59:59"

    # Test that 'exclude_unset=True' works correctly
    # changing another field and checking that the date is not deleted.
    client.patch(f"/boards/{board_id}/lists/{list_id}/cards/{card_id}/",
                 json={"description": "The due date must remain set when we send an update request without the due_date field"}, headers=auth_headers)
    card = fetch_card(card_id)
    assert card["due_date"] == "2025-11-30T23:59:59"

    # removed the due_date
    client.patch(f"/boards/{board_id}/lists/{list_id}/cards/{card_id}/",
                 json={"due_date": None}, headers=auth_headers)
    card = fetch_card(card_id)
    assert not card["due_date"]


# --- MOVE TESTS (Drag & Drop) ---

def test_move_card_same_list(client, auth_headers):
    """
    Verifies reordering cards within the same list.
    Scenario: List with 3 cards [C1, C2, C3].
    Action: Move C1 (pos 1) to position 2.
    Expected Result: [C2, C1, C3].
    """
    # 1. Setup: Create Board + List + 3 Cards
    # Create Board
    res_board = client.post(
        "/boards/", json={"name": "Move Board"}, headers=auth_headers)
    board_id = res_board.json()["id"]

    # Create List
    res_list = client.post(
        f"/boards/{board_id}/lists", json={"name": "List A"}, headers=auth_headers)
    list_id = res_list.json()["id"]

    # Create 3 Cards (auto-positioned at 1, 2, 3)
    c1 = client.post(f"/boards/{board_id}/lists/{list_id}/cards",
                     json={"name": "C1"}, headers=auth_headers).json()
    c2 = client.post(f"/boards/{board_id}/lists/{list_id}/cards",
                     json={"name": "C2"}, headers=auth_headers).json()
    c3 = client.post(f"/boards/{board_id}/lists/{list_id}/cards",
                     json={"name": "C3"}, headers=auth_headers).json()

    assert c1["position"] == 1
    assert c2["position"] == 2
    assert c3["position"] == 3

    # 2. Action: Move C1 to position 2
    move_data = {
        "destination_list_id": list_id,
        "destination_list_position": 2
    }
    res = client.post(f"/cards/{c1['id']}/move",
                      json=move_data, headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["position"] == 2

    # 3. Verification: Check the order of ALL cards
    # C2 should have moved down to pos 1 ("shift up")
    # C3 should remain at pos 3
    cards_res = client.get(
        f"/boards/{board_id}/lists/{list_id}/cards", headers=auth_headers)
    cards = cards_res.json()

    # Sort by id for easy lookup or map by id
    card_map = {c["id"]: c["position"] for c in cards}

    assert card_map[c1["id"]] == 2  # C1 moved down
    assert card_map[c2["id"]] == 1  # C2 moved up
    assert card_map[c3["id"]] == 3  # C3 unchanged


def test_move_card_different_list(client, auth_headers):
    """
    Verifies moving a card to another list.
    Scenario: 
        List A: [A1, A2]
        List B: [B1]
    Action: Move A1 to List B, position 1.
    Expected Result:
        List A: [A2] (A2 moves from pos 2 to 1)
        List B: [A1, B1] (A1 enters at pos 1, B1 moves down to pos 2)
    """
    # 1. Setup
    res_board = client.post(
        "/boards/", json={"name": "Cross Board"}, headers=auth_headers)
    board_id = res_board.json()["id"]

    # List A with 2 cards
    list_a = client.post(
        f"/boards/{board_id}/lists", json={"name": "List A"}, headers=auth_headers).json()
    a1 = client.post(f"/boards/{board_id}/lists/{list_a['id']}/cards", json={
                     "name": "A1"}, headers=auth_headers).json()
    a2 = client.post(f"/boards/{board_id}/lists/{list_a['id']}/cards", json={
                     "name": "A2"}, headers=auth_headers).json()

    # List B with 1 card
    list_b = client.post(
        f"/boards/{board_id}/lists", json={"name": "List B"}, headers=auth_headers).json()
    b1 = client.post(f"/boards/{board_id}/lists/{list_b['id']}/cards", json={
                     "name": "B1"}, headers=auth_headers).json()

    # 2. Action: Move A1 -> List B (Position 1)
    move_data = {
        "destination_list_id": list_b["id"],
        "destination_list_position": 1
    }
    res = client.post(f"/cards/{a1['id']}/move",
                      json=move_data, headers=auth_headers)
    assert res.status_code == 200

    # 3. Verifications

    # Check List A (Source)
    res_cards_a = client.get(
        f"/boards/{board_id}/lists/{list_a['id']}/cards", headers=auth_headers).json()
    assert len(res_cards_a) == 1
    assert res_cards_a[0]["id"] == a2["id"]
    assert res_cards_a[0]["position"] == 1

    # Check List B (Destination)
    res_cards_b = client.get(
        f"/boards/{board_id}/lists/{list_b['id']}/cards", headers=auth_headers).json()
    assert len(res_cards_b) == 2
    card_map_b = {c["id"]: c["position"] for c in res_cards_b}

    assert card_map_b[a1["id"]] == 1  # A1 enters at top
    assert card_map_b[b1["id"]] == 2  # B1 is pushed down


def test_move_card_security(client, auth_headers):
    """
    Verifies error cases:
    1. Card does not exist.
    2. Destination list does not exist.
    3. Attempt to move to a foreign board (simulated by moving to a non-existent or foreign list).
    """
    # 1. Basic Setup
    res_board = client.post(
        "/boards/", json={"name": "Sec Board"}, headers=auth_headers)
    board_id = res_board.json()["id"]
    res_list = client.post(
        f"/boards/{board_id}/lists", json={"name": "L1"}, headers=auth_headers).json()
    res_card = client.post(f"/boards/{board_id}/lists/{res_list['id']}/cards", json={
                           "name": "C1"}, headers=auth_headers).json()

    # Case 1: Non-existent card
    res = client.post("/cards/99999/move",
                      json={"destination_list_id": res_list['id']}, headers=auth_headers)
    assert res.status_code == 404

    # Case 2: Non-existent destination list
    res = client.post(
        f"/cards/{res_card['id']}/move", json={"destination_list_id": 99999}, headers=auth_headers)
    # Or 403 depending on your security implementation, but 404 is common if not found.
    assert res.status_code == 404

    # Case 3: Unauthorized user (create another user and try to move the first user's card)
    # Create user 2
    client.post("/auth/register", json={"username": "hacker",
                "email": "hacker@ex.com", "password": "123456789"})
    token_hacker = client.post(
        "/auth/login", data={"username": "hacker", "password": "123456789"}).json()
    token_hacker = token_hacker["access_token"]
    headers_hacker = {"Authorization": f"Bearer {token_hacker}"}

    # Pirate attempts to move original user's card
    res = client.post(
        f"/cards/{res_card['id']}/move",
        # Try to move it within the same list
        json={"destination_list_id": res_list['id']},
        headers=headers_hacker
    )
    assert res.status_code == 403


# --- TAG ASSIGN TESTS ---

def test_attach_tag(client, auth_headers):
    # 1. Setup: Board + List
    board_id = client.post(
        "/boards/",
        json={"name": "Daily"},
        headers=auth_headers
    ).json()["id"]
    list_id = client.post(
        f"/boards/{board_id}/lists",
        json={"name": "Job"},
        headers=auth_headers
    ).json()["id"]

    # 2. Create Card
    card_id = client.post(
        f"/boards/{board_id}/lists/{list_id}/cards",
        json={"name": "My Task"},
        headers=auth_headers
    ).json()["id"]

    # 3. Create Tag
    tag_id = client.post(
        f"/boards/{board_id}/tags",
        json={"color": "#ff0000", "name": "Important"},
        headers=auth_headers
    ).json()["id"]

    # 4. Attach the tag with the card
    response = client.post(
        f"cards/{card_id}/tags/{tag_id}",
        headers=auth_headers
    )
    assert response.status_code == 201

    # 5. Check if the tag was attached
    cards = client.get(
        f"/boards/{board_id}/lists/{list_id}/cards",
        headers=auth_headers
    ).json()
    card = [card for card in cards if card["id"] == card_id][0]

    card_tags = card["tags"]
    assert len(card_tags) == 1
    assert card_tags[0]["color"] == "#ff0000"
    assert card_tags[0]["name"] == "Important"


def test_detach_tag(client, auth_headers):
    # 1. Setup: Board + List
    board_id = client.post(
        "/boards/",
        json={"name": "Daily"},
        headers=auth_headers
    ).json()["id"]
    list_id = client.post(
        f"/boards/{board_id}/lists",
        json={"name": "Job"},
        headers=auth_headers
    ).json()["id"]

    # 2. Setup: Card + Tag
    card_id = client.post(
        f"/boards/{board_id}/lists/{list_id}/cards",
        json={"name": "My Task"},
        headers=auth_headers
    ).json()["id"]
    tag_id = client.post(
        f"/boards/{board_id}/tags",
        json={"color": "#ff0000", "name": "Important"},
        headers=auth_headers
    ).json()["id"]

    # 3. Attach the tag with the card
    response = client.post(
        f"cards/{card_id}/tags/{tag_id}",
        headers=auth_headers
    )
    assert response.status_code == 201

    # 4. Check if the tag was attached
    cards = client.get(
        f"/boards/{board_id}/lists/{list_id}/cards",
        headers=auth_headers
    ).json()
    card = [card for card in cards if card["id"] == card_id][0]

    card_tags = card["tags"]
    assert len(card_tags) == 1
    assert card_tags[0]["color"] == "#ff0000"
    assert card_tags[0]["name"] == "Important"

    # 5. Detach the tag
    response = client.delete(
        f"cards/{card_id}/tags/{tag_id}",
        headers=auth_headers
    )
    assert response.status_code == 200

    # 6. Check if the tag was attached
    cards = client.get(
        f"/boards/{board_id}/lists/{list_id}/cards",
        headers=auth_headers
    ).json()
    card = [card for card in cards if card["id"] == card_id][0]

    card_tags = card["tags"]
    assert len(card_tags) == 0


def test_attach_tag_cross_board(client, auth_headers):
    # 1. Setup for card creation: Board + List
    card_board_id = client.post(
        "/boards/",
        json={"name": "Board for card"},
        headers=auth_headers
    ).json()["id"]
    card_list_id = client.post(
        f"/boards/{card_board_id}/lists",
        json={"name": "Job"},
        headers=auth_headers
    ).json()["id"]

    # 2. Setup for tag creation: Board
    tag_board_id = client.post(
        "/boards/",
        json={"name": "Board for tag"},
        headers=auth_headers
    ).json()["id"]

    # 2. Create Card
    card_id = client.post(
        f"/boards/{card_board_id}/lists/{card_list_id}/cards",
        json={"name": "My Task"},
        headers=auth_headers
    ).json()["id"]

    # 3. Create Tag
    tag_id = client.post(
        f"/boards/{tag_board_id}/tags",
        json={"color": "#ff0000", "name": "Important"},
        headers=auth_headers
    ).json()["id"]

    # 4. Try to attach the tag with the card
    response = client.post(
        f"cards/{card_id}/tags/{tag_id}",
        headers=auth_headers
    )
    assert response.status_code == 404
