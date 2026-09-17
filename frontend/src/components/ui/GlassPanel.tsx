"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassPanelProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  depth?: 1 | 2 | 3;
  className?: string;
  hoverEffect?: boolean;
}

export function GlassPanel({
  children,
  depth = 2,
  className = "",
  hoverEffect = false,
  ...props
}: GlassPanelProps) {
  const depthClass = `glass-panel-${depth}`;

  return (
    <motion.div
      className={`${depthClass} ${className}`}
      whileHover={
        hoverEffect
          ? {
              y: -2,
              transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
            }
          : undefined
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}
