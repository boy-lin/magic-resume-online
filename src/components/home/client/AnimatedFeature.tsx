"use client";
import { motion } from "framer-motion";

interface AnimatedFeatureProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "left" | "right" | "up" | "down";
}

export default function AnimatedFeature({
  children,
  delay = 0,
  direction = "up",
}: AnimatedFeatureProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: direction === "left" ? -20 : direction === "right" ? 20 : 0,
        y: direction === "up" ? -20 : direction === "down" ? 20 : 0,
      }}
      whileInView={{
        opacity: 1,
        x: direction === "left" ? 0 : direction === "right" ? 0 : 0,
        y: direction === "up" ? 0 : direction === "down" ? 0 : 0,
      }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}
