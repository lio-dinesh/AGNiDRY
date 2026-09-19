from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, Index
from app.database import Base

def utc_now_str():
    return datetime.now(timezone.utc).isoformat()

class TelemetryModel(Base):
    __tablename__ = "telemetry"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    device_id = Column(String(64), default="AGNI-001", index=True, nullable=False)
    batch_id = Column(String(64), index=True, nullable=False)
    timestamp = Column(String(64), default=utc_now_str, index=True, nullable=False)
    temperature = Column(Float, nullable=False)          # °C (chamber air temp)
    humidity = Column(Float, nullable=False)             # % RH (chamber relative humidity)
    weight = Column(Float, nullable=False)               # kg (tray load cell reading)
    battery_voltage = Column(Float, default=12.6)        # Volts
    battery_percentage = Column(Float, default=85.0)     # % SoC
    solar_status = Column(Boolean, default=True)         # True = generating
    fan_status = Column(Boolean, default=True)           # True = running
    heater_status = Column(Boolean, default=False)       # True = heating
    vent_status = Column(Boolean, default=False)         # True = open

    __table_args__ = (
        Index("idx_batch_timestamp", "batch_id", "timestamp"),
    )
