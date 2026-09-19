from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from app.database import Base

def utc_now_str():
    return datetime.now(timezone.utc).isoformat()

class BatchModel(Base):
    __tablename__ = "batches"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    batch_id = Column(String(64), unique=True, index=True, nullable=False)
    device_id = Column(String(64), default="AGNI-001", nullable=False)
    product_type = Column(String(128), nullable=False)  # e.g., "Mogra Agarbatti", "Sandalwood"
    initial_weight = Column(Float, nullable=False)      # in kg (e.g., 2.00)
    current_weight = Column(Float, nullable=False)      # in kg (e.g., 1.28)
    final_weight = Column(Float, nullable=True)         # in kg when complete
    target_moisture_loss_pct = Column(Float, default=36.0) # target % drop
    start_time = Column(String(64), default=utc_now_str, nullable=False)
    end_time = Column(String(64), nullable=True)
    duration = Column(String(64), default="0h 0m")
    status = Column(String(32), default="READY", index=True, nullable=False) # READY, DRYING, PAUSED, COMPLETED, FAILED, CANCELLED
    notes = Column(Text, default="", nullable=False)
    created_at = Column(String(64), default=utc_now_str, nullable=False)
    updated_at = Column(String(64), default=utc_now_str, onupdate=utc_now_str, nullable=False)
