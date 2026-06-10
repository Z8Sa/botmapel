const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const qrcode = require("qrcode-terminal");

const Database = require("./database/Database");
const OwnerHandler = require("./handlers/OwnerHandler");
const CommandHandler = require("./handlers/CommandHandler");
const { PATHS } = require("./config/constants");

class Bot {
    constructor() {
        this.sock = null;
        this.database = new Database();
        this.ownerHandler = new OwnerHandler();
        this.commandHandler = null;
    }
    
    async start() {
        try {
            const { state, saveCreds } = await useMultiFileAuthState(PATHS.AUTH);
            
            this.sock = makeWASocket({
                auth: state,
                logger: pino({ level: "silent" }),
                printQRInTerminal: true
            });
            
            this.commandHandler = new CommandHandler(this.sock, this.database, this.ownerHandler);
            
            this.sock.ev.on("creds.update", saveCreds);
            this.sock.ev.on("connection.update", this.handleConnection.bind(this));
            this.sock.ev.on("messages.upsert", this.handleMessages.bind(this));
            
            this.printStartupInfo();
        } catch (error) {
            console.error("Failed to start bot:", error);
            throw error;
        }
    }
    
    printStartupInfo() {
        console.log("\n🚀 BOT READY - AI bisa membaca database!");
        console.log("📁 Database tersimpan di database.json");
        console.log(`👑 Jumlah Owner: ${this.ownerHandler.getOwnerCount()}`);
        if (this.ownerHandler.getOwnerCount() > 0) {
            console.log("👑 Owner JIDs:", this.ownerHandler.getOwners());
        }
        console.log("");
    }
    
    handleConnection({ connection, qr, lastDisconnect }) {
        if (qr) {
            console.log("\n📱 SCAN QR CODE DENGAN WHATSAPP ANDA");
            qrcode.generate(qr, { small: true });
            console.log("\n");
        }
        
        if (connection === "open") {
            console.log("✅ BOT CONNECTED SUCCESSFULLY");
        }
        
        if (connection === "close") {
            const code = lastDisconnect?.error?.output?.statusCode;
            console.log(`⚠️ Connection closed with code: ${code}`);
            
            if (code !== DisconnectReason.loggedOut) {
                console.log("🔄 Attempting to reconnect...");
                setTimeout(() => this.start(), 5000);
            } else {
                console.log("❌ Logged out. Please delete auth folder and restart.");
            }
        }
    }
    
    async handleMessages({ messages }) {
        for (const msg of messages) {
            const jid = msg.key.remoteJid;
            const text = this.extractText(msg);
            
            if (text && text.startsWith(".")) {
                console.log(`📨 Command dari JID: ${jid} | Pesan: ${text.substring(0, 50)}${text.length > 50 ? "..." : ""}`);
            }
            
            if (!text || !text.startsWith(".")) continue;
            
            const raw = text.slice(1).trim();
            const cmd = raw.split(" ")[0].toLowerCase();
            const args = raw.split(" ").slice(1);
            
            try {
                await this.commandHandler.handle(jid, cmd, args);
            } catch (error) {
                console.error(`Error handling command ${cmd}:`, error);
                await this.sock.sendMessage(jid, {
                    text: "❌ Terjadi kesalahan saat memproses perintah. Silakan coba lagi."
                });
            }
        }
    }
    
    extractText(msg) {
        return msg.message?.conversation ||
               msg.message?.extendedTextMessage?.text ||
               msg.message?.imageMessage?.caption ||
               msg.message?.videoMessage?.caption ||
               "";
    }
}

module.exports = Bot;