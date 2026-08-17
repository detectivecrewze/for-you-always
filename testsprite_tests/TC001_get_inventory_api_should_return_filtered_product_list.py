import requests

def test_get_inventory_api_should_return_filtered_product_list():
    base_url = "http://localhost:3000/api"
    endpoint = "/inventory"
    # Filter by occasion for the test, example occasion "Anniversary"
    params = {"occasion": "Anniversary"}
    headers = {
        "Accept": "application/json"
    }
    timeout = 30

    try:
        response = requests.get(f"{base_url}{endpoint}", headers=headers, params=params, timeout=timeout)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"

    try:
        data = response.json()
    except ValueError:
        assert False, "Response content is not valid JSON"

    # Expect data to be a list directly
    if not isinstance(data, list):
        assert False, "Response JSON is not a list of products as expected"

    products = data

    assert isinstance(products, list), "Expected response to be a list of products"

    # Check each product has necessary details: features, pricing, preview media, and filtered by occasion
    for product in products:
        assert isinstance(product, dict), "Each product should be a dictionary"

        # Occasion filtering check (occasion might be in a field, e.g. "occasion" or "tags")
        # We try to find "occasion" attribute or something similar
        product_occasions = product.get("occasion") or product.get("occasions") or product.get("tags") or []
        # Normalize to list for check
        if isinstance(product_occasions, str):
            product_occasions = [product_occasions]
        assert any(p_oc.lower() == "anniversary" for p_oc in product_occasions if isinstance(p_oc, str)), \
            f"Product does not match filtered occasion 'Anniversary': {product.get('id', 'unknown')}"

        # Features
        assert "features" in product, f"Product missing 'features': {product.get('id', 'unknown')}"
        assert isinstance(product["features"], list), f"Product 'features' should be a list: {product.get('id', 'unknown')}"

        # Pricing
        assert "pricing" in product, f"Product missing 'pricing': {product.get('id', 'unknown')}"
        pricing = product["pricing"]
        assert isinstance(pricing, dict), f"Product 'pricing' should be a dict: {product.get('id', 'unknown')}"
        assert "currency" in pricing, f"Pricing missing 'currency': {product.get('id', 'unknown')}"
        assert "amount" in pricing, f"Pricing missing 'amount': {product.get('id', 'unknown')}"
        assert isinstance(pricing["amount"], (int, float)), f"Pricing 'amount' should be a number: {product.get('id', 'unknown')}"

        # Preview media
        assert "preview_media" in product or "previewMedia" in product or "media" in product, \
            f"Product missing preview media: {product.get('id', 'unknown')}"
        # Check preview media is a non-empty list if present
        media_field = product.get("preview_media") or product.get("previewMedia") or product.get("media")
        assert media_field is not None, f"Product preview media is None: {product.get('id', 'unknown')}"
        assert isinstance(media_field, list), f"Product preview media should be a list: {product.get('id', 'unknown')}"
        assert len(media_field) > 0, f"Product preview media list is empty: {product.get('id', 'unknown')}"

test_get_inventory_api_should_return_filtered_product_list()
