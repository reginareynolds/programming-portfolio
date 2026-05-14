from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError

from app import db
from app.models import Project
from app.schemas import ProjectSchema

projects_bp = Blueprint("projects", __name__)

project_schema = ProjectSchema()


@projects_bp.route("", methods=["GET"])
@jwt_required()
def list_projects():
    user_id = int(get_jwt_identity())
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    per_page = min(per_page, 100)

    query = Project.query.filter_by(owner_id=user_id).order_by(Project.updated_at.desc())
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "projects": [p.to_dict() for p in pagination.items],
        "total": pagination.total,
        "page": pagination.page,
        "pages": pagination.pages,
    })


@projects_bp.route("/<int:project_id>", methods=["GET"])
@jwt_required()
def get_project(project_id):
    user_id = int(get_jwt_identity())
    project = Project.query.filter_by(id=project_id, owner_id=user_id).first()
    if not project:
        return jsonify({"error": "Project not found"}), 404
    return jsonify(project.to_dict(include_tasks=True))


@projects_bp.route("", methods=["POST"])
@jwt_required()
def create_project():
    try:
        data = project_schema.load(request.get_json())
    except ValidationError as e:
        return jsonify({"errors": e.messages}), 400

    user_id = int(get_jwt_identity())

    if Project.query.filter_by(owner_id=user_id).count() >= 20:
        return jsonify({"error": "Project limit reached (max 20)"}), 400

    project = Project(name=data["name"], description=data["description"], owner_id=user_id)

    db.session.add(project)
    db.session.commit()

    return jsonify(project.to_dict()), 201


@projects_bp.route("/<int:project_id>", methods=["PUT"])
@jwt_required()
def update_project(project_id):
    user_id = int(get_jwt_identity())
    project = Project.query.filter_by(id=project_id, owner_id=user_id).first()
    if not project:
        return jsonify({"error": "Project not found"}), 404

    try:
        data = project_schema.load(request.get_json())
    except ValidationError as e:
        return jsonify({"errors": e.messages}), 400

    project.name = data["name"]
    project.description = data["description"]
    db.session.commit()

    return jsonify(project.to_dict())


@projects_bp.route("/<int:project_id>", methods=["DELETE"])
@jwt_required()
def delete_project(project_id):
    user_id = int(get_jwt_identity())
    project = Project.query.filter_by(id=project_id, owner_id=user_id).first()
    if not project:
        return jsonify({"error": "Project not found"}), 404

    db.session.delete(project)
    db.session.commit()

    return "", 204
