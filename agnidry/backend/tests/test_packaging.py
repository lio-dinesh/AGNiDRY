def test_list_packaging_records(client):
    response = client.get("/api/packaging")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["package_id"] == "PKG-2026-001"

def test_create_packaging_record(client):
    payload = {
        "package_id": "PKG-2026-999",
        "batch_id": "AG-2026-002",
        "product_name": "Pure Sandalwood (Chandan Sticks)",
        "package_type": "POUCH_50G",
        "quantity": 25,
        "package_weight": 50.0,
        "material": "Heat-sealed Eco Film",
        "seal_status": "SUCCESS",
        "notes": "Verified impulse seal",
        "artisan_name": "Lakshmi Devi",
    }
    response = client.post("/api/packaging", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["package_id"] == "PKG-2026-999"
    assert data["package_type"] == "POUCH_50G"
    assert data["seal_status"] == "SUCCESS"

    # Verify query by batch
    batch_pkg = client.get("/api/packaging?batch_id=AG-2026-002")
    assert batch_pkg.status_code == 200
    pkg_list = batch_pkg.json()
    assert any(p["package_id"] == "PKG-2026-999" for p in pkg_list)
