import pandas as pd
from sqlalchemy import text

from database import db
from models import Dataset


def process_csv_upload(file) -> dict:
    df = pd.read_csv(file)

    if len(df) > 10000:
        raise ValueError("CSV must have 10,000 rows or fewer")
    if len(df.columns) > 30:
        raise ValueError("CSV must have 30 columns or fewer")

    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

    db.session.execute(text("DROP TABLE IF EXISTS custom_data"))
    db.session.commit()

    type_map = {}
    for col in df.columns:
        if pd.api.types.is_integer_dtype(df[col]):
            type_map[col] = "numeric"
        elif pd.api.types.is_float_dtype(df[col]):
            type_map[col] = "numeric"
        elif pd.api.types.is_datetime64_any_dtype(df[col]):
            type_map[col] = "date"
        else:
            try:
                pd.to_datetime(df[col], format="mixed")
                type_map[col] = "date"
                df[col] = pd.to_datetime(df[col], format="mixed")
            except (ValueError, TypeError):
                type_map[col] = "categorical" if df[col].nunique() < 50 else "text"

    df.to_sql("custom_data", db.engine, if_exists="replace", index=False)

    existing = Dataset.query.filter_by(name="User Upload", is_demo=False).first()
    if existing:
        existing.columns_metadata = type_map
        existing.description = f"User-uploaded CSV with {len(df)} rows and {len(df.columns)} columns."
    else:
        dataset = Dataset(
            name="User Upload",
            description=f"User-uploaded CSV with {len(df)} rows and {len(df.columns)} columns.",
            is_demo=False,
            columns_metadata=type_map,
        )
        db.session.add(dataset)

    db.session.commit()

    schema_str = "\n".join(f"  {col}: {dtype}" for col, dtype in type_map.items())
    return {
        "rows": len(df),
        "columns": list(df.columns),
        "types": type_map,
        "schema_str": schema_str,
        "preview": df.head(5).to_dict(orient="records"),
    }
