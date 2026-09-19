from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.api import api_router
from app.api.websocket import ws_manager
from app.services.seed import seed_database_if_empty

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables if not exist and seed initial data
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database_if_empty(db)
    finally:
        db.close()
    yield
    # Shutdown: Clean up resources if needed

app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="Local-First FastAPI backend for AgniDry Smart Solar-Powered Drying & Compact Packaging System (SIH 2026).",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount REST API
app.include_router(api_router)

# Mount WebSocket endpoint
@app.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            # Keep connection open and accept ping/commands from client if any
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception:
        ws_manager.disconnect(websocket)

@app.get("/")
def root():
    return {
        "system": "AgniDry Local-First API",
        "version": settings.version,
        "status": "ONLINE",
        "device_id": settings.device_id,
        "docs": "/docs",
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": "OK"}
