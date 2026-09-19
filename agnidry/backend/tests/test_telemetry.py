def test_get_batch_telemetry(client):
    response = client.get("/api/telemetry/AG-2026-001")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 5
    # Verify chronological ordering
    assert data[0]["batch_id"] == "AG-2026-001"
    assert "temperature" in data[0]
    assert "humidity" in data[0]
    assert "weight" in data[0]

def test_get_latest_telemetry(client):
    response = client.get("/api/telemetry/latest")
    assert response.status_code == 200
    data = response.json()
    assert data is not None
    assert data["batch_id"] == "AG-2026-001"

def test_submit_telemetry(client):
    payload = {
        "device_id": "AGNI-001",
        "batch_id": "AG-2026-001",
        "temperature": 48.2,
        "humidity": 39.8,
        "weight": 1.25,
        "battery_voltage": 12.5,
        "battery_percentage": 83.0,
        "solar_status": True,
        "fan_status": True,
        "heater_status": False,
        "vent_status": False,
    }
    response = client.post("/api/telemetry", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["temperature"] == 48.2
    assert data["weight"] == 1.25

    # Verify that the batch's current weight was updated
    batch_res = client.get("/api/batches/AG-2026-001")
    assert batch_res.status_code == 200
    assert batch_res.json()["current_weight"] == 1.25
