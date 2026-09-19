from typing import Optional, Literal
from pydantic import BaseModel, ConfigDict

AlertSeverityType = Literal['INFO', 'WARNING', 'CRITICAL']

class AlertCreate(BaseModel):
    alert_id: Optional[str] = None
    device_id: Optional[str] = "AGNI-001"
    batch_id: Optional[str] = None
    type: str
    severity: AlertSeverityType = "INFO"
    message: str

class AlertResponse(BaseModel):
    id: int
    alert_id: str
    device_id: str
    batch_id: Optional[str] = None
    type: str
    severity: str
    message: str
    timestamp: str
    acknowledged: bool

    model_config = ConfigDict(from_attributes=True)
