import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg
from psycopg.rows import dict_row
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
CLIENT_URL = os.getenv("CLIENT_URL", "http://localhost:5173")

app = FastAPI(title="Stats Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[CLIENT_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_conn():
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL not configured")
    return psycopg.connect(DATABASE_URL, row_factory=dict_row)

@app.get("/stats")
async def stats():
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT COUNT(*) AS total FROM tasks WHERE isdeleted=false;"
            )
            total = cur.fetchone()["total"]
            cur.execute(
                "SELECT COUNT(*) AS completed FROM tasks WHERE status='completed' AND isdeleted=false;"
            )
            completed = cur.fetchone()["completed"]
            cur.execute(
                "SELECT COUNT(*) AS pending FROM tasks WHERE status='pending' AND isdeleted=false;"
            )
            pending = cur.fetchone()["pending"]
    return {
        "total_tasks": total,
        "completed_tasks": completed,
        "pending_tasks": pending,
    }