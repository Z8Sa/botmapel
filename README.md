# 🎓 Class Knowledge Bot - SMK TKJ

Bot WhatsApp untuk menyimpan materi dan tugas sekolah dengan dukungan AI, pencarian database, serta manajemen owner.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![WhatsApp](https://img.shields.io/badge/WhatsApp-Baileys-brightgreen)
![AI](https://img.shields.io/badge/AI-Groq-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Fitur

* 📚 Manajemen Materi per Semester
* 📝 Manajemen Tugas per Semester
* 🤖 AI Assistant menggunakan Groq
* 🔍 Pencarian Materi & Tugas
* 🖼️ Tampilan Gambar (Canvas)
* 💾 Penyimpanan Data JSON
* 👥 Multi Owner Support
* 🔐 Pemisahan Hak Akses Owner & User

---

## 📖 Mata Pelajaran

### Semester 1 & Semester 2

* Informatika
* Matematika
* Bahasa Indonesia
* Bahasa Inggris
* IPAS
* TKJ
* Sejarah
* Tahfidz
* Database
* PAI
* PJOK
* PPKn

---

## ⚙️ Persyaratan

* Node.js v18+
* NPM v9+
* API Key Groq

---

## 🚀 Instalasi

### Clone Repository

```bash
git clone https://github.com/Z8Sa/botmapel.git
cd botmapel
```

### Install Dependency

```bash
npm install
```

### Buat File .env

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxx
```

Dapatkan API Key dari:

https://console.groq.com

### Jalankan Bot

```bash
node index.js
```

### Hubungkan WhatsApp

Scan QR Code yang muncul di terminal menggunakan WhatsApp.

---

## 📋 Perintah User

| Command              | Deskripsi              |
| -------------------- | ---------------------- |
| `.menu`              | Tampilkan menu         |
| `.semester1`         | Lihat mapel semester 1 |
| `.semester2`         | Lihat mapel semester 2 |
| `.semester1 tkj`     | Detail TKJ semester 1  |
| `.semester2 tkj`     | Detail TKJ semester 2  |
| `.img tkj semester1` | Tampilan gambar        |
| `.caridb jaringan`   | Cari data              |
| `.tanya subnetting`  | Tanya AI               |
| `.cekjid`            | Lihat JID WhatsApp     |

---

## 🔑 Perintah Owner

### Tambah Materi

```txt
.+materis1 tkj subnetting dasar
.+materis2 tkj routing dasar
```

### Tambah Tugas

```txt
.+tugass1 tkj laporan jaringan
.+tugass2 tkj konfigurasi router
```

### Hapus Materi

```txt
.-materis1 tkj 1
.-materis2 tkj 1
```

### Kelola Owner

```txt
.addowner <JID>
.removeowner <JID>
.listowner
```

---

## 🤖 Contoh AI

```txt
.tanya apa itu subnetting?
.tanya materi TKJ semester 1?
.tanya ada tugas tentang jaringan?
.tanya jelaskan tentang database
```

AI dapat menjawab berdasarkan data yang tersimpan di database bot.

---

## 👥 Cara Menjadi Owner

### Langkah 1

Kirim:

```txt
.cekjid
```

Contoh hasil:

```txt
120363408589182654@g.us # jid grub
92879288541305@lid # jid pribadi
```

### Langkah 2

Owner saat ini menjalankan:

```txt
.addowner 120363408589182654@g.us
```

---

## 📂 Struktur Project

```txt
botmateri/
├── auth/
├── src/
│   ├── config/
│   │   └── constants.js
│   ├── database/
│   │   └── Database.js
│   ├── services/
│   │   ├── AIService.js
│   │   └── ImageGenerator.js
│   ├── handlers/
│   │   ├── CommandHandler.js
│   │   └── OwnerHandler.js
│   ├── utils/
│   │   └── helpers.js
│   └── Bot.js
├── database.json
├── owners.json
├── .env
├── .env.example
└── index.js
```

---

## 🛠️ Teknologi

| Teknologi       | Fungsi          |
| --------------- | --------------- |
| Baileys         | WhatsApp API    |
| Groq API        | AI Assistant    |
| Canvas          | Generate Gambar |
| Axios           | HTTP Request    |
| Pino            | Logging         |
| QRCode Terminal | QR Scanner      |

---

## 🐞 Troubleshooting

### Canvas Gagal Install

Windows:

```bash
npm install canvas
```

Ubuntu / Debian:

```bash
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev
npm install canvas
```

---

### Database Rusak

Hapus:

```txt
database.json
```

Bot akan membuat ulang otomatis.

---

### AI Error

Pastikan:

* API Key valid
* Kuota Groq tersedia
* Model masih aktif

---

### Owner Tidak Terdeteksi

1. Jalankan `.cekjid`
2. Cocokkan dengan `owners.json`
3. Daftarkan ulang owner

---

## 📌 Catatan

* Bot hanya merespon command yang diawali `.`
* Data tersimpan permanen
* Mendukung WhatsApp Multi Device
* Tetap berjalan meskipun AI gagal

---

## 💾 Backup Database

Backup:

```bash
copy database.json backup_db.json
copy owners.json backup_owners.json
```

Restore:

```bash
copy backup_db.json database.json
copy backup_owners.json owners.json
```

---

## 🆕 Update Terbaru

* Multi Owner Support
* AI Groq Integration
* Penyimpanan Owner Permanen
* Tampilan Menu Lebih Rapi
* Fitur `.cekjid`

---

## 📜 Lisensi

MIT License

---

## 👨‍💻 Developer

**Rafi**
SMK TKJ

GitHub: https://github.com/Z8Sa

---

⭐ Jika project ini membantu, berikan star pada repository.
