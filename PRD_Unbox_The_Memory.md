# 📋 PRODUCT REQUIREMENT DOCUMENT (PRD) — "UNBOX THE MEMORY"
### Inisiatif: Hybrid Physical + Digital Gift Experience (Direct E-Commerce & Logistics)
### Platform: **For you, Always.** — Digital Atelier
### Versi: 2.0 (Production Architecture) • Tanggal: 17 Agustus 2026

---

## 1. EXECUTIVE SUMMARY & LATAR BELAKANG

**For you, Always.** awalnya beroperasi sebagai platform kado digital murni (Letter, Voices, Mixtape, Invitation, Arcade, Retro, Wrapped, Memoria).

**Inisiatif "Unbox the Memory"** memperluas value proposition brand dengan menghadirkan **hampers gift box fisik premium** yang di dalamnya disematkan **kartu eksklusif ber-QR Code unik**. Ketika penerima memindai QR code tersebut, mereka diarahkan ke pengalaman kado digital interaktif yang telah dipersonalisasi oleh pengirim.

Berbeda dari rancangan awal yang hanya berupa showcase brand awareness ke marketplace luar, inisiatif ini kini telah berkembang penuh menjadi **Sistem Direct Web E-Commerce Terintegrasi**:
- Penjualan langsung di website utama (`/unbox-the-memory`).
- Kalkulasi ongkir otomatis dan pemilihan kurir via **Biteship API**.
- Checkout multi-step (Kustomisasi Digital + Alamat Pengiriman Fisik).
- Pelacakan pesanan real-time bagi pembeli (`/order-status`).
- Manajemen pemenuhan order, stok fisik, dan dispatch kurir di Admin Dashboard (`/atelier-hq`).

---

## 2. ARSITEKTUR PRODUK & USER EXPERIENCE

```
+-----------------------------------------------------------------------------------+
| 1. STOREFRONT & PEMILIHAN PRODUK                                                  |
|    URL: /unbox-the-memory                                                         |
|    - 3 Varian: Letter Edition (Rp 89k), Voices Gift (Rp 85k), Memoria (Rp 115k)  |
|    - Real-Time Inventory Stock Badge (Tersisa X box / Sold Out)                   |
+-----------------------------------------+-----------------------------------------+
                                          | Klik "Pesan Gift Box"
                                          v
+-----------------------------------------------------------------------------------+
| 2. MULTI-STEP CHECKOUT & LOGISTICS                                                |
|    Komponen: CartCheckoutModal.tsx                                                |
|    - Step 1: Data Kontak Pemesan (Nama, Email, No. WhatsApp)                     |
|    - Step 2: Form Alamat Fisik Penerima (Alamat, Kecamatan, Kota, Kode Pos)       |
|    - Step 3: Hitung Ongkir Otomatis via Biteship API (SiCepat BEST, Reguler, J&T) |
|    - Step 4: Pembayaran via Gateway Terpusat (Pakasir / DOKU)                     |
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
|    - Filter Tab: Menunggu Pengisian | Siap Packing | Sudah Dikirim               |
|    - Cetak QR Barcode: Generate QR Code kado untuk diselipkan ke dalam box        |
|    - Request Pick-up: Panggil Kurir via Biteship API (Generate Resi Otomatis)     |
|    - Internal Live Tracking: Modal pelacakan posisi paket real-time               |
|    - Manajemen Stok: Ubah kuota box & atur ambang batas peringatan stok          |
+-----------------------------------------------------------------------------------+
```

---

## 3. SPESIFIKASI TEKNIS & INTEGRASI API

### 3.1 Integrasi Logistik Biteship
1. **Perhitungan Ongkir (`POST /api/shipping/rates`):**
   * Menghitung ongkos kirim real-time berdasarkan berat paket (500 gram) dan koordinat/nama kecamatan tujuan.
   * Menampilkan pilihan kurir: SiCepat (BEST, Reguler, GOKIL Cargo), J&T, JNE.
2. **Penjemputan Paket (`POST /api/shipping/dispatch`):**
   * Mengirim request pick-up ke kurir resmi melalui Biteship API.
   * Parameter pengirim dienkripsi secara anonim: `"For you, Always."` (tanpa nama pribadi).
   * Menghasilkan nomor waybill (`tracking_number`) dan link pelacakan resmi Biteship.
3. **Live Real-time Tracking (`GET /api/shipping/track`):**
   * Endpoint server-side Next.js yang mengambil riwayat checkpoint transit kurir secara live tanpa delay.

### 3.2 Penyimpanan Data (Cloudflare D1 `orders_db`)
Tabel `orders` menampung atribut:
- `order_id`: ID unik pesanan (`ORD-XXXXXXX`).
- `product_id`: Varian kado (`unbox_letter`, `unbox_voices`, `unbox_loves`).
- `shipping_details`: JSON terstruktur berisi nama penerima, alamat, kurir, dan biaya ongkir.
- `customization_status`: Status pengerjaan kado digital (`draft` / `published`).
- `fulfillment_status`: Status fisik (`unfulfilled` / `ready_to_pack` / `shipped`).
- `tracking_number`: Nomor resi ekspedisi resmi.
- `courier`: Nama ekspedisi & layanan pengiriman.

---

## 4. DESIGN SYSTEM & ATURAN VISUAL
- **Palet Warna Brand Atelier:**
  - Background Utama: Warm Cream `#FAF7F2`
  - Border & Garis Halus: Sand / Driftwood `#EBDCD0` / `#DCD1C6`
  - Teks & Heading Utama: Deep Espresso `#1D1816` & Soft Brown `#6E5C53`
  - Aksen Status Hijau (Success): `#2E7D32` & Soft Green `#E8F5E9`
  - Aksen Status Emas / Bronze: Honey Brown `#A67C52`
- **Tipografi:**
  - Display Font: Cormorant Garamond (`--font-cormorant`)
  - Body Font: DM Sans (`--font-dm-sans`)
- **Kebijakan Visual:**
  - Tampilan bersih tanpa emoji pada tombol dan teks status formal.
  - Komponen responsive mobile-first dengan text-wrapping rapi.

---

## 5. STATUS IMPLEMENTASI & DAFTAR TUGAS

- [x] Landing Page Showcase `/unbox-the-memory`
- [x] Multi-Step Checkout Modal dengan Hitung Ongkir Biteship
- [x] Dual Gateway Support & Order Creation ke Cloudflare D1
- [x] Admin Dashboard Atelier HQ (`/atelier-hq`)
- [x] Modul Biteship Courier Dispatch (Panggil Kurir Otomatis)
- [x] Generator Cetak QR Code Kado Fisik
- [x] Halaman Customer Dynamic 4-Step Order Status (`/order-status`)
- [x] Live Real-time Courier Tracking API & Timeline Tracker
- [x] Email Notifikasi Transaksi dengan Link Status & Lacak Resi
- [ ] Tombol Konfirmasi WhatsApp di Studio Editor (Letter & Voices Gift)
