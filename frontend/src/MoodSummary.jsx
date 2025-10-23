import React from "react";
import { motion } from "framer-motion";

function MoodSummary({ stats }) {
  const mostCommonMood =
    stats.length > 0
      ? stats.reduce((prev, current) =>
          prev.count > current.count ? prev : current
        )
      : null;

  return (
    <motion.div
      className="bg-terminal-bg rounded-lg p-6 mb-8 neon-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg text-neon-pink mb-4">MOOD SUMMARY (THIS MONTH)</h3>
      {stats.length === 0 ? (
        <p className="text-neon-pink">NO MOODS LOGGED YET.</p>
      ) : (
        <div className="space-y-2">
          {stats.map((s) => (
            <motion.div
              key={s.mood}
              className="flex items-center justify-between bg-terminal-bg border border-terminal-border rounded-none px-4 py-2"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-2xl text-neon-pink">{s.mood}</span>
              <span className="font-semibold text-neon-pink">{s.count}</span>
            </motion.div>
          ))}
          {mostCommonMood && (
            <motion.div
              className="mt-4 p-3 bg-terminal-bg border border-terminal-border rounded-none text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-neon-cyan">
                MOST COMMON MOOD:{" "}
                <span className="text-neon-pink">{mostCommonMood.mood}</span>
              </p>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default MoodSummary;
