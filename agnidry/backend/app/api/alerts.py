from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.alert import AlertModel
from app.schemas.alert import AlertCreate, AlertResponse
from app.api.websocket import ws_manager

router = APIRouter(prefix="/api/alerts", tags=["alerts"])

def utc_now_str():
    return datetime.now(timezone.utc).isoformat()

@router.get("", response_model=List[AlertResponse])
def list_alerts(
    severity: Optional[str] = Query(None, description="Filter by severity, e.g. CRITICAL, WARNING, INFO"),
    unacknowledged_only: bool = Query(False, description="Filter unacknowledged only"),
    db: Session = Depends(get_db)
):
    query = db.query(AlertModel)
    if severity and severity != "ALL":
        query = query.filter(AlertModel.severity == severity)
    if unacknowledged_only:
        query = query.filter(AlertModel.acknowledged == False) # noqa: E712
    return query.order_by(AlertModel.id.desc()).all()

@router.post("", response_model=AlertResponse, status_code=201)
async def create_alert(alert_in: AlertCreate, db: Session = Depends(get_db)):
    alert_id = alert_in.alert_id or f"ALT-{datetime.now().strftime('%M%S')}"

    alert = AlertModel(
        alert_id=alert_id,
        device_id=alert_in.device_id or "AGNI-001",
        batch_id=alert_in.batch_id,
        type=alert_in.type,
        severity=alert_in.severity,
        message=alert_in.message,
        timestamp=utc_now_str(),
        acknowledged=False,
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)

    await ws_manager.broadcast_json({
        "type": "ALERT_TRIGGERED",
        "alert": {
            "alert_id": alert.alert_id,
            "type": alert.type,
            "severity": alert.severity,
            "message": alert.message,
            "timestamp": alert.timestamp,
        }
    })

    return alert

@router.post("/{alert_id}/acknowledge", response_model=AlertResponse)
async def acknowledge_alert(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(AlertModel).filter(AlertModel.alert_id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail=f"Alert '{alert_id}' not found")

    alert.acknowledged = True
    db.commit()
    db.refresh(alert)

    await ws_manager.broadcast_json({
        "type": "ALERT_ACKNOWLEDGED",
        "alert_id": alert.alert_id,
    })

    return alert
