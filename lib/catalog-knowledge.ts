export interface ProductCatalogDetail {
    id: string;
    name: string;
    type: "physical_digital_hybrid" | "digital_interactive";
    singlePrice: string;
    numericPrice: number;
    bundlePrice?: string;
    badge: string;
    tagline: string;
    coreFeatures: string[];
    physicalSpecs?: {
        boxDimensions?: string;
        boxColors?: string;
        includedItems?: string[];
        packagingDetails?: string;
        shippingEstimate?: string;
    };
    digitalExperience?: {
        interactiveMechanism?: string;
        themesAvailable?: string[];
        customizationOptions?: string[];
    };
    targetOccasions: string[];
    emotionalHooks: string[];
    faqs: Array<{ q: string; a: string }>;
}

export const COMPLETE_CATALOG_KNOWLEDGE: Record<string, ProductCatalogDetail> = {
    "the-gift-box": {
        id: "the-gift-box",
        name: "The Gift Box",
        type: "physical_digital_hybrid",
        singlePrice: "Rp 139.000",
        numericPrice: 139000,
        badge: "PHYSICAL GIFT (Best Value)",
        tagline: "Gift box fisik mewah dengan kejutan digital personal, dibuat untuk menyampaikan sesuatu yang sulit diucapkan langsung.",
        coreFeatures: [
            "Boks Kado Eksklusif Lid Krem dan Bodi Burgundy Mewah dengan Balutan Pita Satin",
            "Kartu Akses QR Custom Cetak Nama Personal (menghubungkan ke kado digital interaktif)",
            "Isian Lengkap: Boneka Bear Plush Mini, Coklat Cadbury Dairy Milk, Pocky, dan Buket Bunga Kering",
            "Pilihan Akses Kado Digital: Memoria (Wrapped), Letter Edition, atau Voices Gift",
            "Pengemasan Ekspedisi Super Aman Berlapis Bubble Wrap Tebal dan Box Luar Pelindung"
        ],
        physicalSpecs: {
            boxColors: "Lid Krem (#FAF7F2), Bodi Burgundy (#4A1521), Pita Satin Burgundy Kilau Halus",
            includedItems: [
                "Boks Kado Eksklusif For you, Always.",
                "Boneka Plush Mini Bear Coklat Lembut",
                "1 Batang Coklat Cadbury Dairy Milk 62g",
                "1 Kotak Snack Pocky",
                "Buket Bunga Kering Asli (Baby's Breath & Lavender)",
                "Kartu Akses QR Cetak Custom 'For [Nama Pasangan]'"
            ],
            packagingDetails: "Bantalan shredded paper pelindung, kardus pengiriman tebal, stiker fragile, dan bubble wrap ganda.",
            shippingEstimate: "Jabodetabek 1-3 hari kerja, luar Jawa 3-5 hari kerja. Bisa dikirim langsung ke alamat pasangan."
        },
        digitalExperience: {
            interactiveMechanism: "Penerima kado membuka boks fisik, lalu memindai (scan) kartu QR menggunakan kamera HP untuk membuka website kenangan interaktif personal.",
            themesAvailable: ["Memoria Wrapped Recap", "Letter Edition Wax Envelope", "Voices Audio Player"]
        },
        targetOccasions: ["Anniversary", "Ulang Tahun Pacar", "LDR (Kado Kejutan Jarak Jauh)", "Hari Jadian", "Girlfriend Day"],
        emotionalHooks: [
            "Sensasi unboxing kado fisik yang membuka website kenangan digital saat di-scan QR-nya.",
            "Kado yang tidak akan pernah layu atau basi karena link kenangannya aktif selamanya.",
            "Solusi sempurna untuk pasangan LDR yang ingin mengirim pelukan fisik dan suara secara bersamaan."
        ],
        faqs: [
            {
                q: "Bagaimana cara kerja The Gift Box?",
                a: "Pembeli memesan The Gift Box, lalu mengisi foto, pesan, dan suara di Studio Editor kami. Kami merakit boks fisiknya, mencetak Kartu Akses QR kado digitalnya, dan mengirimkannya ke alamat tujuan."
            },
            {
                q: "Apakah link kado digitalnya punya masa kedaluwarsa?",
                a: "Tidak ada masa kedaluwarsa. Kado digital aktif selamanya (Lifetime Access) dan bisa dibuka kapan saja."
            }
        ]
    },
    "voices-gift": {
        id: "voices-gift",
        name: "Voices Gift",
        type: "digital_interactive",
        singlePrice: "Rp 20.000",
        numericPrice: 20000,
        bundlePrice: "Rp 25.000 (3 Slot Kuota)",
        badge: "Popular Aesthetic",
        tagline: "Kado digital interaktif berupa rekaman suara personal, galeri foto sinematik, dan musik latar favorit.",
        coreFeatures: [
            "Pemutar Audio Rekaman Suara Pribadi dengan Desain Aesthetic Retro Player",
            "Galeri Foto Kenangan Sinematik (Slide Foto dengan Transisi Halus)",
            "Pemutar Musik Latar Romantis yang Mengalun Bersamaan",
            "Tersedia Paket 3-Slot Bundle (Beli 1 dapat 3 kuota kado untuk momen berbeda)"
        ],
        digitalExperience: {
            interactiveMechanism: "Penerima menekan tombol play, mendengar rekaman suara tulus pengirim sambil melihat foto-foto kenangan berputar.",
            themesAvailable: ["Beige Atelier", "Pinky Romance", "Sage Botanical", "Blanc Minimalist"]
        },
        targetOccasions: ["LDR (Sangat Direkomendasikan)", "Ulang Tahun", "Anniversary", "Ungkapan Rindu", "Minta Maaf"],
        emotionalHooks: [
            "Mendengar suara orang tersayang saat sedang rindu berat di kala LDR.",
            "Lebih intim daripada sekadar chat teks biasa di WhatsApp."
        ],
        faqs: [
            {
                q: "Berapa lama durasi rekaman suara yang bisa diunggah?",
                a: "Mendukung rekaman suara hingga beberapa menit dengan format audio jernih."
            }
        ]
    },
    "letter-edition": {
        id: "letter-edition",
        name: "Letter Edition",
        type: "digital_interactive",
        singlePrice: "Rp 20.000",
        numericPrice: 20000,
        bundlePrice: "Rp 25.000 (3 Slot Kuota)",
        badge: "Best Seller (2.1k+ Terjual)",
        tagline: "Surat cinta digital interaktif dengan animasi pembuka amplop segel lilin dan efek ketikan mesin tik puitis.",
        coreFeatures: [
            "Animasi Interaktif Membuka Amplop dengan Wax Seal (Segel Lilin)",
            "Efek Ketikan Mesin Tik (Typewriter Effect) yang Mengalir Sinematik",
            "Pemutar Musik Romantis Otomatis saat Surat Terbuka",
            "Sisipan Foto Polaroid & Video Kenangan di dalam Surat"
        ],
        digitalExperience: {
            interactiveMechanism: "Penerima menyentuh amplop di layar, segel lilin terbuka, dan surat mulai mengetikkan kata-kata puitis satu per satu diiringi alunan lagu.",
            themesAvailable: ["Vintage Linen Cream", "Blush Petal", "Sage Botanical", "Midnight Gold", "Noir Minimalist"]
        },
        targetOccasions: ["Anniversary", "Ulang Tahun", "Hari Kelulusan (Graduation)", "Ungkapan Terima Kasih", "Surat Cinta"],
        emotionalHooks: [
            "Menghidupkan kembali romantisme surat cinta klasik di era serba digital.",
            "Sensasi haru saat membaca kata demi kata yang terketik perlahan diiringi lagu kenangan kalian."
        ],
        faqs: [
            {
                q: "Apakah surat bisa diedit setelah dibuat?",
                a: "Bisa, pengirim memiliki akses Studio Editor untuk merevisi tulisan dan foto kapan saja."
            }
        ]
    },
    "mixtape-love": {
        id: "mixtape-love",
        name: "Mixtape Edition",
        type: "digital_interactive",
        singlePrice: "Rp 20.000",
        numericPrice: 20000,
        bundlePrice: "Rp 25.000 (3 Slot Kuota)",
        badge: "Retro Aesthetic",
        tagline: "Kaset retro interaktif yang memutar playlist lagu kenangan, video pendek, dan galeri foto kebersamaan.",
        coreFeatures: [
            "Animasi Kaset Pita Retro Berputar (Side A dan Side B)",
            "Playlist Musik Personal Terintegrasi",
            "Galeri Foto dan Video Pendek di dalam Cassette Case",
            "Desain Nostalgia Walkman 90-an yang Sangat Aesthetic"
        ],
        digitalExperience: {
            interactiveMechanism: "Penerima memasukkan kaset ke pemutar digital, kaset berputar memutar lagu kenangan sambil menampilkan foto-foto polaroid.",
            themesAvailable: ["Classic Cassette", "Pastel Dream", "Vintage Leather", "Y2K Cyber"]
        },
        targetOccasions: ["Anniversary", "Crush / PDKT", "Ulang Tahun Sahabat", "Musik Lovers"],
        emotionalHooks: [
            "Kado terbaik untuk seseorang yang menghubungkan setiap momen hidupnya dengan lagu.",
            "Format kaset retro yang sangat estetik untuk dibagikan ke Instagram Story."
        ],
        faqs: [
            {
                q: "Berapa banyak lagu yang bisa dimasukkan ke kaset?",
                a: "Bisa memasukkan beberapa lagu pilihan kenangan kalian di Side A dan Side B."
            }
        ]
    },
    "memoria-wrapped": {
        id: "memoria-wrapped",
        name: "Memoria (Wrapped Edition)",
        type: "digital_interactive",
        singlePrice: "Rp 25.000",
        numericPrice: 25000,
        bundlePrice: "Rp 40.000 (Paket Premium Done-For-You)",
        badge: "#1 Exclusive Loved",
        tagline: "Recap perjalanan cinta interaktif 6 babak sinematik ala Spotify Wrapped yang merangkum setiap momen berharga.",
        coreFeatures: [
            "6 Babak Cerita Interaktif: Our Journey, Special Moments, 6 Reasons Why I Love You, Time Counter, Secret Message",
            "Kalkulator Waktu Hubungan (Menghitung hari, jam, dan detik kebersamaan secara realtime)",
            "Animasi Bunga Bermekaran dan Musik Latar Sinematik",
            "Tersedia Opsi Done-For-You (Tim kami yang bantu susunkan teks puitisnya)"
        ],
        digitalExperience: {
            interactiveMechanism: "Penerima membuka gate, lalu menikmati 6 slide cerita visual interaktif yang merangkum perjalanan hubungan dari awal bertemu hingga hari ini.",
            themesAvailable: ["Quiet Luxury Champagne", "Midnight Starlight", "Rosé Botanical", "Vintage Romance"]
        },
        targetOccasions: ["Anniversary Tahunan (1 Tahun, 2 Tahun, dst)", "Ulang Tahun Spesial", "Kado Lamaran / Propose", "Pasangan Menikah"],
        emotionalHooks: [
            "Meneteskan air mata bahagia melihat kilas balik perjalanan cinta yang tersusun rapi dan estetik.",
            "Menunjukkan betapa kamu mengingat setiap detail kecil sejak hari pertama kalian bersama."
        ],
        faqs: [
            {
                q: "Apakah hitungan hari bersama berjalan otomatis?",
                a: "Ya, sistem menghitung durasi hubungan secara realtime sejak tanggal jadian yang kamu masukkan."
            }
        ]
    },
    "arcade-edition": {
        id: "arcade-edition",
        name: "Arcade Edition",
        type: "digital_interactive",
        singlePrice: "Rp 25.000",
        numericPrice: 25000,
        badge: "Unique Pixel Game",
        tagline: "Game pixel art interaktif 10 ruangan kenangan di mana pasangan berpetualang mengumpulkan memori indah bersama.",
        coreFeatures: [
            "Petualangan 10 Ruangan Kenangan Interaktif (Memory Rooms)",
            "Karakter Pixel Art Pasangan yang Bisa Digerakkan",
            "Musik 8-Bit Chiptune Bernuansa Hangat",
            "Kejutan Surat Rahasia di Ruangan Terakhir"
        ],
        digitalExperience: {
            interactiveMechanism: "Penerima menggerakkan karakter melewati ruangan-ruangan interaktif, membuka pintu kenangan, dan menemukan pesan romantis di akhir quest.",
            themesAvailable: ["Retro Gameboy", "Cyberpunk Neon", "Pastel Arcade", "Classic 8-Bit"]
        },
        targetOccasions: ["Gamers Couple", "Ulang Tahun Pacar Cowok/Cewek", "PDKT", "Anniversary Seru"],
        emotionalHooks: [
            "Kado interaktif paling seru dan tidak membosankan untuk pasangan penyuka game.",
            "Cara unik mengajak pasangan bernostalgia lewat game buatan sendiri."
        ],
        faqs: [
            {
                q: "Apakah game ini bisa dimainkan di HP?",
                a: "Ya, 100% responsif di HP (dengan tombol kontrol sentuh virtual) maupun laptop/PC."
            }
        ]
    },
    "retro-edition": {
        id: "retro-edition",
        name: "Retro Edition (Windows 98)",
        type: "digital_interactive",
        singlePrice: "Rp 20.000",
        numericPrice: 20000,
        bundlePrice: "Rp 25.000 (3 Slot Kuota)",
        badge: "Nostalgic Y2K",
        tagline: "Kado kejutan bertema sistem operasi Windows 98 nostalgia dengan 5 tahapan pop-up kenangan interaktif.",
        coreFeatures: [
            "Antarmuka Sistem Operasi Windows 98 Klasik",
            "5 Tahapan Kejutan Interaktif: Notepad Letter, Media Player Video, Photo Album, Mini Game, dan Special Wish",
            "Suara Khas Booting Komputer Retro yang Menggemaskan"
        ],
        digitalExperience: {
            interactiveMechanism: "Penerima mengklik ikon desktop retro, membuka jendela pop-up demi pop-up yang berisi pesan cinta dan foto kenangan.",
            themesAvailable: ["Classic Win98 Grey", "Cyber Lavender", "Retro Teal"]
        },
        targetOccasions: ["Ulang Tahun Gen-Z / Milenial", "Sahabat Dekat", "Anniversary Kasual", "Nostalgia 90s"],
        emotionalHooks: [
            "Konsep retro Y2K yang sangat unik, lucu, dan estetik untuk dibagikan di TikTok.",
            "Memberikan senyuman nostalgia dari klik pertama."
        ],
        faqs: [
            {
                q: "Apakah ada efek suara komputer jadul?",
                a: "Ya, ada efek suara klik mouse, pop-up dialog, dan musik latar retro yang menyenangkan."
            }
        ]
    },
    "invitation-edition": {
        id: "invitation-edition",
        name: "Invitation Edition",
        type: "digital_interactive",
        singlePrice: "Rp 20.000",
        numericPrice: 20000,
        bundlePrice: "Rp 25.000 (3 Slot Kuota)",
        badge: "Date Ticket",
        tagline: "Tiket kencan digital interaktif dengan countdown waktu mundur, rute rencana jalan, dan pesan rahasia.",
        coreFeatures: [
            "Desain Boarding Pass / Cinema Date Ticket yang Elegan",
            "Countdown Jam Menuju Waktu Kencan",
            "Rincian Itinerary, Dresscode, dan Lokasi Kencan Interaktif",
            "Konfirmasi Kehadiran Interaktif (Yes / Absolutely Yes!)"
        ],
        digitalExperience: {
            interactiveMechanism: "Penerima membuka link tiket kencan, melihat waktu hitung mundur menuju dinner/kencan spesial, dan menekan tombol konfirmasi kehadiran.",
            themesAvailable: ["Boarding Pass Luxury", "Cinema Golden Ticket", "Fine Dining Invitation"]
        },
        targetOccasions: ["Ajakan Kencan / Date Night", "Surprise Dinner Anniversary", "Valentine Day", "Lamaran Santai"],
        emotionalHooks: [
            "Cara paling romantis dan berkelas untuk mengajak seseorang pergi kencan.",
            "Membuat pasangan merasa sangat dihargai dan tidak sabar menantikan hari kencan kalian."
        ],
        faqs: [
            {
                q: "Bisakah dimasukkan link Google Maps lokasi kencan?",
                a: "Bisa, kamu bisa menyematkan lokasi restoran atau tempat kencan secara langsung."
            }
        ]
    }
};
