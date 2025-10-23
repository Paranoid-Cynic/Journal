import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MoodPicker from "./MoodPicker";

function EditModal({ entry, onSave, onClose }) {
  const [title, setTitle] = useState(entry.title);
  const [mood, setMood] = useState(entry.mood);
  const [content, setContent] = useState(entry.content);
  const [showMoodPicker, setShowMoodPicker] = useState(false);

  const handleSave = () => {
    onSave(entry.id, { title, mood, content });
    onClose();
  };

  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood.name);
    setShowMoodPicker(false);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-terminal-bg rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl neon-border"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <h2 className="text-lg neon-text mb-6">EDIT ENTRY</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="TITLE"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full terminal-input"
          />
          <div>
            <button
              onClick={() => setShowMoodPicker(!showMoodPicker)}
              className="w-full terminal-input text-left"
            >
              {mood || "SELECT MOOD"}
            </button>
            {showMoodPicker && (
              <div className="mt-2 p-4 bg-terminal-bg rounded-lg neon-border">
                <MoodPicker onSelectMood={handleMoodSelect} />
              </div>
            )}
          </div>
          <textarea
            placeholder="CONTENT"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full terminal-input h-32 resize-none"
          />
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <motion.button
            onClick={onClose}
            className="terminal-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            CANCEL
          </motion.button>
          <motion.button
            onClick={handleSave}
            className="terminal-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            SAVE
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default EditModal;
