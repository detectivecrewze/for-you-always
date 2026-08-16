# 🚀 PANDUAN & CHECKLIST DEPLOYMENT KE MAIN WEBSITE (PRODUCTION)
### Fitur: **Unbox the Memory (Physical + Digital Hybrid Gift)**
### Platform: **For you, Always.** — Digital Atelier

---

## 📌 1. DAFTAR ENVIRONMENT VARIABLES (.ENV) UNTUK VERCEL PRODUCTION

Saat nanti branch `feat/unbox-ecommerce` di-merge ke branch `main`, tambahkan / pastikan seluruh Environment Variables berikut sudah terdaftar di **Vercel Dashboard** (`Project Settings > Environment Variables > Target: Production`):

| Key Variabel | Nilai / Keterangan | Status Wajib |
|---|---|---|
| `ADMIN_PASSWORD` | Kata sandi login dashboard `/atelier-hq` (misal: `Aldobotak1@`) | **WAJIB** |
| `CLOUDFLARE_D1_API_KEY` | API Token Cloudflare D1 (akses database `orders_db`) | **WAJIB** |
| `CLOUDFLARE_ACCOUNT_ID` | `1fd49662a11579a8f5e6f842f77ee5bd` | **WAJIB** |
| `CLOUDFLARE_DATABASE_ID` | `1fa17bf3-d594-442a-8c77-e7244b22c1a5` | **WAJIB** |
| `BITESHIP_API_KEY` | **GANTI KE API KEY PRODUCTION BITESHIP** (`biteship_live.xxxx`) | **KRITIKAL** |
| `NEXT_PUBLIC_PAYMENT_GATEWAY_URL` | `https://pakasir-gateway.aldoramadhan16.workers.dev` (Worker Production) | **KRITIKAL** |

> 💡 **Info Alamat Penjemputan Kurir:**
> * Alamat penjemputan paket kurir (Origin) **TIDAK PERLU** diatur di `.env`, karena sudah bisa kamu pilih dan ubah secara dinamis langsung di form modal **Admin Dashboard (`/atelier-hq`)**.

> ⚠️ **PERHATIAN KHUSUS API KEY BITESHIP:**
> * API Key yang saat ini ada di `.env.local` adalah **Biteship Sandbox (`biteship_test.xxx`)**.
> * Sebelum live ke `main`, buka dashboard **Biteship Console** (`dashboard.biteship.com`), ambil **Production Secret Key (`biteship_live.xxx`)**, dan pastikan saldo Biteship kamu sudah terisi agar kurir bisa di-dispatch.

---

## 📌 2. RENCANA MIGRASI DARI `pakasir-sandbox` KE `pakasir-gateway` (PRODUCTION WORKER)

Saat ini seluruh fitur pesanan fisik, pengurangan stok otomatis, dan email khusus Unbox the Memory telah diuji dan berjalan sempurna di folder `pakasir-sandbox`.

### Perbedaan yang Akan Di-Sync ke `pakasir-gateway` Asli:
1. **Deteksi Varian Unbox (`isPhysicalUnbox`):**
   * Penanganan ID produk `unbox_letter`, `unbox_voices`, dan `unbox_memoria`.
   * Mapping link kado studio untuk kado fisik.
2. **Penyimpanan Alamat Fisik (`shipping_details`):**
   * Menyimpan JSON alamat lengkap, kurir, dan ongkir ke kolom `shipping_details` di tabel `orders` D1.
3. **Pengurangan Stok Otomatis (Inventory Auto-Decrement):**
   * Query SQL otomatis saat pembayaran berhasil:
     ```sql
     UPDATE inventory SET stock = MAX(0, stock - 1), updated_at = CURRENT_TIMESTAMP WHERE product_id = 'unbox-the-memory' AND stock > 0;
     ```
4. **Template Email Resend Khusus Pesanan Fisik:**
   * Email yang dikirim ke pembeli menyertakan tombol masuk Studio Digital **DAN** tombol **Lacak Status Pesanan (`/order-status`)**.

### Yang Tetap Dipertahankan di Production Worker:
* Endpoint API Pakasir Asli (`https://app.pakasir.com/api/...`) — **BUKAN sandbox**.
* API Key Pakasir Asli & Resend API Key Asli.

---

## 📌 3. LANGKAH EKSEKUSI (STEP-BY-STEP RILIS KE MAIN)

```
[ STEP 1 ] Input Environment Variables di Vercel Dashboard (Production)
     │
[ STEP 2 ] Ganti API Key Biteship dari Test ke Live Production Key & Isi Saldo
     │
[ STEP 3 ] Replace logic unbox di `pakasir-gateway/src/index.js` & jalankan `npx wrangler deploy`
     │
[ STEP 4 ] Merge branch `feat/unbox-ecommerce` ke branch `main` di Valentine-Platform
     │
[ STEP 5 ] Git push origin main -> Vercel otomatis deploy live!
```

---

*Dokumen ini dibuat otomatis sebagai panduan rilis resmi Unbox the Memory — For you, Always.*
