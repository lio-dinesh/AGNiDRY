from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.device import DeviceModel
from app.schemas.device import DeviceStatusResponse, ThresholdUpdateRequest

router = APIRouter(prefix="/api/device", tags=["device"])

def utc_now_str():
    return datetime.now(timezone.utc).isoformat()

def get_or_create_default_device(db: Session) -> DeviceModel:
    device = db.query(DeviceModel).filter(DeviceModel.device_id == "AGNI-001").first()
    if not device:
        device = DeviceModel(
            device_id="AGNI-001",
            device_name="AgniDry Prototype Chamber #1",
            firmware_version="v1.0.0-proto",
            status="ONLINE",
            last_seen=utc_now_str(),
            max_temperature=55.0,
            target_humidity=40.0,
            min_battery_voltage=11.8,
        )
        db.add(device)
        db.commit()
        db.refresh(device)
    return device

@router.get("/status", response_model=DeviceStatusResponse)
def get_device_status(db: Session = Depends(get_db)):
    device = get_or_create_default_device(db)
    device.last_seen = utc_now_str()
    db.commit()

    return DeviceStatusResponse(
        device_id=device.device_id,
        device_name=device.device_name,
        firmware_version=device.firmware_version,
        status=device.status,
        last_seen=device.last_seen,
        max_temperature=device.max_temperature,
        target_humidity=device.target_humidity,
        min_battery_voltage=device.min_battery_voltage,
        is_live=True,
    )

@router.patch("/thresholds", response_model=DeviceStatusResponse)
def update_thresholds(req: ThresholdUpdateRequest, db: Session = Depends(get_db)):
    device = get_or_create_default_device(db)
    if req.max_temperature is not None:
        device.max_temperature = req.max_temperature
    if req.target_humidity is not None:
        device.target_humidity = req.target_humidity
    if req.min_battery_voltage is not None:
        device.min_battery_voltage = req.min_battery_voltage

    db.commit()
    db.refresh(device)

    return DeviceStatusResponse(
        device_id=device.device_id,
        device_name=device.device_name,
        firmware_version=device.firmware_version,
        status=device.status,
        last_seen=device.last_seen,
        max_temperature=device.max_temperature,
        target_humidity=device.target_humidity,
        min_battery_voltage=device.min_battery_voltage,
        is_live=True,
    )
