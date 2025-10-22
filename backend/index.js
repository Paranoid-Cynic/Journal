import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { initDB } from "./db.js";

const app = express();
const PORT = 4000;
const JWT_SECRET = "your_secret_key";

app.use(cors());
app.use(express.json());

let db;

// ✅ Initialize database
(async () => {
  db = await initDB();
})();

// ✅ Middleware for auth
const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token" });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ✅ Signup Route
app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.run("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      hashed,
    ]);
    res.json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Login Route
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.get("SELECT * FROM users WHERE username = ?", [username]);
    if (!user) return res.status(400).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Wrong password" });

    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get All Entries
app.get("/api/entries", auth, async (req, res) => {
  try {
    const entries = await db.all(
      "SELECT * FROM entries WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(entries);
  } catch (err) {
    console.error("Get Entries Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Add Entry
app.post("/api/entries", auth, async (req, res) => {
  const { title, mood, content } = req.body;
  try {
    await db.run(
      "INSERT INTO entries (title, mood, content, user_id) VALUES (?, ?, ?, ?)",
      [title, mood, content, req.user.id]
    );
    res.json({ message: "Entry added successfully" });
  } catch (err) {
    console.error("Add Entry Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Mood Stats
app.get("/api/moods/stats", auth, async (req, res) => {
  try {
    const stats = await db.all(
      `SELECT mood, COUNT(mood) as count
       FROM entries
       WHERE user_id = ? AND strftime('%m', created_at) = strftime('%m', 'now')
       GROUP BY mood`,
      [req.user.id]
    );
    res.json(stats);
  } catch (err) {
    console.error("Mood Stats Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
