from typing import Optional, Literal
from pydantic import BaseModel, ConfigDict, Field

PackageFormatType = Literal['POUCH_50G', 'BOX_100G', 'BUNDLE_250G', 'BULK_1KG']
SealStatusType = Literal['SUCCESS', 'FAILED', 'PENDING']

class PackagingCreate(BaseModel):
    package_id: Optional[str] = None
    batch_id: str
    product_name: str
    package_type: PackageFormatType = "BOX_100G"
    quantity: int = Field(default=50, gt=0)
    package_weight: float = Field(default=100.0, gt=0)
    material: Optional[str] = "Airtight Recycled Kraft Box"
    seal_status: SealStatusType = "SUCCESS"
    notes: Optional[str] = ""
    artisan_name: Optional[str] = "Lakshmi Devi"

class PackagingResponse(BaseModel):
    id: int
    package_id: str
    batch_id: str
    product_name: str
    package_type: str
    quantity: int
    package_weight: float
    material: str
    seal_status: str
    start_time: str
    completion_time: str
    notes: str
    artisan_name: str
    created_at: str

    model_config = ConfigDict(from_attributes=True)
