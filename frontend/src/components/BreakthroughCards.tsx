"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  ShieldAlert,
  AlertTriangle,
  Scale,
  Award,
  ArrowRight,
  Gavel,
} from "lucide-react";
import { GlassPanel } from "./ui/GlassPanel";
import type { CaseBreakthrough } from "@/lib/api";

interface BreakthroughCardsProps {
  breakthroughs: CaseBreakthrough[];
}

export function BreakthroughCards({ breakthroughs }: BreakthroughCardsProps) {
  if (!breakthroughs || breakthroughs.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-tertiary)" }}>
        No specific procedural breakthroughs triggered for this general inquiry.
      </div>
    );
  }

  const getImpactBadge = (level: string) => {
    const l = level.toLowerCase();
    if (l === "critical") {
      return {
        bg: "rgba(244, 63, 94, 0.14)",
        text: "#f43f5e",
        border: "rgba(244, 63, 94, 0.3)",
        label: "CRITICAL BREAKTHROUGH",
      };
    }
    if (l === "high") {
      return {
        bg: "rgba(245, 158, 11, 0.14)",
        text: "#f59e0b",
        border: "rgba(245, 158, 11, 0.3)",
        label: "HIGH STRATEGIC IMPACT",
      };
    }
    return {
      bg: "rgba(6, 182, 212, 0.14)",
      text: "#06b6d4",
      border: "rgba(6, 182, 212, 0.3)",
      label: "PROCEDURAL ADVANTAGE",
    };
  };

  const getCategoryIcon = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes("flaw") || c.includes("procedural")) return ShieldAlert;
    if (c.includes("evidentiary") || c.includes("gap")) return AlertTriangle;
    if (c.includes("constitutional") || c.includes("shield")) return Scale;
    return Award;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Zap size={18} color="var(--accent-amber)" />
          <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Case Breakthroughs &amp; Defense Angles
          </span>
        </div>
        <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
          {breakthroughs.length} Tactical Vulnerabilities Identified
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "14px" }}>
        {breakthroughs.map((b, idx) => {
          const badge = getImpactBadge(b.impact_level);
          const IconComp = getCategoryIcon(b.category);

          return (
            <GlassPanel
              key={idx}
              depth={2}
              hoverEffect
              style={{
                padding: "20px",
                borderLeft: `4px solid ${badge.text}`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Top Row: Category + Impact Level Badge */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <IconComp size={16} color={badge.text} />
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {b.category}
                  </span>
                </div>

                <span
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 800,
                    padding: "3px 10px",
                    borderRadius: "9999px",
                    background: badge.bg,
                    color: badge.text,
                    border: `1px solid ${badge.border}`,
                    letterSpacing: "0.06em",
                  }}
                >
                  {badge.label}
                </span>
              </div>

              {/* Title */}
              <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px", lineHeight: 1.4 }}>
                {b.title}
              </h4>

              {/* Description */}
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "14px" }}>
                {b.description}
              </p>

              {/* Statutory Basis Capsule */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)" }}>
                  Statutory Basis:
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "8px",
                    background: "var(--liquid-glass-3)",
                    border: "1px solid var(--liquid-border)",
                    color: "var(--accent-teal)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {b.statutory_basis}
                </span>
              </div>

              {/* Tactical Court Advantage Box */}
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  background: "var(--bg-base)",
                  border: "1px solid var(--liquid-border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-cyan)", textTransform: "uppercase" }}>
                  <Gavel size={13} />
                  <span>Advocate Tactical Playbook / Court Leverage:</span>
                </div>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-primary)", lineHeight: 1.55 }}>
                  {b.tactical_advantage}
                </p>
              </div>
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
}
