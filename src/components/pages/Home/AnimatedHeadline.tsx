"use client";

import React from "react";
import { motion } from "framer-motion";

const AnimatedHeadline: React.FC = () => {
  // Animation variants for the headline
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const headline = "Elegance Redefined";
  const subline = "For Every Occasion";

  return (
    <div className="mb-6">
      {/* Main Headline with letter-by-letter animation */}
      <motion.h1
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-2 md:mb-4"
      >
        {headline.split("").map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            variants={letterVariants}
            className="inline-block"
            style={{ display: char === " " ? "inline" : "inline-block" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.h1>

      {/* Subline with slide-up animation */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="relative inline-block"
      >
        <h2 className="text-2xl md:text-4xl font-light text-white/90 italic">
          {subline}
        </h2>
        {/* Decorative underline with draw animation */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mt-2"
        />
      </motion.div>
    </div>
  );
};

export default AnimatedHeadline;
