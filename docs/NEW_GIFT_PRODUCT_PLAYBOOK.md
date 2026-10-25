# Playbook Produk Kado Digital Baru

Dokumen ini adalah acuan wajib untuk AI agent dan tim saat merancang, membangun, menguji, serta meluncurkan template atau produk kado digital baru di ekosistem **For you, Always.**

Tujuannya bukan membuat semua produk terlihat sama. Tujuannya adalah menjaga alur kerja, kualitas kode, keamanan data, pengalaman customer, dan integrasi pembayaran tetap konsisten. The Plan adalah referensi implementasi premium terbaru, tetapi identitas visual dan interaksi produk baru harus tetap unik.

> Aturan utama: jangan langsung membangun seluruh sistem. Kerjakan bertahap dan jangan lanjut ke fase berikutnya sebelum fase aktif disetujui owner.

## 1. Cara memakai dokumen ini

Sebelum menulis kode produk baru:

1. Baca dokumen ini sampai selesai.
2. Baca root `AGENTS.md` storefront.
3. Tentukan model produk, target market, dan pengalaman penerima.
4. Buat repo/folder produk terpisah beserta `PRD.md`, `AGENTS.md`, dan `README.md`.
5. Kunci kontrak data sebelum membuat banyak komponen.
6. Kerjakan fase secara berurutan: Gift → Studio → Dashboard → Form → Payment/Storefront.
7. Gunakan `pakasir-sandbox` untuk semua eksperimen pembayaran.
8. Jangan mengubah atau deploy `pakasir-gateway` dan production tanpa izin eksplisit owner.

## 2. Tiga model produk yang didukung

### A. Self-service

Customer membayar lalu menerima link Studio dan mengisi sendiri.

Cocok untuk produk sederhana, customer yang ingin kontrol langsung, dan data yang tidak membutuhkan kurasi cerita oleh tim.

```text
Checkout → pembayaran sukses → project dibuat → link Studio dikirim → customer edit → publish
```

### B. Terima Jadi

Customer membayar lalu menerima form. Tim dan AI agent merangkai gift di Studio internal.

Cocok untuk produk premium, storytelling, banyak media, desain yang perlu kurasi, dan customer yang ingin praktis.

```text
Checkout → pembayaran sukses → project + form dibuat → link form dikirim
→ customer mengisi → incoming order → draft otomatis terisi
→ AI agent + tim merapikan → owner review → publish → link final dikirim
```

### C. Hybrid

Customer dapat memilih **Buat Sendiri** atau **Terima Jadi**.

Gunakan hanya bila kedua pengalaman memang siap dipelihara. Setiap mode harus mempunyai harga, email, status order, link, dan perlindungan akses yang jelas.

## 3. Pertanyaan produk yang wajib dijawab

Tuliskan jawaban di `PRD.md` sebelum implementasi.

### Identitas dan pasar

- Apa nama produk yang pendek dan mudah disebut?
- Produk ini untuk pasangan, sahabat, keluarga, atau umum?
- Momen utamanya apa: ulang tahun, anniversary, permintaan maaf, ajakan pergi, atau lainnya?
- Masalah customer apa yang diselesaikan?
- Apa satu pengalaman yang paling mudah diingat penerima?
- Mengapa customer memilih produk ini dibanding produk lama?

### Konten

- Data apa yang wajib dan opsional?
- Berapa banyak foto, video, audio, dan teks?
- Apakah tim boleh mengimprovisasi tulisan customer?
- Apakah Bahasa Indonesia dan English diperlukan?
- Apakah customer memilih tone tulisan?
- Apakah ada tanggal, waktu, lokasi, Maps, deadline, atau data faktual lain?

### Pengalaman penerima

- Apa opening/gate-nya?
- Apa urutan section?
- Apa interaksi utama?
- Apa closing dan respons penerima?
- Apakah ada hasil yang dapat diunduh atau dibagikan?
- Bagaimana pengalaman iPhone, Android, dan desktop?

### Bisnis dan operasional

- Self-service, Terima Jadi, atau hybrid?
- Harga resminya berapa?
- Apakah hanya satu produk per checkout?
- SLA dan revisinya bagaimana?
- Siapa yang mengerjakan setelah form masuk?
- Apakah perlu custom slug atau custom domain?
- Apa status produksi dari order masuk sampai selesai?

## 4. Stack standar yang direkomendasikan

Gunakan stack yang sudah dipahami tim kecuali ada alasan teknis kuat untuk berbeda.

### Frontend produk

- **Vite + TypeScript** untuk gift, Studio, admin/dashboard, dan form dalam satu repo.
- Vanilla modular TypeScript cocok untuk pengalaman visual statis/interaktif.
- Gunakan Next.js hanya bila benar-benar membutuhkan SSR, React ecosystem, atau server route bawaan.
- Hosting frontend: **Vercel**.

### Backend produk

- **Cloudflare Worker** untuk endpoint publik dan internal.
- **KV namespace baru per produk** untuk project, order, draft, gift, token, dan respons.
- **R2 bucket `valentine-upload`** dapat dipakai bersama, tetapi semua object wajib memakai prefix produk dan project.
- Service Binding dari gateway ke Worker produk sebagai jalur utama.
- HTTPS Worker URL sebagai fallback terkontrol.

### Storefront dan pembayaran

- Storefront: `Valentine-Platform`.
- Pengujian pembayaran: `pakasir-sandbox`.
- Production payment: `pakasir-gateway`.
- Pakasir menggunakan API v2 `payment_link`; jangan membuat UI pembayaran custom kecuali owner meminta.

## 5. Struktur repo produk standar

Struktur dapat disesuaikan, tetapi tanggung jawab modul harus tetap jelas.

```text
new-product/
├── AGENTS.md
├── PRD.md
├── README.md
├── package.json
├── index.html
├── public/
├── src/
│   ├── main.ts                 # recipient gift entry
│   ├── project.ts              # shared data contract
│   ├── projectSchema.ts        # validation boundary
│   ├── copy.ts                 # fixed UI ID/EN
│   ├── themes.ts               # curated theme IDs and tokens
│   ├── demo.ts                 # complete demo data
│   ├── apiBase.ts
│   ├── giftData.ts
│   ├── studio/
│   ├── admin/
│   └── form/
├── tests/
├── worker/
│   └── index.ts
└── wrangler.jsonc
```

Jangan membuat satu file besar yang menangani gift, form, admin, API, dan export sekaligus. Pisahkan berdasarkan fitur dan boundary data.

## 6. Kontrak data sebagai fondasi

Semua renderer dan editor harus memakai satu kontrak project bersama.

Prinsip:

- content berada di data, bukan ditanam di komponen;
- tema disimpan sebagai ID, bukan sekumpulan warna mentah;
- locale disimpan sebagai nilai terbatas seperti `id | en`;
- media mempunyai tipe eksplisit `image | video | audio`;
- field faktual divalidasi di client dan Worker;
- field opsional benar-benar boleh kosong dan layout harus beradaptasi;
- schema mempunyai versi;
- data lama tidak rusak ketika field baru ditambahkan.

Contoh minimum:

```ts
interface GiftProject {
  schemaVersion: 1;
  id: string;
  locale: "id" | "en";
  theme: ThemeId;
  recipient?: string;
  sender?: string;
  opening: OpeningSection;
  hero: HeroSection;
  music?: MusicSection;
  invitation?: InvitationSection;
  letter?: LetterSection;
  gallery?: GallerySection;
  closing: ClosingSection;
}
```

Jangan menjadikan data demo sebagai bentuk schema. Demo harus mematuhi schema, bukan sebaliknya.

## 7. Model penyimpanan KV dan R2

Untuk produk premium Terima Jadi, gunakan pola berikut:

```text
order:{orderId}             # data operasional + jawaban form asli
form-access:{projectId}     # token private form
form-draft:{projectId}      # autosave pengisian customer
draft:{projectId}           # pekerjaan editable Studio
gift:{projectId}            # snapshot publish yang disetujui
project-meta:{projectId}    # metadata internal bila diperlukan
response:{projectId}        # jawaban penerima
domain:{hostname}           # mapping custom domain bila didukung
```

Aturan penting:

- `draft` dan `gift` tidak boleh menjadi record yang sama.
- Edit Studio tidak mengubah gift live sampai tombol Publish ditekan.
- Jawaban form asli harus tetap disimpan untuk audit.
- Operasi “Terapkan ulang” harus eksplisit karena dapat menimpa polishing Studio.
- Token form tidak boleh keluar dari dashboard terautentikasi atau URL customer.
- Endpoint publik tidak boleh mengembalikan token, Studio URL internal, password, atau metadata internal.

R2 object key:

```text
{product-id}/{projectId}/{category}/{safe-filename}
```

Contoh:

```text
the-plan/plan-abc/gallery/1700000000-photo.webp
```

Semua foto besar sebaiknya dikompresi ke WebP. Video dan audio divalidasi MIME, ukuran, serta ekstensi di Worker. URL hasil upload production tidak boleh menunjuk ke localhost.

## 8. Fase pengerjaan wajib

### Fase 0 — PRD dan kontrak

Deliverable:

- nama dan positioning;
- model produk;
- target market;
- urutan section;
- field wajib/opsional;
- sistem bahasa dan tema;
- skema project awal;
- alur manual dan webhook;
- acceptance criteria tiap fase.

Jangan mulai semua page sebelum keputusan inti terkunci.

### Fase 1 — Gift page

Fokus hanya pada pengalaman penerima.

Wajib:

- satu demo lengkap dengan data realistis;
- mobile-first pada 320, 390, dan 428 px;
- desktop tetap proporsional;
- section berasal dari project data;
- field opsional tidak meninggalkan ruang kosong besar;
- foto/video lazy atau progressive;
- musik mempunyai fallback;
- animasi menghormati `prefers-reduced-motion`;
- tidak ada horizontal overflow;
- fixed UI mengikuti locale;
- tidak ada brand internal bila desain gift memang harus personal;
- interaksi dapat dipakai touch dan keyboard bila relevan.

Jika musik diharapkan autoplay pada iPhone, gunakan explicit user gesture yang menyatu dengan opening. Jangan mengandalkan autoplay tanpa gesture.

Jika ada PNG/download:

- render pada ukuran pasti, bukan screenshot viewport;
- tunggu font dan media siap;
- uji Safari iPhone;
- sediakan Web Share API dengan fallback download;
- hasil tidak boleh bergantung pada panjang layar HP.

Gate: owner harus melihat dan menyukai gift page sebelum Fase 2.

### Fase 2 — Studio internal

Studio adalah alat produksi tim, bukan form customer.

Wajib:

- autentikasi internal;
- load project dan autosave draft;
- step yang jelas dengan Previous/Next;
- semua field project penting dapat diedit;
- upload foto/video/audio ke R2;
- preview memakai renderer gift yang sebenarnya;
- preview dapat lompat ke section aktif;
- preset copy tidak menimpa data faktual;
- locale dan theme memakai opsi terkontrol;
- Publish terpisah dari Save;
- setelah publish tampil link final, QR/barcode bila diperlukan, dan template review.

### Fase 3 — Dashboard/admin

Dashboard mengelola produksi, bukan menduplikasi seluruh Studio.

Wajib:

- buat project/order manual dengan input sesedikit mungkin;
- daftar incoming, in-progress, dan completed;
- detail semua jawaban form;
- status produksi dan catatan internal;
- link form private;
- tombol buka Studio;
- tombol terapkan/re-apply jawaban form;
- published gift link;
- respons penerima;
- template WhatsApp;
- personal slug dan custom domain bila produk premium mendukungnya.

### Fase 4 — Customer form

Form bukan Studio mini. Customer memberikan bahan; tim yang mendesain.

Wajib:

- bahasa UI form dapat dipilih bila pasar membutuhkannya;
- bahasa konten gift dipilih terpisah;
- langkah pendek dan manusiawi;
- hint menjelaskan hasil penggunaan data;
- preview membuka contoh gift yang sudah jadi dan lompat ke section terkait;
- tema diperlihatkan secara visual;
- musik memakai playlist bersama, request, upload, atau team choice;
- upload media ke R2;
- autosave;
- halaman review mobile-safe;
- deadline opsional bila operasional membutuhkan;
- submit idempotent;
- success screen berisi langkah berikutnya dan pesan WhatsApp siap pakai.

Sesudah submit, semua field yang dapat dipetakan harus otomatis masuk ke draft Studio. AI agent tetap wajib membaca raw order sebelum melakukan polishing.

### Fase 5 — Gateway, storefront, dan release

Baru dimulai setelah gift, Studio, dashboard, form, Worker, serta upload sudah stabil.

Urutan:

1. Integrasikan produk ke `pakasir-sandbox`.
2. Uji checkout sampai form/project tercipta.
3. Uji email, order status, form submit, dashboard, Studio, publish, dan gift final.
4. Integrasikan kartu/detail product ke storefront.
5. Uji keseluruhan memakai endpoint sandbox.
6. Salin business logic yang sudah lulus ke `pakasir-gateway`.
7. Pertahankan perbedaan environment production yang memang disengaja.
8. Deploy Worker produk.
9. Deploy frontend produk.
10. Deploy production gateway hanya dengan izin owner.
11. Deploy storefront.
12. Jalankan smoke test production read-only dan satu pembayaran nyata bila owner menyetujui.

## 9. Integrasi payment gateway untuk produk baru

### Aturan sandbox-first

- Semua perubahan dimulai di `pakasir-sandbox`.
- Jangan bereksperimen langsung di `pakasir-gateway`.
- Modul business logic harus identik antara sandbox dan gateway.
- Perbedaan hanya boleh menyangkut endpoint/provider mode, database binding, secret, label email test, simulasi, dan pengamanan production.
- Jangan mengganti seluruh folder gateway secara buta. Bandingkan file dan pertahankan guard production.

### File yang biasanya ditambah/diubah

```text
src/catalog-order.mjs          # whitelist harga server-side
src/{product}-order.mjs       # validasi + panggil Worker produk
src/index.js                  # checkout, fulfillment, email, status
src/sales-counts.mjs          # normalisasi count publik
tests/catalog-order.test.mjs
tests/{product}-order.test.mjs
tests/sales-counts.test.mjs
wrangler.toml                 # service binding + non-secret config
```

### Validasi server-side minimum

- product ID dikenal;
- harga sama dengan harga resmi;
- quantity benar;
- total sama dengan jumlah item;
- kombinasi produk diizinkan;
- suffix layanan valid;
- customer fields yang dibutuhkan tersedia;
- order ID tidak dipakai ulang untuk detail berbeda;
- webhook cocok pada order ID, nominal, transaction ID, dan status provider;
- production menolak transaksi sandbox.

Browser tidak pernah menjadi sumber kebenaran harga.

### Integrasi Worker produk

Gunakan endpoint internal idempotent seperti:

```text
POST /api/integrations/orders
Authorization: Bearer {PRODUCT_INGEST_SECRET}
Idempotency-Key: {stable-order-id}
```

Respons Terima Jadi minimal:

```json
{
  "projectId": "product-abc",
  "formUrl": "https://product.example/form/product-abc?token=private",
  "studioUrl": "https://product.example/studio/product-abc"
}
```

Customer hanya menerima `formUrl`. `studioUrl` tetap internal.

### Email dan order status

Untuk Terima Jadi:

- email sukses menjelaskan pembayaran diterima;
- tombol utama membuka form;
- link Studio tidak boleh muncul;
- order status menampilkan form atau status pengerjaan, bukan internal magic link;
- bila generator gagal, order berbayar harus dapat diretry dengan aman tanpa membuat duplikat.

### Sales count

- Count berasal dari order D1 berstatus `success`.
- Sandbox, simulation, dan test order tidak dihitung.
- Satu product ID dihitung sekali per order.
- Tambahkan product ID ke gateway `PUBLIC_PRODUCT_IDS` dan storefront `PRODUCT_IDS`.
- Normalisasi suffix seperti `_dfy` atau legacy `_3slot` bila relevan.
- Badge disembunyikan saat nilai nol.
- Cache storefront dapat menunda tampilan beberapa menit.

## 10. Checklist integrasi storefront

Tambahkan produk secara konsisten di semua permukaan yang relevan.

### Data dan halaman

- `lib/storefront-catalog.ts`
- halaman `/catalog/{slug}`
- homepage collection/carousel
- `/catalog` grid
- Gift Finder dan knowledge data
- sitemap dan metadata SEO
- order status metadata
- dashboard internal/Atelier mapping

### Asset

- ambil screenshot dari demo gift lengkap, bukan mockup generik;
- gunakan desktop experience untuk showcase utama kecuali desain membutuhkan mobile;
- buat WebP yang ringan;
- sertakan opening, hero, fitur utama, gallery, dan ending;
- setiap image punya fallback lokal dan alt text.

### Modal demo

- gunakan `DemoPreviewModal` bersama;
- sediakan variant bila produk memiliki beberapa template;
- sediakan theme swatches bila satu template mendukung beberapa palet;
- query theme demo hanya boleh memengaruhi root demo khusus;
- published `/gift/:id` wajib mengabaikan override URL.

### Checkout

- gunakan product ID stabil dan sama di cart, gateway, dashboard, dan count;
- harga UI harus sama dengan whitelist gateway;
- tentukan direct checkout, cart, atau modal fulfillment;
- jangan memberi pilihan 3-slot pada produk yang tidak mendukungnya;
- untuk Terima Jadi murni, customer membeli satu item dan menerima form.

## 11. Tema, bahasa, dan preset

### Tema

- Satu sumber definisi tema di repo produk.
- Simpan `themeId` pada project/order/form.
- Studio dan form membaca sumber tema yang sama.
- Storefront hanya menampilkan swatch dari theme ID yang benar-benar didukung.
- Export PNG, QR, ticket, atau printable mengikuti tema project.
- Recipient gift tidak menampilkan language/theme switch kecuali itu memang konsep produk.

### Bahasa

- Fixed UI copy memakai dictionary bertipe untuk `id` dan `en`.
- Kedua dictionary harus mempunyai key identik.
- `document.documentElement.lang` mengikuti locale gift.
- Bahasa UI form dapat berbeda dari bahasa isi gift.
- Jangan menerjemahkan tulisan personal customer secara otomatis tanpa persetujuan.

### Preset

- Preset membantu tim/customer, bukan menghapus tulisan mereka.
- Tampilkan konfirmasi yang menjelaskan teks lama dan baru bila preset mengganti banyak field.
- Jangan pernah mengganti tanggal, waktu, lokasi, nama, media, atau fakta acara lewat preset copy.

## 12. Keamanan minimum

- Jangan commit secret, API key, password, atau private token.
- Gunakan `wrangler secret put` untuk production secret.
- File `.dev.vars` wajib di-ignore.
- Session internal harus signed, terbatas waktu, dan disimpan di `sessionStorage` bila sesuai.
- Endpoint dashboard dan Studio wajib memvalidasi session.
- Form memakai capability token private dan header khusus.
- CORS production hanya mengizinkan origin yang diperlukan.
- Validasi URL eksternal dan hostname custom.
- Sanitasi HTML dan nama file upload.
- Batasi ukuran serta MIME upload.
- Jangan menaruh secret dalam variabel frontend `VITE_*` atau `NEXT_PUBLIC_*`.
- Jangan menampilkan internal Studio URL di email/customer API Terima Jadi.

## 13. Testing minimum

### Unit/contract

- project schema valid/invalid;
- parity copy Indonesia/English;
- semua theme ID valid;
- preset safety;
- mapping form → draft;
- token dan auth;
- upload MIME/size;
- generator idempotency;
- checkout price manipulation;
- webhook verification;
- sales count normalization.

### Browser QA

- 320, 390, dan 428 px;
- tablet dan desktop;
- Safari iPhone untuk audio, share, dan download;
- Chrome Android;
- keyboard navigation dan focus;
- reduced motion;
- teks pendek dan panjang;
- field opsional kosong;
- gallery sedikit dan banyak;
- gambar gagal, audio gagal, serta jaringan lambat;
- tidak ada overflow horizontal.

### End-to-end sandbox

```text
Storefront checkout
→ Pakasir sandbox payment
→ webhook selesai
→ email masuk
→ form dapat dibuka
→ upload R2 berhasil
→ submit masuk dashboard
→ draft Studio terisi
→ publish
→ gift final dapat dibuka
→ respons penerima tersimpan
→ sales count sandbox tetap tidak mencemari production
```

## 14. Deployment order dan verifikasi

Sebelum deployment:

- branch sesuai;
- working tree dipahami;
- test dan production build lulus;
- tidak ada secret/local URL dalam diff;
- migration dan binding sudah tersedia;
- rollback commit diketahui.

Urutan aman:

1. Deploy Worker produk.
2. Smoke test endpoint publik dan auth rejection.
3. Deploy frontend produk.
4. Pastikan frontend memakai API production yang benar.
5. Deploy sandbox gateway dan lakukan E2E.
6. Setelah owner menyetujui, deploy production gateway.
7. Deploy storefront terakhir.
8. Verifikasi domain live, email, form, dan order status.
9. Cek D1/KV/R2 secara read-only.
10. Catat commit SHA dan Worker Version ID.

Push Git bukan bukti deployment selesai. Periksa status Vercel/Cloudflare dan lakukan smoke test domain live.

## 15. Rollback dan penanganan kegagalan

Jika release bermasalah:

- jangan menghapus order customer;
- jangan reset database;
- pertahankan raw form answers dan media;
- rollback frontend ke deployment stabil bila masalah visual;
- rollback Worker version bila kontrak API rusak;
- retry fulfillment secara idempotent bila project gagal dibuat;
- jangan mengirim link internal kepada customer sebagai workaround;
- dokumentasikan order yang terdampak dan langkah pemulihannya.

## 16. Definition of Done

Produk baru belum selesai hanya karena demo terlihat bagus. Produk dianggap siap bila:

- Gift page disetujui owner.
- Mobile experience stabil.
- Semua konten berasal dari data project.
- Studio dapat edit, preview, save, dan publish.
- Dashboard menampilkan order lengkap.
- Form terasa seperti intake, bukan editor.
- Upload production menghasilkan URL R2.
- Manual dan webhook flow bertemu pada pipeline yang sama.
- Sandbox checkout lulus sampai gift final.
- Production gateway mempunyai validasi harga dan webhook yang sama.
- Email dan order status memberi link yang tepat.
- Sales count memakai paid production data.
- Secret tidak bocor.
- Tests dan production build lulus.
- README dan AGENTS produk telah diperbarui.
- Owner memberi izin eksplisit sebelum push/deploy production.

## 17. Referensi implementasi saat ini

Gunakan ini sebagai contoh pola, bukan untuk disalin mentah:

- `the-plan/PRD.md` — tahapan produk premium Terima Jadi.
- `the-plan/AGENTS.md` — aturan operasi AI agent dan data customer.
- `the-plan/src/project.ts` — shared project contract.
- `the-plan/worker/index.ts` — KV/R2, form, Studio, dashboard, publish.
- `Valentine-Platform/app/(landing)/catalog/plan/page.tsx` — detail storefront dan modal demo.
- `Valentine-Platform/lib/storefront-demo-config.ts` — variants dan theme swatches.
- `pakasir-sandbox/src/plan-order.mjs` — validasi serta pembuatan order/form.
- `pakasir-sandbox/src/catalog-order.mjs` — whitelist harga server-side.
- `pakasir-sandbox/src/sales-counts.mjs` — social-proof paid order.

## 18. Template handoff agent

Saat menyerahkan pekerjaan ke agent lain, sertakan:

```text
Produk:
Repo/folder:
Fase aktif:
Yang sudah disetujui owner:
Yang belum boleh diubah:
Kontrak data:
Worker/KV/R2:
URL demo:
URL sandbox:
Test command:
Known issues:
Deployment yang dilarang tanpa izin:
Next acceptance gate:
```

Agent penerus harus melanjutkan fase aktif dan tidak melompati acceptance gate.
