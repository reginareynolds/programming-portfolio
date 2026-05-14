def test_create_project(client, auth_header):
    resp = client.post("/api/projects", json={
        "name": "My Project",
        "description": "A test project",
    }, headers=auth_header)
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["name"] == "My Project"
    assert data["task_count"] == 0


def test_create_project_no_auth(client):
    resp = client.post("/api/projects", json={"name": "Fail"})
    assert resp.status_code == 401


def test_create_project_missing_name(client, auth_header):
    resp = client.post("/api/projects", json={"description": "no name"}, headers=auth_header)
    assert resp.status_code == 400


def test_list_projects(client, auth_header):
    client.post("/api/projects", json={"name": "P1"}, headers=auth_header)
    client.post("/api/projects", json={"name": "P2"}, headers=auth_header)

    resp = client.get("/api/projects", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["total"] == 2
    assert len(data["projects"]) == 2


def test_list_projects_pagination(client, auth_header):
    for i in range(5):
        client.post("/api/projects", json={"name": f"P{i}"}, headers=auth_header)

    resp = client.get("/api/projects?page=1&per_page=2", headers=auth_header)
    data = resp.get_json()
    assert len(data["projects"]) == 2
    assert data["total"] == 5
    assert data["pages"] == 3


def test_get_project(client, auth_header):
    resp = client.post("/api/projects", json={"name": "Detail"}, headers=auth_header)
    pid = resp.get_json()["id"]

    resp = client.get(f"/api/projects/{pid}", headers=auth_header)
    assert resp.status_code == 200
    assert resp.get_json()["name"] == "Detail"


def test_get_project_not_found(client, auth_header):
    resp = client.get("/api/projects/999", headers=auth_header)
    assert resp.status_code == 404


def test_update_project(client, auth_header):
    resp = client.post("/api/projects", json={"name": "Old"}, headers=auth_header)
    pid = resp.get_json()["id"]

    resp = client.put(f"/api/projects/{pid}", json={"name": "New"}, headers=auth_header)
    assert resp.status_code == 200
    assert resp.get_json()["name"] == "New"


def test_delete_project(client, auth_header):
    resp = client.post("/api/projects", json={"name": "Delete Me"}, headers=auth_header)
    pid = resp.get_json()["id"]

    resp = client.delete(f"/api/projects/{pid}", headers=auth_header)
    assert resp.status_code == 204

    resp = client.get(f"/api/projects/{pid}", headers=auth_header)
    assert resp.status_code == 404


def test_project_isolation(client, auth_header):
    client.post("/api/projects", json={"name": "User1 Project"}, headers=auth_header)

    client.post("/api/auth/register", json={
        "username": "other",
        "email": "other@example.com",
        "password": "password123",
    })
    resp = client.post("/api/auth/login", json={
        "username": "other",
        "password": "password123",
    })
    other_header = {"Authorization": f"Bearer {resp.get_json()['access_token']}"}

    resp = client.get("/api/projects", headers=other_header)
    assert resp.get_json()["total"] == 0
