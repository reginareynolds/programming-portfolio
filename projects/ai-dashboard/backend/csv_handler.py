import re
import pandas as pd
from sqlalchemy import text

from database import db
from models import Dataset


def _sanitize_table_name(session_id: str) -> str:
    """Ensure session_id produces a safe table name."""
    cleaned = re.sub(r"[^a-z0-9]", "", session_id.lower())
    return f"custom_data_{cleaned[:32]}"


def process_csv_upload(file, session_id: str) -> dict:
    df = pd.read_csv(file)

    if len(df) > 10000:
        raise ValueError("CSV must have 10,000 rows or fewer")
    if len(df.columns) > 30:
        raise ValueError("CSV must have 30 columns or fewer")

    df.columns = [re.sub(r"[^a-z0-9_]", "", c.strip().lower().replace(" ", "_")) for c in df.columns]

    table_name = _sanitize_table_name(session_id)

    db.session.execute(text(f'DROP TABLE IF EXISTS "{table_name}"'))
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

    df.to_sql(table_name, db.engine, if_exists="replace", index=False)

    existing = Dataset.query.filter_by(session_id=session_id, is_demo=False).first()
    if existing:
        existing.columns_metadata = type_map
        existing.table_name = table_name
        existing.description = f"User-uploaded CSV with {len(df)} rows and {len(df.columns)} columns."
        existing.created_at = db.func.now()
    else:
        dataset = Dataset(
            name="User Upload",
            description=f"User-uploaded CSV with {len(df)} rows and {len(df.columns)} columns.",
            is_demo=False,
            columns_metadata=type_map,
            session_id=session_id,
            table_name=table_name,
        )
        db.session.add(dataset)

    db.session.commit()

    return {
        "rows": len(df),
        "columns": list(df.columns),
        "types": type_map,
        "table_name": table_name,
        "preview": df.head(5).to_dict(orient="records"),
    }
