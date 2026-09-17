"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, GitCommit, ArrowRight, BookOpen } from "lucide-react";

interface HeroProps {
  onSelectSampleQuery: (query: string) => void;
}

const SAMPLE_QUERIES = [
  "Can police detain a citizen indefinitely without producing them before a magistrate?",
  "What is the test of reasonableness for restrictions on free speech under Article 19(2)?",
  "Is the right to privacy protected as an intrinsic part of Article 21?",
  "How does the Basic Structure doctrine limit Parliament's amending power under Article 368?",
];

export default function Hero({ onSelectSampleQuery }: HeroProps) {
  const scrollToWorkspace = () => {
    const el = document.getElementById("chat-workspace");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      style={{
        position: "relative",
        padding: "140px 24px 80px",
        maxWidth: "1120px",
        margin: "0 auto",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Top Status Capsule */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 14px",
          borderRadius: "9999px",
          background: "var(--glass-2)",
          border: "1px solid var(--glass-border-outer)",
          boxShadow: "var(--glass-border-inner)",
          marginBottom: "28px",
        }}
      >
        <span
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "var(--accent-teal)",
            boxShadow: "0 0 10px var(--accent-teal)",
          }}
        />
        <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-secondary)" }}>
          Federated Agentic AI Framework • Constitution of India
        </span>
      </motion.div>

      {/* Main Editorial Headline */}
      <motion.h1
        className="heading-display"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: "900px", marginBottom: "20px", color: "var(--text-primary)" }}
      >
        Intelligent legal reasoning,
        <br />
        <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>
          grounded in the Constitution.
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontSize: "1.125rem",
          lineHeight: 1.6,
          color: "var(--text-tertiary)",
          maxWidth: "680px",
          marginBottom: "40px",
          fontWeight: 400,
        }}
      >
        A 13-stage federated multi-agent architecture delivering inspectable,
        IRAC-structured legal analysis with full citation trails and real-time trust scoring.
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", marginBottom: "56px" }}
      >
        <button className="btn-solid" onClick={scrollToWorkspace}>
          <span>Open Legal Assistant</span>
          <ArrowRight size={16} />
        </button>

        <button
          className="btn-glass"
          onClick={() => {
            const el = document.getElementById("pipeline-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <GitCommit size={16} color="var(--accent-teal)" />
          <span>Inspect 13-Stage Pipeline</span>
        </button>
      </motion.div>

      {/* Quick Interactive Prompt Chips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
          <BookOpen size={13} />
          <span>Try a landmark constitutional query</span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", maxWidth: "900px" }}>
          {SAMPLE_QUERIES.map((sq, i) => (
            <button
              key={i}
              onClick={() => {
                onSelectSampleQuery(sq);
                scrollToWorkspace();
              }}
              style={{
                background: "var(--glass-1)",
                border: "1px solid var(--glass-border-outer)",
                boxShadow: "var(--glass-border-inner)",
                borderRadius: "9999px",
                padding: "8px 16px",
                color: "var(--text-secondary)",
                fontSize: "0.8125rem",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.background = "var(--glass-2)";
                e.currentTarget.style.borderColor = "var(--accent-teal)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.background = "var(--glass-1)";
                e.currentTarget.style.borderColor = "var(--glass-border-outer)";
              }}
            >
              {sq}
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
