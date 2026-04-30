def test_register_success(client):
    resp = client.post("/api/auth/register", json={
        "username": "newuser",
        "email": "new@example.com",
        "password": "password123",
    })
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["user"]["username"] == "newuser"
    assert "access_token" in data


def test_register_duplicate_username(client):
    payload = {"username": "dup", "email": "a@example.com", "password": "password123"}
    client.post("/api/auth/register", json=payload)
    payload["email"] = "b@example.com"
    resp = client.post("/api/auth/register", json=payload)
    assert resp.status_code == 409


def test_register_invalid_email(client):
    resp = client.post("/api/auth/register", json={
        "username": "user",
        "email": "not-an-email",
        "password": "password123",
    })
    assert resp.status_code == 400


def test_register_short_password(client):
    resp = client.post("/api/auth/register", json={
        "username": "user",
        "email": "u@example.com",
        "password": "123",
    })
    assert resp.status_code == 400


def test_login_success(client):
    client.post("/api/auth/register", json={
        "username": "loginuser",
        "email": "login@example.com",
        "password": "password123",
    })
    resp = client.post("/api/auth/login", json={
        "username": "loginuser",
        "password": "password123",
    })
    assert resp.status_code == 200
    assert "access_token" in resp.get_json()


def test_login_wrong_password(client):
    client.post("/api/auth/register", json={
        "username": "user2",
        "email": "u2@example.com",
        "password": "password123",
    })
    resp = client.post("/api/auth/login", json={
        "username": "user2",
        "password": "wrongpass",
    })
    assert resp.status_code == 401


def test_get_me(client, auth_header):
    resp = client.get("/api/auth/me", headers=auth_header)
    assert resp.status_code == 200
    assert resp.get_json()["username"] == "testuser"


def test_get_me_no_token(client):
    resp = client.get("/api/auth/me")
    assert resp.status_code == 401
