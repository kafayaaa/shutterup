"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const TAGLINES = [
  "Capture More Than Just Images",
  "Because Every Frame Counts",
  "Turn Moments Into Memories",
  "Designed for Better Photography",
];

export default function AnimatedTagline() {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const typingSpeed = 70;
  const deletingSpeed = 50;
  const pauseAfterTyping = 2000;

  useEffect(() => {
    const currentText = TAGLINES[index];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && text.length < currentText.length) {
      timeout = setTimeout(() => {
        setText(currentText.slice(0, text.length + 1));
      }, typingSpeed);
    } else if (isDeleting && text.length > 0) {
      timeout = setTimeout(() => {
        setText(currentText.slice(0, text.length - 1));
      }, deletingSpeed);
    } else if (!isDeleting && text.length === currentText.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseAfterTyping);
    } else if (isDeleting && text.length === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % TAGLINES.length);
      }, 300);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, index]);

  return (
    <div className="w-full max-w-11/12 md:max-w-[50%] mx-auto h-40 flex items-center justify-center">
      <motion.p
        className="text-xl md:text-5xl font-bold text-white/85 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {text}
        <span className="ml-1 animate-pulse">|</span>
      </motion.p>
    </div>
  );
}
