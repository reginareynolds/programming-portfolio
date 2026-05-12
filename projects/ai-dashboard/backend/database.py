from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect

db = SQLAlchemy()


def init_db(app):
    db.init_app(app)
    with app.app_context():
        inspector = inspect(db.engine)
        if not inspector.has_table("sales_records"):
            db.create_all()
