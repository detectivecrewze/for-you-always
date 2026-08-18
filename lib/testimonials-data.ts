export interface TestimonialItem {
    id: string;
    customerAlias: string;
    productName: string;
    productId: "the-gift-box" | "letter" | "voices" | "mixtape" | "memoria" | "arcade" | "retro" | "invitation";
    productCategory: string;
    highlightQuote: string;
    occasion: string;
    rating: number;
    timeAgo: string;
    messages: Array<{
        sender: "customer" | "admin";
        text: string;
        time: string;
    }>;
}

export const TESTIMONIALS_DATA: TestimonialItem[] = [
    // 1. LETTER EDITION — PACAR NANGIS
    {
        id: "testi-1",
        customerAlias: "Kak N*** (Verified Buyer)",
        productName: "Letter Edition",
        productId: "letter",
        productCategory: "Digital Letter",
        highlightQuote: "kakakk makasih ya udah bikin templates kayak ginii, aku ga expect pacarku sampe nangiss wkwk...",
        occasion: "Anniversary Surprise",
        rating: 5,
        timeAgo: "2 hari yang lalu",
        messages: [
            { sender: "customer", text: "kakakk makasih ya udah bikin templates kayak ginii, aku ga expect pacarku sampe nangiss wkwk", time: "08.14" },
            { sender: "customer", text: "sukses terus ya kakk usahanya, keren banget!!", time: "08.14" },
            { sender: "admin", text: "Urwell kakk, thank you so much for the review", time: "15.51" },
            { sender: "admin", text: "Aku izin buat testimoni yaa kakk", time: "15.51" },
            { sender: "customer", text: "iyaa bolehh bangett kakk", time: "15.52" }
        ]
    },

    // 2. THE GIFT BOX — RESPON CEPAT & TANGGAP
    {
        id: "testi-2",
        customerAlias: "Kak F*** (Verified Buyer)",
        productName: "The Gift Box",
        productId: "the-gift-box",
        productCategory: "Physical + Digital",
        highlightQuote: "done kak, thank youu so much... sukaa banget respon nya cepet + tanggap bangett",
        occasion: "Gift Box Surprise",
        rating: 5,
        timeAgo: "3 hari yang lalu",
        messages: [
            { sender: "customer", text: "done kak, thank youu so much", time: "22.26" },
            { sender: "customer", text: "sukaa banget respon nya cepet + tanggap bangett", time: "22.27" },
            { sender: "admin", text: "thanks kakk hih, semoga paket kado fisiknya disukai yaa", time: "22.30" },
            { sender: "customer", text: "pasti bangett min, boks nya wangi dan rapih parah", time: "22.32" },
            { sender: "customer", text: "next time pasti order lagi disini", time: "22.33" }
        ]
    },

    // 3. VOICES GIFT — LDR TERHARU NANGIS
    {
        id: "testi-3",
        customerAlias: "Kak S*** (Verified Buyer)",
        productName: "Voices Gift",
        productId: "voices",
        productCategory: "Voice & Music",
        highlightQuote: "gada kak aman kok dia suka sekali... cayang ku sampe terharu nangis wkwkwk",
        occasion: "LDR Special",
        rating: 5,
        timeAgo: "3 hari yang lalu",
        messages: [
            { sender: "admin", text: "gaada kendala / masalah kan kak?", time: "00.45" },
            { sender: "customer", text: "gada kak aman kok dia suka sekali... cayang ku sampe terharu nangis wkwkwk", time: "00.48" },
            { sender: "admin", text: "hihihi glad to hear that kakk", time: "00.49" },
            { sender: "customer", text: "hehe berasa dipeluk langsung katanya", time: "00.49" },
            { sender: "customer", text: "tidur nyenyak yah minnn, bye bye", time: "00.49" }
        ]
    },

    // 4. MEMORIA / WRAPPED — SAMPE SALTING LIATNYA
    {
        id: "testi-4",
        customerAlias: "Kak E*** (Verified Buyer)",
        productName: "Memoria (Wrapped)",
        productId: "memoria",
        productCategory: "Story Recap",
        highlightQuote: "ih kaa sumpah bagusa bngt aku aja sampe salting liatnya... makasih ya ka",
        occasion: "Ulang Tahun Pacar",
        rating: 5,
        timeAgo: "4 hari yang lalu",
        messages: [
            { sender: "admin", text: "done yaa kak, link memorianya udah aktif", time: "19.14" },
            { sender: "customer", text: "ih kaa sumpah bagusa bngt aku aja sampe salting liatnya", time: "19.14" },
            { sender: "customer", text: "makasih ya ka, foto2nya jadi estetik parah", time: "19.15" },
            { sender: "admin", text: "hihi you're most welcome kakk, seneng dengernya", time: "20.25" },
            { sender: "customer", text: "sukses selalu yaa kakk", time: "20.26" }
        ]
    },

    // 5. LETTER EDITION — SESUAI PERSIS DI TIKTOK & DETAIL RAPIH
    {
        id: "testi-5",
        customerAlias: "Kak M*** (Verified Buyer)",
        productName: "Letter Edition",
        productId: "letter",
        productCategory: "Digital Letter",
        highlightQuote: "asli bagus banget dan sesuai persis sama yg di tiktok... detailnya juga rapih banget, keliatan niat dan effortnya.",
        occasion: "Hari Jadian",
        rating: 5,
        timeAgo: "5 hari yang lalu",
        messages: [
            { sender: "customer", text: "kak, thank you so much yaa aku bener bener puas sama hasil letter editionnya, asli bagus banget dan sesuai persis sama yg di tiktok", time: "11.01" },
            { sender: "customer", text: "detailnya juga rapih banget, keliatan niat dan effortnya. ownernya juga ramah banget jadi aku nyaman order di sini definitely bakal order lagi next time, sukses terus ya kak!", time: "11.01" },
            { sender: "admin", text: "Hihi thank you smm kak for the review", time: "11.47" },
            { sender: "admin", text: "Aku izin buat testimoni yaa", time: "11.47" },
            { sender: "customer", text: "okeii kaaa siap", time: "12.15" }
        ]
    },

    // 6. INVITATION EDITION — AKHIRNYA BAIKAN JUGA
    {
        id: "testi-6",
        customerAlias: "Kak R*** (Verified Buyer)",
        productName: "Invitation Edition",
        productId: "invitation",
        productCategory: "Date Ticket",
        highlightQuote: "makasi juga ya kak... KAKK THANK U YAA AKHIR NYA BAIKAN JUGAAA",
        occasion: "Minta Maaf & Baikan",
        rating: 5,
        timeAgo: "5 hari yang lalu",
        messages: [
            { sender: "customer", text: "makasi juga ya kak, tiket undangannya udah dibaca", time: "12.50" },
            { sender: "customer", text: "dia seneng banget liat countdown dinnernya", time: "12.51" },
            { sender: "customer", text: "KAKK THANK U YAA AKHIR NYA BAIKAN JUGAAA", time: "12.56" },
            { sender: "admin", text: "hihihi you're most welcome kakk, seneng banget dengernya!", time: "14.17" },
            { sender: "customer", text: "makasih banyaak kakk penyelamat", time: "14.20" }
        ]
    },

    // 7. ARCADE EDITION — TERHARU BANGET SAMA WEB KAKAK
    {
        id: "testi-7",
        customerAlias: "Kak K*** (Verified Buyer)",
        productName: "Arcade Edition",
        productId: "arcade",
        productCategory: "Pixel Adventure",
        highlightQuote: "makasih banyak ya kak dia terharu banget sama web kakak next aku order lagi ya",
        occasion: "Ulang Tahun Cowok",
        rating: 5,
        timeAgo: "6 hari yang lalu",
        messages: [
            { sender: "customer", text: "makasih banyak ya kak dia terharu banget sama web kakak next aku order lagi ya", time: "10.58" },
            { sender: "customer", text: "dia main game 10 ruangannya sampe tamat wkwk", time: "10.59" },
            { sender: "admin", text: "Hihi thank you sm kakk, surat di ruangan terakhir kebuka kan?", time: "11.02" },
            { sender: "customer", text: "kebuka min, langsung salting parah dia", time: "11.05" },
            { sender: "admin", text: "mantap kakk, langgeng terus yaa", time: "11.06" }
        ]
    },

    // 8. MEMORIA / WRAPPED — APALAGI ADA LAGUNYA, BAGUS BANGET
    {
        id: "testi-8",
        customerAlias: "Kak V*** (Verified Buyer)",
        productName: "Memoria (Wrapped)",
        productId: "memoria",
        productCategory: "Story Recap",
        highlightQuote: "iyaa kak, terharu banget saya.. apalagi ada lagunya, BAGUS BANGET... mantan saya suka",
        occasion: "Nostalgia Spesial",
        rating: 5,
        timeAgo: "1 minggu yang lalu",
        messages: [
            { sender: "admin", text: "Senang kalo hasilnya sesuai ekspetasi", time: "18.30" },
            { sender: "customer", text: "iyaa kak, terharu banget saya.. apalagi ada lagunya, BAGUS BANGET", time: "18.34" },
            { sender: "customer", text: "mantan saya suka", time: "18.34" },
            { sender: "admin", text: "Alhamdulillah kak, semoga membawa kebaikan yaa", time: "18.36" },
            { sender: "customer", text: "aamiin kak, makasih banyak yaa", time: "18.40" }
        ]
    },

    // 9. MIXTAPE EDITION — DEYMMM SUKAA BNGDD BINTANGGG LIMAKK
    {
        id: "testi-9",
        customerAlias: "Kak D*** (Verified Buyer)",
        productName: "Mixtape Edition",
        productId: "mixtape",
        productCategory: "Retro Cassette",
        highlightQuote: "DEYMMM SUKAA BNGDD... MAKASIH BANYAA MIMINN CANTIII/ GANTENFG... amanahhh bngdd, bintangg limakk",
        occasion: "Playlist Kado Spesial",
        rating: 5,
        timeAgo: "1 minggu yang lalu",
        messages: [
            { sender: "customer", text: "DEYMMM SUKAA BNGDD", time: "21.10" },
            { sender: "customer", text: "MAKASIH BANYAA MIMINN CANTIII/ GANTENFG", time: "21.10" },
            { sender: "customer", text: "amanahhh bngdd, bintanggg limakk", time: "21.11" },
            { sender: "admin", text: "hihi you're most welcome kakkk, thanks juga yaaa", time: "21.11" },
            { sender: "customer", text: "iyaa mimin, sehat sehat terus ya", time: "21.11" }
        ]
    },

    // 10. RETRO WIN98 — COCOK BAGUSS POWWLL MINNN
    {
        id: "testi-10",
        customerAlias: "Kak B*** (Verified Buyer)",
        productName: "Retro Win98",
        productId: "retro",
        productCategory: "Windows 98 OS",
        highlightQuote: "Minnn, cocok baguss powwll minnn makasih banyak ya minn, lancar2 usahanya minn. semoga dia suka ya min",
        occasion: "Surprise Akhir Pekan",
        rating: 5,
        timeAgo: "1 minggu yang lalu",
        messages: [
            { sender: "customer", text: "Minnn, cocok baguss powwll minnn makasih banyak ya minn, lancar2 usahanya minn. semoga dia suka ya min", time: "10.30" },
            { sender: "customer", text: "ini rencana aku ngirim.ke dia malem minggu aman kan min?", time: "10.30" },
            { sender: "customer", text: "ngga ada tenggat waktunya kan?", time: "10.30" },
            { sender: "admin", text: "aamin kakk, gaada tenggat waktu aktif selamanya kok", time: "10.32" },
            { sender: "customer", text: "okeey siaap minn, good luck yaa", time: "10.33" }
        ]
    },

    // 11. VOICES GIFT — COWO AKU TERHARU AMPE NANGIS
    {
        id: "testi-11",
        customerAlias: "Kak P*** (Verified Buyer)",
        productName: "Voices Gift",
        productId: "voices",
        productCategory: "Voice & Music",
        highlightQuote: "Makasiihh ya kak cowo aku terharu ampe nangis wkwk, next bakal order disini lagii",
        occasion: "Kado Pacar Cowok",
        rating: 5,
        timeAgo: "2 minggu yang lalu",
        messages: [
            { sender: "customer", text: "Makasiihh ya kak cowo aku terharu ampe nangis wkwk, next bakal order disini lagii", time: "03.15" },
            { sender: "customer", text: "dia dengerin voicenote nya diulang2 terus", time: "03.16" },
            { sender: "admin", text: "you're very welcome kakkk, thanks juga yaa", time: "05.04" },
            { sender: "admin", text: "seneng banget kalau kadonya berkesan", time: "05.05" },
            { sender: "customer", text: "bangett kakk makasiih yaa", time: "05.10" }
        ]
    },

    // 12. THE GIFT BOX — TINGGAL NUNGGU ORANGNYA DATANG
    {
        id: "testi-12",
        customerAlias: "Kak T*** (Verified Buyer)",
        productName: "The Gift Box",
        productId: "the-gift-box",
        productCategory: "Physical + Digital",
        highlightQuote: "thankss ya min... tinggal nunggu orangnya datang... OMG so cutee!",
        occasion: "Birthday Surprise",
        rating: 5,
        timeAgo: "2 minggu yang lalu",
        messages: [
            { sender: "customer", text: "thankss ya min paketnya udah mendarat", time: "16.22" },
            { sender: "customer", text: "tinggal nunggu orangnya datang", time: "16.22" },
            { sender: "admin", text: "OMG so cutee, bonekanya aman kan kak?", time: "16.35" },
            { sender: "customer", text: "aman banget min, rapih pol", time: "16.36" },
            { sender: "admin", text: "Good luck kakkk acaranya nanti!", time: "16.37" }
        ]
    },

    // 13. LETTER EDITION — UDAH DIKIRIM KE TEMENKU DIA SUKA TERHARU
    {
        id: "testi-13",
        customerAlias: "Kak L*** (Verified Buyer)",
        productName: "Letter Edition",
        productId: "letter",
        productCategory: "Digital Letter",
        highlightQuote: "Kaaa makasih yaa, udahh dikirim sma temenkuu.. Alhamdulillah diaa sukaa, terharuuu",
        occasion: "Kado Sahabat",
        rating: 5,
        timeAgo: "2 minggu yang lalu",
        messages: [
            { sender: "customer", text: "Kaaa makasih yaa, udahh dikirim sma temenkuu.. Alhamdulillah diaa sukaa, terharuuu", time: "09.59" },
            { sender: "customer", text: "katanya amplop lilinnya estetik banget pas dibuka", time: "10.00" },
            { sender: "admin", text: "You're welcome kakk, so happy to hear that", time: "15.55" },
            { sender: "admin", text: "semoga persahabatannya langgeng yaa", time: "15.56" },
            { sender: "customer", text: "aamiin kakk, thank youu", time: "16.00" }
        ]
    },

    // 14. MIXTAPE EDITION — LUCUUU BANGETT SUKAAA
    {
        id: "testi-14",
        customerAlias: "Kak C*** (Verified Buyer)",
        productName: "Mixtape Edition",
        productId: "mixtape",
        productCategory: "Retro Cassette",
        highlightQuote: "thank uuu kakk, lucuuu bangett, sukaaa",
        occasion: "Anniversary Kaset",
        rating: 5,
        timeAgo: "2 minggu yang lalu",
        messages: [
            { sender: "customer", text: "thank uuu kakk, lucuuu bangett, sukaaa", time: "23.11" },
            { sender: "customer", text: "kasetnya muter lagu kita berdua", time: "23.12" },
            { sender: "admin", text: "Hihi thank youu kak, seneng kalau sukaa", time: "23.15" },
            { sender: "customer", text: "worth it parah sih ini min", time: "23.16" },
            { sender: "admin", text: "makasih reviewnya ya kakk", time: "23.18" }
        ]
    },

    // 15. ARCADE EDITION — PUAS BANGET ORDER KE KAMU
    {
        id: "testi-15",
        customerAlias: "Kak W*** (Verified Buyer)",
        productName: "Arcade Edition",
        productId: "arcade",
        productCategory: "Pixel Adventure",
        highlightQuote: "done, terimakasiii kembali kakk... puas bnget order ke kamu kak asli, disamping amanah bngtt, kakanya juga menyenangkan n sabarr bngt",
        occasion: "Custom Order Game",
        rating: 5,
        timeAgo: "3 minggu yang lalu",
        messages: [
            { sender: "customer", text: "done, terimakasiii kembali kakk", time: "22.54" },
            { sender: "customer", text: "puas bnget order ke kamu kak asli, disamping amanah bngtt, kakanya juga menyenangkan n sabarr bngt", time: "22.55" },
            { sender: "admin", text: "hihi aman kakk, makasih banyak atas kepercayaannya", time: "22.58" },
            { sender: "admin", text: "thanks for the review yaaa", time: "22.58" },
            { sender: "customer", text: "sama-sama kakk, sukses terus yaa", time: "23.00" }
        ]
    },

    // 16. RETRO WIN98 — KAKK MAKASII BANYAK SUKA BANGET
    {
        id: "testi-16",
        customerAlias: "Kak G*** (Verified Buyer)",
        productName: "Retro Win98",
        productId: "retro",
        productCategory: "Windows 98 OS",
        highlightQuote: "Kakk makasii banyak yaaa suka bangett, next aku order lagii yaa~",
        occasion: "Kejutan Retro 98",
        rating: 5,
        timeAgo: "3 minggu yang lalu",
        messages: [
            { sender: "customer", text: "Kakk makasii banyak yaaa suka bangett, next aku order lagii yaa~", time: "20.15" },
            { sender: "customer", text: "temenku kaget ada OS win98 isi foto kita wkwk", time: "20.16" },
            { sender: "admin", text: "Hihi urwell kak, thanks juga yaa sudah order", time: "20.20" },
            { sender: "customer", text: "siap min, nanti ada ultah lagi aku kabarin", time: "20.22" },
            { sender: "admin", text: "ditunggu ya kakk!", time: "20.25" }
        ]
    },

    // 17. MEMORIA / WRAPPED — UDAH BIKIN NANGIEZZSS KECIL
    {
        id: "testi-17",
        customerAlias: "Kak Y*** (Verified Buyer)",
        productName: "Memoria (Wrapped)",
        productId: "memoria",
        productCategory: "Story Recap",
        highlightQuote: "aku baru nyoba nyoba aja, tapi udah bikin nangiezzss kecil... THANK YOUU SO MUCH YAA KAK, BENER BENER GA RUGI...",
        occasion: "Special Memories",
        rating: 5,
        timeAgo: "3 minggu yang lalu",
        messages: [
            { sender: "customer", text: "aku baru nyoba nyoba aja, tapi udah bikin nangiezzss kecil", time: "20.28" },
            { sender: "customer", text: "ga kebayang kalo temen aku yang baca nanti,,,,", time: "20.28" },
            { sender: "customer", text: "THANK YOUU SO MUCH YAA KAK, BENER BENER GA RUGI... PASTI INI JADI HAL YANG MEMORABLE BANGET, THANK YOUU SEKALI LAGI KAK", time: "20.30" },
            { sender: "admin", text: "Heheh sama2 yaa kakk, seneng kalau berkesan", time: "20.32" },
            { sender: "customer", text: "sukses selalu usahanya kak", time: "20.33" }
        ]
    },

    // 18. THE GIFT BOX — IYAAA KAAA MAKASI AKU SUKA N PUAS
    {
        id: "testi-18",
        customerAlias: "Kak H*** (Verified Buyer)",
        productName: "The Gift Box",
        productId: "the-gift-box",
        productCategory: "Physical + Digital",
        highlightQuote: "thanks yaa kak... iyaaa kaaa makasi ya ka, aku suka n puas sama hasilnyaa",
        occasion: "Hampers Mewah",
        rating: 5,
        timeAgo: "3 minggu yang lalu",
        messages: [
            { sender: "admin", text: "thanks yaa kak, paketnya udah sampai dengan aman kan?", time: "10.04" },
            { sender: "customer", text: "iyaaa kaaa makasi ya ka, aku suka n puas sama hasilnyaa", time: "10.26" },
            { sender: "customer", text: "kartu QR nya pas di-scan langsung muncul webnya", time: "10.27" },
            { sender: "admin", text: "Alhamdulillah kakk, terima kasih banyak yaa", time: "10.30" },
            { sender: "customer", text: "sama-sama kak, recomended bangett", time: "10.35" }
        ]
    },

    // 19. LETTER EDITION — NGGA NYESEL ORDER DI KAKANYA
    {
        id: "testi-19",
        customerAlias: "Kak A*** (Verified Buyer)",
        productName: "Letter Edition",
        productId: "letter",
        productCategory: "Digital Letter",
        highlightQuote: "makasihhh yaa kaa nggaa nyesel order di kaka nyaa, lain kali kalo mau bikin ginian lagi di kaka nya ajaa udaa mah murah cepet bagus lagi...",
        occasion: "Kado Cewek",
        rating: 5,
        timeAgo: "1 bulan yang lalu",
        messages: [
            { sender: "admin", text: "udah aman yaa kakk. tinggal aku bikinin barcode-nya yaa", time: "17.10" },
            { sender: "customer", text: "makasihhh yaa kaa nggaa nyesel order di kaka nyaa, lain kali kalo mau bikin ginian lagi di kaka nya ajaa udaa mah murah cepet bagus lagi, inti nyaa makasihhh banget kaaa pasti cewe akuu sukaaa kalo di kasih ginian, sekali lagi makasihh kaa", time: "17.15" },
            { sender: "admin", text: "hihi you're most welcome kak! thanks for the review yaa kak", time: "17.33" },
            { sender: "customer", text: "siap kakk, nanti aku rekomendasiin ke temen2", time: "17.35" }
        ]
    },

    // 20. LETTER EDITION — LINK SURATNYA HASILNYA BAGUS BANGET
    {
        id: "testi-20",
        customerAlias: "Kak Z*** (Verified Buyer)",
        productName: "Letter Edition",
        productId: "letter",
        productCategory: "Digital Letter",
        highlightQuote: "link suratnya udah aku bikin dan semuanya udah selesai yaa... hasilnya bagus banget dan aku sukaa. Semoga usahanya makin lancar...",
        occasion: "Surat Kenangan",
        rating: 5,
        timeAgo: "1 bulan yang lalu",
        messages: [
            { sender: "customer", text: "Hi kak! Aku mau kasih kabar aja, link suratnya udah aku bikin dan semuanya udah selesai yaa. Makasih banyak kak karena udah bantu proses pesenannya dari awal sampai akhir, hasilnya bagus banget dan aku sukaa. Semoga usahanya makin lancar dan makin banyak yang order ya kak. Terima kasih sekali lagi!", time: "15.07" },
            { sender: "admin", text: "Thank you so much for the heartwarming review kak", time: "15.15" },
            { sender: "admin", text: "Thanks juga yaa sudah mempercayakan momennya di sini", time: "15.15" },
            { sender: "customer", text: "sama-samaa kakk", time: "15.18" }
        ]
    }
];
