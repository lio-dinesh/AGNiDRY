def test_list_batches(client):
    response = client.get("/api/batches")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 3  # Initial seeded batches

def test_get_batch_by_id(client):
    response = client.get("/api/batches/AG-2026-001")
    assert response.status_code == 200
    data = response.json()
    assert data["batch_id"] == "AG-2026-001"
    assert data["status"] == "DRYING"

def test_create_new_batch(client):
    payload = {
        "batch_id": "AG-2026-999",
        "product_type": "Kewra Agarbatti",
        "initial_weight": 2.50,
        "target_moisture_loss_pct": 36.0,
        "notes": "Test batch created via API",
        "status": "READY",
    }
    response = client.post("/api/batches", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["batch_id"] == "AG-2026-999"
    assert data["current_weight"] == 2.50
    assert data["status"] == "READY"

    # Verify retrieval
    get_res = client.get("/api/batches/AG-2026-999")
    assert get_res.status_code == 200
    assert get_res.json()["product_type"] == "Kewra Agarbatti"

def test_update_batch_status(client):
    # Transition AG-2026-003 from READY to DRYING
    response = client.patch(
        "/api/batches/AG-2026-003/status",
        json={"status": "DRYING"}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "DRYING"

    # Complete the batch
    complete_res = client.patch(
        "/api/batches/AG-2026-003/status",
        json={"status": "COMPLETED"}
    )
    assert complete_res.status_code == 200
    data = complete_res.json()
    assert data["status"] == "COMPLETED"
    assert data["end_time"] is not None

def test_batch_not_found(client):
    response = client.get("/api/batches/NON_EXISTENT_ID")
    assert response.status_code == 404
