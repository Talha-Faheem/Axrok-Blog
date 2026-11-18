"use client";

import React from "react";
import { motion, HTMLMotionProps, Variants } from "framer-motion";

// Subtle editorial animation variants
export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

interface MotionProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, className = "", ...props }: MotionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, delay, ease: [0.215, 0.61, 0.355, 1] },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGroup({ children, className = "", ...props }: MotionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={staggerContainerVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "", ...props }: MotionProps) {
  return (
    <motion.div variants={fadeInUpVariants} className={className} {...props}>
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, delay = 0, className = "", ...props }: MotionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: { opacity: 0, scale: 0.98 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1.0] },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
