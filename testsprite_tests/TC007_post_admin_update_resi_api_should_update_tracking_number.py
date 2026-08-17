import requests
import uuid

BASE_URL = "http://localhost:3000/api"
TIMEOUT = 30
ADMIN_AUTH_TOKEN = "Bearer your_admin_auth_token_here"  # Replace with valid admin token

def create_order():
    url = f"{BASE_URL}/checkout"
    payload = {
        "digitalExperience": "Letter",
        "sender": {
            "name": "Test Sender",
            "email": f"sender_{uuid.uuid4()}@example.com",
            "phone": "+621234567890"
        },
        "recipient": {
            "name": "Test Recipient",
            "email": f"recipient_{uuid.uuid4()}@example.com",
            "phone": "+628765432109"
        },
        "shippingAddress": {
            "address": "Jl. Test Address No.123",
            "province": "DKI Jakarta",
            "city": "Jakarta Selatan",
            "postalCode": "12345"
        },
        "payment": {
            "method": "credit_card",
            "cardNumber": "4111111111111111",
            "cardExpiry": "12/29",
            "cardCvv": "123"
        }
    }
    headers = {
        "Content-Type": "application/json"
    }
    resp = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
    resp.raise_for_status()
    data = resp.json()
    order_id = data.get("orderId") or data.get("id")
    assert order_id, "Created orderId not returned"
    return order_id

def delete_order(order_id):
    url = f"{BASE_URL}/admin/orders/{order_id}"
    headers = {
        "Authorization": ADMIN_AUTH_TOKEN
    }
    try:
        resp = requests.delete(url, headers=headers, timeout=TIMEOUT)
        # deletion might not return 204, adjust accordingly if API differs
        if resp.status_code not in (200, 204):
            print(f"Warning: Deletion of order {order_id} returned status {resp.status_code}")
    except Exception as e:
        print(f"Failed to delete order {order_id}: {e}")

def get_order_details(order_id):
    url = f"{BASE_URL}/admin/orders/{order_id}"
    headers = {"Authorization": ADMIN_AUTH_TOKEN}
    resp = requests.get(url, headers=headers, timeout=TIMEOUT)
    resp.raise_for_status()
    return resp.json()

def test_post_admin_update_resi_api_should_update_tracking_number():
    order_id = None
    new_resi_number = f"TESTREI{uuid.uuid4().hex[:8].upper()}"
    headers = {
        "Authorization": ADMIN_AUTH_TOKEN,
        "Content-Type": "application/json"
    }
    try:
        # Create a new order to update
        order_id = create_order()

        # Prepare update payload
        update_payload = {
            "orderId": order_id,
            "trackingNumber": new_resi_number
        }
        update_url = f"{BASE_URL}/admin/update-resi"
        update_resp = requests.post(update_url, json=update_payload, headers=headers, timeout=TIMEOUT)
        update_resp.raise_for_status()

        update_data = update_resp.json()
        assert update_data.get("success") is True or update_resp.status_code == 200, "Resi update failed"

        # Verify the update reflected correctly by fetching the order details
        order_details = get_order_details(order_id)
        assert order_details.get("trackingNumber") == new_resi_number, "Tracking number not updated correctly in order details"

    finally:
        if order_id:
            delete_order(order_id)

test_post_admin_update_resi_api_should_update_tracking_number()