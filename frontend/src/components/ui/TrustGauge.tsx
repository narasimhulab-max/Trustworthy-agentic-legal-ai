"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, Scale } from "lucide-react";
import type { TrustMetrics } from "@/lib/api";

interface TrustGaugeProps {
  metrics: TrustMetrics;
}

export function TrustGauge({ metrics }: TrustGaugeProps) {
  const score = Math.max(0, Math.min(100, metrics.overall_score));
  
  // Radial circle params
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 85) return "#10b981"; // Emerald
    if (score >= 65) return "#f59e0b"; // Amber
    return "#f43f5e"; // Rose
  };

  const getBadgeStyle = () => {
    if (metrics.confidence_level === "high") {
      return { bg: "rgba(16, 185, 129, 0.12)", text: "#10b981", border: "rgba(16, 185, 129, 0.25)" };
    }
    if (metrics.confidence_level === "medium") {
      return { bg: "rgba(245, 158, 11, 0.12)", text: "#f59e0b", border: "rgba(245, 158, 11, 0.25)" };
    }
    return { bg: "rgba(244, 63, 94, 0.12)", text: "#f43f5e", border: "rgba(244, 63, 94, 0.25)" };
  };

  const badge = getBadgeStyle();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ShieldCheck size={18} color="var(--accent-teal)" />
          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>
            Trust &amp; Verification Score
          </span>
        </div>
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: "9999px",
            background: badge.bg,
            color: badge.text,
            border: `1px solid ${badge.border}`,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {metrics.confidence_level} CONFIDENCE
        </span>
      </div>

      {/* Radial Meter + Factor Breakdowns */}
      <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: "20px", alignItems: "center" }}>
        {/* Radial SVG Meter */}
        <div style={{ position: "relative", width: "100px", height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
            {/* Background track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="var(--glass-border-outer)"
              strokeWidth="7"
            />
            {/* Animated value track */}
            <motion.circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke={getColor()}
              strokeWidth="7"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              strokeLinecap="round"
            />
          </svg>
          <div style={{ position: "absolute", textAlign: "center" }}>
            <span style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text-primary)" }}>
              {Math.round(score)}%
            </span>
          </div>
        </div>

        {/* Breakdown Horizontal Progress Bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Source Grounding */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "4px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Source Grounding</span>
              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{metrics.source_grounding}%</span>
            </div>
            <div style={{ height: "4px", width: "100%", background: "var(--glass-border-outer)", borderRadius: "9999px", overflow: "hidden" }}>
              <motion.div
                style={{ height: "100%", background: "var(--accent-teal)", borderRadius: "9999px" }}
                initial={{ width: 0 }}
                animate={{ width: `${metrics.source_grounding}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
          </div>

          {/* Hallucination Risk */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "4px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Hallucination Risk (Low is better)</span>
              <span style={{ fontWeight: 600, color: metrics.hallucination_risk < 10 ? "#10b981" : "#f59e0b" }}>
                {metrics.hallucination_risk}%
              </span>
            </div>
            <div style={{ height: "4px", width: "100%", background: "var(--glass-border-outer)", borderRadius: "9999px", overflow: "hidden" }}>
              <motion.div
                style={{
                  height: "100%",
                  background: metrics.hallucination_risk < 10 ? "#10b981" : "#f59e0b",
                  borderRadius: "9999px",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, metrics.hallucination_risk * 4)}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
          </div>

          {/* Jurisdictional Relevance */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "4px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Indian Statutory Fit</span>
              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{metrics.jurisdictional_relevance}%</span>
            </div>
            <div style={{ height: "4px", width: "100%", background: "var(--glass-border-outer)", borderRadius: "9999px", overflow: "hidden" }}>
              <motion.div
                style={{ height: "100%", background: "#06b6d4", borderRadius: "9999px" }}
                initial={{ width: 0 }}
                animate={{ width: `${metrics.jurisdictional_relevance}%` }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
