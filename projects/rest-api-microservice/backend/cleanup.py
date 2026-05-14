from datetime import datetime, timezone, timedelta
from app import create_app, db
from app.models import User

app = create_app()

with app.app_context():
    cutoff = datetime.now(timezone.utc) - timedelta(hours=24)
    stale = User.query.filter(User.created_at < cutoff).all()
    count = len(stale)
    for user in stale:
        db.session.delete(user)
    db.session.commit()
    print(f"Purged {count} users older than 24 hours")
