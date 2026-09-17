"use client";

import React, { useState } from "react";
import { BookOpen, Scale, AlertOctagon, ExternalLink, ChevronDown } from "lucide-react";
import { GlassPanel } from "./ui/GlassPanel";
import type { CitedArticle } from "@/lib/api";

interface CitationTrailProps {
  articles: CitedArticle[];
}

export function CitationTrail({ articles }: CitationTrailProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!articles || articles.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <BookOpen size={18} color="var(--accent-teal)" />
          <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)" }}>
            Statutory Citations &amp; Case Jurisprudence
          </span>
        </div>
        <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
          {articles.length} Verified Sources Grounded
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
        {articles.map((article, idx) => {
          const isCase = article.article_number.startsWith("CASE_") || article.title.toLowerCase().includes("v.");
          const isExpanded = expandedIndex === idx;

          return (
            <GlassPanel
              key={idx}
              depth={1}
              hoverEffect
              onClick={() => setExpandedIndex(isExpanded ? null : idx)}
              style={{
                padding: "14px 18px",
                cursor: "pointer",
                borderLeft: isCase
                  ? "3px solid var(--accent-cyan)"
                  : "3px solid var(--accent-teal)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "6px",
                      background: isCase ? "rgba(6, 182, 212, 0.12)" : "rgba(20, 184, 166, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isCase ? "var(--accent-cyan)" : "var(--accent-teal)",
                      flexShrink: 0,
                    }}
                  >
                    {isCase ? <Scale size={15} /> : <BookOpen size={15} />}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                        {isCase ? "Landmark Precedent" : "Constitutional Statute"}
                      </span>
                    </div>
                    <h5
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        marginTop: "1px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {article.title}
                    </h5>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "9999px",
                      background: "rgba(20, 184, 166, 0.1)",
                      color: "var(--accent-teal)",
                      border: "1px solid rgba(20, 184, 166, 0.2)",
                    }}
                  >
                    {Math.round(article.relevance_score * 100)}% Match
                  </span>
                  <ChevronDown
                    size={15}
                    color="var(--text-muted)"
                    style={{
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </div>
              </div>

              {isExpanded && (
                <div
                  style={{
                    marginTop: "12px",
                    paddingTop: "12px",
                    borderTop: "1px solid var(--glass-border-outer)",
                    fontSize: "0.8125rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  <p>{article.text}</p>
                </div>
              )}
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
}
