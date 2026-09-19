from typing import Optional
from pydantic import BaseModel, ConfigDict

class DeviceStatusResponse(BaseModel):
    device_id: str
    device_name: str
    firmware_version: str
    status: str
    last_seen: str
    max_temperature: float
    target_humidity: float
    min_battery_voltage: float
    is_live: bool = True

    model_config = ConfigDict(from_attributes=True)

class ThresholdUpdateRequest(BaseModel):
    max_temperature: Optional[float] = None
    target_humidity: Optional[float] = None
    min_battery_voltage: Optional[float] = None
