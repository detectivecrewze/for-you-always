import requests

BASE_URL = "http://localhost:3000/api"
TIMEOUT = 30


def test_post_checkout_api_should_process_order_and_payment():
    url = f"{BASE_URL}/checkout"
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "digitalExperience": "Letter",
        "sender": {
            "name": "Alice Example",
            "email": "alice@example.com",
            "phone": "+6281234567890"
        },
        "recipient": {
            "name": "Bob Example",
            "email": "bob@example.com",
            "phone": "+6280987654321"
        },
        "shipping": {
            "addressLine1": "Jl. Jend. Sudirman No. 123",
            "addressLine2": "Suite 45",
            "province": "DKI Jakarta",
            "city": "Jakarta Selatan",
            "postalCode": "12920"
        },
        "payment": {
            "method": "credit_card",
            "cardNumber": "4111111111111111",
            "cardExpiry": "12/26",
            "cardCvv": "123",
            "cardHolderName": "Alice Example"
        }
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
        response.raise_for_status()
        data = response.json()

        assert isinstance(data, dict), "Response should be a JSON object"
        assert "orderId" in data and isinstance(data["orderId"], str) and data["orderId"], "Response must include non-empty orderId"
        assert "paymentStatus" in data and data["paymentStatus"] == "completed", "Payment status should be 'completed'"
        assert "shippingStatus" in data, "Response should contain shippingStatus"
        assert "digitalExperienceAccess" in data, "Response should contain digitalExperienceAccess details"
        assert isinstance(data.get("orderSummary"), dict), "Response should contain orderSummary object"

    except requests.exceptions.RequestException as e:
        assert False, f"Request failed: {e}"


test_post_checkout_api_should_process_order_and_payment()