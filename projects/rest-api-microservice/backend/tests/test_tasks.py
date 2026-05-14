import pytest


@pytest.fixture()
def project_id(client, auth_header):
    resp = client.post("/api/projects", json={"name": "Task Project"}, headers=auth_header)
    return resp.get_json()["id"]


def test_create_task(client, auth_header, project_id):
    resp = client.post("/api/tasks", json={
        "title": "Write tests",
        "project_id": project_id,
        "priority": "high",
    }, headers=auth_header)
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["title"] == "Write tests"
    assert data["status"] == "todo"
    assert data["priority"] == "high"


def test_create_task_invalid_status(client, auth_header, project_id):
    resp = client.post("/api/tasks", json={
        "title": "Bad",
        "project_id": project_id,
        "status": "invalid",
    }, headers=auth_header)
    assert resp.status_code == 400


def test_create_task_missing_title(client, auth_header, project_id):
    resp = client.post("/api/tasks", json={
        "project_id": project_id,
    }, headers=auth_header)
    assert resp.status_code == 400


def test_create_task_wrong_project(client, auth_header):
    resp = client.post("/api/tasks", json={
        "title": "Orphan",
        "project_id": 999,
    }, headers=auth_header)
    assert resp.status_code == 404


def test_list_tasks(client, auth_header, project_id):
    for i in range(3):
        client.post("/api/tasks", json={
            "title": f"Task {i}",
            "project_id": project_id,
        }, headers=auth_header)

    resp = client.get("/api/tasks", headers=auth_header)
    assert resp.status_code == 200
    assert resp.get_json()["total"] == 3


def test_filter_by_status(client, auth_header, project_id):
    client.post("/api/tasks", json={
        "title": "Todo",
        "project_id": project_id,
        "status": "todo",
    }, headers=auth_header)
    client.post("/api/tasks", json={
        "title": "Done",
        "project_id": project_id,
        "status": "done",
    }, headers=auth_header)

    resp = client.get("/api/tasks?status=done", headers=auth_header)
    tasks = resp.get_json()["tasks"]
    assert len(tasks) == 1
    assert tasks[0]["title"] == "Done"


def test_filter_by_priority(client, auth_header, project_id):
    client.post("/api/tasks", json={
        "title": "Low",
        "project_id": project_id,
        "priority": "low",
    }, headers=auth_header)
    client.post("/api/tasks", json={
        "title": "High",
        "project_id": project_id,
        "priority": "high",
    }, headers=auth_header)

    resp = client.get("/api/tasks?priority=high", headers=auth_header)
    tasks = resp.get_json()["tasks"]
    assert len(tasks) == 1
    assert tasks[0]["title"] == "High"


def test_update_task(client, auth_header, project_id):
    resp = client.post("/api/tasks", json={
        "title": "Original",
        "project_id": project_id,
    }, headers=auth_header)
    tid = resp.get_json()["id"]

    resp = client.put(f"/api/tasks/{tid}", json={
        "title": "Updated",
        "status": "in_progress",
    }, headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["title"] == "Updated"
    assert data["status"] == "in_progress"


def test_delete_task(client, auth_header, project_id):
    resp = client.post("/api/tasks", json={
        "title": "Delete Me",
        "project_id": project_id,
    }, headers=auth_header)
    tid = resp.get_json()["id"]

    resp = client.delete(f"/api/tasks/{tid}", headers=auth_header)
    assert resp.status_code == 204

    resp = client.get(f"/api/tasks/{tid}", headers=auth_header)
    assert resp.status_code == 404


def test_get_project_includes_tasks(client, auth_header, project_id):
    client.post("/api/tasks", json={
        "title": "Nested Task",
        "project_id": project_id,
    }, headers=auth_header)

    resp = client.get(f"/api/projects/{project_id}", headers=auth_header)
    data = resp.get_json()
    assert data["task_count"] == 1
    assert len(data["tasks"]) == 1
    assert data["tasks"][0]["title"] == "Nested Task"


def test_delete_project_cascades_tasks(client, auth_header, project_id):
    client.post("/api/tasks", json={
        "title": "Cascade Me",
        "project_id": project_id,
    }, headers=auth_header)

    client.delete(f"/api/projects/{project_id}", headers=auth_header)

    resp = client.get("/api/tasks", headers=auth_header)
    assert resp.get_json()["total"] == 0
