# 📋 PRD — "Unbox the Memory"
### Fitur Baru: Physical + Digital Hybrid Gift Product
### Platform: For You, Always — Digital Atelier

---

## 1. RINGKASAN

**For You, Always** saat ini menjual 8 produk **digital murni** (Letter, Voices, Mixtape, Invitation, Arcade, Retro, Wrapped, Memoria) lewat storefront `Valentine-Platform`, dengan checkout langsung di web (Pakasir/DOKU gateway).

**Rencana baru:** menambahkan lini produk **fisik** bernama **"Unbox the Memory"** — sebuah gift box (isi: boneka, dried flower, snack, kartu, dll, mirip hampers) yang disertai **satu kartu bertanda QR code unik per order**. QR ini menghubungkan penerima ke salah satu produk digital existing (misal Letter Edition atau Mixtape Edition) yang sudah di-custom sebelumnya oleh pengirim.

> ⚠️ **Penting:** Sistem QR code (generate kode unik, mapping ke produk digital, validasi saat scan) **SUDAH DIBANGUN dan SUDAH BERES** — bukan bagian dari scope pekerjaan agent. Desain kartu fisik juga **sudah selesai** dikerjakan Aldo sendiri di Figma. **Satu-satunya scope pekerjaan di PRD ini adalah membangun halaman showcase/landing page produk fisiknya.**

**Channel penjualan produk fisik ini berbeda** dari produk digital: bukan lewat checkout Valentine-Platform, melainkan lewat **marketplace (Shopee)**.

Diferensiator dari kompetitor hampers biasa: box fisik generik + kartu ucapan template. Punya kami: box fisik + QR unik yang membuka pengalaman digital personal (galeri sinematik, game arcade, mixtape retro, dll) — bukan cuma teks ucapan statis.

---

## 2. TUJUAN

Membuat satu halaman **showcase/landing** baru di `Valentine-Platform` untuk memperkenalkan produk fisik "Unbox the Memory" ini. Halaman ini **murni untuk storytelling/brand awareness**, bukan untuk checkout — checkout produk fisik terjadi di Shopee, di luar sistem platform ini.

---

## 3. KONTEKS PRODUK & USER JOURNEY

### Siapa yang terlibat:
- **Pengirim** — beli gift box "Unbox the Memory" di Shopee, lalu mengisi/custom pesan digital di salah satu studio generator produk yang sudah ada (`letter-project/generator`, `mixtape-love`, dst — tergantung produk digital mana yang dipilih sebagai isi QR).
- **Penerima** — menerima box fisik, membuka kartu bertanda QR (sistem QR sudah ada & berjalan, di luar scope PRD ini), lalu diarahkan ke halaman produk digital yang sudah di-custom pengirim.

Halaman showcase yang jadi scope PRD ini berperan **sebelum** proses di atas terjadi — yaitu sebagai tempat calon pembeli mengenal konsep produknya dulu (biasanya datang dari Instagram/TikTok bio), sebelum akhirnya membeli di Shopee.

---

## 4. SCOPE PEKERJAAN

### 4.1 Halaman Showcase Baru (di dalam `Valentine-Platform`, BUKAN domain/repo baru)

**Kenapa di dalam platform yang sudah ada:** reuse design system (warna, font Cormorant Garamond, komponen kartu produk) yang sudah settled, konsistensi brand, tanpa overhead maintenance domain baru.

**Lokasi yang disarankan:** halaman baru di dalam `app/(landing)/`, mengikuti pola yang sudah ada seperti `app/(landing)/letter/` atau `app/(landing)/arcade/` — misal `app/(landing)/unbox-the-memory/`.

**Catatan penting:** halaman ini **bukan halaman checkout**. Tidak perlu terhubung ke `CheckoutModal.tsx` atau payment gateway, karena transaksi terjadi di Shopee, bukan di platform ini.

**Konten yang perlu ada di halaman ini:**
1. **Hero section** — visual produk (mockup box + kartu QR), satu tagline yang menjelaskan konsep ("hadiah fisik yang menyimpan pesan digital")
2. **"Cara Kerja" (How it works)** — 3 langkah: pilih box → custom pesan digital di studio → kirim; penerima buka box → scan QR → nikmati pengalaman digital
3. **Galeri isi box** — foto detail komponen fisik
4. **Preview pengalaman digital** — contoh tampilan salah satu produk digital (letter/mixtape/dll) sebagai ilustrasi "apa yang akan dibuka lewat QR"
5. **CTA "Beli di Shopee"** — tombol/link keluar ke listing Shopee (arah link ini AMAN: dari website kita ke Shopee. Yang TIDAK BOLEH adalah sebaliknya, karena kebijakan Shopee melarang link keluar di listing/deskripsi/foto produk mereka)
6. (Opsional, kalau sudah ada materialnya) testimoni/social proof dari customer sebelumnya

**Design system yang WAJIB direuse (lihat dokumen onboarding platform yang sudah ada):**
- Warna: krem `#faf7f2`, coklat gelap `#382a24` (dan warna brand book tambahan: Honey Brown `#A67C52`, Driftwood Tan `#CDAB8F`, Obsidian Black `#1D1816`)
- Font display: Cormorant Garamond (`--font-cormorant`)
- Font body: DM Sans (`--font-dm-sans`)
- Styling: inline style + CSS variables (bukan Tailwind), konsisten dengan konvensi platform

> ⚠️ **PENTING — WAJIB PATUHI, JANGAN OFF-BRAND:**
> Halaman ini **bukan halaman baru yang bebas didesain sendiri oleh agent**. Ini harus terasa seperti **bagian yang sama** dari website yang sudah berjalan (for-you-always.my.id), bukan seperti microsite terpisah yang stylenya beda.
>
> Sebelum membangun apapun, agent WAJIB:
> 1. **Baca ulang Brand Book resmi** (file "for_you_always_brand_book_by_pomelli") — ambil warna, tipografi, dan tone visual persis dari situ, jangan menebak atau membuat variasi warna sendiri.
> 2. **Buka dan amati halaman-halaman existing yang sudah live** (`app/(landing)/page.tsx`, `app/(landing)/letter/`, `app/(landing)/arcade/`, dll) untuk meniru pola layout, spacing, ukuran komponen, cara pakai gambar/mockup, dan gaya penulisan copy yang sudah dipakai di sana.
> 3. Pakai ulang komponen yang sudah ada sebisa mungkin (`LandscapeProductCard.tsx`, `CompactProductCard.tsx`, `Navbar.tsx`, dll) daripada membuat komponen baru dari nol, kecuali memang tidak ada yang cocok.
> 4. Kalau ragu apakah sebuah elemen desain (warna, font, ukuran tombol, dll) sudah sesuai brand, **cek dulu ke Brand Book atau halaman existing** — jangan improvisasi sendiri.
>
> Tujuannya: kalau orang buka halaman ini setelah sebelumnya buka halaman produk digital lain di situs yang sama, mereka harus merasa "ini masih brand yang sama", bukan "kok beda ya stylenya".

---

## 5. BATASAN & HAL YANG SUDAH DIPUTUSKAN

- ✅ **Scope pekerjaan agent HANYA halaman showcase/landing page.** Sistem QR code (generate, mapping, validasi) sudah ada dan berjalan — **jangan disentuh, jangan dibangun ulang, jangan dianggap sebagai bagian dari tugas ini.**
- ✅ Halaman showcase dibuat **di dalam Valentine-Platform**, tidak bikin domain/repo baru.
- ✅ Channel jualan produk fisik: **Shopee** (bukan checkout internal platform).
- ✅ Halaman showcase **tidak untuk transaksi** — hanya storytelling/brand awareness, CTA keluar ke Shopee.
- ✅ Desain kartu fisik (layout, warna, tipografi kartu QR) — **sudah selesai** dikerjakan Aldo sendiri di Figma. Agent boleh dikasih file/gambar referensi desain ini untuk dipakai sebagai aset visual di halaman showcase (misal ditampilkan sebagai contoh produk), tapi tidak perlu mendesain ulang.

## 6. HAL YANG BELUM DIPUTUSKAN SEPUTAR HALAMAN INI (JANGAN diasumsikan, tanya Aldo dulu)

- ❓ URL/slug halaman: `/unbox-the-memory`, `/catalog/unbox-the-memory`, atau nama lain?
- ❓ Apakah halaman ini perlu masuk ke navigasi utama (Navbar) atau cukup diakses lewat link langsung dari Instagram/TikTok bio?
- ❓ Link Shopee yang dipakai di CTA (belum tentu final/sudah ada saat development dimulai)?
- ❓ Aset foto/visual box fisik — apakah sudah tersedia untuk dipakai, atau masih placeholder dulu?

---

## 7. CARA KERJA DENGAN AGENT (mengikuti konvensi platform yang sudah ada)

- Komunikasi dalam **Bahasa Indonesia**, ringkas, langsung ke poin.
- **Jangan** mengambil keputusan besar (arsitektur data, struktur tabel baru) tanpa konfirmasi eksplisit dari Aldo — terutama untuk poin-poin di Bagian 6 di atas.
- **Jangan** menghapus/merombak kode existing yang tidak diminta.
- Cek `git log` sebelum perubahan besar.
- Commit convention: `feat(scope): pesan`, contoh `feat(unbox-the-memory): add landing page structure`.
- Selalu `git add . && git commit -m "..." && git push origin main` setelah pekerjaan selesai.

---

*Dokumen ini dibuat sebagai pelengkap dokumen onboarding utama platform ("PANDUAN ONBOARDING — AI AGENT"). Baca dokumen itu dulu untuk konteks arsitektur penuh sebelum mengerjakan apapun di bagian ini.*
