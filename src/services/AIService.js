const axios = require("axios");
const { AI_CONFIG, DB_KEYWORDS } = require("../config/constants");

class AIService {
    static isDatabaseQuery(question) {
        return DB_KEYWORDS.some(keyword => 
            question.toLowerCase().includes(keyword)
        );
    }
    
    static buildDatabaseContext(question, database) {
        const searchResults = database.search(question);
        
        if (searchResults.length > 0) {
            let context = "\n\n[DATA DARI DATABASE BOT]\n";
            for (const result of searchResults) {
                context += `\n【${result.semester} - ${result.subject}】\n`;
                if (result.materi.length > 0) {
                    context += `  Materi: ${result.materi.join(", ")}\n`;
                }
                if (result.tugas.length > 0) {
                    context += `  Tugas: ${result.tugas.join(", ")}\n`;
                }
            }
            return context;
        }
        
        return database.getInfo();
    }
    
    static async ask(question, database) {
        const isDatabaseQuery = this.isDatabaseQuery(question);
        
        if (!process.env.GROQ_API_KEY) {
            return isDatabaseQuery ? database.getInfo() : 
                "❌ AI tidak aktif. Ketik .menumapel untuk fitur lainnya.";
        }
        
        try {
            const dbContext = isDatabaseQuery ? 
                this.buildDatabaseContext(question, database) : "";
            
            const response = await axios.post(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    model: AI_CONFIG.MODEL,
                    messages: [
                        {
                            role: "system",
                            content: "Kamu guru SMK TKJ. Jawab singkat, jelas, tidak bertele-tele. Maksimal 2 kalimat."
                        },
                        {
                            role: "user",
                            content: `Pertanyaan: ${question}\n\n${dbContext}\n\nJawab:`
                        }
                    ],
                    max_tokens: AI_CONFIG.MAX_TOKENS,
                    temperature: AI_CONFIG.TEMPERATURE
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    timeout: AI_CONFIG.TIMEOUT
                }
            );
            
            let answer = response.data.choices[0].message.content;
            
            if (answer.length > 500) {
                answer = answer.substring(0, 500) + "...";
            }
            
            return answer;
        } catch (error) {
            console.error("AI Error:", error.response?.data || error.message);
            
            if (isDatabaseQuery) {
                return database.getInfo();
            }
            
            return "❌ AI error. Coba lagi nanti.";
        }
    }
}

module.exports = AIService;