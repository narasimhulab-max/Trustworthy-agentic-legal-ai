"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSearch,
  Cpu,
  ListTodo,
  Network,
  Search,
  Share2,
  Sparkles,
  Scale,
  FileCheck2,
  ShieldAlert,
  SlidersHorizontal,
  UserCheck,
  CheckCircle2,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { GlassPanel } from "./ui/GlassPanel";
import type { StageUpdate } from "@/lib/api";

export interface StageDefinition {
  id: string;
  number: number;
  name: string;
  category: "Intake & Routing" | "Retrieval & Graph" | "Reasoning & Trust" | "Synthesis & Delivery";
  icon: React.ElementType;
  defaultDesc: string;
}

export const PIPELINE_STAGES: StageDefinition[] = [
  { id: "intake", number: 1, name: "Legal Query Intake", category: "Intake & Routing", icon: FileSearch, defaultDesc: "Normalizes query and classifies legal domain" },
  { id: "orchestrator", number: 2, name: "Agent Orchestrator", category: "Intake & Routing", icon: Cpu, defaultDesc: "Top-level controller managing run state machine" },
  { id: "planning", number: 3, name: "Planning Agent", category: "Intake & Routing", icon: ListTodo, defaultDesc: "Decomposes query into statute and case-law sub-tasks" },
  { id: "task_allocation", number: 4, name: "Task Allocation Agent", category: "Intake & Routing", icon: Network, defaultDesc: "Assigns tools and manages concurrency batches" },
  { id: "retrieval", number: 5, name: "Retrieval Agent", category: "Retrieval & Graph", icon: Search, defaultDesc: "Hybrid search over Constitution chunks & vectors" },
  { id: "knowledge_graph", number: 6, name: "Dynamic Knowledge Graph", category: "Retrieval & Graph", icon: Share2, defaultDesc: "Traverses precedent citations, overrulings, and doctrines" },
  { id: "foundation_model", number: 7, name: "Foundation Model", category: "Retrieval & Graph", icon: Sparkles, defaultDesc: "LLM inference grounded strictly on retrieved context" },
  { id: "reasoning", number: 8, name: "Legal Reasoning Engine", category: "Reasoning & Trust", icon: Scale, defaultDesc: "Executes structured IRAC legal analysis" },
  { id: "explainability", number: 9, name: "Explainability Engine", category: "Reasoning & Trust", icon: FileCheck2, defaultDesc: "Generates plain-language summary and citation trail" },
  { id: "trust", number: 10, name: "Trust Evaluation Module", category: "Reasoning & Trust", icon: ShieldAlert, defaultDesc: "Calculates multi-factor confidence and hallucination score" },
  { id: "decision", number: 11, name: "Decision Intelligence", category: "Synthesis & Delivery", icon: SlidersHorizontal, defaultDesc: "Synthesizes ranked recommendation options with tradeoffs" },
  { id: "human_feedback", number: 12, name: "Human Feedback Module", category: "Synthesis & Delivery", icon: UserCheck, defaultDesc: "Lawyer-in-the-loop review and continuous ranking feedback" },
  { id: "final", number: 13, name: "Final Legal Recommendation", category: "Synthesis & Delivery", icon: CheckCircle2, defaultDesc: "Renders validated recommendation with citations and disclaimers" },
];

interface AgentPipelineProps {
  stageUpdates: Record<string, StageUpdate>;
  isLive: boolean;
}

export default function AgentPipeline({ stageUpdates, isLive }: AgentPipelineProps) {
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);

  const getStageStatus = (id: string): "pending" | "running" | "done" | "failed" => {
    return stageUpdates[id]?.status || "pending";
  };

  const getStageMessage = (id: string, defaultDesc: string): string => {
    return stageUpdates[id]?.message || defaultDesc;
  };

  const getStagePreview = (id: string): string | undefined => {
    return stageUpdates[id]?.output_preview;
  };

  // Calculate overall progress percentage
  const completedCount = PIPELINE_STAGES.filter(
    (s) => getStageStatus(s.id) === "done"
  ).length;
  const progressPercent = Math.round((completedCount / PIPELINE_STAGES.length) * 100);

  return (
    <section
      id="pipeline-section"
      style={{
        padding: "80px 24px",
        maxWidth: "1080px",
        margin: "0 auto",
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <span className="label-eyebrow">Architecture &amp; State Machine</span>
        <h2 className="heading-title" style={{ marginTop: "8px", marginBottom: "12px" }}>
          13-Stage Federated Agentic Pipeline
        </h2>
        <p style={{ color: "var(--text-tertiary)", fontSize: "0.9375rem", maxWidth: "600px", margin: "0 auto" }}>
          Every query flows through 13 specialized, inspectable modules. Real-time state
          is streamed live from the Python orchestrator.
        </p>

        {/* Live Progress Bar Indicator */}
        <div
          style={{
            maxWidth: "400px",
            margin: "24px auto 0",
            padding: "10px 16px",
            borderRadius: "9999px",
            background: "var(--glass-2)",
            border: "1px solid var(--glass-border-outer)",
            boxShadow: "var(--glass-border-inner)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div style={{ flex: 1, height: "6px", background: "var(--glass-border-outer)", borderRadius: "9999px", overflow: "hidden" }}>
            <motion.div
              style={{
                height: "100%",
                background: "linear-gradient(90deg, var(--accent-teal), var(--accent-cyan))",
                borderRadius: "9999px",
              }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", minWidth: "50px", textAlign: "right" }}>
            {completedCount}/13 Done
          </span>
        </div>
      </div>

      {/* 13-Stage Vertical Stack Flow */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", position: "relative" }}>
        {PIPELINE_STAGES.map((stage, idx) => {
          const status = getStageStatus(stage.id);
          const message = getStageMessage(stage.id, stage.defaultDesc);
          const preview = getStagePreview(stage.id);
          const isSelected = selectedStageId === stage.id;
          const IconComp = stage.icon;

          const isRunning = status === "running";
          const isDone = status === "done";
          const isFailed = status === "failed";

          return (
            <React.Fragment key={stage.id}>
              <GlassPanel
                depth={isRunning ? 3 : isDone ? 2 : 1}
                hoverEffect
                onClick={() => setSelectedStageId(isSelected ? null : stage.id)}
                style={{
                  padding: "16px 20px",
                  cursor: "pointer",
                  borderColor: isRunning
                    ? "var(--accent-cyan)"
                    : isDone
                    ? "rgba(16, 185, 129, 0.35)"
                    : "var(--glass-border-outer)",
                  background: isRunning
                    ? "rgba(6, 182, 212, 0.08)"
                    : isDone
                    ? "rgba(16, 185, 129, 0.04)"
                    : "var(--glass-1)",
                  boxShadow: isRunning ? "0 0 30px -5px rgba(6, 182, 212, 0.25)" : undefined,
                  transition: "all 0.25s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                  {/* Left: Stage Number & Icon */}
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: "260px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        background: isRunning
                          ? "rgba(6, 182, 212, 0.2)"
                          : isDone
                          ? "rgba(16, 185, 129, 0.15)"
                          : "var(--glass-2)",
                        border: `1px solid ${
                          isRunning
                            ? "var(--accent-cyan)"
                            : isDone
                            ? "var(--accent-emerald)"
                            : "var(--glass-border-outer)"
                        }`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isRunning
                          ? "var(--accent-cyan)"
                          : isDone
                          ? "var(--accent-emerald)"
                          : "var(--text-tertiary)",
                        flexShrink: 0,
                      }}
                    >
                      {isRunning ? (
                        <Loader2 size={18} className="anim-spin" style={{ animation: "spin 1s linear infinite" }} />
                      ) : isDone ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <IconComp size={18} />
                      )}
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em" }}>
                          STAGE {stage.number.toString().padStart(2, "0")}
                        </span>
                        <span style={{ fontSize: "0.6875rem", color: "var(--text-tertiary)" }}>•</span>
                        <span style={{ fontSize: "0.6875rem", color: "var(--text-tertiary)" }}>{stage.category}</span>
                      </div>
                      <h4 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>
                        {stage.name}
                      </h4>
                    </div>
                  </div>

                  {/* Middle: Live Message / Description */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "0.8125rem",
                        color: isRunning
                          ? "var(--accent-cyan)"
                          : isDone
                          ? "var(--text-secondary)"
                          : "var(--text-tertiary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontWeight: isRunning ? 500 : 400,
                      }}
                    >
                      {message}
                    </p>
                  </div>

                  {/* Right: Status Pill & Expand Chevron */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: "9999px",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        background: isRunning
                          ? "rgba(6, 182, 212, 0.15)"
                          : isDone
                          ? "rgba(16, 185, 129, 0.12)"
                          : "var(--glass-2)",
                        color: isRunning
                          ? "var(--accent-cyan)"
                          : isDone
                          ? "var(--accent-emerald)"
                          : "var(--text-muted)",
                        border: `1px solid ${
                          isRunning
                            ? "rgba(6, 182, 212, 0.3)"
                            : isDone
                            ? "rgba(16, 185, 129, 0.2)"
                            : "var(--glass-border-outer)"
                        }`,
                      }}
                    >
                      {status}
                    </span>
                    <ChevronRight
                      size={16}
                      color="var(--text-muted)"
                      style={{
                        transform: isSelected ? "rotate(90deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                      }}
                    />
                  </div>
                </div>

                {/* Inspectable Stage Output Accordion */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: "hidden", borderTop: "1px solid var(--glass-border-outer)", marginTop: "12px", paddingTop: "12px" }}
                    >
                      <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginBottom: "4px", textTransform: "uppercase", fontWeight: 600 }}>
                        Stage Inspection Payload:
                      </div>
                      <div
                        style={{
                          background: "var(--bg-base)",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.75rem",
                          color: "var(--accent-teal)",
                          lineHeight: 1.5,
                          whiteSpace: "pre-wrap",
                          border: "1px solid var(--glass-border-outer)",
                        }}
                      >
                        {preview || message || "Waiting for execution..."}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassPanel>

              {/* Progress Trace Line Between Nodes */}
              {idx < PIPELINE_STAGES.length - 1 && (
                <div
                  style={{
                    width: "2px",
                    height: "10px",
                    margin: "0 0 0 37px",
                    background: isDone
                      ? "var(--accent-emerald)"
                      : isRunning
                      ? "var(--accent-cyan)"
                      : "var(--glass-border-outer)",
                    boxShadow: isDone ? "0 0 6px rgba(16, 185, 129, 0.4)" : undefined,
                    transition: "background 0.3s ease",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}
