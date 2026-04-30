import random
from datetime import date, timedelta

from database import db
from models import Dataset, SalesRecord

REGIONS = ["North America", "Europe", "Asia Pacific", "Latin America"]
CATEGORIES = {
    "Electronics": ["Laptop", "Smartphone", "Tablet", "Monitor", "Headphones"],
    "Furniture": ["Desk", "Chair", "Bookshelf", "Filing Cabinet", "Table"],
    "Office Supplies": ["Paper", "Pens", "Binder", "Stapler", "Tape"],
    "Software": ["Antivirus", "Productivity Suite", "Cloud Storage", "VPN", "Design Tool"],
}
SEGMENTS = ["Enterprise", "Small Business", "Consumer", "Government"]


def seed_demo_data():
    if SalesRecord.query.first():
        return

    random.seed(42)
    start_date = date(2023, 1, 1)
    records = []

    for i in range(500):
        category = random.choice(list(CATEGORIES.keys()))
        product = random.choice(CATEGORIES[category])
        quantity = random.randint(1, 50)
        unit_price = round(random.uniform(10, 2000), 2)
        total_revenue = round(quantity * unit_price, 2)
        shipping = round(random.uniform(5, 150), 2)
        profit = round(total_revenue - shipping - (total_revenue * random.uniform(0.2, 0.6)), 2)

        records.append(
            SalesRecord(
                order_date=start_date + timedelta(days=random.randint(0, 729)),
                region=random.choice(REGIONS),
                category=category,
                product=product,
                quantity=quantity,
                unit_price=unit_price,
                total_revenue=total_revenue,
                customer_segment=random.choice(SEGMENTS),
                shipping_cost=shipping,
                profit=profit,
            )
        )

    db.session.add_all(records)

    demo_dataset = Dataset(
        name="Sample Sales Data",
        description="500 synthetic sales records spanning 2023-2024 across 4 regions, 4 categories, and 4 customer segments.",
        is_demo=True,
        columns_metadata={
            "order_date": "date",
            "region": "categorical",
            "category": "categorical",
            "product": "categorical",
            "quantity": "numeric",
            "unit_price": "numeric",
            "total_revenue": "numeric",
            "customer_segment": "categorical",
            "shipping_cost": "numeric",
            "profit": "numeric",
        },
    )
    db.session.add(demo_dataset)
    db.session.commit()
