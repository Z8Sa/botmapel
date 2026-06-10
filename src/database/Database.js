const fs = require("fs");
const { PATHS, SUBJECTS } = require("../config/constants");

class Database {
    constructor() {
        this.db = this.load();
    }
    
    load() {
        try {
            if (!fs.existsSync(PATHS.DATABASE)) {
                return this.createDefault();
            }
            
            const data = fs.readFileSync(PATHS.DATABASE, "utf-8");
            if (!data.trim()) return this.createDefault();
            
            return JSON.parse(data);
        } catch (err) {
            console.error("Error loading database:", err.message);
            return this.createDefault();
        }
    }
    
    createDefault() {
        const defaultDB = { semester1: {}, semester2: {} };
        
        for (const subject of SUBJECTS) {
            defaultDB.semester1[subject] = { materi: [], tugas: [] };
            defaultDB.semester2[subject] = { materi: [], tugas: [] };
        }
        
        this.save(defaultDB);
        return defaultDB;
    }
    
    save(data = this.db) {
        try {
            fs.writeFileSync(PATHS.DATABASE, JSON.stringify(data, null, 2), "utf-8");
            this.db = data;
        } catch (err) {
            console.error("Error saving database:", err.message);
            throw new Error("Failed to save database");
        }
    }
    
    getSubject(semester, subject) {
        if (!this.db[semester][subject]) {
            this.db[semester][subject] = { materi: [], tugas: [] };
        }
        return this.db[semester][subject];
    }
    
    getAllSubjects(semester) {
        return Object.keys(this.db[semester]);
    }
    
    getInfo() {
        let info = "📚 INFORMASI DATABASE BOT:\n\n";
        
        for (const semester of ["semester1", "semester2"]) {
            const semesterName = semester === "semester1" ? "SEMESTER 1" : "SEMESTER 2";
            info += `${semesterName}:\n`;
            
            for (const subject in this.db[semester]) {
                const materiCount = this.db[semester][subject].materi.length;
                const tugasCount = this.db[semester][subject].tugas.length;
                
                if (materiCount > 0 || tugasCount > 0) {
                    info += `• ${subject}: ${materiCount} materi, ${tugasCount} tugas\n`;
                }
            }
            info += "\n";
        }
        
        return info;
    }
    
    search(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();
        
        for (const sem of ["semester1", "semester2"]) {
            for (const subject in this.db[sem]) {
                const materiList = this.db[sem][subject].materi.filter(m => 
                    m.toLowerCase().includes(lowerQuery)
                );
                const tugasList = this.db[sem][subject].tugas.filter(t => 
                    t.toLowerCase().includes(lowerQuery)
                );
                
                if (materiList.length > 0 || tugasList.length > 0) {
                    results.push({
                        semester: sem === "semester1" ? "Semester 1" : "Semester 2",
                        subject: subject,
                        materi: materiList,
                        tugas: tugasList
                    });
                }
            }
        }
        
        return results;
    }
    
    addItem(semester, subject, type, item) {
        const target = this.getSubject(semester, subject);
        target[type].push(item);
        this.save();
        return true;
    }
    
    deleteItem(semester, subject, type, index) {
        const target = this.getSubject(semester, subject);
        
        if (index < 0 || index >= target[type].length) {
            return null;
        }
        
        const removed = target[type].splice(index, 1);
        this.save();
        return removed[0];
    }
}

module.exports = Database;