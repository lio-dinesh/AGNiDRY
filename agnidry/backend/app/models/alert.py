from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, Text
from app.database import Base

def utc_now_str():
    return datetime.now(timezone.utc).isoformat()

class AlertModel(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    alert_id = Column(String(64), unique=True, index=True, nullable=False)
    device_id = Column(String(64), default="AGNI-001", index=True, nullable=False)
    batch_id = Column(String(64), nullable=True)
    type = Column(String(64), nullable=False)        # HIGH_TEMPERATURE, HIGH_HUMIDITY, LOW_BATTERY, etc.
    severity = Column(String(16), default="INFO", nullable=False) # INFO, WARNING, CRITICAL
    message = Column(Text, nullable=False)
    timestamp = Column(String(64), default=utc_now_str, index=True, nullable=False)
    acknowledged = Column(Boolean, default=False, nullable=False)
