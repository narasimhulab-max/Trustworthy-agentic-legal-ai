"use client";

import React from "react";
import { BookOpen, GitBranch, Share2, Scale, Cpu, ShieldCheck } from "lucide-react";
import { GlassPanel } from "./ui/GlassPanel";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Constitution of India Grounding",
    description:
      "Direct semantic and structural indexing of the Indian Constitution — Articles 1 to 395, Parts, Schedules, and Fundamental Rights guarantees.",
  },
  {
    icon: GitBranch,
    title: "13-Stage Inspectable Pipeline",
    description:
      "From Query Intake to IRAC Reasoning and Decision Intelligence — each stage is a typed, inspectable service with live SSE status streaming.",
  },
  {
    icon: Share2,
    title: "Dynamic Legal Knowledge Graph",
    description:
      "Graph-based traversal mapping statutes to landmark Supreme Court precedents, citing histories, overruling flags, and constitutional doctrines.",
  },
  {
    icon: Scale,
    title: "Structured IRAC Legal Reasoning",
    description:
      "Rigorous legal methodology: Issue formulation → Rule identification → Application to factual scenario → Definite legal conclusion.",
  },
  {
    icon: Cpu,
    title: "Pluggable Foundation Models",
    description:
      "Vendor-neutral architecture supporting Google Gemini, Groq (Llama 3.3 70B), or local OpenAI-compatible endpoints with strict grounding constraints.",
  },
  {
    icon: ShieldCheck,
    title: "Multi-Factor Trust Evaluation",
    description:
      "Continuous confidence scoring measuring source grounding overlap, hallucination drift detection, and Indian statutory relevance.",
  },
];

export default function FeatureCards() {
  return (
    <section
      id="features-section"
      style={{
        padding: "80px 24px",
        maxWidth: "1080px",
        margin: "0 auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <span className="label-eyebrow">Pillars of Intelligence</span>
        <h2 className="heading-title" style={{ marginTop: "8px", marginBottom: "12px" }}>
          Engineered for Indian Jurisprudence
        </h2>
        <p style={{ color: "var(--text-tertiary)", fontSize: "0.9375rem", maxWidth: "600px", margin: "0 auto" }}>
          Built from the ground up for strict legal fidelity, verifiable citations,
          and transparent multi-agent orchestration.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "16px",
        }}
      >
        {FEATURES.map((feat, i) => {
          const IconComp = feat.icon;
          return (
            <GlassPanel
              key={i}
              depth={2}
              hoverEffect
              style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(20, 184, 166, 0.1)",
                  border: "1px solid rgba(20, 184, 166, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-teal)",
                }}
              >
                <IconComp size={20} />
              </div>

              <h3 style={{ fontSize: "1.0625rem", fontWeight: 600, color: "var(--text-primary)" }}>
                {feat.title}
              </h3>

              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {feat.description}
              </p>
            </GlassPanel>
          );
        })}
      </div>
    </section>
  );
}
