# 🚀 PANDUAN & CHECKLIST DEPLOYMENT KE MAIN WEBSITE (PRODUCTION)
### Fitur: **Unbox the Memory (Physical + Digital Hybrid Gift E-Commerce)**
### Platform: **For you, Always.** — Digital Atelier
### Versi: 2.1 • Terakhir Diperbarui: 17 Agustus 2026

---

## 📌 1. DAFTAR ENVIRONMENT VARIABLES (.ENV) UNTUK VERCEL PRODUCTION

Saat nanti branch eat/unbox-ecommerce di-merge ke branch main, tambahkan / pastikan seluruh Environment Variables berikut sudah terdaftar di **Vercel Dashboard** (Project Settings > Environment Variables > Target: Production):

| Key Variabel | Nilai / Keterangan | Status Wajib |
|---|---|---|
| ADMIN_PASSWORD | Kata sandi login dashboard /atelier-hq (Default: Aldobotak1@) | **WAJIB** |
| CLOUDFLARE_D1_API_KEY | API Token Cloudflare D1 (akses database orders_db) | **WAJIB** |
| CLOUDFLARE_ACCOUNT_ID | 1fd49662a11579a8f5e6f842f77ee5bd | **WAJIB** |
| CLOUDFLARE_DATABASE_ID | 1fa17bf3-d594-442a-8c77-e7244b22c1a5 | **WAJIB** |
| BITESHIP_API_KEY | **GANTI KE API KEY PRODUCTION BITESHIP** (iteship_live.xxxx) | **KRITIKAL** |
| NEXT_PUBLIC_PAYMENT_GATEWAY_URL | https://pakasir-gateway.aldoramadhan16.workers.dev (Worker Production) | **KRITIKAL** |

> 💡 **Info Alamat Penjemputan Kurir (Origin):**
> * Alamat penjemputan paket kurir (Origin) **TIDAK PERLU** diatur di .env, karena sudah bisa dipilih dan diubah secara dinamis langsung di form modal **Admin Dashboard (/atelier-hq)** (Studio Jakarta, Bandung, Depok).

> ⚠️ **PERHATIAN KHUSUS API KEY BITESHIP:**
> * API Key yang saat ini ada di .env.local adalah **Biteship Sandbox (iteship_test.xxx)**.
> * Sebelum live ke main, buka dashboard **Biteship Console** (dashboard.biteship.com), ambil **Production Secret Key (iteship_live.xxx)**, dan pastikan saldo Biteship kamu sudah terisi agar kurir bisa di-dispatch.

---

## 📌 2. RENCANA MIGRASI DARI pakasir-sandbox KE pakasir-gateway (PRODUCTION WORKER)

Saat ini seluruh fitur pesanan fisik, pengurangan stok otomatis, dan email khusus Unbox the Memory telah diuji dan berjalan sempurna di folder pakasir-sandbox.

### Perbedaan yang Akan Di-Sync ke pakasir-gateway Asli:
1. **Deteksi Varian Unbox (isPhysicalUnbox):**
   * Penanganan ID produk unbox_voices (Rp 139K), unbox_letter (Rp 149K), dan unbox_loves (Rp 159K).
   * Mapping link kado studio untuk kado fisik.
2. **Penyimpanan Alamat Fisik (shipping_details):**
   * Menyimpan JSON alamat lengkap, kurir, dan ongkir ke kolom shipping_details di tabel orders D1.
3. **Pengurangan Stok Otomatis (Inventory Auto-Decrement):**
   * Query SQL otomatis saat pembayaran berhasil:
     `sql
     UPDATE inventory SET stock = MAX(0, stock - 1), updated_at = CURRENT_TIMESTAMP WHERE product_id = 'unbox-the-memory' AND stock > 0;
     `
4. **Template Email Resend Khusus Pesanan Fisik:**
   * Email yang dikirim ke pembeli menyertakan tombol masuk Studio Digital **DAN** tombol **Lacak Status Pesanan (/order-status)**.

### Yang Tetap Dipertahankan di Production Worker:
* Endpoint API Pakasir Asli (https://app.pakasir.com/api/...) — **BUKAN sandbox**.
* API Key Pakasir Asli & Resend API Key Asli.

---

## 📌 3. VERIFIKASI SEBELUM MERGE (PRE-FLIGHT AUDIT)

- [x] **TestSprite Automated Quality Assurance Passed:**
  - 15 Frontend scenarios (Checkout flow, Master password login, Admin dispatch, Dynamic tracking, Variant stock display).
  - 7 Backend API endpoints (Live shipping rates calculator, Admin auth security protection 401, Inventory query).
- [x] **Refined Tiered Pricing Verified:**
  - Voices Gift: **Rp 139.000**
  - Letter Edition: **Rp 149.000**
  - Memoria: **Rp 159.000**
  - Mulai Dari: **Rp 139.000**
- [x] **Atelier HQ Server-Side Performance:**
  - SQL LIMIT & OFFSET pagination terpasang.
  - Debounced search filter aktif.
  - Analytics API /api/admin/stats terhubung.

---

## 📌 4. LANGKAH EKSEKUSI (STEP-BY-STEP RILIS KE MAIN)

`
[ STEP 1 ] Input Environment Variables di Vercel Dashboard (Production)
     │
[ STEP 2 ] Ganti API Key Biteship dari Test ke Live Production Key & Isi Saldo
     │
[ STEP 3 ] Replace logic unbox di pakasir-gateway/src/index.js & jalankan 
px wrangler deploy
     │
[ STEP 4 ] Merge branch eat/unbox-ecommerce ke branch main di Valentine-Platform
     │
[ STEP 5 ] Git push origin main -> Vercel otomatis deploy live!
`

---

*Dokumen ini diperbarui sebagai panduan rilis resmi Unbox the Memory — For you, Always.*
