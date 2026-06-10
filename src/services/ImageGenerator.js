const { createCanvas } = require("canvas");
const { IMAGE_CONFIG } = require("../config/constants");

class ImageGenerator {
    static async generateSubjectImage(subject, semester, data) {
        const { WIDTH, HEIGHT, COLORS } = IMAGE_CONFIG;
        const canvas = createCanvas(WIDTH, HEIGHT);
        const ctx = canvas.getContext("2d");
        
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
        gradient.addColorStop(0, COLORS.BACKGROUND_START);
        gradient.addColorStop(1, COLORS.BACKGROUND_END);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        
        // Border
        ctx.strokeStyle = COLORS.STROKE;
        ctx.lineWidth = 5;
        ctx.strokeRect(10, 10, WIDTH - 20, HEIGHT - 20);
        
        // Title
        ctx.fillStyle = COLORS.ACCENT;
        ctx.font = "bold 32px sans-serif";
        ctx.fillText(`📘 ${subject.toUpperCase()}`, 30, 70);
        
        // Semester
        ctx.fillStyle = COLORS.TEXT;
        ctx.font = "20px sans-serif";
        ctx.fillText(semester === "semester1" ? "SEMESTER 1" : "SEMESTER 2", 30, 115);
        
        // Separator
        ctx.beginPath();
        ctx.strokeStyle = "#533483";
        ctx.lineWidth = 2;
        ctx.moveTo(30, 135);
        ctx.lineTo(WIDTH - 30, 135);
        ctx.stroke();
        
        // Materials section
        ctx.fillStyle = COLORS.SUBTITLE;
        ctx.font = "bold 24px sans-serif";
        ctx.fillText("📖 MATERI", 30, 180);
        
        // Materials content
        let y = 220;
        ctx.fillStyle = "#ffffff";
        ctx.font = "16px sans-serif";
        
        if (data.materi.length === 0) {
            ctx.fillStyle = "#888888";
            ctx.fillText("   ✨ Belum ada materi", 30, y);
            y += 30;
        } else {
            for (const [i, materi] of data.materi.entries()) {
                const text = `   ${i + 1}. ${materi.length > 60 ? materi.slice(0, 57) + "..." : materi}`;
                ctx.fillStyle = "#cccccc";
                ctx.fillText(text, 30, y);
                y += 30;
                if (y > HEIGHT - 150) break;
            }
        }
        
        // Tasks section
        y += 20;
        ctx.fillStyle = COLORS.TASK;
        ctx.font = "bold 24px sans-serif";
        ctx.fillText("📝 TUGAS", 30, y);
        y += 40;
        
        ctx.fillStyle = "#ffffff";
        ctx.font = "16px sans-serif";
        
        if (data.tugas.length === 0) {
            ctx.fillStyle = "#888888";
            ctx.fillText("   ✨ Belum ada tugas", 30, y);
        } else {
            for (const [i, tugas] of data.tugas.entries()) {
                const text = `   ${i + 1}. ${tugas.length > 60 ? tugas.slice(0, 57) + "..." : tugas}`;
                ctx.fillStyle = COLORS.TEXT;
                ctx.fillText(text, 30, y);
                y += 30;
                if (y > HEIGHT - 50) break;
            }
        }
        
        // Footer
        ctx.fillStyle = "#533483";
        ctx.font = "12px sans-serif";
        ctx.fillText("DEVELOPER : RAFI", WIDTH - 150, HEIGHT - 20);
        
        return canvas.toBuffer();
    }
}

module.exports = ImageGenerator;