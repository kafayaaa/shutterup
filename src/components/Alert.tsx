"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface AlertProps {
  message: string;
  type: "success" | "error" | "info";
  onDismiss?: () => void;
  duration?: number;
}

const alertVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -50,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      type: "spring",
      damping: 20,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};

const typeStyles = {
  success: "bg-emerald-500/50 border-emerald-500/75",
  error: "bg-rose-500/50 border-rose-500/75",
  info: "bg-teal-500/50 border-teal-500/75",
};

const Alert: React.FC<AlertProps> = ({
  message,
  type,
  onDismiss,
  duration = 3000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onDismiss) {
          onDismiss();
        }
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="alert"
          variants={alertVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`fixed top-5 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-lg inset-shadow-xs inset-shadow-white backdrop-blur-lg flex items-center justify-between z-50 min-w-75 border text-white ${typeStyles[type]}`}
        >
          <p className="font-semibold">{message}</p>
          <button
            onClick={handleDismiss}
            className="ml-4 p-1 rounded-full hover:bg-white/50 hover:bg-opacity-20 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
