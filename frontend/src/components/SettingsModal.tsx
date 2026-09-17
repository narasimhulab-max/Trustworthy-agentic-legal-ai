"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Cpu,
  ShieldCheck,
  BookOpen,
  Sliders,
  Check,
  Sparkles,
  Lock,
} from "lucide-react";
import { GlassPanel } from "./ui/GlassPanel";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [selectedModel, setSelectedModel] = useState<"gemini" | "groq" | "local">("gemini");
  const [federatedPrivacy, setFederatedPrivacy] = useState(true);
  const [strictGrounding, setStrictGrounding] = useState(true);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background: "rgba(0, 0, 0, 0.65)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{ width: "100%", maxWidth: "560px" }}
        >
          <div className="liquid-glass-dock" style={{ padding: "28px", borderRadius: "24px" }}>
            {/* Modal Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "rgba(20, 184, 166, 0.15)",
                    border: "1px solid rgba(20, 184, 166, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent-teal)",
                  }}
                >
                  <Sliders size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    Settings &amp; Model Architecture
                  </h3>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                    Configure the 13-stage federated legal engine
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-tertiary)",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "6px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
              >
                <X size={18} />
              </button>
            </div>

            {/* Model Provider Selector */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "10px" }}>
                Pluggable Foundation Model (Stage 07)
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                {/* Gemini Option */}
                <div
                  onClick={() => setSelectedModel("gemini")}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "14px",
                    background: selectedModel === "gemini" ? "var(--liquid-glass-3)" : "var(--liquid-glass-1)",
                    border: selectedModel === "gemini" ? "1px solid var(--accent-teal)" : "1px solid var(--liquid-border)",
                    boxShadow: selectedModel === "gemini" ? "0 0 20px rgba(20, 184, 166, 0.2)" : "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                    <Sparkles size={16} color="var(--accent-teal)" />
                    {selectedModel === "gemini" && <Check size={14} color="var(--accent-teal)" />}
                  </div>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", display: "block" }}>
                    Google Gemini
                  </span>
                  <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>
                    Gemini 2.5 Flash / 1.5 Pro
                  </span>
                </div>

                {/* Groq Option */}
                <div
                  onClick={() => setSelectedModel("groq")}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "14px",
                    background: selectedModel === "groq" ? "var(--liquid-glass-3)" : "var(--liquid-glass-1)",
                    border: selectedModel === "groq" ? "1px solid var(--accent-cyan)" : "1px solid var(--liquid-border)",
                    boxShadow: selectedModel === "groq" ? "0 0 20px rgba(6, 182, 212, 0.2)" : "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                    <Cpu size={16} color="var(--accent-cyan)" />
                    {selectedModel === "groq" && <Check size={14} color="var(--accent-cyan)" />}
                  </div>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", display: "block" }}>
                    Groq Cloud
                  </span>
                  <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>
                    Llama 3.3 70B (Fast)
                  </span>
                </div>

                {/* Local Option */}
                <div
                  onClick={() => setSelectedModel("local")}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "14px",
                    background: selectedModel === "local" ? "var(--liquid-glass-3)" : "var(--liquid-glass-1)",
                    border: selectedModel === "local" ? "1px solid var(--accent-amber)" : "1px solid var(--liquid-border)",
                    boxShadow: selectedModel === "local" ? "0 0 20px rgba(245, 158, 11, 0.2)" : "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                    <Lock size={16} color="var(--accent-amber)" />
                    {selectedModel === "local" && <Check size={14} color="var(--accent-amber)" />}
                  </div>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", display: "block" }}>
                    Local vLLM
                  </span>
                  <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>
                    Air-gapped on-premise
                  </span>
                </div>
              </div>
            </div>

            {/* Federated Privacy & Privilege Toggle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderRadius: "14px",
                background: "var(--liquid-glass-1)",
                border: "1px solid var(--liquid-border)",
                marginBottom: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <ShieldCheck size={18} color="var(--accent-teal)" />
                <div>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", display: "block" }}>
                    Federated Privacy &amp; Legal Privilege
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Keeps client documents in local volatile memory without external telemetry
                  </span>
                </div>
              </div>

              <input
                type="checkbox"
                checked={federatedPrivacy}
                onChange={(e) => setFederatedPrivacy(e.target.checked)}
                style={{ width: "18px", height: "18px", accentColor: "var(--accent-teal)", cursor: "pointer" }}
              />
            </div>

            {/* Strict Grounding Constraint */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderRadius: "14px",
                background: "var(--liquid-glass-1)",
                border: "1px solid var(--liquid-border)",
                marginBottom: "24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <BookOpen size={18} color="var(--accent-cyan)" />
                <div>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", display: "block" }}>
                    Strict Constitutional Grounding
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Prohibits model extrapolation outside retrieved Indian statutes &amp; case law
                  </span>
                </div>
              </div>

              <input
                type="checkbox"
                checked={strictGrounding}
                onChange={(e) => setStrictGrounding(e.target.checked)}
                style={{ width: "18px", height: "18px", accentColor: "var(--accent-teal)", cursor: "pointer" }}
              />
            </div>

            {/* Done Action */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={onClose}
                className="btn-liquid-primary"
                style={{ fontSize: "0.875rem", padding: "10px 24px" }}
              >
                Save &amp; Apply
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
