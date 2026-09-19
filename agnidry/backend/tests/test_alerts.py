def test_list_alerts(client):
    response = client.get("/api/alerts")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["alert_id"] == "ALT-2026-001"

def test_create_and_acknowledge_alert(client):
    payload = {
        "alert_id": "ALT-2026-TEST",
        "device_id": "AGNI-001",
        "batch_id": "AG-2026-001",
        "type": "HIGH_TEMPERATURE",
        "severity": "WARNING",
        "message": "Chamber air temperature approaching 50.0°C cutoff limit.",
    }
    create_res = client.post("/api/alerts", json=payload)
    assert create_res.status_code == 201
    alert_data = create_res.json()
    assert alert_data["acknowledged"] is False

    # Acknowledge
    ack_res = client.post(f"/api/alerts/{alert_data['alert_id']}/acknowledge")
    assert ack_res.status_code == 200
    assert ack_res.json()["acknowledged"] is True
