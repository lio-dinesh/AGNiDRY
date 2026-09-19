from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Text
from app.database import Base

def utc_now_str():
    return datetime.now(timezone.utc).isoformat()

class PackagingModel(Base):
    __tablename__ = "packaging_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    package_id = Column(String(64), unique=True, index=True, nullable=False)
    batch_id = Column(String(64), index=True, nullable=False)
    product_name = Column(String(128), nullable=False)
    package_type = Column(String(32), default="BOX_100G", nullable=False) # POUCH_50G, BOX_100G, BUNDLE_250G, BULK_1KG
    quantity = Column(Integer, default=50, nullable=False)
    package_weight = Column(Float, default=100.0, nullable=False) # grams
    material = Column(String(128), default="Airtight Recycled Kraft Box", nullable=False)
    seal_status = Column(String(32), default="SUCCESS", nullable=False) # SUCCESS, FAILED, PENDING
    start_time = Column(String(64), default=utc_now_str, nullable=False)
    completion_time = Column(String(64), default=utc_now_str, nullable=False)
    notes = Column(Text, default="", nullable=False)
    artisan_name = Column(String(128), default="Lakshmi Devi", nullable=False)
    created_at = Column(String(64), default=utc_now_str, nullable=False)
