from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import text

from config import Config
from database import db, init_db
from demo_data import seed_demo_data
from csv_handler import process_csv_upload
from llm_service import generate_sql


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    init_db(app)

    with app.app_context():
        seed_demo_data()

    return app


app = create_app()

custom_schema_cache = {"schema_str": "No custom data uploaded."}


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/api/datasets", methods=["GET"])
def list_datasets():
    from models import Dataset
    datasets = Dataset.query.all()
    return jsonify([d.to_dict() for d in datasets])


@app.route("/api/upload", methods=["POST"])
def upload_csv():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if not file.filename.endswith(".csv"):
        return jsonify({"error": "Only CSV files are supported"}), 400

    try:
        result = process_csv_upload(file)
        custom_schema_cache["schema_str"] = result["schema_str"]
        return jsonify({
            "message": f"Uploaded {result['rows']} rows with {len(result['columns'])} columns",
            "columns": result["columns"],
            "types": result["types"],
            "preview": result["preview"],
        })
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Failed to process CSV: {str(e)}"}), 500


@app.route("/api/query", methods=["POST"])
def query_data():
    data = request.get_json()
    if not data or "question" not in data:
        return jsonify({"error": "Please provide a question"}), 400

    question = data["question"].strip()
    if not question:
        return jsonify({"error": "Question cannot be empty"}), 400

    try:
        llm_result = generate_sql(question, custom_schema_cache["schema_str"])
        sql = llm_result["sql"]
        chart_type = llm_result.get("chart_type", "table")

        result = db.session.execute(text(sql))
        columns = list(result.keys())
        rows = [dict(zip(columns, row)) for row in result.fetchall()]

        return jsonify({
            "question": question,
            "sql": sql,
            "chart_type": chart_type,
            "columns": columns,
            "data": rows,
            "row_count": len(rows),
        })
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Query failed: {str(e)}"}), 500


@app.route("/api/demo/summary", methods=["GET"])
def demo_summary():
    try:
        stats = {}

        result = db.session.execute(text("SELECT COUNT(*) FROM sales_records"))
        stats["total_orders"] = result.scalar()

        result = db.session.execute(text("SELECT SUM(total_revenue) FROM sales_records"))
        stats["total_revenue"] = round(result.scalar() or 0, 2)

        result = db.session.execute(text("SELECT SUM(profit) FROM sales_records"))
        stats["total_profit"] = round(result.scalar() or 0, 2)

        result = db.session.execute(text("SELECT AVG(total_revenue) FROM sales_records"))
        stats["avg_order_value"] = round(result.scalar() or 0, 2)

        result = db.session.execute(text(
            "SELECT region, SUM(total_revenue) as revenue FROM sales_records GROUP BY region ORDER BY revenue DESC"
        ))
        stats["revenue_by_region"] = [dict(zip(["region", "revenue"], row)) for row in result.fetchall()]

        result = db.session.execute(text(
            "SELECT category, SUM(total_revenue) as revenue FROM sales_records GROUP BY category ORDER BY revenue DESC"
        ))
        stats["revenue_by_category"] = [dict(zip(["category", "revenue"], row)) for row in result.fetchall()]

        result = db.session.execute(text("""
            SELECT DATE_TRUNC('month', order_date) as month, SUM(total_revenue) as revenue
            FROM sales_records GROUP BY month ORDER BY month
        """))
        stats["monthly_revenue"] = [
            {"month": row[0].isoformat(), "revenue": round(row[1], 2)} for row in result.fetchall()
        ]

        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
