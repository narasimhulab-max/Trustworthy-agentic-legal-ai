"use client";

import React, { useState, useCallback, useEffect } from "react";
import Sidebar, { ChatSession } from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";
import SettingsModal from "@/components/SettingsModal";
import PipelineDrawer from "@/components/PipelineDrawer";
import type { StageUpdate } from "@/lib/api";
import {
  Scale,
  GitBranch,
  Sliders,
  Sparkles,
  PanelLeft,
  Share2,
} from "lucide-react";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pipelineDrawerOpen, setPipelineDrawerOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState("session-1");
  const [currentQuery, setCurrentQuery] = useState("");

  const [stageUpdates, setStageUpdates] = useState<Record<string, StageUpdate>>({});
  const [isPipelineLive, setIsPipelineLive] = useState(false);

  // ─── localStorage Session Persistence ───
  const STORAGE_KEY = "nyayaai_sessions";

  const loadPersistedSessions = (): ChatSession[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const persistSessions = (sessions: ChatSession[]) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, 50)));
    } catch {
      // localStorage might be full
    }
  };

  // Called when a new query is submitted from ChatInterface
  const handleNewSession = useCallback((query: string) => {
    const title = query.length > 60 ? query.slice(0, 57) + "..." : query;
    const session: ChatSession = {
      id: activeChatId,
      title,
      timestamp: "Just now",
      category: "Today",
      query,
    };
    // Notify sidebar — will be handled via prop if sidebar takes external sessions
    // For now, also persist to localStorage
    setCurrentQuery(query);
    const existing = loadPersistedSessions();
    const filtered = existing.filter((s) => s.id !== session.id);
    persistSessions([session, ...filtered]);
  }, [activeChatId]);

  const handleStageUpdate = useCallback((update: StageUpdate) => {
    setStageUpdates((prev) => ({
      ...prev,
      [update.stage_id]: update,
    }));
  }, []);

  const handleExecutionStart = useCallback(() => {
    setStageUpdates({});
    setIsPipelineLive(true);
  }, []);

  const handleExecutionComplete = useCallback(() => {
    setIsPipelineLive(false);
  }, []);

  const handleSelectChat = (session: ChatSession) => {
    setActiveChatId(session.id);
    setCurrentQuery(session.query);
  };

  const handleNewChat = () => {
    const newId = `session-${Date.now()}`;
    setActiveChatId(newId);
    setCurrentQuery("");
    setStageUpdates({});
  };

  // Count active/done stages
  const doneCount = Object.values(stageUpdates).filter((s) => s.status === "done").length;

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}>
      <div className="liquid-backdrop" />

      {/* ─── 1. Left ChatGPT-Style Sidebar ─── */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenPipelineDrawer={() => setPipelineDrawerOpen(true)}
      />

      {/* ─── 2. Main Workspace Layout ─── */}
      <main
        style={{
          flex: 1,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          background: "transparent",
        }}
      >
        {/* Workspace Top Header Bar */}
        <header
          style={{
            height: "56px",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--liquid-border)",
            background: "var(--liquid-glass-1)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            flexShrink: 0,
          }}
        >
          {/* Left: Sidebar Toggle & Model Capsule */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                title="Open sidebar"
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  padding: "6px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                <PanelLeft size={18} />
              </button>
            )}

            {/* Model Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "5px 12px",
                borderRadius: "9999px",
                background: "var(--liquid-glass-2)",
                border: "1px solid var(--liquid-border)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              <Scale size={14} color="var(--accent-teal)" />
              <span>NyayaAI 2.0</span>
              <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", fontWeight: 400 }}>
                • Constitution of India
              </span>
            </div>
          </div>

          {/* Right: Live 13-Stage Pipeline Pulse & Settings Trigger */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* 13-Stage Pipeline State Trigger */}
            <button
              onClick={() => setPipelineDrawerOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "9999px",
                background: isPipelineLive ? "rgba(6, 182, 212, 0.15)" : "var(--liquid-glass-2)",
                border: isPipelineLive ? "1px solid var(--accent-cyan)" : "1px solid var(--liquid-border)",
                color: isPipelineLive ? "var(--accent-cyan)" : "var(--text-secondary)",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: isPipelineLive ? "0 0 16px rgba(6, 182, 212, 0.3)" : "none",
              }}
            >
              <GitBranch size={13} />
              <span>
                {isPipelineLive
                  ? `13 Stages Running (${doneCount}/13)...`
                  : "13-Stage Pipeline State"}
              </span>
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setSettingsOpen(true)}
              title="Model settings"
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "9999px",
                background: "var(--liquid-glass-2)",
                border: "1px solid var(--liquid-border)",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              <Sliders size={14} />
            </button>
          </div>
        </header>

        {/* Conversational Chat Workspace Container */}
        <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
          <ChatInterface
            initialQuery={currentQuery}
            onStageUpdate={handleStageUpdate}
            onExecutionStart={handleExecutionStart}
            onExecutionComplete={handleExecutionComplete}
            onNewSession={handleNewSession}
          />
        </div>
      </main>

      {/* ─── 3. Settings Modal ─── */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {/* ─── 4. 13-Stage Live Pipeline Drawer ─── */}
      <PipelineDrawer
        isOpen={pipelineDrawerOpen}
        onClose={() => setPipelineDrawerOpen(false)}
        stageUpdates={stageUpdates}
        isLive={isPipelineLive}
      />
    </div>
  );
}
