export interface StorefrontCatalogItem {
    badgeText: string;
    badgeColor: string;
    badgeVariant?: "solid" | "soft";
    slotBadgeText?: string;
    titleColor: string;
    imageSrc: string;
    title: string;
    oldPrice?: string;
    newPrice: string;
    id: string;
    numericPrice: number;
    href: string;
    occasions: string[];
    features: string[];
    hashtag?: string;
    soldCount?: string;
}

export const STOREFRONT_CATALOG: StorefrontCatalogItem[] = [
    { badgeText: "Physical Gift", badgeColor: "#1d1816", badgeVariant: "solid", slotBadgeText: "Sisa 5 Box", titleColor: "#382a24", imageSrc: "/the-gift-box/IMG_2213_hd.webp", title: "The Gift Box", oldPrice: "Rp 110.000", newPrice: "Rp 80.000", id: "the-gift-box", numericPrice: 80000, href: "/catalog/the-gift-box", occasions: ["Anniversary", "Birthday", "LDR"], features: ["Classic Kraft Box & Hardbox Tier", "Kartu Akses QR Custom", "Pilihan Memoria, Birthday, Letter & Voices"] },
    { badgeText: "#1 Exclusive", badgeColor: "#d4af37", titleColor: "#581824", imageSrc: "/assets/opening_gate.png", title: "Memoria (Premium)", oldPrice: "Rp 50.000", newPrice: "Rp 40.000", id: "loves", numericPrice: 40000, href: "/catalog/memoria", occasions: ["Anniversary", "Birthday", "Crush", "LDR"], features: ["Custom Desain Eksklusif", "Galeri Foto Sinematik", "Terima Beres (Done For You)"] },
    { badgeText: "New", badgeColor: "#bf7b19", titleColor: "#bf7b19", imageSrc: "/assets/snoopy-features/main-card-updatesnoopy.webp", title: "Birthday Scrapbook", oldPrice: "Rp 35.000", newPrice: "Rp 25.000", id: "birthday", numericPrice: 25000, href: "/catalog/birthday", occasions: ["Birthday"], features: ["4 Ruangan Interaktif", "15 Foto/Video + 3 Soundtrack", "Surat & Wish Inbox Interaktif"] },
    { badgeText: "Best Seller", badgeColor: "#a67c52", titleColor: "#7a5438", imageSrc: "https://cdn.for-you-always.my.id/1783163306081-l92p1h.webp", title: "Letter Edition", oldPrice: "Rp 30.000", newPrice: "Rp 20.000", id: "letter", numericPrice: 20000, hashtag: "#BESTSELLER", soldCount: "2.1k+ terjual", href: "/catalog/letter", occasions: ["Graduation", "Apology", "Anniversary", "LDR"], features: ["3 Kuota Letter Sekaligus", "Efek Typewriter Sinematik", "Kejutan Amplop & Foto/Video"] },
    { badgeText: "Popular", badgeColor: "#a67c52", titleColor: "#a67c52", imageSrc: "https://cdn.for-you-always.my.id/1777881039502-bav595.webp", title: "Voices Gift", newPrice: "Rp 20.000", oldPrice: "Rp 30.000", id: "voices", numericPrice: 20000, hashtag: "#AESTHETIC", soldCount: "1.2k+ terjual", href: "/catalog/voices", occasions: ["LDR", "Any Occasion", "Birthday", "Apology"], features: ["3 Kuota Voices Sekaligus", "Rekam Suara & Pesan Pribadi", "Galeri Foto & Music Pilihan"] },
    { badgeText: "Premium Bundle", badgeColor: "#4a7c8e", titleColor: "#5a8d9e", imageSrc: "https://cdn.for-you-always.my.id/1781034685666-udzbps.png", title: "Mixtape Edition", oldPrice: "Rp 30.000", newPrice: "Rp 20.000", id: "mixtape", numericPrice: 20000, hashtag: "#3QUOTAS", soldCount: "New Release", href: "/catalog/mixtape", occasions: ["Crush", "Birthday", "Any Occasion", "Apology"], features: ["3 Kuota Mixtape Sekaligus", "Desain Kaset Retro Interaktif", "Galeri Foto, Video & Musik"] },
    { badgeText: "New", badgeColor: "#e8789a", titleColor: "#8a3050", imageSrc: "https://cdn.for-you-always.my.id/1782232677562-8sosah.webp", title: "Invitation Edition", oldPrice: "Rp 30.000", newPrice: "Rp 20.000", id: "invitation", numericPrice: 20000, hashtag: "#DATEINVITATION", soldCount: "New Release", href: "/catalog/invitation", occasions: ["Crush", "LDR", "Anniversary", "Birthday"], features: ["3 Kuota Invitation Sekaligus", "Pilih Tanggal & Aktivitas Kencan", "Tiket Digital Interaktif"] },
    { badgeText: "10 Rooms", badgeColor: "#5c8c5c", titleColor: "#5c8c5c", imageSrc: "https://cdn.for-you-always.my.id/1781032826300-poixyb.png", title: "Arcade Edition", oldPrice: "Rp 30.000", newPrice: "Rp 25.000", id: "arcade", numericPrice: 25000, hashtag: "#10ROOMS", soldCount: "560+ terjual", href: "/catalog/arcade", occasions: ["Anniversary", "Birthday", "Bestie"], features: ["10 Ruangan Game Interaktif", "Kustomisasi On/Off Ruangan", "Dilengkapi Background Music"] },
    { badgeText: "Nostalgic", badgeColor: "#008689", titleColor: "#008689", imageSrc: "https://cdn.for-you-always.my.id/1778444079509-72xi4d.png", title: "Retro Edition", oldPrice: "Rp 30.000", newPrice: "Rp 20.000", id: "retro", numericPrice: 20000, hashtag: "#NOSTALGIA", soldCount: "340+ terjual", href: "/catalog/retro", occasions: ["Bestie", "Birthday", "Apology"], features: ["3 Kuota Retro Sekaligus", "Tema Klasik Windows 98", "5 Tahapan Kejutan Interaktif"] },
    { badgeText: "Storytelling", badgeColor: "#c9184a", titleColor: "#c9184a", imageSrc: "https://cdn.for-you-always.my.id/1777887751232-efe0ge.webp", title: "Wrapped Edition", oldPrice: "Rp 30.000", newPrice: "Rp 25.000", id: "wrapped", numericPrice: 25000, hashtag: "#MEMORIES", soldCount: "420+ terjual", href: "/catalog/wrapped", occasions: ["Year End", "Anniversary", "Birthday"], features: ["6 Halaman Recap Interaktif", "Kustomisasi On/Off Halaman", "Dilengkapi Background Music"] },
];
