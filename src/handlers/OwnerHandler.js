const fs = require("fs");
const { PATHS, DEFAULT_OWNERS } = require("../config/constants");

class OwnerHandler {
    constructor() {
        this.owners = [];
        this.load();
    }
    
    load() {
        try {
            if (fs.existsSync(PATHS.OWNERS)) {
                const data = fs.readFileSync(PATHS.OWNERS, "utf-8");
                if (data.trim()) {
                    this.owners = JSON.parse(data);
                    console.log("👑 Loaded owners from file:", this.owners);
                    return;
                }
            }
            
            // Use default owners if file doesn't exist
            this.owners = [...DEFAULT_OWNERS];
            this.save();
            console.log("👑 Created default owners:", this.owners);
        } catch (error) {
            console.error("Error loading owners:", error.message);
            this.owners = [...DEFAULT_OWNERS];
            this.save();
        }
    }
    
    save() {
        try {
            fs.writeFileSync(PATHS.OWNERS, JSON.stringify(this.owners, null, 2), "utf-8");
            console.log("💾 Owners saved to file:", this.owners);
        } catch (error) {
            console.error("Error saving owners:", error.message);
            throw new Error("Failed to save owners");
        }
    }
    
    isOwner(jid) {
        if (!jid) return false;
        return this.owners.includes(jid);
    }
    
    addOwner(jid) {
        if (!this.owners.includes(jid)) {
            this.owners.push(jid);
            this.save();
            return true;
        }
        return false;
    }
    
    removeOwner(jid) {
        const index = this.owners.indexOf(jid);
        if (index !== -1) {
            this.owners.splice(index, 1);
            this.save();
            return true;
        }
        return false;
    }
    
    getOwners() {
        return [...this.owners];
    }
    
    getOwnerCount() {
        return this.owners.length;
    }
}

module.exports = OwnerHandler;