import React from "react";
import { motion } from "framer-motion";

const ViewModal = ({ entry, onClose }) => {
  if (!entry) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-terminal-bg rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl neon-border"
      >
        <h2 className="text-lg neon-text mb-4">{entry.title}</h2>
        <p className="text-lg text-neon-cyan mb-2">MOOD: {entry.mood || "—"}</p>
        <p className="text-base text-neon-pink leading-relaxed">
          {entry.content}
        </p>
        <p className="text-sm text-neon-cyan mt-4">
          {new Date(entry.created_at).toLocaleDateString()}
        </p>
        <motion.button
          onClick={onClose}
          className="mt-6 terminal-button glow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          CLOSE
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ViewModal;
