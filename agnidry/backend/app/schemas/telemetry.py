from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class TelemetryCreate(BaseModel):
    device_id: Optional[str] = "AGNI-001"
    batch_id: str
    temperature: float = Field(..., description="Chamber temperature in °C")
    humidity: float = Field(..., description="Chamber relative humidity in %")
    weight: float = Field(..., description="Tray weight in kg")
    battery_voltage: Optional[float] = 12.6
    battery_percentage: Optional[float] = 85.0
    solar_status: Optional[bool] = True
    fan_status: Optional[bool] = True
    heater_status: Optional[bool] = False
    vent_status: Optional[bool] = False
    timestamp: Optional[str] = None

class TelemetryResponse(BaseModel):
    id: int
    device_id: str
    batch_id: str
    timestamp: str
    temperature: float
    humidity: float
    weight: float
    battery_voltage: float
    battery_percentage: float
    solar_status: bool
    fan_status: bool
    heater_status: bool
    vent_status: bool

    model_config = ConfigDict(from_attributes=True)
