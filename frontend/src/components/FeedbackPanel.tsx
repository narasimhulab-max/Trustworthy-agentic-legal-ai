"use client";

import React, { useState } from "react";
import { Check, Edit3, X, Send, UserCheck, AlertCircle } from "lucide-react";
import { GlassPanel } from "./ui/GlassPanel";
import { submitHumanFeedback } from "@/lib/api";

interface FeedbackPanelProps {
  query: string;
  recommendationText: string;
}

export function FeedbackPanel({ query, recommendationText }: FeedbackPanelProps) {
  const [currentAction, setCurrentAction] = useState<"accept" | "edit" | "reject" | null>(null);
  const [correctionText, setCorrectionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<string | null>(null);
  const [adjustedResult, setAdjustedResult] = useState<string | null>(null);

  const handleActionClick = async (action: "accept" | "edit" | "reject") => {
    if (action === "edit") {
      setCurrentAction("edit");
      return;
    }

    setIsSubmitting(true);
    setCurrentAction(action);
    try {
      const res = await submitHumanFeedback({
        query,
        action,
        original_recommendation: recommendationText,
      });
      setFeedbackStatus(
        action === "accept"
          ? "Legal recommendation accepted and verified by lawyer-in-the-loop."
          : "Recommendation flagged for senior jurist review."
      );
      if (res.adjusted_recommendation) {
        setAdjustedResult(res.adjusted_recommendation);
      }
    } catch {
      setFeedbackStatus("Failed to submit feedback to backend");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCorrectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionText.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await submitHumanFeedback({
        query,
        action: "edit",
        correction: correctionText.trim(),
        original_recommendation: recommendationText,
      });
      setFeedbackStatus("Lawyer correction recorded and applied to knowledge graph weighting.");
      if (res.adjusted_recommendation) {
        setAdjustedResult(res.adjusted_recommendation);
      }
    } catch {
      setFeedbackStatus("Failed to save correction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassPanel depth={1} style={{ padding: "18px 20px", marginTop: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <UserCheck size={16} color="var(--accent-teal)" />
          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>
            Lawyer-in-the-Loop Validation
          </span>
        </div>
        <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
          Stage 11: Continuous Ranking Refinement
        </span>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          onClick={() => handleActionClick("accept")}
          disabled={isSubmitting}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            borderRadius: "9999px",
            fontSize: "0.8125rem",
            fontWeight: 600,
            cursor: isSubmitting ? "not-allowed" : "pointer",
            border: currentAction === "accept" ? "1px solid var(--accent-emerald)" : "1px solid var(--glass-border-outer)",
            background: currentAction === "accept" ? "rgba(16, 185, 129, 0.15)" : "var(--glass-2)",
            color: currentAction === "accept" ? "var(--accent-emerald)" : "var(--text-secondary)",
            transition: "all 0.2s",
          }}
        >
          <Check size={14} />
          <span>Accept Recommendation</span>
        </button>

        <button
          onClick={() => handleActionClick("edit")}
          disabled={isSubmitting}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            borderRadius: "9999px",
            fontSize: "0.8125rem",
            fontWeight: 600,
            cursor: isSubmitting ? "not-allowed" : "pointer",
            border: currentAction === "edit" ? "1px solid var(--accent-cyan)" : "1px solid var(--glass-border-outer)",
            background: currentAction === "edit" ? "rgba(6, 182, 212, 0.15)" : "var(--glass-2)",
            color: currentAction === "edit" ? "var(--accent-cyan)" : "var(--text-secondary)",
            transition: "all 0.2s",
          }}
        >
          <Edit3 size={14} />
          <span>Edit &amp; Add Caveat</span>
        </button>

        <button
          onClick={() => handleActionClick("reject")}
          disabled={isSubmitting}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            borderRadius: "9999px",
            fontSize: "0.8125rem",
            fontWeight: 600,
            cursor: isSubmitting ? "not-allowed" : "pointer",
            border: currentAction === "reject" ? "1px solid var(--accent-rose)" : "1px solid var(--glass-border-outer)",
            background: currentAction === "reject" ? "rgba(244, 63, 94, 0.15)" : "var(--glass-2)",
            color: currentAction === "reject" ? "var(--accent-rose)" : "var(--text-secondary)",
            transition: "all 0.2s",
          }}
        >
          <X size={14} />
          <span>Flag / Reject</span>
        </button>
      </div>

      {/* Edit Form */}
      {currentAction === "edit" && !feedbackStatus && (
        <form onSubmit={handleCorrectionSubmit} style={{ marginTop: "14px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)" }}>
              Provide Advocate Correction or Precedent Clarification:
            </label>
            <textarea
              rows={3}
              value={correctionText}
              onChange={(e) => setCorrectionText(e.target.value)}
              placeholder="e.g., Note that the High Court of Delhi has recently issued a circular regarding expedited bail in this matter..."
              style={{
                width: "100%",
                background: "var(--bg-base)",
                border: "1px solid var(--glass-border-outer)",
                borderRadius: "12px",
                padding: "10px 14px",
                color: "var(--text-primary)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.8125rem",
                outline: "none",
                resize: "vertical",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                disabled={isSubmitting || !correctionText.trim()}
                className="btn-solid"
                style={{ fontSize: "0.75rem", padding: "6px 14px" }}
              >
                <Send size={13} />
                <span>Submit Correction</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Feedback Status Alert */}
      {feedbackStatus && (
        <div
          style={{
            marginTop: "12px",
            padding: "10px 14px",
            borderRadius: "10px",
            background: "rgba(20, 184, 166, 0.08)",
            border: "1px solid rgba(20, 184, 166, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.8125rem",
            color: "var(--text-primary)",
          }}
        >
          <Check size={16} color="var(--accent-teal)" />
          <span>{feedbackStatus}</span>
        </div>
      )}

      {/* Adjusted Recommendation Display */}
      {adjustedResult && (
        <div
          style={{
            marginTop: "10px",
            padding: "12px 14px",
            borderRadius: "10px",
            background: "var(--bg-base)",
            border: "1px solid var(--glass-border-outer)",
            fontSize: "0.8125rem",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
          }}
        >
          <span style={{ fontWeight: 600, color: "var(--accent-cyan)", display: "block", marginBottom: "4px" }}>
            Updated Recommendation Payload:
          </span>
          {adjustedResult}
        </div>
      )}
    </GlassPanel>
  );
}
