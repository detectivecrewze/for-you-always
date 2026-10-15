export type FulfillmentMode = "self_service" | "done_for_you";

export interface DigitalPurchaseOption {
    id: string;
    title: string;
    basePrice: number;
    doneForYouPrice: number;
    themeColor: string;
    themeImgSrc?: string;
}

export const DONE_FOR_YOU_ADDON = 15000;
export const THREE_SLOT_SALES_ENABLED = false;

const DIGITAL_PURCHASE_OPTIONS: Record<string, Omit<DigitalPurchaseOption, "doneForYouPrice">> = {
    letter: { id: "letter", title: "Letter Edition", basePrice: 20000, themeColor: "#7a5438", themeImgSrc: "https://cdn.for-you-always.my.id/1783163306081-l92p1h.webp" },
    voices: { id: "voices", title: "Voices Gift", basePrice: 20000, themeColor: "#a67c52", themeImgSrc: "https://cdn.for-you-always.my.id/1777881039502-bav595.webp" },
    arcade: { id: "arcade", title: "Arcade Edition", basePrice: 25000, themeColor: "#5c8c5c", themeImgSrc: "https://cdn.for-you-always.my.id/1781032826300-poixyb.png" },
    retro: { id: "retro", title: "Retro Edition", basePrice: 20000, themeColor: "#008689", themeImgSrc: "https://cdn.for-you-always.my.id/1778444079509-72xi4d.png" },
    wrapped: { id: "wrapped", title: "Wrapped Edition", basePrice: 25000, themeColor: "#c9184a", themeImgSrc: "https://cdn.for-you-always.my.id/1777887751232-efe0ge.webp" },
    mixtape: { id: "mixtape", title: "Mixtape Edition", basePrice: 20000, themeColor: "#5a8d9e", themeImgSrc: "https://cdn.for-you-always.my.id/1781034685666-udzbps.png" },
    invitation: { id: "invitation", title: "Invitation Edition", basePrice: 20000, themeColor: "#8a3050", themeImgSrc: "https://cdn.for-you-always.my.id/1782232677562-8sosah.webp" },
    birthday: { id: "birthday", title: "Birthday Scrapbook", basePrice: 25000, themeColor: "#bf7b19", themeImgSrc: "/assets/snoopy-features/main-card-updatesnoopy.webp" },
    storybook: { id: "storybook", title: "Storybook Edition", basePrice: 25000, themeColor: "#8b1d2c", themeImgSrc: "/assets/storybook-features/spiderman-box.jpg" },
    sorry: { id: "sorry", title: "Sorry Letter", basePrice: 15000, themeColor: "#8b1d2c", themeImgSrc: "/assets/sorry-features/sorry-envelope.webp" },
};

export const DONE_FOR_YOU_PRODUCT_IDS = new Set(Object.keys(DIGITAL_PURCHASE_OPTIONS));

export function getDigitalPurchaseOption(productId: string): DigitalPurchaseOption | null {
    const option = DIGITAL_PURCHASE_OPTIONS[productId];
    if (!option) return null;
    return { ...option, doneForYouPrice: option.basePrice + DONE_FOR_YOU_ADDON };
}

export function createDoneForYouItem(productId: string) {
    const option = getDigitalPurchaseOption(productId);
    if (!option) return null;
    return {
        id: option.id,
        title: `${option.title} (Terima Jadi)`,
        numericPrice: option.doneForYouPrice,
        themeColor: option.themeColor,
        themeImgSrc: option.themeImgSrc,
        fulfillmentMode: "done_for_you" as const,
    };
}

export function formatRupiah(value: number) {
    return `Rp ${value.toLocaleString("id-ID")}`;
}
