import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <motion.button
      onClick={toggleDarkMode}
      className="relative p-2 rounded-full glass-effect hover:scale-110 transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: darkMode ? 360 : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        {darkMode ? (
          <Moon className="w-5 h-5 text-yellow-300" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-500" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;