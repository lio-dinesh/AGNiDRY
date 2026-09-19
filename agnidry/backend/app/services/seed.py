from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.models.batch import BatchModel
from app.models.telemetry import TelemetryModel
from app.models.packaging import PackagingModel
from app.models.alert import AlertModel
from app.models.device import DeviceModel

def seed_database_if_empty(db: Session):
    # Check if batches exist
    batch_count = db.query(BatchModel).count()
    if batch_count > 0:
        return  # Already seeded or has data

    now = datetime.now(timezone.utc)

    # 1. Seed Device
    device = DeviceModel(
        device_id="AGNI-001",
        device_name="AgniDry Prototype Chamber #1",
        firmware_version="v1.0.0-proto",
        status="ONLINE",
        last_seen=now.isoformat(),
        max_temperature=55.0,
        target_humidity=40.0,
        min_battery_voltage=11.8,
    )
    db.add(device)

    # 2. Seed Initial Batches
    b1 = BatchModel(
        batch_id="AG-2026-001",
        device_id="AGNI-001",
        product_type="Mogra Agarbatti (Classic Floral)",
        initial_weight=2.00,
        current_weight=1.28,
        final_weight=None,
        target_moisture_loss_pct=36.0,
        start_time=(now - timedelta(hours=2, minutes=15)).isoformat(),
        end_time=None,
        duration="2h 15m",
        status="DRYING",
        notes="Pilot batch prepared by artisan Lakshmi Devi. 400 wet sticks on perforated stainless-steel tray.",
        created_at=(now - timedelta(hours=2, minutes=20)).isoformat(),
        updated_at=now.isoformat(),
    )
    b2 = BatchModel(
        batch_id="AG-2026-002",
        device_id="AGNI-001",
        product_type="Pure Sandalwood (Chandan Sticks)",
        initial_weight=1.85,
        current_weight=1.18,
        final_weight=1.18,
        target_moisture_loss_pct=36.0,
        start_time=(now - timedelta(days=1, hours=4)).isoformat(),
        end_time=(now - timedelta(days=1, hours=1)).isoformat(),
        duration="3h 05m",
        status="COMPLETED",
        notes="High-fragrance raw paste. Successfully dried under full solar irradiation without stick warping.",
        created_at=(now - timedelta(days=1, hours=4, minutes=10)).isoformat(),
        updated_at=(now - timedelta(days=1, hours=1)).isoformat(),
    )
    b3 = BatchModel(
        batch_id="AG-2026-003",
        device_id="AGNI-001",
        product_type="Rose Petal Essence (Gulab)",
        initial_weight=2.20,
        current_weight=2.20,
        final_weight=None,
        target_moisture_loss_pct=36.0,
        start_time=now.isoformat(),
        end_time=None,
        duration="0h 0m",
        status="READY",
        notes="Loaded into drying chamber tray. Awaiting morning solar heating cycle.",
        created_at=now.isoformat(),
        updated_at=now.isoformat(),
    )
    db.add_all([b1, b2, b3])

    # 3. Seed Initial Telemetry for AG-2026-001 (15 time points showing realistic drying curve)
    points = [
        (135, 29.5, 78.0, 2.00, False, False, False),
        (120, 34.2, 75.2, 1.95, True, True, False),
        (105, 38.6, 71.0, 1.88, True, True, False),
        (90, 42.1, 65.4, 1.79, True, True, True),
        (75, 45.3, 58.9, 1.68, True, True, True),
        (60, 46.8, 52.1, 1.57, True, True, True),
        (45, 47.5, 47.4, 1.48, True, True, True),
        (30, 46.9, 44.2, 1.39, True, True, False),
        (15, 47.2, 42.1, 1.33, True, True, False),
        (0, 46.8, 41.5, 1.28, True, True, False),
    ]
    for mins_ago, temp, rh, wt, fan, heater, vent in points:
        t_time = (now - timedelta(minutes=mins_ago)).isoformat()
        db.add(TelemetryModel(
            device_id="AGNI-001",
            batch_id="AG-2026-001",
            timestamp=t_time,
            temperature=temp,
            humidity=rh,
            weight=wt,
            battery_voltage=12.6,
            battery_percentage=85.0,
            solar_status=True,
            fan_status=fan,
            heater_status=heater,
            vent_status=vent,
        ))

    # 4. Seed Initial Packaging Record
    db.add(PackagingModel(
        package_id="PKG-2026-001",
        batch_id="AG-2026-002",
        product_name="Pure Sandalwood (Chandan Sticks)",
        package_type="BOX_100G",
        quantity=50,
        package_weight=100.0,
        material="Airtight Recycled Kraft Box",
        seal_status="SUCCESS",
        start_time=(now - timedelta(days=1, minutes=45)).isoformat(),
        completion_time=(now - timedelta(days=1, minutes=44)).isoformat(),
        notes="Airtight impulse heat sealed. Verified on bench scale.",
        artisan_name="Lakshmi Devi",
        created_at=(now - timedelta(days=1, minutes=44)).isoformat(),
    ))

    # 5. Seed Initial Alert
    db.add(AlertModel(
        alert_id="ALT-2026-001",
        device_id="AGNI-001",
        batch_id="AG-2026-001",
        type="HIGH_HUMIDITY",
        severity="INFO",
        message="Initial stick moisture evaporation detected (78% RH). Exhaust vent opened.",
        timestamp=(now - timedelta(hours=1, minutes=45)).isoformat(),
        acknowledged=True,
    ))

    db.commit()
