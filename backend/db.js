import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

// Required to make relative paths work properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

sqlite3.verbose();

export const initDB = async () => {
  try {
    // Create or open the database in backend folder
    const db = await open({
      filename: path.join(__dirname, "journal.db"),
      driver: sqlite3.Database,
    });

    // ✅ Create users table if it doesn’t exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
      )
    `);

    // ✅ Create entries table if it doesn’t exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT,
        content TEXT,
        mood TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    console.log("✅ SQLite database initialized successfully");
    return db;
  } catch (err) {
    console.error("❌ Error initializing database:", err);
    throw err;
  }
};
