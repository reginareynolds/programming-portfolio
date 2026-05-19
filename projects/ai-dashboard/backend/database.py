from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect, text

db = SQLAlchemy()


def init_db(app):
    db.init_app(app)
    with app.app_context():
        inspector = inspect(db.engine)
        if not inspector.has_table("sales_records"):
            db.create_all()
        else:
            columns = {c["name"] for c in inspector.get_columns("datasets")}
            with db.engine.connect() as conn:
                if "session_id" not in columns:
                    conn.execute(text("ALTER TABLE datasets ADD COLUMN session_id VARCHAR(36)"))
                    conn.execute(text("CREATE INDEX ix_datasets_session_id ON datasets (session_id)"))
                if "table_name" not in columns:
                    conn.execute(text("ALTER TABLE datasets ADD COLUMN table_name VARCHAR(100)"))
                conn.commit()
