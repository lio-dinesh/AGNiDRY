from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.telemetry import TelemetryModel
from app.models.batch import BatchModel
from app.schemas.telemetry import TelemetryCreate, TelemetryResponse
from app.api.websocket import ws_manager

router = APIRouter(prefix="/api/telemetry", tags=["telemetry"])

def utc_now_str():
    return datetime.now(timezone.utc).isoformat()

@router.post("", response_model=TelemetryResponse, status_code=201)
async def submit_telemetry(telemetry_in: TelemetryCreate, db: Session = Depends(get_db)):
    t_timestamp = telemetry_in.timestamp or utc_now_str()

    telemetry = TelemetryModel(
        device_id=telemetry_in.device_id or "AGNI-001",
        batch_id=telemetry_in.batch_id,
        timestamp=t_timestamp,
        temperature=telemetry_in.temperature,
        humidity=telemetry_in.humidity,
        weight=telemetry_in.weight,
        battery_voltage=telemetry_in.battery_voltage if telemetry_in.battery_voltage is not None else 12.6,
        battery_percentage=telemetry_in.battery_percentage if telemetry_in.battery_percentage is not None else 85.0,
        solar_status=telemetry_in.solar_status if telemetry_in.solar_status is not None else True,
        fan_status=telemetry_in.fan_status if telemetry_in.fan_status is not None else True,
        heater_status=telemetry_in.heater_status if telemetry_in.heater_status is not None else False,
        vent_status=telemetry_in.vent_status if telemetry_in.vent_status is not None else False,
    )
    db.add(telemetry)

    # Also update current weight on the matching batch if exists
    batch = db.query(BatchModel).filter(BatchModel.batch_id == telemetry_in.batch_id).first()
    if batch:
        batch.current_weight = telemetry_in.weight
        # If target weight reached, auto-mark completed
        target_wt = batch.initial_weight * (1.0 - (batch.target_moisture_loss_pct or 36.0) / 100.0)
        if batch.status == "DRYING" and batch.current_weight <= target_wt:
            batch.status = "COMPLETED"
            batch.end_time = t_timestamp
            batch.final_weight = batch.current_weight

    db.commit()
    db.refresh(telemetry)

    # Broadcast live sensor reading to all connected WebSocket clients
    telemetry_dict = {
        "type": "LIVE_TELEMETRY",
        "data": {
            "id": telemetry.id,
            "device_id": telemetry.device_id,
            "batch_id": telemetry.batch_id,
            "timestamp": telemetry.timestamp,
            "temperature": telemetry.temperature,
            "humidity": telemetry.humidity,
            "weight": telemetry.weight,
            "battery_voltage": telemetry.battery_voltage,
            "battery_percentage": telemetry.battery_percentage,
            "solar_status": telemetry.solar_status,
            "fan_status": telemetry.fan_status,
            "heater_status": telemetry.heater_status,
            "vent_status": telemetry.vent_status,
        }
    }
    await ws_manager.broadcast_json(telemetry_dict)

    return telemetry

@router.get("/latest", response_model=Optional[TelemetryResponse])
def get_latest_telemetry(db: Session = Depends(get_db)):
    latest = db.query(TelemetryModel).order_by(TelemetryModel.id.desc()).first()
    return latest

@router.get("/{batch_id}", response_model=List[TelemetryResponse])
def get_batch_telemetry(
    batch_id: str,
    limit: int = Query(200, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    records = (
        db.query(TelemetryModel)
        .filter(TelemetryModel.batch_id == batch_id)
        .order_by(TelemetryModel.id.asc())
        .limit(limit)
        .all()
    )
    return records
