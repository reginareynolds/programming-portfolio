from database import db


class Dataset(db.Model):
    __tablename__ = "datasets"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    is_demo = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    columns_metadata = db.Column(db.JSON)
    session_id = db.Column(db.String(36), index=True)
    table_name = db.Column(db.String(100))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "is_demo": self.is_demo,
            "created_at": self.created_at.isoformat(),
            "columns_metadata": self.columns_metadata,
        }


class SalesRecord(db.Model):
    """Dynamic table for the demo sales dataset."""
    __tablename__ = "sales_records"

    id = db.Column(db.Integer, primary_key=True)
    order_date = db.Column(db.Date, nullable=False)
    region = db.Column(db.String(50), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    product = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    total_revenue = db.Column(db.Float, nullable=False)
    customer_segment = db.Column(db.String(100), nullable=False)
    shipping_cost = db.Column(db.Float, nullable=False)
    profit = db.Column(db.Float, nullable=False)
