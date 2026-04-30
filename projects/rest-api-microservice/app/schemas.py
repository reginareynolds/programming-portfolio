from marshmallow import Schema, fields, validate


class RegisterSchema(Schema):
    username = fields.Str(required=True, validate=validate.Length(min=3, max=80))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))


class LoginSchema(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True)


class ProjectSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    description = fields.Str(load_default="")


class TaskSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    description = fields.Str(load_default="")
    status = fields.Str(
        load_default="todo",
        validate=validate.OneOf(["todo", "in_progress", "done"]),
    )
    priority = fields.Str(
        load_default="medium",
        validate=validate.OneOf(["low", "medium", "high"]),
    )
    due_date = fields.Date(load_default=None)
    project_id = fields.Int(required=True)


class TaskUpdateSchema(Schema):
    title = fields.Str(validate=validate.Length(min=1, max=200))
    description = fields.Str()
    status = fields.Str(validate=validate.OneOf(["todo", "in_progress", "done"]))
    priority = fields.Str(validate=validate.OneOf(["low", "medium", "high"]))
    due_date = fields.Date(allow_none=True)
