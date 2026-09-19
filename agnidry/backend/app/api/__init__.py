from fastapi import APIRouter
from app.api.batches import router as batches_router
from app.api.telemetry import router as telemetry_router
from app.api.packaging import router as packaging_router
from app.api.alerts import router as alerts_router
from app.api.device import router as device_router

api_router = APIRouter()
api_router.include_router(batches_router)
api_router.include_router(telemetry_router)
api_router.include_router(packaging_router)
api_router.include_router(alerts_router)
api_router.include_router(device_router)

__all__ = ["api_router"]
