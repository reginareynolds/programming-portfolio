import re
from sqlalchemy import text
from database import db

ALLOWED_TABLES = {"sales_records", "custom_data"}
STATEMENT_TIMEOUT_MS = 5000


def execute_readonly(sql: str):
    """Execute LLM-generated SQL in a read-only context with restrictions."""
    _validate_sql(sql)

    conn = db.engine.connect()
    try:
        conn = conn.execution_options(isolation_level="AUTOCOMMIT")
        conn.execute(text("BEGIN TRANSACTION READ ONLY"))
        conn.execute(text(f"SET LOCAL statement_timeout = '{STATEMENT_TIMEOUT_MS}'"))
        result = conn.execute(text(sql))
        columns = list(result.keys())
        rows = [dict(zip(columns, row)) for row in result.fetchall()]
        conn.execute(text("COMMIT"))
        return columns, rows
    except Exception:
        conn.execute(text("ROLLBACK"))
        raise
    finally:
        conn.close()


def _validate_sql(sql: str):
    """Reject anything that isn't a single SELECT on allowed tables."""
    normalized = sql.strip().rstrip(";")

    if not re.match(r"(?i)^\s*SELECT\b", normalized):
        raise ValueError("Only SELECT queries are permitted")

    dangerous = re.compile(
        r"\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|CREATE|GRANT|REVOKE|COPY|EXECUTE|DO|CALL)\b",
        re.IGNORECASE,
    )
    if dangerous.search(normalized):
        raise ValueError("Only SELECT queries are permitted")

    if ";" in normalized:
        raise ValueError("Multiple statements are not permitted")

    tables_referenced = set(
        re.findall(r"\bFROM\s+([a-z_][a-z0-9_]*)", normalized, re.IGNORECASE)
        + re.findall(r"\bJOIN\s+([a-z_][a-z0-9_]*)", normalized, re.IGNORECASE)
    )

    disallowed = tables_referenced - ALLOWED_TABLES
    if disallowed:
        raise ValueError(f"Access denied to table(s): {', '.join(disallowed)}")

    blocked_functions = re.compile(
        r"\b(pg_read_file|pg_read_binary_file|pg_ls_dir|pg_stat_file|lo_import|lo_export|dblink|copy)\s*\(",
        re.IGNORECASE,
    )
    if blocked_functions.search(normalized):
        raise ValueError("Restricted function call detected")
