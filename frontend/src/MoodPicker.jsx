import React from "react";
import { motion } from "framer-motion";

const moods = [
  {
    name: "HAPPY",
    emoji: "😊",
    color: "bg-neon-yellow",
    description: "CHEERFUL FACE",
  },
  {
    name: "CALM",
    emoji: "😌",
    color: "bg-neon-cyan",
    description: "SOFT SMILE",
  },
  {
    name: "SAD",
    emoji: "😞",
    color: "bg-gray-500",
    description: "TEARDROP FACE",
  },
  {
    name: "TIRED",
    emoji: "🫠",
    color: "bg-neon-purple",
    description: "DROOPY EYES",
  },
  {
    name: "EXCITED",
    emoji: "🤩",
    color: "bg-neon-pink",
    description: "SPARKLY EYES",
  },
  {
    name: "ANXIOUS",
    emoji: "😬",
    color: "bg-neon-blue",
    description: "NERVOUS FACE",
  },
  {
    name: "GRATEFUL",
    emoji: "🤍",
    color: "bg-neon-yellow",
    description: "CALM HEART EYES",
  },
  {
    name: "ANGRY",
    emoji: "😡",
    color: "bg-red-500",
    description: "PUFF CHEEKS",
  },
];

function MoodPicker({ onSelectMood }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-lg neon-text mb-8">HOW ARE YOU FEELING TODAY?</h2>
      <div className="grid grid-cols-2 gap-6">
        {moods.map((mood) => (
          <motion.button
            key={mood.name}
            className={`${mood.color} w-28 h-28 rounded-none flex flex-col items-center justify-center text-3xl shadow-lg hover:shadow-xl mood-hover transition-all duration-300 border-2 border-terminal-border`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectMood(mood)}
          >
            <span className="mb-1">{mood.emoji}</span>
            <span className="text-xs font-medium text-black">{mood.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default MoodPicker;
