require("dotenv").config();
const Bot = require("./src/Bot");

async function main() {
    const bot = new Bot();
    await bot.start();
    
    // Handle graceful shutdown
    process.on("SIGINT", () => {
        console.log("\n🛑 Shutting down gracefully...");
        process.exit(0);
    });
    
    process.on("SIGTERM", () => {
        console.log("\n🛑 Shutting down gracefully...");
        process.exit(0);
    });
}

main().catch(console.error);