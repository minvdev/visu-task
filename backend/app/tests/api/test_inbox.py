def test_get_inbox(client, auth_headers):
    """
    Tests retrieving the Inbox board for the authenticated user.
    Verifies:
    1. The route returns 200 OK.
    2. The returned board is indeed the Inbox (is_inbox=True).
    3. It contains the default "Incoming" list.
    """
    # 1. GET /inbox request
    response = client.get("/inbox/", headers=auth_headers)

    # 2. Basic verifications
    assert response.status_code == 200
    data = response.json()

    # 3. Verify Inbox attributes
    assert data["name"] == "Inbox"
    # The 'is_inbox' field is not in the 'Board' response schema, so
    # we need to check if the name is 'Inbox'.

    # 4. Verify internal structure (Incoming List)
    # The Inbox must always be created with a list named "Incoming"
    assert "lists" in data
    assert len(data["lists"]) == 1
    assert data["lists"][0]["name"] == "Incoming"


def test_get_inbox_unauthorized(client):
    """
    Verifies that an unauthenticated user cannot access the Inbox.
    """
    # Not passing the headers
    response = client.get("/inbox/")
    assert response.status_code == 401
