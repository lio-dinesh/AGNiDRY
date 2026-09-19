def test_device_status(client):
    response = client.get("/api/device/status")
    assert response.status_code == 200
    data = response.json()
    assert data["device_id"] == "AGNI-001"
    assert data["status"] == "ONLINE"
    assert data["is_live"] is True

def test_update_device_thresholds(client):
    response = client.patch(
        "/api/device/thresholds",
        json={"max_temperature": 52.0, "target_humidity": 38.0}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["max_temperature"] == 52.0
    assert data["target_humidity"] == 38.0
