========================================
  CLASS KNOWLEDGE BOT - SMK TKJ
========================================

Bot WhatsApp untuk materi & tugas
sekolah dengan AI + gambar.

========================================
FITUR
========================================

+ Manajemen Materi & Tugas
+ Tampilan Gambar (Canvas)
+ AI Assistant (Groq Llama)
+ Pencarian Database
+ Penyimpanan Permanen (JSON)
+ Multi Owner Support
+ Mode Owner & User Berbeda

========================================
MATA PELAJARAN
========================================

Semester 1 & 2:

- Informatika
- Matematika
- B.Indonesia
- B.Inggris
- IPAS
- TKJ
- Sejarah
- Tahfidz
- Database
- PAI
- PJOK
- PPKn

========================================
PERSYARATAN
========================================

1. Node.js v18 atau lebih baru
2. NPM v9 atau lebih baru
3. Akun Groq (untuk API Key)

========================================
CARA INSTALL
========================================

1. Clone repository:
   git clone https://github.com/Z8Sa/botmapel.git
   cd botmapel

2. Install dependencies:
   npm install

3. Buat file .env:
   GROQ_API_KEY=gsk_xxxxx

   (Dapatkan API Key di console.groq.com)

4. Jalankan bot:
   node index.js

5. Scan QR Code yang muncul
   menggunakan WhatsApp

========================================
PANDUAN PERINTAH
========================================

PERINTAH UNTUK SEMUA USER:

.menu              - Tampilkan menu bantuan
.semester1         - Lihat semua mapel S1
.semester2         - Lihat semua mapel S2
.semester1 tkj     - Detail TKJ semester 1
.semester2 tkj     - Detail TKJ semester 2
.img tkj semester1 - Tampil gambar materi
.caridb jaringan   - Cari kata di database
.tanya subnetting  - Tanya AI (bisa akses DB)
.cekjid            - Lihat JID WhatsApp Anda

PERINTAH KHUSUS OWNER:

.+materis1 tkj x   - Tambah materi S1
.+materis2 tkj x   - Tambah materi S2
.+tugass1 tkj x    - Tambah tugas S1
.+tugass2 tkj x    - Tambah tugas S2
.-materis1 tkj 1   - Hapus materi S1
.-materis2 tkj 1   - Hapus materi S2
.addowner <JID>    - Tambah owner baru
.removeowner <JID> - Hapus owner
.listowner         - Lihat daftar owner

CONTOH PENGGUNAAN AI:

.tanya apa itu subnetting?
.tanya materi TKJ semester 1?
.tanya ada tugas tentang jaringan?
.tanya jelaskan tentang database

========================================
CARA MENJADI OWNER
========================================

1. Kirim .cekjid ke bot (chat pribadi)
2. Copy JID yang muncul (contoh:
   6281234567890@s.whatsapp.net)
3. Minta owner saat ini mengetik:
   .addowner 6281234567890@s.whatsapp.net

Atau jika belum ada owner:

1. Kirim .cekjid ke bot
2. Ketik .addowner <JID_anda>
   (JID yang muncul dari .cekjid)

========================================
STRUKTUR FOLDER
========================================

botmapel/
├── index.js          # File utama bot
├── database.json     # DB materi & tugas
├── owners.json       # Daftar owner
├── auth/             # Auth WhatsApp
├── package.json      # Dependencies
├── .env              # API Key
└── README.md         # Dokumentasi

========================================
TEKNOLOGI
========================================

- Baileys      - WhatsApp Web Library
- Groq API     - AI Llama 3.3 70B
- Canvas       - Generate gambar
- Axios        - HTTP client
- Pino         - Logger
- QRCode Terminal - QR generator

========================================
TROUBLESHOOTING
========================================

ERROR: Cannot find module 'canvas'

Windows:
  npm install canvas

Linux (Ubuntu/Debian):
  sudo apt-get install build-essential
  libcairo2-dev libpango1.0-dev
  libjpeg-dev libgif-dev
  npm install canvas

ERROR: Unexpected end of JSON input

Hapus file database.json:
  del database.json (Windows)
  rm database.json (Linux/Mac)

ERROR: AI Error 400 / model decommissioned

1. Pastikan GROQ_API_KEY valid
2. Cek model di console.groq.com
3. Update model di file index.js
   (ganti "llama-3.3-70b-versatile")

ERROR: Owner tidak terdeteksi

1. Kirim .cekjid untuk lihat JID
2. Pastikan JID cocok dengan owners.json
3. Hapus owners.json dan daftar ulang

========================================
CATATAN PENTING
========================================

- Bot hanya merespon pesan diawali titik (.)
- Data tersimpan permanen di database.json
- Bot tetap berjalan meskipun AI error
- Support WhatsApp multi-device
- Gunakan .cekjid untuk cek JID sendiri
- Owner bisa dikelola via .addowner/.removeowner

========================================
BACKUP & RESTORE
========================================

Backup database:
  copy database.json backup_db.json
  copy owners.json backup_owners.json

Restore database:
  copy backup_db.json database.json
  copy backup_owners.json owners.json

========================================
UPDATE TERBARU
========================================

- Perbaikan AI model ke llama-3.3-70b
- Penambahan fitur multi owner
- Perbaikan penyimpanan owner permanen
- Menu lebih rapi dengan struktur tree
- Fitur .cekjid untuk cek JID

========================================
LISENSI
========================================

MIT License - Free for educational purposes

========================================
DEVELOPER
========================================

Nama   : Rafi
Sekolah: SMK TKJ
GitHub : https://github.com/Z8Sa

========================================
  Made with ❤️ for SMK TKJ students
========================================