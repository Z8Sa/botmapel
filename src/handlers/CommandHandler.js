const AIService = require("../services/AIService");
const ImageGenerator = require("../services/ImageGenerator");
const { SUBJECTS } = require("../config/constants");

class CommandHandler {
    constructor(sock, database, ownerHandler) {
        this.sock = sock;
        this.db = database;
        this.ownerHandler = ownerHandler;
    }
    
    async handle(jid, cmd, args) {
        const ownerOnlyCommands = [
            "+materis1", "+materis2", "+tugass1", "+tugass2",
            "-materis1", "-materis2", "-tugass1", "-tugass2",
            "addowner", "removeowner", "listowner"
        ];
        
        // Check owner permissions
        if (ownerOnlyCommands.includes(cmd) && !this.ownerHandler.isOwner(jid)) {
            await this.sock.sendMessage(jid, {
                text: `❌ *Akses Ditolak!*\n\nPerintah "${cmd}" hanya bisa digunakan oleh Owner Bot.\n\nKetik .cekjid untuk lihat JID Anda.`
            });
            return true;
        }
        
        // Command mapping
        const commands = {
            "menumapel": () => this.showMenu(jid),
            "cekjid": () => this.cekJid(jid),
            "semester1": () => this.handleSemester(jid, "semester1", args),
            "semester2": () => this.handleSemester(jid, "semester2", args),
            "img": () => this.handleImage(jid, args),
            "caridb": () => this.handleSearch(jid, args),
            "listmateris1": () => this.listItems(jid, "semester1", "materi"),
            "listmateris2": () => this.listItems(jid, "semester2", "materi"),
            "listtugass1": () => this.listItems(jid, "semester1", "tugas"),
            "listtugass2": () => this.listItems(jid, "semester2", "tugas"),
            "+materis1": () => this.addItem(jid, "semester1", "materi", args),
            "+materis2": () => this.addItem(jid, "semester2", "materi", args),
            "+tugass1": () => this.addItem(jid, "semester1", "tugas", args),
            "+tugass2": () => this.addItem(jid, "semester2", "tugas", args),
            "-materis1": () => this.deleteItem(jid, "semester1", "materi", args),
            "-materis2": () => this.deleteItem(jid, "semester2", "materi", args),
            "-tugass1": () => this.deleteItem(jid, "semester1", "tugas", args),
            "-tugass2": () => this.deleteItem(jid, "semester2", "tugas", args),
            "addowner": () => this.addOwner(jid, args),
            "removeowner": () => this.removeOwner(jid, args),
            "listowner": () => this.listOwner(jid),
            "tanya": () => this.handleAI(jid, args),
        };
        
        const handler = commands[cmd];
        if (handler) {
            await handler();
            return true;
        }
        return false;
    }
    
    async showMenu(jid) {
        const isUserOwner = this.ownerHandler.isOwner(jid);
        
        let menu = `
✨ *MENU BOT MAPEL TKJ* ✨
▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸
${isUserOwner ? "👑 OWNER MODE" : "📖 SISWA MODE"}

📚 CLASS KNOWLEDGE BOT
│
├─ 📖 MENU UTAMA
│   │ .semester1
│   │ .semester2
│   │ .semester1 <mapel>
│   │ .semester2 <mapel>
│   │ .img <mapel> <semester>
│   │ .tanya <pertanyaan>
│   │ .caridb <kata kunci>
│   │ .cekjid
│
├─ 📚 MATERI
│   │ .listmateris1
│   │ .listmateris2
│
├─ 📝 TUGAS
│   │ .listtugass1
│   │ .listtugass2
│
├─ 🖼️ GAMBAR
│   │ .img <mapel> <semester>
│
├─ 🤖 AI ASSISTANT
│   │ .tanya <pertanyaan>
│
├─ 🔍 PENCARIAN
│   │ .caridb <kata kunci>`;
        
        if (isUserOwner) {
            menu += `
│
├─ 👑 OWNER ONLY
│   │ .+materis1 <mapel> <judul>
│   │ .+materis2 <mapel> <judul>
│   │ .+tugass1 <mapel> <judul>
│   │ .+tugass2 <mapel> <judul>
│   │ .-materis1 <mapel> <urutan>
│   │ .-materis2 <mapel> <urutan>
│   │ .-tugass1 <mapel> <urutan>
│   │ .-tugass2 <mapel> <urutan>
│   │ .addowner <JID>
│   │ .removeowner <JID>
│   │ .listowner`;
        }
        
        menu += `
▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸
💡 AI bisa membaca database bot!`;
        
        await this.sock.sendMessage(jid, { text: menu });
    }
    
    async cekJid(jid) {
        const isUserOwner = this.ownerHandler.isOwner(jid);
        
        let message = `📱 *CEK JID WHATSAPP*\n\n`;
        message += `JID Anda: ${jid}\n`;
        message += `Status: ${isUserOwner ? "👑 OWNER" : "👤 USER"}\n\n`;
        
        if (!isUserOwner) {
            message += `Untuk menjadi owner, kirim JID ini ke owner bot.\n`;
            message += `Atau minta owner mengetik:\n.addowner ${jid}`;
        } else {
            message += `Anda sudah terdaftar sebagai owner.\n\n`;
            message += `Untuk mendaftarkan orang lain:\n.addowner <JID_orang_lain>`;
        }
        
        await this.sock.sendMessage(jid, { text: message });
    }
    
    async handleSemester(jid, semester, args) {
        if (args.length === 0) {
            let out = `📚 ${semester.toUpperCase()}\n▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸\n`;
            for (const subject of this.db.getAllSubjects(semester)) {
                out += `▸ ${subject}\n`;
            }
            await this.sock.sendMessage(jid, { text: out });
            return;
        }
        
        const subject = args[0].toLowerCase();
        const data = this.db.db[semester][subject];
        
        if (!data || !SUBJECTS.includes(subject)) {
            await this.sock.sendMessage(jid, {
                text: `❌ Mata pelajaran "${subject}" tidak ditemukan.\n\n📋 Daftar mapel: ${this.db.getAllSubjects(semester).join(", ")}`
            });
            return;
        }
        
        let out = `📘 *${subject.toUpperCase()}* - ${semester.toUpperCase()}\n▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸\n\n`;
        
        out += `📖 *MATERI:*\n`;
        if (data.materi.length === 0) {
            out += `   - Belum ada materi\n`;
        } else {
            data.materi.forEach((m, i) => {
                out += `   ${i + 1}. ${m}\n`;
            });
        }
        
        out += `\n📝 *TUGAS:*\n`;
        if (data.tugas.length === 0) {
            out += `   - Belum ada tugas\n`;
        } else {
            data.tugas.forEach((t, i) => {
                out += `   ${i + 1}. ${t}\n`;
            });
        }
        
        await this.sock.sendMessage(jid, { text: out });
    }
    
    async handleImage(jid, args) {
        const subject = args[0]?.toLowerCase();
        const semester = args[1]?.toLowerCase();
        
        if (!subject || !semester) {
            await this.sock.sendMessage(jid, {
                text: "Format: .img <mapel> <semester1/semester2>\nContoh: .img tkj semester1"
            });
            return;
        }
        
        if (semester !== "semester1" && semester !== "semester2") {
            await this.sock.sendMessage(jid, {
                text: "Semester harus 'semester1' atau 'semester2'"
            });
            return;
        }
        
        const data = this.db.db[semester][subject];
        if (!data || !SUBJECTS.includes(subject)) {
            await this.sock.sendMessage(jid, {
                text: `❌ Mata pelajaran "${subject}" tidak ditemukan di ${semester}`
            });
            return;
        }
        
        try {
            await this.sock.sendMessage(jid, { text: "🖼️ Sedang membuat gambar..." });
            const imageBuffer = await ImageGenerator.generateSubjectImage(subject, semester, data);
            await this.sock.sendMessage(jid, {
                image: imageBuffer,
                caption: `📘 *${subject.toUpperCase()}* - ${semester.toUpperCase()}\n\n📖 Materi: ${data.materi.length} item\n📝 Tugas: ${data.tugas.length} item`
            });
        } catch (error) {
            console.error("Image generation error:", error);
            await this.sock.sendMessage(jid, {
                text: "❌ Gagal membuat gambar."
            });
        }
    }
    
    async handleSearch(jid, args) {
        const keyword = args.join(" ");
        if (!keyword) {
            await this.sock.sendMessage(jid, {
                text: "Contoh: .caridb jaringan"
            });
            return;
        }
        
        const results = this.db.search(keyword);
        
        if (results.length === 0) {
            await this.sock.sendMessage(jid, {
                text: `🔍 Tidak ditemukan hasil untuk "${keyword}"`
            });
            return;
        }
        
        let out = `🔍 HASIL PENCARIAN: "${keyword}"\n▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸\n\n`;
        for (const result of results) {
            out += `📚 ${result.semester} - ${result.subject}\n`;
            if (result.materi.length > 0) {
                out += `   📖 Materi:\n`;
                result.materi.forEach(m => out += `      • ${m}\n`);
            }
            if (result.tugas.length > 0) {
                out += `   📝 Tugas:\n`;
                result.tugas.forEach(t => out += `      • ${t}\n`);
            }
            out += `\n`;
        }
        
        await this.sock.sendMessage(jid, { text: out });
    }
    
    async listItems(jid, semester, type) {
        const typeName = type === "materi" ? "MATERI" : "TUGAS";
        let out = `📖 ${typeName} ${semester.toUpperCase()}\n▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸\n\n`;
        
        for (const subject in this.db.db[semester]) {
            out += `📘 ${subject}\n`;
            const items = this.db.db[semester][subject][type];
            
            if (items.length === 0) {
                out += "   - kosong\n\n";
            } else {
                items.forEach((item, i) => {
                    out += `   ${i + 1}. ${item}\n`;
                });
                out += "\n";
            }
        }
        
        await this.sock.sendMessage(jid, { text: out });
    }
    
    async addItem(jid, semester, type, args) {
        const subject = args[0]?.toLowerCase();
        const title = args.slice(1).join(" ");
        
        if (!subject || !title) {
            const cmdType = type === "materi" ? "materi" : "tugas";
            const cmdName = semester === "semester1" ? `+${cmdType}s1` : `+${cmdType}s2`;
            await this.sock.sendMessage(jid, {
                text: `Format: .${cmdName} mapel judul ${cmdType}`
            });
            return;
        }
        
        if (!SUBJECTS.includes(subject)) {
            await this.sock.sendMessage(jid, {
                text: `❌ Mata pelajaran "${subject}" tidak valid.\n\n📋 Daftar mapel: ${SUBJECTS.join(", ")}`
            });
            return;
        }
        
        this.db.addItem(semester, subject, type, title);
        
        await this.sock.sendMessage(jid, {
            text: `✅ ${type === "materi" ? "Materi" : "Tugas"} tersimpan di ${semester}/${subject}`
        });
    }
    
    async deleteItem(jid, semester, type, args) {
        const fullArg = args.join(" ");
        const parts = fullArg.split(" ");
        
        if (parts.length !== 2) {
            const typeName = type === "materi" ? "materi" : "tugas";
            const cmdName = semester === "semester1" ? `-${typeName}s1` : `-${typeName}s2`;
            await this.sock.sendMessage(jid, {
                text: `⚠️ *Format Salah!*\n\nFormat: .${cmdName} <mapel> <urutan>\n\nContoh:\n.${cmdName} tkj 2`
            });
            return;
        }
        
        const subject = parts[0].trim().toLowerCase();
        const index = parseInt(parts[1].trim());
        
        if (!SUBJECTS.includes(subject)) {
            await this.sock.sendMessage(jid, {
                text: `❌ Mata pelajaran "${subject}" tidak ditemukan.\n\n📋 Daftar mapel: ${SUBJECTS.join(", ")}`
            });
            return;
        }
        
        if (isNaN(index) || index <= 0) {
            await this.sock.sendMessage(jid, {
                text: "❌ Urutan harus berupa angka positif!"
            });
            return;
        }
        
        const target = this.db.getSubject(semester, subject);
        
        if (index - 1 >= target[type].length) {
            await this.sock.sendMessage(jid, {
                text: `❌ Urutan ${index} tidak ditemukan!\n\n📝 ${subject} hanya memiliki ${target[type].length} ${type}.`
            });
            return;
        }
        
        const removed = this.db.deleteItem(semester, subject, type, index - 1);
        
        let response = `✅ *${type === "materi" ? "Materi" : "Tugas"} Berhasil Dihapus!*\n\n`;
        response += `📚 Semester: ${semester === "semester1" ? "Semester 1" : "Semester 2"}\n`;
        response += `📘 Mata Pelajaran: ${subject}\n`;
        response += `📝 Yang dihapus: "${removed}"\n`;
        response += `🔢 Urutan: ${index}\n\n`;
        
        if (target[type].length > 0) {
            response += `📋 *Sisa ${type}:*\n`;
            target[type].forEach((item, i) => {
                response += `   ${i + 1}. ${item}\n`;
            });
        } else {
            response += `✨ Sekarang tidak ada ${type} untuk ${subject}`;
        }
        
        await this.sock.sendMessage(jid, { text: response });
    }
    
    async addOwner(jid, args) {
        const newOwnerJid = args[0] || "";
        
        if (!newOwnerJid) {
            await this.sock.sendMessage(jid, {
                text: "📝 *Format Add Owner*\n\n.addowner <JID>\n\nContoh:\n.addowner 6285399180750@s.whatsapp.net"
            });
            return;
        }
        
        if (!newOwnerJid.includes('@')) {
            await this.sock.sendMessage(jid, {
                text: `❌ Format JID tidak valid!\n\nJID harus berisi '@'\nContoh: 6285399180750@s.whatsapp.net`
            });
            return;
        }
        
        if (this.ownerHandler.addOwner(newOwnerJid)) {
            await this.sock.sendMessage(jid, {
                text: `✅ *Owner Berhasil Ditambahkan!*\n\nJID: ${newOwnerJid}`
            });
        } else {
            await this.sock.sendMessage(jid, {
                text: `❌ JID ${newOwnerJid} sudah terdaftar.`
            });
        }
    }
    
    async removeOwner(jid, args) {
        const ownerToRemove = args[0] || "";
        
        if (!ownerToRemove) {
            await this.sock.sendMessage(jid, {
                text: "📝 *Format Remove Owner*\n\n.removeowner <JID>"
            });
            return;
        }
        
        if (this.ownerHandler.getOwnerCount() === 1) {
            await this.sock.sendMessage(jid, {
                text: "❌ Tidak bisa menghapus owner terakhir!"
            });
            return;
        }
        
        if (this.ownerHandler.removeOwner(ownerToRemove)) {
            await this.sock.sendMessage(jid, {
                text: `✅ *Owner Berhasil Dihapus!*\n\nJID: ${ownerToRemove}`
            });
        } else {
            await this.sock.sendMessage(jid, {
                text: `❌ JID ${ownerToRemove} tidak ditemukan.`
            });
        }
    }
    
    async listOwner(jid) {
        const owners = this.ownerHandler.getOwners();
        
        if (owners.length === 0) {
            await this.sock.sendMessage(jid, {
                text: "📋 Belum ada owner terdaftar."
            });
            return;
        }
        
        let text = "👑 *DAFTAR OWNER BOT*\n\n";
        owners.forEach((owner, i) => {
            text += `${i + 1}. ${owner}\n`;
        });
        
        await this.sock.sendMessage(jid, { text: text });
    }
    
    async handleAI(jid, args) {
        const question = args.join(" ");
        if (!question) {
            await this.sock.sendMessage(jid, {
                text: "Contoh: .tanya apa itu subnetting\n\nAtau tanya database:\n.tanya materi TKJ semester 1?"
            });
            return;
        }
        
        const answer = await AIService.ask(question, this.db);
        await this.sock.sendMessage(jid, { text: `🤖 ${answer}` });
    }
}

module.exports = CommandHandler;