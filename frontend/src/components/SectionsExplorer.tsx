"use client";

import React from "react";
import { BookOpen, Shield, AlertCircle, FileSpreadsheet } from "lucide-react";
import { GlassPanel } from "./ui/GlassPanel";
import type { StatutorySection } from "@/lib/api";

interface SectionsExplorerProps {
  sections: StatutorySection[];
}

export function SectionsExplorer({ sections }: SectionsExplorerProps) {
  if (!sections || sections.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-tertiary)" }}>
        No explicit penal sections matched. General constitutional provisions apply.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <BookOpen size={18} color="var(--accent-teal)" />
          <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Applicable Statutory Sections &amp; Penal Codes
          </span>
        </div>
        <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
          {sections.length} Provisions Mapped (BNS / IPC / BNSS / CrPC)
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
        {sections.map((sec, idx) => {
          const isNonBailable = sec.bailable?.toLowerCase().includes("non-bailable");

          return (
            <GlassPanel
              key={idx}
              depth={2}
              hoverEffect
              style={{
                padding: "18px 20px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {/* Header: Act Name & Section Numbers */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 800,
                      color: "var(--accent-teal)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {sec.section}
                  </span>
                  {sec.ipc_equivalent && sec.ipc_equivalent !== "N/A" && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: "6px",
                        background: "rgba(255, 255, 255, 0.08)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Equivalent: {sec.ipc_equivalent}
                    </span>
                  )}
                </div>

                {/* Bailable / Non-Bailable Badge */}
                {sec.bailable && sec.bailable !== "N/A" && (
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: "9999px",
                      background: isNonBailable ? "rgba(244, 63, 94, 0.12)" : "rgba(16, 185, 129, 0.12)",
                      color: isNonBailable ? "#f43f5e" : "#10b981",
                      border: `1px solid ${isNonBailable ? "rgba(244, 63, 94, 0.25)" : "rgba(16, 185, 129, 0.25)"}`,
                      textTransform: "uppercase",
                    }}
                  >
                    {sec.bailable}
                  </span>
                )}
              </div>

              {/* Title & Act */}
              <div>
                <h4 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  {sec.title}
                </h4>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {sec.act}
                </span>
              </div>

              {/* Punishment & Guidelines */}
              {sec.punishment && sec.punishment !== "N/A" && (
                <div
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--text-secondary)",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: "var(--bg-base)",
                    border: "1px solid var(--liquid-border)",
                  }}
                >
                  <span style={{ fontWeight: 600, color: "var(--text-muted)", marginRight: "6px" }}>
                    Prescribed Punishment:
                  </span>
                  {sec.punishment}
                </div>
              )}
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
}
