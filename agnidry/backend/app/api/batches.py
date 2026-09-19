from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.batch import BatchModel
from app.schemas.batch import BatchCreate, BatchUpdate, BatchStatusUpdate, BatchResponse
from app.api.websocket import ws_manager

router = APIRouter(prefix="/api/batches", tags=["batches"])

def utc_now_str():
    return datetime.now(timezone.utc).isoformat()

@router.post("", response_model=BatchResponse, status_code=201)
async def create_batch(batch_in: BatchCreate, db: Session = Depends(get_db)):
    batch_id = batch_in.batch_id or f"AG-2026-{datetime.now().strftime('%M%S')}"
    
    # Check if already exists
    existing = db.query(BatchModel).filter(BatchModel.batch_id == batch_id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Batch with ID '{batch_id}' already exists")

    curr_wt = batch_in.current_weight if batch_in.current_weight is not None else batch_in.initial_weight

    batch = BatchModel(
        batch_id=batch_id,
        device_id=batch_in.device_id or "AGNI-001",
        product_type=batch_in.product_type,
        initial_weight=batch_in.initial_weight,
        current_weight=curr_wt,
        target_moisture_loss_pct=batch_in.target_moisture_loss_pct or 36.0,
        status=batch_in.status or "READY",
        notes=batch_in.notes or "",
        start_time=utc_now_str(),
        duration="0h 0m",
    )
    db.add(batch)
    db.commit()
    db.refresh(batch)

    # Broadcast event via websocket
    await ws_manager.broadcast_json({
        "type": "BATCH_CREATED",
        "batch_id": batch.batch_id,
        "status": batch.status,
    })

    return batch

@router.get("", response_model=List[BatchResponse])
def list_batches(
    status: Optional[str] = Query(None, description="Filter by status, e.g., DRYING, COMPLETED"),
    db: Session = Depends(get_db)
):
    query = db.query(BatchModel)
    if status and status != "ALL":
        query = query.filter(BatchModel.status == status)
    return query.order_by(BatchModel.id.desc()).all()

@router.get("/{batch_id}", response_model=BatchResponse)
def get_batch(batch_id: str, db: Session = Depends(get_db)):
    batch = db.query(BatchModel).filter(BatchModel.batch_id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail=f"Batch '{batch_id}' not found")
    return batch

@router.patch("/{batch_id}/status", response_model=BatchResponse)
async def update_batch_status(
    batch_id: str,
    status_update: BatchStatusUpdate,
    db: Session = Depends(get_db)
):
    batch = db.query(BatchModel).filter(BatchModel.batch_id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail=f"Batch '{batch_id}' not found")

    batch.status = status_update.status
    if status_update.status in ("COMPLETED", "FAILED", "CANCELLED") and not batch.end_time:
        batch.end_time = utc_now_str()
        if not batch.final_weight:
            batch.final_weight = batch.current_weight

    db.commit()
    db.refresh(batch)

    await ws_manager.broadcast_json({
        "type": "BATCH_STATUS_UPDATED",
        "batch_id": batch.batch_id,
        "status": batch.status,
    })

    return batch

@router.patch("/{batch_id}", response_model=BatchResponse)
async def update_batch(
    batch_id: str,
    batch_update: BatchUpdate,
    db: Session = Depends(get_db)
):
    batch = db.query(BatchModel).filter(BatchModel.batch_id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail=f"Batch '{batch_id}' not found")

    update_data = batch_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(batch, field, value)

    db.commit()
    db.refresh(batch)

    await ws_manager.broadcast_json({
        "type": "BATCH_UPDATED",
        "batch_id": batch.batch_id,
        "status": batch.status,
        "current_weight": batch.current_weight,
    })

    return batch
