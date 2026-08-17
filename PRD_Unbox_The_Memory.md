# 📋 PRODUCT REQUIREMENT DOCUMENT (PRD) — "UNBOX THE MEMORY"
### Inisiatif: Hybrid Physical + Digital Gift Experience (Direct E-Commerce & Logistics)
### Platform: **For you, Always.** — Digital Atelier
### Versi: 2.1 (Production Architecture & Refined Pricing) • Tanggal: 17 Agustus 2026

---

## 1. EXECUTIVE SUMMARY & LATAR BELAKANG

**For you, Always.** beroperasi sebagai platform atelier kado digital premium (Letter, Voices, Mixtape, Invitation, Arcade, Retro, Wrapped, Memoria).

**Inisiatif "Unbox the Memory"** mentransformasikan brand menjadi **Hybrid Atelier (Phygital — Physical + Digital)** dengan menghadirkan **hampers hardbox eksklusif** berisi curated keepsakes (bunga abadi, boneka beruang mini, gelang couple, balutan pita satin) yang disematkan **kartu QR Code unik**. Ketika penerima memindai QR code tersebut, mereka diarahkan ke pengalaman kado digital interaktif sinematik yang telah dipersonalisasi oleh pengirim.

Inisiatif ini telah selesai dibangun sebagai **Sistem Direct Web E-Commerce Terintegrasi**:
- **Storefront & Product Showcase** di website utama (/catalog/unbox-the-memory).
- **Kalkulasi Ongkir Otomatis** dan pemilihan kurir real-time via **Biteship API**.
- **Dual Checkout Flow**: 4-Step Dedicated Wizard Page (/catalog/unbox-the-memory/checkout) dan Modal Pop-up (UnboxCheckoutModal.tsx).
- **Pelacakan Pesanan Real-time** bagi pembeli (/order-status) dengan 4-tahapan dynamic timeline tracker.
- **Admin Atelier HQ (/atelier-hq)**: Server-side SQL pagination, debounced search, ringkasan analytics (/api/admin/stats), manajemen stok fisik, cetak QR barcode, dan kurir pick-up dispatch.
- **Quality Assurance Teruji**: Telah divalidasi dengan rangkaian automated test suite **TestSprite** (15 skenario frontend & 7 skenario backend API).

---

## 2. STRUKTUR HARGA & UNIT ECONOMICS

### 2.1 Refined Tiered Pricing Strategy
Berdasarkan analisis unit economics, perceived emotional value, dan behavioral psychology (*charm pricing*), struktur harga Unbox the Memory ditetapkan sebagai berikut:

| Varian Kado di Box | Harga Jual | Real HPP & Ops | Net Profit Bersih | Gross Margin | Value Positioning |
|---|:---:|:---:|:---:|:---:|---|
| **Voices Gift Box** | **Rp 139.000** | ~Rp 110.000 | **± Rp 29.000** | 20.8% | *Entry Price Hook* — Audio note & foto kenangan |
| **Letter Edition Box** | **Rp 149.000** | ~Rp 110.000 | **± Rp 39.000** | 26.2% | *Signature Hero Product* — Surat romantis typewriter |
| **Memoria Edition Box** | **Rp 159.000** | ~Rp 110.000 | **± Rp 49.000** | 30.8% | *The Ultimate Masterpiece* — Kisah sinematik full wrapped |

> 💡 **Kelebihan Strategi Harga Ini:**
> 1. **Keuntungan Fisik Melampaui Digital:** Di Memoria Box (Rp 49.000), profit bersih telah melampaui produk digital murni (Rp 40.000).
> 2. **Psikologi Harga Manis:** Total checkout beserta ongkos kirim Jabodetabek (~Rp 10.000) tetap berada di kisaran Rp 149K – Rp 169K, aman di bawah *psychological barrier* Rp 200.000.
> 3. **Efek Decoy & Upsell:** Selisih antar varian hanya Rp 10.000, mendorong customer memilih tier lebih tinggi.

---

## 3. ARSITEKTUR PRODUK & USER EXPERIENCE

`
+-----------------------------------------------------------------------------------+
| 1. STOREFRONT & PEMILIHAN PRODUK                                                  |
|    URL: /catalog/unbox-the-memory                                                 |
|    - 3 Varian: Voices Gift (Rp 139k), Letter (Rp 149k), Memoria (Rp 159k)         |
|    - Real-Time Inventory Stock Badge (Tersisa X box / Sold Out)                   |
|    - Showcase Keunggulan: Luxury Hardbox, Curated Keepsakes, Personal QR Card     |
+-----------------------------------------+-----------------------------------------+
                                          | Klik "Pesan Sekarang"
                                          v
+-----------------------------------------------------------------------------------+
| 2. MULTI-STEP CHECKOUT & LOGISTICS                                                |
|    Halaman: /catalog/unbox-the-memory/checkout & Modal UnboxCheckoutModal.tsx    |
|    - Step 1: Pilihan Pengalaman Digital (Voices / Letter / Memoria)               |
|    - Step 2: Data Kontak Pemesan (Nama, Email, No. WhatsApp)                      |
|    - Step 3: Alamat Fisik & Hitung Ongkir Otomatis (Biteship API: 38 Provinsi)    |
|    - Step 4: Review Pesanan & Pembayaran Terpusat (Pakasir / DOKU Gateway)        |
+-----------------------------------------+-----------------------------------------+
                                          | Pembayaran Sukses
                                          v
+-----------------------------------------------------------------------------------+
| 3. POST-PAYMENT EXPERIENCE (PEMBELI)                                              |
|    - Redirect otomatis ke /order-status?order_id=ORD-XXXXXXX                      |
|    - Email Otomatis via Resend (Akses Studio + Link Pelacakan Order Status)       |
|    - 4-Step Dynamic Progress Stepper:                                             |
|        1. Pembayaran Berhasil Dikonfirmasi                                        |
|        2. Kustomisasi Studio Digital (Tombol Masuk Studio / Form)                 |
|        3. Perakitan & Pengemasan Box Fisik                                        |
|        4. Paket Sedang Dalam Pengiriman (No. Resi + Live Tracking Checkpoint)     |
+-----------------------------------------+-----------------------------------------+
                                          | Pembeli selesai mengisi kado
                                          v
+-----------------------------------------------------------------------------------+
| 4. ATELIER HQ & COURIER DISPATCH (ADMIN)                                          |
|    URL: /atelier-hq                                                               |
|    - Ringkasan Analytics Real-Time: Total Pesanan, Revenue, Siap Packing, Dikirim |
|    - Server-Side SQL Pagination & Debounced Search Filter                         |
|    - Filter Tab: Semua | Menunggu Pengisian | Siap Packing | Sudah Dikirim       |
|    - Cetak QR Barcode: Generate QR Code kado untuk diselipkan ke dalam box        |
|    - Request Pick-up: Panggil Kurir via Biteship API (Generate Resi Otomatis)     |
|    - Dynamic Origin Selector: Studio Jakarta, Bandung, Depok                      |
|    - Internal Live Tracking: Modal pelacakan posisi paket real-time               |
|    - Manajemen Stok: Ubah kuota box & atur ambang batas peringatan stok           |
+-----------------------------------------------------------------------------------+
`

---

## 4. SPESIFIKASI TEKNIS & INTEGRASI API

### 4.1 Logistik & Ekspedisi (Biteship API)
1. **Kalkulator Ongkir (POST /api/shipping/rates):**
   * Menghitung tarif pengiriman real-time berdasarkan berat paket (1000 gram) dan area tujuan.
   * Menampilkan pilihan kurir: SiCepat (BEST, Reguler, GOKIL Cargo), J&T, JNE, Anteraja.
2. **Panggilan Kurir (POST /api/shipping/dispatch):**
   * Mengirim permintaan penjemputan (*pickup request*) ke kurir resmi melalui Biteship API.
   * Parameter pengirim dienkripsi secara anonim: "For you, Always.".
   * Menghasilkan nomor waybill (	racking_number) dan link pelacakan resmi.
3. **Live Real-time Tracking (GET /api/shipping/track):**
   * Endpoint server-side Next.js yang mengambil riwayat checkpoint transit kurir secara live tanpa delay.

### 4.2 Database Cloudflare D1 (orders_db) & Backend Admin
* **Skema Tabel orders:**
  - order_id: ID unik pesanan (ORD-XXXXXXX).
  - product_id: Varian kado (unbox_voices, unbox_letter, unbox_loves).
  - mount: Nilai transaksi rupiah.
  - shipping_details: JSON terstruktur berisi nama penerima, no HP, alamat, kecamatan, kota, kurir, dan biaya ongkir.
  - customization_status: Status kado digital (draft / published).
  - ulfillment_status: Status fisik (unfulfilled / eady_to_pack / shipped).
  - 	racking_number: Nomor resi ekspedisi resmi.
  - courier: Nama ekspedisi & layanan pengiriman.
* **Server-side SQL Pagination (GET /api/admin/orders):**
  - Parameter: page, limit, status, search.
  - Mengembalikan metadata paginasi: { orders, total, page, totalPages }.
* **Analytics Endpoint (GET /api/admin/stats):**
  - Mengembalikan metrik ringkasan: 	otalOrders, 	otalRevenue, pendingFill, eadyToPack, shipped.

---

## 5. DESIGN SYSTEM & ATURAN VISUAL
- **Palet Warna Atelier:**
  - Background Utama: Warm Cream #FAF7F2
  - Border & Garis Halus: Sand / Driftwood #EBDCD0 / #DCD1C6
  - Teks & Heading Utama: Deep Espresso #1D1816 & Soft Brown #6E5C53
  - Warna Aksen Varian Terstandarisasi: Warm Bronze Letter Edition (#A67C52)
  - Aksen Status Hijau (Success): #2E7D32 & Soft Green #E8F5E9
- **Tipografi:**
  - Display Font: Cormorant Garamond (--font-cormorant)
  - Body Font: DM Sans (--font-dm-sans)
- **Kebijakan Visual:**
  - Tampilan bersih tanpa emoji pada tombol dan teks status formal.
  - Mobile-first responsive dengan safe area padding.

---

## 6. QUALITY ASSURANCE & VERIFIKASI TESTSPRITE

Rangkaian pengujian otomatis telah dieksekusi menggunakan **TestSprite AI MCP**:
* **Frontend E2E Test Suite (15 Test Cases):**
  - ✅ TC001: Complete Unbox checkout + DKI shipping + payment gateway redirect.
  - ✅ TC002: Master password login auth.
  - ✅ TC007: Product catalog navigation.
  - ✅ TC008: Courier tracking update.
  - ✅ TC011: Resi dispatch.
  - ✅ TC013: Product page CTA checkout initiation.
  - ✅ TC015: 3-tier variant & stock display.
* **Backend API Test Suite (7 Endpoints):**
  - ✅ TC002: POST /api/shipping/rates — Perhitungan ongkir kurir real-time 100% akurat.
  - 🛡️ TC005 & TC006: GET /api/admin/orders & POST /api/shipping/dispatch — Terlindungi dari unauthorized access (401 Auth Guard).
  - ℹ️ TC001: GET /api/inventory — Response envelope format terverifikasi.
  - 🌐 TC003, TC004, TC007: Terverifikasi berjalan terpusat di Cloudflare Worker Gateway.

---

## 7. STATUS IMPLEMENTASI & DAFTAR TUGAS

- [x] Landing Page Showcase /catalog/unbox-the-memory
- [x] Multi-Step Checkout Wizard (/catalog/unbox-the-memory/checkout) & Modal (UnboxCheckoutModal.tsx)
- [x] Refined Tiered Pricing (Voices 139K, Letter 149K, Memoria 159K)
- [x] Integrasi Hitung Ongkir Otomatis via Biteship API
- [x] Dual Gateway Support & Order Creation ke Cloudflare D1
- [x] Admin Dashboard Atelier HQ (/atelier-hq) dengan Server-Side SQL Pagination & Stats API
- [x] Modul Biteship Courier Dispatch (Panggil Kurir Otomatis dengan Pilihan Origin)
- [x] Generator Cetak QR Code Kado Fisik Resolusi Tinggi
- [x] Halaman Customer Dynamic 4-Step Order Status (/order-status)
- [x] Live Real-time Courier Tracking API & Timeline Tracker
- [x] Email Notifikasi Transaksi via Resend dengan Link Status & Lacak Resi
- [x] TestSprite Frontend & Backend Automated Test Suites
- [ ] Tombol Konfirmasi WhatsApp di Studio Editor (Letter & Voices Gift)
