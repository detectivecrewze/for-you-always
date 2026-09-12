interface TikTokPixel {
    track: (event: string, properties: Record<string, unknown>) => void;
}

declare global {
    interface Window {
        ttq?: TikTokPixel;
        fbq?: (command: string, event: string, properties?: Record<string, unknown>, options?: Record<string, unknown>) => void;
    }
}

const META_READY_EVENT = 'fya:meta-pixel-ready';

export function trackMetaEvent(event: string, properties?: Record<string, unknown>, options?: Record<string, unknown>) {
    if (typeof window === 'undefined') return;
    const send = () => {
        if (properties) window.fbq?.('track', event, properties, options);
        else window.fbq?.('track', event);
    };
    if (window.fbq) send();
    else window.addEventListener(META_READY_EVENT, send, { once: true });
}

export function trackAddToCart({ id, name, price }: { id: string; name: string; price: number }) {
    trackMetaEvent('AddToCart', {
        content_ids: [id], content_name: name, content_type: 'product', value: price, currency: 'IDR',
    });
}

const checkoutKey = (orderId: string) => `fya_meta_checkout_${orderId}`;
const purchaseKey = (orderId: string) => `fya_meta_purchase_${orderId}`;
const pendingPurchases = new Set<string>();

export function rememberMetaCheckout(orderId: string, value: number, contentIds: string[]) {
    if (typeof window === 'undefined' || !orderId || !Number.isFinite(value) || value < 0) return;
    try {
        window.localStorage.setItem(checkoutKey(orderId), JSON.stringify({ value, contentIds }));
    } catch { /* Storage may be unavailable. */ }
}

export function trackMetaPurchase(orderId: string, productId?: string) {
    if (typeof window === 'undefined' || !orderId || pendingPurchases.has(orderId)) return;
    try {
        if (window.localStorage.getItem(purchaseKey(orderId))) return;
    } catch { /* Still allow the event when storage is unavailable. */ }

    let saved: { value?: number; contentIds?: string[] } = {};
    try {
        saved = JSON.parse(window.localStorage.getItem(checkoutKey(orderId)) || '{}');
    } catch { /* Older or unavailable checkout data. */ }
    // Only count purchases that began checkout in this browser. This avoids
    // counting old orders or orders viewed through the public status search.
    if (typeof saved.value !== 'number' || !Number.isFinite(saved.value)) return;
    const contentIds = productId
        ? productId.split(',').map(id => id.trim()).filter(Boolean)
        : Array.isArray(saved.contentIds) ? saved.contentIds : [];
    const properties: Record<string, unknown> = { content_type: 'product' };
    if (contentIds.length) properties.content_ids = contentIds;
    properties.value = saved.value;
    properties.currency = 'IDR';

    pendingPurchases.add(orderId);
    const send = () => {
        window.fbq?.('track', 'Purchase', properties, { eventID: `purchase_${orderId}` });
        try {
            window.localStorage.setItem(purchaseKey(orderId), '1');
            window.localStorage.removeItem(checkoutKey(orderId));
        } catch { /* A future visit may repeat the event if storage is unavailable. */ }
        pendingPurchases.delete(orderId);
    };
    if (window.fbq) send();
    else window.addEventListener(META_READY_EVENT, send, { once: true });
}

export function trackViewContent({ id, name, price }: { id: string; name: string; price?: number }) {
    if (typeof window === 'undefined') return;
    const send = () => {
        trackMetaEvent('ViewContent', {
            content_ids: [id], content_name: name, content_type: 'product',
            ...(typeof price === 'number' ? { value: price, currency: 'IDR' } : {}),
        });
        window.ttq?.track('ViewContent', {
            content_type: 'product',
            content_id: id,
            content_name: name,
            value: price || 0,
            currency: 'IDR',
        });
    };
    if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(send, { timeout: 1200 });
    } else {
        setTimeout(send, 300);
    }
}

export function trackInitiateCheckout(items: Array<{ id: string; title: string; numericPrice: number }>, total: number) {
    trackMetaEvent('InitiateCheckout', {
        contents: items.map(i => ({ id: i.id, quantity: 1, item_price: i.numericPrice })),
        content_ids: items.map(i => i.id),
        content_type: 'product', value: total, currency: 'IDR', num_items: items.length,
    });
    if (typeof window !== 'undefined' && window.ttq) {
        window.ttq.track('InitiateCheckout', {
            contents: items.map(i => ({
                content_id: i.id,
                content_name: i.title,
                quantity: 1,
                price: i.numericPrice,
            })),
            content_type: 'product',
            value: total,
            currency: 'IDR',
            num_items: items.length,
        });
    }
}

export function trackContact(channel: string = 'WhatsApp') {
    trackMetaEvent('Contact', { content_name: channel });
    if (typeof window !== 'undefined' && window.ttq) {
        window.ttq.track('Contact', {
            content_name: channel,
        });
    }
}
