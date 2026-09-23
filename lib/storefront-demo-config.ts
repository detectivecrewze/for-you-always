import type { DemoModalTheme, DemoPreviewVariant, MemoriaThemeSwatch } from "@/app/components/DemoPreviewModal";

export type DemoProductId = "loves" | "letter" | "voices" | "mixtape" | "invitation" | "retro" | "wrapped" | "birthday" | "arcade" | "storybook";

export interface StorefrontDemoConfig {
    productName: string;
    title: string;
    subtitle: string;
    price: string;
    theme: DemoModalTheme;
    variants: readonly DemoPreviewVariant[];
    initialVariantId: string;
    themeSwatches?: readonly MemoriaThemeSwatch[];
    opensInNewTab?: boolean;
}

export const GIFT_OPENING_DEMO_URL = "https://anniv.for-you-always.my.id/auto-kvoggmb";
export const PERSONAL_DEMO_URL = "https://anniv.for-you-always.my.id/untuk-nadia?preview=personal";

export const MEMORIA_DEMO_VARIANTS = [
    { id: "gift-opening", label: "Gift Opening", src: GIFT_OPENING_DEMO_URL, subtitle: "Lihat transisi pembuka dengan animasi kado" },
    { id: "personal", label: "Personal Edition", src: PERSONAL_DEMO_URL, subtitle: "Jelajahi contoh Personal Edition" },
    { id: "circle", label: "Circle Wishes", src: "https://anniv.for-you-always.my.id/auto-circle?preview=circle#circle-wishes-section", subtitle: "Lihat bagaimana ucapan teman hadir di dalam kado" },
] as const satisfies readonly DemoPreviewVariant[];

export const MEMORIA_THEME_SWATCHES = [
    { id: "vintage-burgundy", name: "Vintage Burgundy", color: "#9E2A47", bgColor: "#2D141E" },
    { id: "classic-light", name: "Classic Light", color: "#C99B6D", bgColor: "#FDFAF5" },
    { id: "midnight-rose", name: "Midnight Rose", color: "#E84D72", bgColor: "#0A0408" },
    { id: "ocean-breeze", name: "Ocean Breeze", color: "#38B4D8", bgColor: "#071520" },
    { id: "blush-pink", name: "Blush Pink", color: "#F0789E", bgColor: "#FFE4E8" },
    { id: "midnight-blue", name: "Midnight Blue", color: "#3B82F6", bgColor: "#050C1A" },
    { id: "velvet-purple", name: "Velvet Purple", color: "#A855F7", bgColor: "#120818" },
    { id: "antique-rose-diary", name: "Antique Rose Diary", color: "#8B4854", bgColor: "#EFE4D2" },
    { id: "sage-botanical-letter", name: "Sage Botanical Letter", color: "#68745B", bgColor: "#F1EDDF" },
    { id: "espresso-love-letter", name: "Espresso Love Letter", color: "#724C40", bgColor: "#E6D5C2" },
] as const satisfies readonly MemoriaThemeSwatch[];

export const LETTER_DEMO_VARIANTS = [
    { id: "classic-wax", label: "Classic Wax Seal", src: "https://letter.for-you-always.my.id/letter-test", subtitle: "Surat klasik dengan amplop dan segel wax" },
    { id: "vintage-airmail", label: "Vintage Airmail", src: "https://letter.for-you-always.my.id/airmail/letter-test", subtitle: "Surat pos udara bernuansa vintage" },
    { id: "ribbon-seal", label: "Ribbon & Seal", src: "https://letter.for-you-always.my.id/ribbon/letter-test", subtitle: "Surat elegan dengan pita dan segel" },
    { id: "vintage", label: "Vintage", src: "https://letter.for-you-always.my.id/vintage/letter-test", subtitle: "Surat vintage dengan amplop interaktif" },
] as const satisfies readonly DemoPreviewVariant[];

export const VOICES_DEMO_VARIANTS = [
    { id: "music-box", label: "Music Box", src: "https://voice.for-you-always.my.id/gift/for-nadin", subtitle: "Rekaman suara dalam nuansa kotak musik klasik" },
    { id: "camera", label: "Camera", src: "https://voice.for-you-always.my.id/camera/silver/for-nadin", subtitle: "Rekaman suara dengan tampilan kamera retro" },
] as const satisfies readonly DemoPreviewVariant[];

export const BIRTHDAY_DEMO_VARIANTS = [
    { id: "snoopy", label: "Snoopy Comic", src: "https://snoopy.for-you-always.my.id/gift?project=gift-f0d02efd7edcbf62", subtitle: "Scrapbook komik retro bersama Snoopy & Woodstock" },
    { id: "dubu-dudu", label: "Dubu & Dudu", src: "https://snoopy.for-you-always.my.id/gift/index.html?project=gift-ab79b22216982751", subtitle: "Scrapbook hangat dengan nuansa pastel" },
] as const satisfies readonly DemoPreviewVariant[];

export const STORYBOOK_SPIDERMAN_DEMO_URL = "https://storybook.for-you-always.my.id/gift/gift-2cf4f3ec9cf1eb9b";
export const STORYBOOK_BATMAN_DEMO_URL = `${STORYBOOK_SPIDERMAN_DEMO_URL}?demoTheme=batman`;

export const STORYBOOK_DEMO_VARIANTS = [
    { id: "spiderman", label: "Spider-Man", src: STORYBOOK_SPIDERMAN_DEMO_URL, subtitle: "Storybook komik dengan warna merah, biru, dan tekstur web" },
    { id: "batman", label: "Batman", src: STORYBOOK_BATMAN_DEMO_URL, subtitle: "Storybook noir Gotham dengan aksen navy dan emas" },
] as const satisfies readonly DemoPreviewVariant[];

export const INVITATION_DEMO_VARIANTS = [
    { id: "invitation-date", label: "Invitation Date", src: "https://invitation.for-you-always.my.id/WRcVb-mY0f", subtitle: "Undangan kencan dengan date picker dan dress code" },
    { id: "rundown-date", label: "Rundown Date", src: "https://invitation.for-you-always.my.id/rundown-tqthew7", subtitle: "Susunan acara kencan yang rapi dan interaktif" },
] as const satisfies readonly DemoPreviewVariant[];

export const STOREFRONT_DEMO_CONFIGS: Record<DemoProductId, StorefrontDemoConfig> = {
    loves: { productName: "Memoria Premium", title: "Demo Memoria Premium", subtitle: "Jelajahi pengalaman Memoria", price: "Rp 40.000", theme: "memoria", variants: MEMORIA_DEMO_VARIANTS, initialVariantId: "gift-opening", themeSwatches: MEMORIA_THEME_SWATCHES },
    letter: { productName: "Letter Edition", title: "Demo Letter Edition", subtitle: "Pilih gaya surat yang ingin dijelajahi", price: "Rp 20.000", theme: "letter", variants: LETTER_DEMO_VARIANTS, initialVariantId: "classic-wax" },
    voices: { productName: "Voices Gift", title: "Demo Voices Gift", subtitle: "Pilih pengalaman suara yang ingin dijelajahi", price: "Rp 20.000", theme: "voices", variants: VOICES_DEMO_VARIANTS, initialVariantId: "music-box" },
    mixtape: { productName: "Mixtape Edition", title: "Demo Mixtape Edition", subtitle: "Jelajahi kaset musik personal", price: "Rp 20.000", theme: "mixtape", variants: [{ id: "default", label: "Mixtape", src: "https://mixtape.for-you-always.my.id/auto-w2ykcoi", subtitle: "Kaset retro berisi musik dan kenangan" }], initialVariantId: "default" },
    invitation: { productName: "Invitation Edition", title: "Demo Invitation Edition", subtitle: "Pilih bentuk ajakan yang ingin dijelajahi", price: "Rp 20.000", theme: "invitation", variants: INVITATION_DEMO_VARIANTS, initialVariantId: "invitation-date" },
    retro: { productName: "Retro Edition", title: "Demo Retro Edition", subtitle: "Jelajahi kejutan bernuansa Windows 98", price: "Rp 20.000", theme: "retro", variants: [{ id: "default", label: "Retro", src: "https://retro.for-you-always.my.id/?to=retro-test", subtitle: "Kejutan nostalgia dengan lima tahap interaktif" }], initialVariantId: "default" },
    wrapped: { productName: "Wrapped Edition", title: "Demo Wrapped Edition", subtitle: "Jelajahi recap perjalanan yang personal", price: "Rp 25.000", theme: "wrapped", variants: [{ id: "default", label: "Wrapped", src: "https://love.for-you-always.my.id/love-test", subtitle: "Enam halaman recap interaktif" }], initialVariantId: "default" },
    birthday: { productName: "Birthday Scrapbook", title: "Demo Birthday Scrapbook", subtitle: "Pilih scrapbook yang ingin dijelajahi", price: "Rp 25.000", theme: "birthday", variants: BIRTHDAY_DEMO_VARIANTS, initialVariantId: "snoopy" },
    arcade: { productName: "Arcade Edition", title: "Demo Arcade Edition", subtitle: "Jelajahi sepuluh ruangan permainan", price: "Rp 25.000", theme: "arcade", variants: [{ id: "default", label: "Arcade", src: "https://arcade.for-you-always.my.id/?to=arcade-test", subtitle: "Petualangan game dengan sepuluh ruangan kenangan" }], initialVariantId: "default", opensInNewTab: true },
    storybook: { productName: "Storybook Edition", title: "Demo Storybook Edition", subtitle: "Pilih tema cerita yang ingin dijelajahi", price: "Rp 25.000", theme: "storybook", variants: STORYBOOK_DEMO_VARIANTS, initialVariantId: "spiderman" },
};
