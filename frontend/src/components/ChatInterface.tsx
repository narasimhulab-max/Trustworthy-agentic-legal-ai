"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Sparkles,
  Scale,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ChevronDown,
  X,
  Zap,
  BookOpen,
  Briefcase,
  User,
  Gavel,
} from "lucide-react";
import { GlassPanel } from "./ui/GlassPanel";
import { TrustGauge } from "./ui/TrustGauge";
import { CitationTrail } from "./CitationTrail";
import { BreakthroughCards } from "./BreakthroughCards";
import { SectionsExplorer } from "./SectionsExplorer";
import { FeedbackPanel } from "./FeedbackPanel";
import {
  streamLegalQuery,
  uploadLegalFile,
  type StageUpdate,
  type FinalRecommendation,
} from "@/lib/api";
import { exportLegalReportPDF } from "@/lib/reportExport";

interface ChatInterfaceProps {
  initialQuery?: string;
  onStageUpdate: (update: StageUpdate) => void;
  onExecutionStart: () => void;
  onExecutionComplete: () => void;
  onNewSession?: (query: string) => void;
}

interface MessageItem {
  id: string;
  role: "user" | "assistant";
  text: string;
  recommendation?: FinalRecommendation;
  isLoading?: boolean;
}

export default function ChatInterface({
  initialQuery = "",
  onStageUpdate,
  onExecutionStart,
  onExecutionComplete,
  onNewSession,
}: ChatInterfaceProps) {
  const [queryInput, setQueryInput] = useState(initialQuery);
  const [persona, setPersona] = useState<"advocate" | "citizen">("advocate");
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      text: "Namaste! I am NyayaAI. Enter your case details, question, or attach documents & photos of FIRs/court orders. I will discover the applicable statutory sections (BNS/IPC, BNSS/CrPC) and identify strategic case breakthroughs for you.",
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedAttachment, setUploadedAttachment] = useState<{
    name: string;
    type: "image" | "document";
    text: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuery) {
      setQueryInput(initialQuery);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQueryInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleQuerySubmit();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadLegalFile(file);
      setUploadedAttachment({
        name: file.name,
        type: res.file_type,
        text: res.extracted_text,
      });
      if (!queryInput) {
        setQueryInput(`Case Document Analysis: ${file.name}\n${res.extracted_text.slice(0, 300)}...`);
      }
      if (textareaRef.current) {
        textareaRef.current.style.height = "100px";
      }
    } catch {
      alert("Failed to analyze uploaded file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleQuerySubmit = async () => {
    const query = queryInput.trim();
    if (!query || isProcessing) return;

    setQueryInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    const currentAttachment = uploadedAttachment;
    setUploadedAttachment(null);

    setIsProcessing(true);
    onExecutionStart();
    onNewSession?.(query);

    const userMsgId = `user_${Date.now()}`;
    const assistantMsgId = `assistant_${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: "user", text: query },
      { id: assistantMsgId, role: "assistant", text: "", isLoading: true },
    ]);

    await streamLegalQuery(
      query,
      persona,
      undefined,
      currentAttachment ? [currentAttachment.text] : undefined,
      (update) => {
        onStageUpdate(update);
      },
      (result) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  text: result.summary,
                  recommendation: result,
                  isLoading: false,
                }
              : msg
          )
        );
        setIsProcessing(false);
        onExecutionComplete();
      },
      (errorMsg) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  text: `Execution Error: ${errorMsg}`,
                  isLoading: false,
                }
              : msg
          )
        );
        setIsProcessing(false);
        onExecutionComplete();
      }
    );
  };

  return (
    <section
      id="chat-workspace"
      style={{
        position: "relative",
        padding: "24px 24px 170px",
        maxWidth: "980px",
        margin: "0 auto",
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ─── Top Persona Mode Bar ─── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          padding: "8px 14px",
          borderRadius: "14px",
          background: "var(--liquid-glass-1)",
          border: "1px solid var(--liquid-border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Scale size={16} color="var(--accent-teal)" />
          <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)" }}>
            Assistant Perspective:
          </span>
        </div>

        {/* Dual Persona Switcher */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            background: "var(--liquid-glass-2)",
            padding: "3px",
            borderRadius: "9999px",
            border: "1px solid var(--liquid-border)",
          }}
        >
          <button
            type="button"
            onClick={() => setPersona("advocate")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "9999px",
              background: persona === "advocate" ? "var(--text-primary)" : "transparent",
              color: persona === "advocate" ? "var(--bg-base)" : "var(--text-secondary)",
              border: "none",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <Briefcase size={12} />
            <span>Advocate Mode (Tactical Strategy &amp; Sections)</span>
          </button>

          <button
            type="button"
            onClick={() => setPersona("citizen")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "9999px",
              background: persona === "citizen" ? "var(--text-primary)" : "transparent",
              color: persona === "citizen" ? "var(--bg-base)" : "var(--text-secondary)",
              border: "none",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <User size={12} />
            <span>Citizen Mode (Plain Language &amp; Rights)</span>
          </button>
        </div>
      </div>

      {/* ─── Chat Message Stream ─── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          paddingBottom: "80px",
        }}
      >
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "flex-start",
              width: "100%",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {/* Assistant Avatar */}
            {msg.role === "assistant" && (
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "12px",
                  background: "rgba(20, 184, 166, 0.15)",
                  border: "1px solid rgba(20, 184, 166, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-teal)",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              >
                <Scale size={18} />
              </div>
            )}

            {/* Message Body */}
            <div style={{ maxWidth: msg.role === "user" ? "78%" : "100%", flex: msg.role === "assistant" ? 1 : undefined }}>
              {msg.role === "user" ? (
                /* User Chat Bubble */
                <div
                  style={{
                    background: "var(--liquid-glass-3)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid var(--liquid-border)",
                    boxShadow: "var(--liquid-inner-glow)",
                    padding: "14px 20px",
                    borderRadius: "22px 22px 4px 22px",
                    color: "var(--text-primary)",
                    fontSize: "0.9375rem",
                    lineHeight: 1.6,
                    fontWeight: 400,
                  }}
                >
                  {msg.text}
                </div>
              ) : (
                /* Assistant Bubble */
                <div>
                  {msg.isLoading ? (
                    <GlassPanel
                      depth={1}
                      style={{
                        padding: "16px 22px",
                        borderRadius: "18px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <Sparkles size={16} color="var(--accent-cyan)" className="anim-spin" />
                      <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                        Analyzing case documents, discovering statutory sections &amp; tactical breakthroughs...
                      </span>
                    </GlassPanel>
                  ) : msg.recommendation ? (
                    <RecommendationResultView rec={msg.recommendation} />
                  ) : (
                    <div
                      style={{
                        fontSize: "0.9375rem",
                        color: "var(--text-primary)",
                        lineHeight: 1.65,
                        paddingTop: "6px",
                      }}
                    >
                      {msg.text}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* ─── ChatGPT Floating Liquid Glass Dock ─── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 90,
          padding: "16px 24px 24px",
          background: "linear-gradient(to top, var(--bg-base) 75%, transparent 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "860px",
            pointerEvents: "auto",
          }}
        >
          {/* Active File / Image Attachment Preview Pill */}
          {uploadedAttachment && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                borderRadius: "10px",
                background: "var(--liquid-glass-3)",
                border: "1px solid var(--liquid-border)",
                boxShadow: "var(--liquid-inner-glow)",
                fontSize: "0.75rem",
                color: "var(--accent-teal)",
                marginBottom: "8px",
              }}
            >
              {uploadedAttachment.type === "image" ? (
                <ImageIcon size={13} color="var(--accent-cyan)" />
              ) : (
                <FileText size={13} color="var(--accent-teal)" />
              )}
              <span style={{ maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 600 }}>
                {uploadedAttachment.name} ({uploadedAttachment.type === "image" ? "OCR Image" : "Document"})
              </span>
              <button
                onClick={() => setUploadedAttachment(null)}
                style={{ background: "none", border: "none", color: "var(--text-tertiary)", cursor: "pointer", display: "flex", padding: 0 }}
              >
                <X size={12} />
              </button>
            </div>
          )}

          {/* Floating Liquid Glass Input Capsule */}
          <div className="liquid-glass-dock" style={{ padding: "10px 14px 10px 18px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {/* Multi-line Expandable Textarea */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={queryInput}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder="State facts, attach case documents/photos of FIR, or ask what sections apply & what are the case breakthroughs..."
              disabled={isProcessing}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.9375rem",
                lineHeight: "1.5",
                resize: "none",
                maxHeight: "180px",
                padding: "4px 0",
              }}
            />

            {/* Bottom Controls Row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "2px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {/* File Upload (Documents & Images) */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf,.md,.jpg,.jpeg,.png,.webp"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing || isUploading}
                  title="Upload case document, court order, or FIR photo (PDF, PNG, JPG)"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "9999px",
                    background: "var(--liquid-glass-2)",
                    border: "1px solid var(--liquid-border)",
                    color: "var(--text-secondary)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--text-primary)";
                    e.currentTarget.style.borderColor = "var(--accent-teal)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-secondary)";
                    e.currentTarget.style.borderColor = "var(--liquid-border)";
                  }}
                >
                  <Paperclip size={13} />
                  <span>Attach Document / Photo</span>
                </button>

                {/* Engine Status Capsule */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "0.6875rem",
                    color: "var(--text-muted)",
                    padding: "4px 8px",
                  }}
                >
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent-teal)" }} />
                  <span>BNS • BNSS • BSA • Constitution</span>
                </div>
              </div>

              {/* Circular Send Button */}
              <button
                type="button"
                onClick={handleQuerySubmit}
                disabled={isProcessing || !queryInput.trim()}
                title="Execute legal analysis"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: queryInput.trim() && !isProcessing ? "var(--text-primary)" : "var(--liquid-glass-2)",
                  color: queryInput.trim() && !isProcessing ? "var(--bg-base)" : "var(--text-muted)",
                  border: "1px solid var(--liquid-border)",
                  cursor: queryInput.trim() && !isProcessing ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: queryInput.trim() && !isProcessing ? "0 4px 14px rgba(0, 0, 0, 0.25)" : "none",
                }}
              >
                <ArrowUp size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div style={{ textAlign: "center", marginTop: "8px", fontSize: "0.6875rem", color: "var(--text-muted)" }}>
            NyayaAI provides decision support and statutory section mapping. Verify with enrolled legal practitioners.
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Structured Recommendation Result View with Breakthroughs & Sections Tabs ─── */

function RecommendationResultView({ rec }: { rec: FinalRecommendation }) {
  const [activeTab, setActiveTab] = useState<"irac" | "breakthroughs" | "sections" | "citations" | "disclaimers">("breakthroughs");
  const [isExporting, setIsExporting] = useState(false);

  const breakthroughsCount = rec.breakthroughs?.length || 0;
  const sectionsCount = rec.identified_sections?.length || 0;

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      await exportLegalReportPDF(rec);
    } catch (e) {
      console.error("PDF export failed", e);
      alert("PDF export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", marginTop: "4px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontSize: "0.6875rem",
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: "9999px",
              background: "rgba(20, 184, 166, 0.12)",
              color: "var(--accent-teal)",
              border: "1px solid rgba(20, 184, 166, 0.25)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {rec.domain}
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: "4px" }}>
            <Clock size={12} />
            {rec.processing_time_ms}ms multi-agent run
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* PDF Export Button */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            title="Export full legal analysis as PDF"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 12px",
              borderRadius: "9999px",
              background: isExporting ? "var(--liquid-glass-1)" : "rgba(20, 184, 166, 0.1)",
              border: "1px solid rgba(20, 184, 166, 0.3)",
              color: isExporting ? "var(--text-muted)" : "var(--accent-teal)",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: isExporting ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { if (!isExporting) e.currentTarget.style.background = "rgba(20, 184, 166, 0.18)"; }}
            onMouseLeave={(e) => { if (!isExporting) e.currentTarget.style.background = "rgba(20, 184, 166, 0.1)"; }}
          >
            <CheckCircle2 size={12} />
            <span>{isExporting ? "Exporting..." : "Export PDF Report"}</span>
          </button>

          {/* Tab Controls */}
          <div
            style={{
              display: "flex",
              gap: "4px",
              background: "var(--liquid-glass-2)",
              padding: "3px",
              borderRadius: "9999px",
              border: "1px solid var(--liquid-border)",
              flexWrap: "wrap",
            }}
          >
            <TabButton active={activeTab === "breakthroughs"} onClick={() => setActiveTab("breakthroughs")}>
              <Zap size={12} color="var(--accent-amber)" />
              <span>Breakthroughs ({breakthroughsCount})</span>
            </TabButton>
            <TabButton active={activeTab === "sections"} onClick={() => setActiveTab("sections")}>
              <BookOpen size={12} color="var(--accent-teal)" />
              <span>Sections ({sectionsCount})</span>
            </TabButton>
            <TabButton active={activeTab === "irac"} onClick={() => setActiveTab("irac")}>
              IRAC Analysis
            </TabButton>
            <TabButton active={activeTab === "citations"} onClick={() => setActiveTab("citations")}>
              Citations ({rec.applicable_articles?.length || 0})
            </TabButton>
            <TabButton active={activeTab === "disclaimers"} onClick={() => setActiveTab("disclaimers")}>
              Actions &amp; Tradeoffs
            </TabButton>
          </div>
        </div>
      </div>

      {/* Main Analysis Glass Panel */}
      <GlassPanel depth={2} style={{ padding: "24px" }}>
        {/* Tab 1: Case Breakthroughs */}
        {activeTab === "breakthroughs" && (
          <BreakthroughCards breakthroughs={rec.breakthroughs} />
        )}

        {/* Tab 2: Applicable Sections */}
        {activeTab === "sections" && (
          <SectionsExplorer sections={rec.identified_sections} />
        )}

        {/* Tab 3: IRAC Legal Analysis */}
        {activeTab === "irac" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <span className="label-eyebrow" style={{ display: "block", marginBottom: "6px" }}>
                Plain Language Legal Takeaway
              </span>
              <p style={{ fontSize: "0.9375rem", color: "var(--text-primary)", lineHeight: 1.6, fontWeight: 500 }}>
                {rec.summary}
              </p>
            </div>

            <div style={{ borderTop: "1px solid var(--liquid-border)", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <span className="label-eyebrow">Structured Legal Reasoning (IRAC)</span>
              <div
                style={{
                  background: "var(--bg-base)",
                  padding: "16px",
                  borderRadius: "14px",
                  border: "1px solid var(--liquid-border)",
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  whiteSpace: "pre-line",
                }}
              >
                {rec.detailed_analysis}
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--liquid-border)", paddingTop: "16px" }}>
              <TrustGauge metrics={rec.trust_metrics} />
            </div>

            <FeedbackPanel query={rec.query} recommendationText={rec.detailed_analysis} />
          </div>
        )}

        {/* Tab 4: Citations & Precedents */}
        {activeTab === "citations" && (
          <CitationTrail articles={rec.applicable_articles} />
        )}

        {/* Tab 5: Actions & Disclaimers */}
        {activeTab === "disclaimers" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <span className="label-eyebrow" style={{ display: "block", marginBottom: "12px" }}>
                Ranked Procedural Options &amp; Tradeoffs
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {rec.recommended_actions?.map((act, i) => (
                  <GlassPanel key={i} depth={1} style={{ padding: "14px 18px" }}>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-primary)", lineHeight: 1.5 }}>
                      {act}
                    </p>
                  </GlassPanel>
                ))}
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--liquid-border)", paddingTop: "16px" }}>
              <span className="label-eyebrow" style={{ display: "block", marginBottom: "8px", color: "var(--accent-amber)" }}>
                Statutory Notices &amp; Caveats
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {rec.disclaimers?.map((disc, i) => (
                  <p key={i} style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", lineHeight: 1.6 }}>
                    • {disc}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: active ? "var(--text-primary)" : "transparent",
        color: active ? "var(--bg-base)" : "var(--text-secondary)",
        border: "none",
        padding: "5px 12px",
        borderRadius: "9999px",
        fontSize: "0.75rem",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      {children}
    </button>
  );
}
