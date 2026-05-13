from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError

from app import db
from app.models import Task, Project
from app.schemas import TaskSchema, TaskUpdateSchema

tasks_bp = Blueprint("tasks", __name__)

task_schema = TaskSchema()
task_update_schema = TaskUpdateSchema()


def verify_project_access(project_id, user_id):
    return Project.query.filter_by(id=project_id, owner_id=user_id).first()


@tasks_bp.route("", methods=["GET"])
@jwt_required()
def list_tasks():
    user_id = int(get_jwt_identity())
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    per_page = min(per_page, 100)

    query = (
        Task.query
        .join(Project)
        .filter(Project.owner_id == user_id)
    )

    status = request.args.get("status")
    if status:
        query = query.filter(Task.status == status)

    priority = request.args.get("priority")
    if priority:
        query = query.filter(Task.priority == priority)

    project_id = request.args.get("project_id", type=int)
    if project_id:
        query = query.filter(Task.project_id == project_id)

    sort = request.args.get("sort", "created_at")
    order = request.args.get("order", "desc")
    sort_column = getattr(Task, sort, Task.created_at)
    query = query.order_by(sort_column.desc() if order == "desc" else sort_column.asc())

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "tasks": [t.to_dict() for t in pagination.items],
        "total": pagination.total,
        "page": pagination.page,
        "pages": pagination.pages,
    })


@tasks_bp.route("/<int:task_id>", methods=["GET"])
@jwt_required()
def get_task(task_id):
    user_id = int(get_jwt_identity())
    task = Task.query.join(Project).filter(Task.id == task_id, Project.owner_id == user_id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(task.to_dict())


@tasks_bp.route("", methods=["POST"])
@jwt_required()
def create_task():
    try:
        data = task_schema.load(request.get_json())
    except ValidationError as e:
        return jsonify({"errors": e.messages}), 400

    user_id = int(get_jwt_identity())
    if not verify_project_access(data["project_id"], user_id):
        return jsonify({"error": "Project not found"}), 404

    task_count = Task.query.join(Project).filter(Project.owner_id == user_id).count()
    if task_count >= 100:
        return jsonify({"error": "Task limit reached (max 100)"}), 400

    task = Task(
        title=data["title"],
        description=data["description"],
        status=data["status"],
        priority=data["priority"],
        due_date=data["due_date"],
        project_id=data["project_id"],
    )

    db.session.add(task)
    db.session.commit()

    return jsonify(task.to_dict()), 201


@tasks_bp.route("/<int:task_id>", methods=["PUT"])
@jwt_required()
def update_task(task_id):
    user_id = int(get_jwt_identity())
    task = Task.query.join(Project).filter(Task.id == task_id, Project.owner_id == user_id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404

    try:
        data = task_update_schema.load(request.get_json())
    except ValidationError as e:
        return jsonify({"errors": e.messages}), 400

    for key, value in data.items():
        setattr(task, key, value)

    db.session.commit()

    return jsonify(task.to_dict())


@tasks_bp.route("/<int:task_id>", methods=["DELETE"])
@jwt_required()
def delete_task(task_id):
    user_id = int(get_jwt_identity())
    task = Task.query.join(Project).filter(Task.id == task_id, Project.owner_id == user_id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404

    db.session.delete(task)
    db.session.commit()

    return "", 204
