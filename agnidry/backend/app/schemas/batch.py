from typing import Optional, Literal
from pydantic import BaseModel, ConfigDict, Field

BatchStatusType = Literal['READY', 'DRYING', 'PAUSED', 'COMPLETED', 'FAILED', 'CANCELLED']

class BatchBase(BaseModel):
    batch_id: str = Field(..., description="Unique batch identifier, e.g., AG-2026-001")
    device_id: str = Field(default="AGNI-001")
    product_type: str = Field(..., description="Agarbatti aroma / product type")
    initial_weight: float = Field(..., gt=0, description="Raw wet weight in kg")
    current_weight: float = Field(..., gt=0, description="Current tray weight in kg")
    final_weight: Optional[float] = None
    target_moisture_loss_pct: Optional[float] = 36.0
    duration: Optional[str] = "0h 0m"
    status: BatchStatusType = "READY"
    notes: Optional[str] = ""

class BatchCreate(BaseModel):
    batch_id: Optional[str] = None
    device_id: Optional[str] = "AGNI-001"
    product_type: str
    initial_weight: float
    current_weight: Optional[float] = None
    target_moisture_loss_pct: Optional[float] = 36.0
    notes: Optional[str] = ""
    status: Optional[BatchStatusType] = "READY"

class BatchUpdate(BaseModel):
    product_type: Optional[str] = None
    current_weight: Optional[float] = None
    final_weight: Optional[float] = None
    status: Optional[BatchStatusType] = None
    duration: Optional[str] = None
    notes: Optional[str] = None
    end_time: Optional[str] = None

class BatchStatusUpdate(BaseModel):
    status: BatchStatusType

class BatchResponse(BatchBase):
    id: int
    start_time: str
    end_time: Optional[str] = None
    created_at: str
    updated_at: str

    model_config = ConfigDict(from_attributes=True)
