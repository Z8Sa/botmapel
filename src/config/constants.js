const path = require("path");

module.exports = {
    // Paths
    PATHS: {
        DATABASE: path.join(process.cwd(), "database.json"),
        OWNERS: path.join(process.cwd(), "owners.json"),
        AUTH: path.join(process.cwd(), "auth")
    },
    
    // Subjects
    SUBJECTS: [
        "informatika", "matematika", "indo", "inggris",
        "ipas", "tkj", "sejarah", "tahfidz",
        "sbd", "pai", "pjok", "ppkn"
    ],
    
    // AI Configuration
    AI_CONFIG: {
        MODEL: "llama-3.3-70b-versatile",
        MAX_TOKENS: 200,
        TEMPERATURE: 0.5,
        TIMEOUT: 30000
    },
    
    // Image Configuration
    IMAGE_CONFIG: {
        WIDTH: 800,
        HEIGHT: 800,
        COLORS: {
            BACKGROUND_START: "#1a1a2e",
            BACKGROUND_END: "#16213e",
            STROKE: "#0f3460",
            ACCENT: "#e94560",
            TEXT: "#ffd93d",
            SUBTITLE: "#00b4d8",
            TASK: "#ff6b6b"
        }
    },
    
    // Default owners (will be overwritten by file)
    DEFAULT_OWNERS: ["120363408589182654@g.us", "92879288541305@lid"],
    
    // Database keywords for AI
    DB_KEYWORDS: [
        "materi", "tugas", "database", "mapel", "pelajaran", 
        "semester", "konten", "isi bot", "apa", "ada", 
        "berapa", "lihat", "tampilkan"
    ]
};