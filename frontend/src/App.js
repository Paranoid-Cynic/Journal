import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API, { setAuthToken } from "./api";
import MoodPicker from "./MoodPicker";
import MoodSummary from "./MoodSummary";
import JournalEntry from "./JournalEntry";
import EditModal from "./EditModal";
import ViewModal from "./ViewModal";
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
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [viewingEntry, setViewingEntry] = useState(null);

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

  // ✅ Handle mood selection
  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood.name);
    setShowMoodPicker(false);
    setShowEntryForm(true);
    setTitle("");
    setContent("");
  };

  // ✅ Save new entry
  const saveEntry = async () => {
    try {
      await API.post("/entries", { title, mood, content });
      setTitle("");
      setMood("");
      setContent("");
      setShowEntryForm(false);
      fetchEntriesAndStats();
    } catch (err) {
      console.error("Error saving entry:", err);
    }
  };

  // ✅ Edit entry
  const editEntry = (entry) => {
    setEditingEntry(entry);
  };

  // ✅ Save edited entry
  const saveEditedEntry = async (id, updatedData) => {
    try {
      await API.put(`/entries/${id}`, updatedData);
      setEditingEntry(null);
      fetchEntriesAndStats();
    } catch (err) {
      console.error("Error saving edited entry:", err);
    }
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

  // ✅ View entry
  const viewEntry = (entry) => {
    setViewingEntry(entry);
  };

  // ✅ Login or Signup page
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <motion.div
          className="bg-terminal-bg rounded-lg p-8 max-w-md w-full neon-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-lg neon-text mb-6 text-center">
            {isLogin ? "LOGIN" : "SIGN UP"}
          </h2>
          <div className="space-y-4">
            <input
              placeholder="USERNAME"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full terminal-input"
            />
            <input
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full terminal-input"
            />
            <motion.button
              onClick={handleAuth}
              className="w-full terminal-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLogin ? "LOGIN" : "SIGNUP"}
            </motion.button>
          </div>
          <p
            onClick={() => setIsLogin(!isLogin)}
            className="text-center mt-4 text-neon-green cursor-pointer hover:text-neon-cyan"
          >
            {isLogin ? "CREATE ACCOUNT?" : "HAVE ACCOUNT?"}
          </p>
        </motion.div>
      </div>
    );
  }

  // ✅ Mood Picker screen
  if (showMoodPicker) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <MoodPicker onSelectMood={handleMoodSelect} />
      </div>
    );
  }

  // ✅ Entry Form screen
  if (showEntryForm) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <motion.div
          className="bg-terminal-bg rounded-lg p-8 max-w-md w-full neon-border"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-lg neon-text mb-6 text-center">
            NEW JOURNAL ENTRY
          </h2>
          <div className="space-y-4">
            <input
              placeholder="TITLE"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full terminal-input"
            />
            <div className="flex items-center space-x-2">
              <span className="text-neon-green">{mood}</span>
              <span className="text-neon-cyan">MOOD</span>
            </div>
            <textarea
              placeholder="WHAT'S ON YOUR MIND?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full terminal-input h-32 resize-none"
            />
            <div className="flex justify-end space-x-4">
              <motion.button
                onClick={() => setShowEntryForm(false)}
                className="terminal-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                CANCEL
              </motion.button>
              <motion.button
                onClick={saveEntry}
                className="terminal-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                SAVE
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ✅ Main journal page
  return (
    <div className="min-h-screen p-8 relative">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            className="text-2xl neon-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            MY DIARY
          </motion.h1>
          <motion.button
            onClick={() => {
              setToken(null);
              setAuthToken(null);
              setEntries([]);
              setStats([]);
            }}
            className="terminal-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            LOGOUT
          </motion.button>
        </div>

        <MoodSummary stats={stats} />

        <div className="space-y-4">
          {entries.map((entry) => (
            <JournalEntry
              key={entry.id}
              entry={entry}
              onEdit={editEntry}
              onDelete={deleteEntry}
              onView={viewEntry}
            />
          ))}
        </div>
      </div>

      {/* Floating Add Button */}
      <motion.button
        className="fixed bottom-8 right-8 w-16 h-16 terminal-button rounded-none flex items-center justify-center text-lg glow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowMoodPicker(true)}
      >
        +
      </motion.button>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingEntry && (
          <EditModal
            entry={editingEntry}
            onSave={saveEditedEntry}
            onClose={() => setEditingEntry(null)}
          />
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {viewingEntry && (
          <ViewModal
            entry={viewingEntry}
            onClose={() => setViewingEntry(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
