import requests

BASE_URL = "http://localhost:3000/api"
ADMIN_TOKEN = "your_admin_bearer_token_here"  # Replace with a valid admin token
TIMEOUT = 30

def test_post_shipping_dispatch_api_should_trigger_courier_dispatch():
    url_dispatch = f"{BASE_URL}/shipping/dispatch"

    headers = {
        "Authorization": f"Bearer {ADMIN_TOKEN}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    # Sample payload for dispatch request. Since PRD doesn't specify exact body, simulate with typical shipment info:
    payload = {
        "shipmentId": "test-shipment-123",
        "courier": "biteship",
        "notes": "Trigger dispatch for test shipment"
    }

    try:
        response = requests.post(url_dispatch, json=payload, headers=headers, timeout=TIMEOUT)
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        # Authorization error should be caught and fail test
        assert False, f"HTTP error occurred: {e}, response content: {e.response.text if e.response else 'No response'}"
    except requests.exceptions.RequestException as e:
        assert False, f"Request failed: {e}"

    # Validate success response
    assert response.status_code == 200, f"Expected HTTP 200 OK but got {response.status_code}"
    json_response = response.json()
    # Assume API returns a success field and dispatch details
    assert "success" in json_response, "Response JSON missing 'success' key"
    assert json_response["success"] is True, "Dispatch was not successful"
    assert "dispatchId" in json_response and isinstance(json_response["dispatchId"], str), "Response missing valid 'dispatchId'"
    assert "message" in json_response and isinstance(json_response["message"], str), "Response missing 'message' field"

test_post_shipping_dispatch_api_should_trigger_courier_dispatch()