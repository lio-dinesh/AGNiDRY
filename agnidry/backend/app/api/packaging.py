from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.packaging import PackagingModel
from app.models.batch import BatchModel
from app.schemas.packaging import PackagingCreate, PackagingResponse
from app.api.websocket import ws_manager

router = APIRouter(prefix="/api/packaging", tags=["packaging"])

def utc_now_str():
    return datetime.now(timezone.utc).isoformat()

@router.post("", response_model=PackagingResponse, status_code=201)
async def create_packaging_record(pkg_in: PackagingCreate, db: Session = Depends(get_db)):
    package_id = pkg_in.package_id or f"PKG-2026-{datetime.now().strftime('%M%S')}"

    # Check uniqueness
    existing = db.query(PackagingModel).filter(PackagingModel.package_id == package_id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Package ID '{package_id}' already exists")

    now = utc_now_str()
    record = PackagingModel(
        package_id=package_id,
        batch_id=pkg_in.batch_id,
        product_name=pkg_in.product_name,
        package_type=pkg_in.package_type,
        quantity=pkg_in.quantity,
        package_weight=pkg_in.package_weight,
        material=pkg_in.material or "Airtight Recycled Kraft Box",
        seal_status=pkg_in.seal_status,
        start_time=now,
        completion_time=now,
        notes=pkg_in.notes or "",
        artisan_name=pkg_in.artisan_name or "Lakshmi Devi",
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    await ws_manager.broadcast_json({
        "type": "PACKAGING_RECORD_CREATED",
        "package_id": record.package_id,
        "batch_id": record.batch_id,
        "seal_status": record.seal_status,
    })

    return record

@router.get("", response_model=List[PackagingResponse])
def list_packaging_records(
    batch_id: Optional[str] = Query(None, description="Filter by batch ID"),
    db: Session = Depends(get_db)
):
    query = db.query(PackagingModel)
    if batch_id:
        query = query.filter(PackagingModel.batch_id == batch_id)
    return query.order_by(PackagingModel.id.desc()).all()
