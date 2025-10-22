import React, { useState, useEffect } from "react";
import API, { setAuthToken } from "./api";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState([]);

  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("");
  const [content, setContent] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch entries + mood stats
  const fetchEntriesAndStats = async () => {
    try {
      const resEntries = await API.get("/entries");
      setEntries(resEntries.data);
      const resStats = await API.get("/moods/stats");
      setStats(resStats.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    if (token) fetchEntriesAndStats();
  }, [token]);

  // ✅ Login / Signup
  const handleAuth = async () => {
    const url = isLogin ? "/login" : "/signup";
    try {
      const res = await API.post(url, { username, password });

      if (res.data.token) {
        setToken(res.data.token);
        setAuthToken(res.data.token);
      } else {
        alert(res.data.message || "User created successfully. Please login!");
        if (!isLogin) setIsLogin(true);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Server error");
    }
  };

  // ✅ Save new or updated entry
  const saveEntry = async () => {
    try {
      if (editingId) {
        await API.put(`/entries/${editingId}`, { title, mood, content });
        setEditingId(null);
      } else {
        await API.post("/entries", { title, mood, content });
      }
      setTitle("");
      setMood("");
      setContent("");
      setShowForm(false);
      fetchEntriesAndStats();
    } catch (err) {
      console.error("Error saving entry:", err);
    }
  };

  // ✅ Edit entry
  const editEntry = (entry) => {
    setTitle(entry.title);
    setMood(entry.mood);
    setContent(entry.content);
    setShowForm(true);
    setEditingId(entry.id);
  };

  // ✅ Delete entry
  const deleteEntry = async (id) => {
    try {
      await API.delete(`/entries/${id}`);
      fetchEntriesAndStats();
    } catch (err) {
      console.error("Error deleting entry:", err);
    }
  };

  // ✅ Login or Signup page
  if (!token) {
    return (
      <div className="auth">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleAuth}>{isLogin ? "Login" : "Signup"}</button>
        <p
          onClick={() => setIsLogin(!isLogin)}
          style={{ cursor: "pointer", marginTop: "10px" }}
        >
          {isLogin ? "Create an account?" : "Already have an account?"}
        </p>
      </div>
    );
  }

  // ✅ Main journal page
  return (
    <div className="journal-container">
      <h1>Journal</h1>

      <div className="stats">
        <h3>📊 Mood Summary (This Month)</h3>
        {stats.length === 0 ? (
          <p>No moods logged yet.</p>
        ) : (
          <ul>
            {stats.map((s) => (
              <li key={s.mood}>
                {s.mood}: {s.count}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "+ Add Entry"}
      </button>

      {showForm && (
        <div className="entry-form">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            placeholder="Mood"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={saveEntry}>{editingId ? "Update" : "Save"}</button>
        </div>
      )}

      <div className="entries">
        {entries.map((entry) => (
          <div className="entry" key={entry.id}>
            <h2>{entry.title}</h2>
            <p className="mood">Mood: {entry.mood || "—"}</p>
            <p className="content">{entry.content}</p>
            <p className="date">
              {new Date(entry.created_at).toLocaleDateString()}
            </p>
            <div className="actions">
              <button onClick={() => editEntry(entry)}>✏️</button>
              <button onClick={() => deleteEntry(entry.id)}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
