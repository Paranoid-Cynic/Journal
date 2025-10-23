import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Eye, Trash2 } from "lucide-react";

function JournalEntry({ entry, onEdit, onDelete, onView }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="bg-terminal-bg rounded-none shadow-lg p-6 mb-4 neon-border cursor-pointer"
      whileHover={{ scale: 1.02 }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg text-neon-pink">{entry.title}</h2>
        <div className="flex items-center space-x-2">
          <motion.button
            className="text-neon-cyan hover:text-neon-blue p-2 rounded-none hover:bg-terminal-bg"
            whileHover={{ scale: 1.1 }}
            onClick={(e) => {
              e.stopPropagation();
              onView(entry);
            }}
          >
            <Eye size={20} />
          </motion.button>
          <motion.button
            className="text-neon-cyan hover:text-neon-blue p-2 rounded-none hover:bg-terminal-bg"
            whileHover={{ scale: 1.1 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(entry);
            }}
          >
            <Edit size={20} />
          </motion.button>
          <motion.button
            className="text-red-500 hover:text-red-400 p-2 rounded-none hover:bg-terminal-bg"
            whileHover={{ scale: 1.1 }}
            onClick={(e) => {
              e.stopPropagation();
              if (
                window.confirm("ARE YOU SURE YOU WANT TO DELETE THIS ENTRY?")
              ) {
                onDelete(entry.id);
              }
            }}
          >
            <Trash2 size={20} />
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <div className="border-t border-terminal-border pt-4">
              <p className="text-neon-cyan mb-2">MOOD: {entry.mood || "—"}</p>
              <p className="text-neon-green line-clamp-3">{entry.content}</p>
              <p className="text-sm text-neon-cyan mt-4">
                {new Date(entry.created_at).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default JournalEntry;
