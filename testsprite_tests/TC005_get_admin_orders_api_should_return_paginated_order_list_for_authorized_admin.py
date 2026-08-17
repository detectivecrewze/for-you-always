import requests

BASE_URL = "http://localhost:3000/api"
ADMIN_ORDERS_ENDPOINT = "/admin/orders"
TIMEOUT = 30

# Example admin token for authorization (replace with a valid token)
ADMIN_AUTH_TOKEN = "Bearer your_admin_auth_token_here"

def test_get_admin_orders_api_should_return_paginated_order_list_for_authorized_admin():
    url = BASE_URL + ADMIN_ORDERS_ENDPOINT
    headers = {
        "Authorization": ADMIN_AUTH_TOKEN,
        "Accept": "application/json"
    }
    params = {
        "page": 1,
        "limit": 10,
        "search": "gift",
        "status": "processing",
        "type": "digital,physical"
    }
    try:
        response = requests.get(url, headers=headers, params=params, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request to {url} failed: {e}"

    # Validate status code
    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"

    try:
        data = response.json()
    except ValueError:
        assert False, "Response is not a valid JSON"

    # Validate pagination fields exist
    assert "orders" in data, "Response JSON does not contain 'orders' key"
    assert isinstance(data["orders"], list), "'orders' should be a list"

    # Optionally validate pagination metadata
    assert "pagination" in data, "Response JSON does not contain 'pagination' key"
    pagination = data["pagination"]
    assert "page" in pagination and "limit" in pagination and "total" in pagination, "Pagination info incomplete"

    # Validate that orders list contains expected keys (digital and physical)
    if len(data["orders"]) > 0:
        order = data["orders"][0]
        assert "id" in order, "Order item missing 'id'"
        assert "type" in order, "Order item missing 'type'"
        assert order["type"] in ["digital", "physical"], "Order type is not valid"
        assert "status" in order, "Order item missing 'status'"
        assert "createdAt" in order or "created_at" in order, "Order item missing creation date"

    # Validate filtering by type if filter applied (type param)
    types_in_response = set(order["type"] for order in data["orders"])
    filter_types = set(t.strip() for t in params["type"].split(","))
    assert types_in_response.issubset(filter_types), "Response contains order types outside filter"

test_get_admin_orders_api_should_return_paginated_order_list_for_authorized_admin()