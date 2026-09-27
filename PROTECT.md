# Panduan & Strategi Proteksi Aset Web / Game (PROTECT.md)

Dokumen ini berisi panduan, checklist, dan potongan kode praktis untuk memproteksi aset grafis (sprites), efek suara (SFX), dan kode game agar tidak mudah dicuri atau di-hotlink saat dipublikasikan secara online.

---

## ⚠️ Prinsip Dasar Browser
> Segala aset (gambar, audio, skrip) yang dijalankan di browser pengguna **harus diunduh** ke memori komputer pengguna agar dapat ditampilkan/diputar. Proteksi 100% terhadap orang teknis berpengalaman (reverse engineer) tidak dimungkinkan, namun Anda bisa menerapkan **Defense-in-Depth** (lapisan pertahanan) untuk menghentikan **99% pencuri kasual, web scraper, dan bot otomatis**.

---

## Checklist Implementasi (Jalankan Saat Project Final)

- [ ] **1. Bersihkan File Sumber (Master Files)** dari folder publik/deploy
- [ ] **2. Terapkan Proteksi UI / Client-Side** (Disable Right Click & Drag)
- [ ] **3. Konfigurasi Anti-Hotlinking & CORS** di Web Server / CDN
- [ ] **4. Sprite Packing & Asset Obfuscation** (Satukan ke Atlas biner)
- [ ] **5. Minifikasi & Obfuscate JavaScript**
- [ ] **6. Watermarking & Metadata Hak Cipta**
- [ ] **7. Cantumkan Lisensi Hukum & Hak Cipta**

---

## 1. Pembersihan File Master Sebelum Deploy

Pastikan file-file mentahan berikut **TIDAK** ikut ter-upload ke hosting/CDN:
- File `.aseprite` (misal: `Necromancer.aseprite`)
- File `.psd` / layered graphic files
- File `.DS_Store` dan log lokal
- Dokumen desain internal

### Rekomendasi `.gitignore` / Build Filter:
```gitignore
*.aseprite
*.psd
*.tmp
.DS_Store
```

---

## 2. Proteksi Client-Side (Mencegah Unduhan Kasual)

### A. CSS: Nonaktifkan Drag & Seleksi Gambar / Canvas
Tambahkan di stylesheet utama Anda (misal `styles.css`):
```css
/* Cegah drag and drop & seleksi gambar dan canvas */
canvas,
img {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  user-drag: none;
}
```

### B. JavaScript: Nonaktifkan Menu Klik Kanan pada Game Canvas
```javascript
// Cegah context menu (klik kanan -> Save Image As) di canvas
const gameCanvas = document.getElementById('sq-canvas');
if (gameCanvas) {
  gameCanvas.addEventListener('contextmenu', (e) => e.preventDefault());
}
```

---

## 3. Server & Network Level (Anti-Hotlink & CORS)

Mencegah situs lain mencuri bandwidth dengan langsung menautkan URL gambar atau suara Anda ke web mereka.

### A. Cloudflare Hotlink Protection (Paling Mudah)
Jika menggunakan Cloudflare:
1. Masuk ke Dashboard Cloudflare.
2. Buka menu **Scrape Shield**.
3. Aktifkan **Hotlink Protection**.

### B. Konfigurasi Nginx (Jika Self-Hosted)
```nginx
# Blokir akses jika referer bukan dari domain Anda
location ~* \.(png|jpg|jpeg|gif|webp|mp3|wav|ogg)$ {
    valid_referers none blocked server_names *.yourdomain.com yourdomain.com;
    if ($invalid_referer) {
        return 403;
    }
}
```

### C. HTTP Security Headers
Tambahkan header berikut di hosting (Vercel, Netlify, atau Nginx):
```http
Referrer-Policy: strict-origin-when-cross-origin
Cross-Origin-Resource-Policy: same-origin
```

---

## 4. Asset Packing & Obfuscation (Tingkat Lanjut untuk Game)

Daripada menyajikan file sprite individual dengan nama jelas (seperti `Soldier_Attack01.png`, `Necromancer_DEATH.png`):

### A. Texture Atlas (Sprite Packing)
- Gabungkan puluhan animasi menjadi 1–2 lembar sprite besar tanpa nama frame yang jelas (misal: `bundle_01.dat` atau `atlas.webp`).
- Petakan koordinat frame melalui array di JavaScript yang sudah di-minifikasi.
- Orang yang membuka file atlas hanya melihat potongan acak tanpa metadata animasi.

### B. Binary / XOR Encryption Ringan (In-Memory Decrypt)
Aset gambar/suara dienkripsi sederhana saat proses build (misal dengan XOR key), lalu didekripsi di memori via `fetch()` + `ArrayBuffer` saat game dijalankan:
```javascript
async function loadEncryptedImage(url, xorKey = 0x5A) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  
  // Sederhana: XOR decrypt di memori browser
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] ^= xorKey;
  }
  
  const blob = new Blob([bytes], { type: 'image/png' });
  const img = new Image();
  img.src = URL.createObjectURL(blob);
  await img.decode();
  return img;
}
```
*Dengan cara ini, siapapun yang mendownload file langsung dari Network tab tidak bisa membukanya di image viewer biasa.*

---

## 5. Minifikasi & Obfuscate Kode JavaScript

Sebelum produksi:
1. Jalankan **Terser** atau **esbuild** untuk mengecilkan ukuran kode dan menghapus semua nama variabel yang mudah dibaca.
2. Gunakan **JavaScript Obfuscator** untuk bagian logika game sensitif (seperti URL aset dan pemetaan frame) jika diperlukan proteksi tambahan.

---

## 6. Perlindungan Hak Cipta & Hukum (Legal Shield)

### A. Catatan Hak Cipta di Footer Website
```html
<p class="copyright">
  &copy; 2026 Muhammad Hidayat. All rights reserved. 
  Original game assets, sprites, audio, and code are proprietary and protected by copyright law.
</p>
```

### B. Template DMCA Takedown (Jika Terjadi Pelanggaran)
Jika menemukan situs lain menggunakan aset Anda tanpa izin, kirimkan surat DMCA Takedown ke penyedia hosting situs tersebut (Cloudflare, GitHub, Vercel, dsb.):

```text
Subject: DMCA Copyright Infringement Notice

To Whom It May Concern,

I am the copyright owner of the proprietary digital artwork and audio assets located at:
https://yourdomain.com/

The following unauthorized website is reproducing and distributing my copyrighted material without my permission:
Infringing URL: https://infringing-site.com/stolen-asset.png

I have a good faith belief that the use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.

I request that you immediately remove or disable access to the infringing material.

Sincerely,
[Nama Anda]
[Kontak Email / No. Telepon]
```
