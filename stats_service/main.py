import os
from fastapi import FastAPI, Request, HTTPException
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
async def stats(request: Request):
    with get_conn() as conn:
        user_id = request.headers.get("x-user-id")
        if not user_id:
            raise HTTPException(status_code=400, detail="Missing X-User-ID header")
        try:
            uid = int(user_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid X-User-ID header")
        
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT COUNT(*) AS total,
                    COUNT(*) FILTER (WHERE t.status='completed') AS completed,
                    COUNT(*) FILTER (WHERE t.status='pending') AS pending
                FROM tasks t
                JOIN lists l ON t.list_id = l.id
                WHERE l.user_id = %s AND t.isdeleted=false;
                """,
                (uid,),
            )
            row = cur.fetchone()
            
            return {
        "total_tasks": row["total"],
        "completed_tasks": row["completed"],
        "pending_tasks": row["pending"],
    }