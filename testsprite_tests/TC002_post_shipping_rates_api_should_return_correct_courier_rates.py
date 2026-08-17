import requests

def test_post_shipping_rates_api_should_return_correct_courier_rates():
    base_url = "http://localhost:3000/api"
    endpoint = "/shipping/rates"
    url = base_url + endpoint
    headers = {
        "Content-Type": "application/json"
    }
    # Example payload for selected province and city in Indonesia
    payload = {
        "province": "DKI Jakarta",
        "city": "Jakarta Selatan"
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request to {url} failed: {e}"

    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"
    try:
        data = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    # Validate that the response contains expected courier rates structure
    # Assuming the API returns a list or dict with courier names and rates
    assert isinstance(data, dict) or isinstance(data, list), "Response data should be a dictionary or list"

    if isinstance(data, dict):
        # If dict, check keys that make sense for courier rates
        assert "rates" in data or "couriers" in data or len(data) > 0, "Response dict should contain courier rates"
    elif isinstance(data, list):
        assert len(data) > 0, "Response list should not be empty"
        for item in data:
            assert "courier" in item or "service" in item, "Each rate entry should contain courier or service key"
            assert "cost" in item or "rate" in item, "Each rate entry should contain cost or rate key"

test_post_shipping_rates_api_should_return_correct_courier_rates()