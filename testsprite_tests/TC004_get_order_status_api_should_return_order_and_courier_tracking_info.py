import requests

BASE_URL = "http://localhost:3000/api"
TIMEOUT = 30

def test_get_order_status_api_should_return_order_and_courier_tracking_info():
    url = f"{BASE_URL}/order-status"
    headers = {
        "Accept": "application/json"
    }

    try:
        response = requests.get(url, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request to {url} failed: {e}"

    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    try:
        data = response.json()
    except ValueError:
        assert False, "Response is not in JSON format"

    # Validate response contains real-time order status info demonstrated by required keys
    # Presence of payment confirmation status
    assert "paymentConfirmed" in data, "Missing 'paymentConfirmed' in response"
    assert isinstance(data["paymentConfirmed"], bool), "'paymentConfirmed' should be a boolean"

    # Presence of digital gift studio access link or info
    assert "digitalGiftStudio" in data, "Missing 'digitalGiftStudio' in response"
    assert isinstance(data["digitalGiftStudio"], dict), "'digitalGiftStudio' should be an object"

    # Presence of courier delivery tracking info
    assert "courierTracking" in data, "Missing 'courierTracking' in response"
    courier_tracking = data["courierTracking"]
    assert isinstance(courier_tracking, dict), "'courierTracking' should be an object"
    # Validate some expected fields inside courierTracking, may include status and checkpoints
    assert "status" in courier_tracking, "Missing 'status' in courierTracking"
    assert isinstance(courier_tracking["status"], str), "'status' in courierTracking should be a string"
    assert "checkpoints" in courier_tracking, "Missing 'checkpoints' in courierTracking"
    assert isinstance(courier_tracking["checkpoints"], list), "'checkpoints' in courierTracking should be a list"

test_get_order_status_api_should_return_order_and_courier_tracking_info()