export function trackViewContent({ id, name, price }: { id: string; name: string; price?: number }) {
    if (typeof window !== 'undefined' && (window as any).ttq) {
        (window as any).ttq.track('ViewContent', {
            content_type: 'product',
            content_id: id,
            content_name: name,
            value: price || 0,
            currency: 'IDR',
        });
    }
}

export function trackInitiateCheckout(items: Array<{ id: string; title: string; numericPrice: number }>, total: number) {
    if (typeof window !== 'undefined' && (window as any).ttq) {
        (window as any).ttq.track('InitiateCheckout', {
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
    if (typeof window !== 'undefined' && (window as any).ttq) {
        (window as any).ttq.track('Contact', {
            content_name: channel,
        });
    }
}
