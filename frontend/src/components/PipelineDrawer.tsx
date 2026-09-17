"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, GitBranch, Copy, CheckCheck, Activity, Zap } from "lucide-react";
import AgentPipeline from "./AgentPipeline";
import type { StageUpdate } from "@/lib/api";

interface PipelineDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stageUpdates: Record<string, StageUpdate>;
  isLive: boolean;
}

export default function PipelineDrawer({
  isOpen,
  onClose,
  stageUpdates,
  isLive,
}: PipelineDrawerProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const doneCount = Object.values(stageUpdates).filter((s) => s.status === "done").length;
  const runningStage = Object.values(stageUpdates).find((s) => s.status === "running");
  const totalStages = 13;

  const handleCopyTrace = () => {
    const trace = Object.entries(stageUpdates)
      .map(([id, s]) => `[${s.status.toUpperCase()}] ${id}: ${s.message}${s.output_preview ? `\n  → ${s.output_preview}` : ""}`)
      .join("\n");
    navigator.clipboard.writeText(trace || "No pipeline trace yet").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 150,
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          display: "flex",
          justifyContent: "flex-end",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ x: 600, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 600, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: "680px",
            height: "100vh",
            background: "var(--bg-base)",
            borderLeft: "1px solid var(--liquid-border)",
            boxShadow: "var(--shadow-liquid-lg)",
            overflowY: "auto",
            padding: "0 0 80px",
            position: "relative",
          }}
        >
          {/* ─── Sticky Header ─── */}
          <div
            style={{
              padding: "20px 24px 16px",
              borderBottom: "1px solid var(--liquid-border)",
              position: "sticky",
              top: 0,
              background: "var(--bg-base)",
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "rgba(6, 182, 212, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent-cyan)",
                  }}
                >
                  <GitBranch size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    13-Stage Agentic State Machine
                  </h3>
                  <span style={{ fontSize: "0.6875rem", color: "var(--text-tertiary)" }}>
                    Live multi-agent status &amp; inspectable payload traces
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {/* Copy Trace Button */}
                <button
                  onClick={handleCopyTrace}
                  title="Copy pipeline trace to clipboard"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "5px 10px",
                    borderRadius: "8px",
                    background: "var(--liquid-glass-2)",
                    border: "1px solid var(--liquid-border)",
                    color: copied ? "var(--accent-teal)" : "var(--text-secondary)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
                  <span>{copied ? "Copied!" : "Copy Trace"}</span>
                </button>

                <button
                  onClick={onClose}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-tertiary)",
                    cursor: "pointer",
                    padding: "6px",
                    borderRadius: "8px",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* ─── Live Stats Bar ─── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                borderRadius: "12px",
                background: isLive ? "rgba(6, 182, 212, 0.06)" : "var(--liquid-glass-1)",
                border: `1px solid ${isLive ? "rgba(6, 182, 212, 0.2)" : "var(--liquid-border)"}`,
              }}
            >
              {/* Live indicator */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {isLive ? (
                  <span
                    className="anim-pulse"
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "var(--accent-cyan)",
                      display: "inline-block",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: doneCount === totalStages ? "var(--accent-emerald)" : "var(--text-muted)",
                      display: "inline-block",
                    }}
                  />
                )}
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: isLive ? "var(--accent-cyan)" : "var(--text-secondary)" }}>
                  {isLive ? "LIVE" : doneCount === totalStages ? "COMPLETE" : "IDLE"}
                </span>
              </div>

              <div style={{ width: "1px", height: "16px", background: "var(--liquid-border)" }} />

              {/* Stages progress */}
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <Activity size={12} color="var(--text-muted)" />
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  <strong style={{ color: "var(--text-primary)" }}>{doneCount}</strong>/{totalStages} Stages Done
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ flex: 1, height: "4px", background: "var(--liquid-glass-2)", borderRadius: "9999px", overflow: "hidden" }}>
                <motion.div
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, var(--accent-teal), var(--accent-cyan))",
                    borderRadius: "9999px",
                  }}
                  animate={{ width: `${(doneCount / totalStages) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {/* Active stage */}
              {runningStage && (
                <>
                  <div style={{ width: "1px", height: "16px", background: "var(--liquid-border)" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Zap size={12} color="var(--accent-amber)" className="anim-pulse" />
                    <span style={{ fontSize: "0.6875rem", color: "var(--accent-amber)", fontWeight: 600, maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {runningStage.message?.slice(0, 40)}...
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ─── Pipeline Stages ─── */}
          <div style={{ padding: "20px 24px" }}>
            <AgentPipeline stageUpdates={stageUpdates} isLive={isLive} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
