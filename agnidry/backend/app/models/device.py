from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float
from app.database import Base

def utc_now_str():
    return datetime.now(timezone.utc).isoformat()

class DeviceModel(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    device_id = Column(String(64), unique=True, index=True, nullable=False)
    device_name = Column(String(128), default="AgniDry Prototype Chamber #1", nullable=False)
    firmware_version = Column(String(64), default="v1.0.0-proto", nullable=False)
    status = Column(String(32), default="ONLINE", nullable=False) # ONLINE, OFFLINE, SIMULATED
    last_seen = Column(String(64), default=utc_now_str, nullable=False)
    max_temperature = Column(Float, default=55.0, nullable=False)
    target_humidity = Column(Float, default=40.0, nullable=False)
    min_battery_voltage = Column(Float, default=11.8, nullable=False)
