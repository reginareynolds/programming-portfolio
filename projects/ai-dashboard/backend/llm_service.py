from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
import json
import re

from config import Config

SYSTEM_PROMPT = """You are a SQL analyst. Given a user's natural language question about a dataset, generate a PostgreSQL query to answer it.

The database has a table called `sales_records` with these columns:
{schema}

If the user uploaded a custom CSV, the table is called `custom_data` with these columns:
{custom_schema}

Rules:
- Return ONLY a JSON object with two keys: "sql" (the query) and "chart_type" (one of: "bar", "line", "pie", "table", "number").
- Choose "number" for single-value answers (totals, averages, counts).
- Choose "line" for time-series data.
- Choose "pie" for proportion/distribution queries with few categories.
- Choose "bar" for comparisons across categories.
- Choose "table" for multi-column results that don't fit a chart.
- Use only SELECT statements. Never use INSERT, UPDATE, DELETE, DROP, ALTER, or any DDL/DML.
- Alias columns with readable names using AS.
- Limit results to 50 rows max.
- Use the correct table based on context. Default to sales_records unless the user references their uploaded data."""

SALES_SCHEMA = """  id: integer (primary key)
  order_date: date
  region: text (North America, Europe, Asia Pacific, Latin America)
  category: text (Electronics, Furniture, Office Supplies, Software)
  product: text
  quantity: integer
  unit_price: float
  total_revenue: float
  customer_segment: text (Enterprise, Small Business, Consumer, Government)
  shipping_cost: float
  profit: float"""


def get_llm():
    return ChatGroq(
        api_key=Config.GROQ_API_KEY,
        model=Config.GROQ_MODEL,
        temperature=0,
    )


def generate_sql(question: str, custom_schema: str = "No custom data uploaded.") -> dict:
    llm = get_llm()

    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        ("human", "{question}"),
    ])

    chain = prompt | llm | StrOutputParser()

    response = chain.invoke({
        "question": question,
        "schema": SALES_SCHEMA,
        "custom_schema": custom_schema,
    })

    match = re.search(r'\{[^}]+\}', response, re.DOTALL)
    if not match:
        raise ValueError("LLM did not return valid JSON")

    result = json.loads(match.group())

    sql = result.get("sql", "").strip().upper()
    if any(keyword in sql for keyword in ["INSERT", "UPDATE", "DELETE", "DROP", "ALTER", "TRUNCATE", "CREATE"]):
        raise ValueError("Only SELECT queries are permitted")

    return result
