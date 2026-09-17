"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  MessageSquare,
  Search,
  Settings,
  Scale,
  GitBranch,
  Share2,
  Trash2,
  PanelLeftClose,
  PanelLeft,
  Moon,
  Sun,
  ShieldCheck,
} from "lucide-react";

export interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  category: "Today" | "Previous 7 Days" | "Constitutional Research";
  query: string;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeChatId: string;
  onSelectChat: (session: ChatSession) => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  onOpenPipelineDrawer: () => void;
}

const DEFAULT_SESSIONS: ChatSession[] = [
  {
    id: "session-1",
    title: "Article 32 Writs & Remedies",
    timestamp: "Just now",
    category: "Today",
    query: "What remedies are available under Article 32 for enforcement of Fundamental Rights?",
  },
  {
    id: "session-2",
    title: "Preventive Detention & Art 22",
    timestamp: "2 hours ago",
    category: "Today",
    query: "Can police detain a citizen indefinitely without producing them before a magistrate?",
  },
  {
    id: "session-3",
    title: "Article 19(2) Speech Restrictions",
    timestamp: "Yesterday",
    category: "Previous 7 Days",
    query: "What is the test of reasonableness for restrictions on free speech under Article 19(2)?",
  },
  {
    id: "session-4",
    title: "Privacy as Article 21 Right",
    timestamp: "3 days ago",
    category: "Previous 7 Days",
    query: "Is the right to privacy protected as an intrinsic part of Article 21 under Puttaswamy?",
  },
  {
    id: "session-5",
    title: "Basic Structure & Article 368",
    timestamp: "Last week",
    category: "Constitutional Research",
    query: "How does the Basic Structure doctrine limit Parliament's amending power under Article 368?",
  },
];

export default function Sidebar({
  isOpen,
  onToggle,
  activeChatId,
  onSelectChat,
  onNewChat,
  onOpenSettings,
  onOpenPipelineDrawer,
}: SidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>(DEFAULT_SESSIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.query.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ["Today", "Previous 7 Days", "Constitutional Research"] as const;

  if (!isOpen) {
    return (
      <div
        style={{
          position: "fixed",
          top: "16px",
          left: "16px",
          zIndex: 95,
        }}
      >
        <button
          onClick={onToggle}
          title="Open sidebar"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "var(--liquid-glass-3)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid var(--liquid-border)",
            boxShadow: "var(--liquid-inner-glow), var(--shadow-liquid-sm)",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--text-primary)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <PanelLeft size={18} />
        </button>
      </div>
    );
  }

  return (
    <motion.aside
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -280, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: "280px",
        height: "100vh",
        background: "var(--liquid-glass-2)",
        backdropFilter: "blur(32px) saturate(220%)",
        WebkitBackdropFilter: "blur(32px) saturate(220%)",
        borderRight: "1px solid var(--liquid-border)",
        boxShadow: "var(--liquid-inner-glow), var(--shadow-liquid-md)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        zIndex: 90,
        position: "relative",
      }}
    >
      {/* ─── Sidebar Header ─── */}
      <div
        style={{
          padding: "18px 16px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--liquid-border)",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "10px",
              background: "rgba(20, 184, 166, 0.15)",
              border: "1px solid rgba(20, 184, 166, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-teal)",
            }}
          >
            <Scale size={18} />
          </div>
          <div>
            <span style={{ fontSize: "0.9375rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
              Nyaya<span style={{ color: "var(--accent-teal)" }}>AI</span>
            </span>
            <span style={{ fontSize: "0.625rem", color: "var(--text-tertiary)", display: "block", marginTop: "-2px" }}>
              Constitution of India
            </span>
          </div>
        </div>

        {/* Close Toggle */}
        <button
          onClick={onToggle}
          title="Close sidebar"
          style={{
            background: "none",
            border: "none",
            color: "var(--text-tertiary)",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
        >
          <PanelLeftClose size={18} />
        </button>
      </div>

      {/* ─── New Inquiry Button (ChatGPT Style) ─── */}
      <div style={{ padding: "14px 16px 8px" }}>
        <button
          onClick={onNewChat}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px",
            borderRadius: "14px",
            background: "var(--liquid-glass-3)",
            border: "1px solid var(--liquid-border)",
            boxShadow: "var(--liquid-inner-subtle)",
            color: "var(--text-primary)",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--liquid-glass-2)";
            e.currentTarget.style.borderColor = "var(--accent-teal)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--liquid-glass-3)";
            e.currentTarget.style.borderColor = "var(--liquid-border)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Plus size={16} color="var(--accent-teal)" />
            <span>New Inquiry</span>
          </div>
          <span
            style={{
              fontSize: "0.6875rem",
              fontWeight: 600,
              padding: "2px 6px",
              borderRadius: "6px",
              background: "rgba(255, 255, 255, 0.08)",
              color: "var(--text-tertiary)",
            }}
          >
            +
          </span>
        </button>
      </div>

      {/* ─── Search Bar ─── */}
      <div style={{ padding: "6px 16px 12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 10px",
            borderRadius: "10px",
            background: "var(--liquid-glass-1)",
            border: "1px solid var(--liquid-border)",
          }}
        >
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past inquiries..."
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: "0.75rem",
              width: "100%",
            }}
          />
        </div>
      </div>

      {/* ─── Grouped Chat History ─── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 12px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        {categories.map((cat) => {
          const catSessions = filteredSessions.filter((s) => s.category === cat);
          if (catSessions.length === 0) return null;

          return (
            <div key={cat}>
              <span
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  padding: "0 8px 6px",
                  display: "block",
                }}
              >
                {cat}
              </span>

              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {catSessions.map((session) => {
                  const isActive = activeChatId === session.id;

                  return (
                    <div
                      key={session.id}
                      onClick={() => onSelectChat(session)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 10px",
                        borderRadius: "10px",
                        background: isActive ? "var(--liquid-glass-3)" : "transparent",
                        border: isActive ? "1px solid var(--liquid-border-focus)" : "1px solid transparent",
                        boxShadow: isActive ? "var(--liquid-inner-subtle)" : "none",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "var(--liquid-glass-1)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "transparent";
                        }
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
                        <MessageSquare
                          size={14}
                          color={isActive ? "var(--accent-teal)" : "var(--text-tertiary)"}
                          style={{ flexShrink: 0 }}
                        />
                        <span
                          style={{
                            fontSize: "0.8125rem",
                            color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                            fontWeight: isActive ? 600 : 400,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {session.title}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleDeleteSession(e, session.id)}
                        title="Delete inquiry"
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--text-muted)",
                          cursor: "pointer",
                          padding: "2px",
                          borderRadius: "4px",
                          display: "flex",
                          opacity: isActive ? 0.7 : 0,
                          transition: "opacity 0.2s, color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-rose)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Quick Feature Links ─── */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--liquid-border)",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <button
          onClick={onOpenPipelineDrawer}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 10px",
            borderRadius: "10px",
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            fontSize: "0.8125rem",
            fontWeight: 500,
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--liquid-glass-1)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          <GitBranch size={15} color="var(--accent-cyan)" />
          <span>13-Stage Pipeline State</span>
        </button>
      </div>

      {/* ─── Bottom User Profile & Settings Drawer ─── */}
      <div
        style={{
          padding: "14px 16px",
          borderTop: "1px solid var(--liquid-border)",
          background: "var(--liquid-glass-1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* User Card */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent-teal), var(--accent-cyan))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "0.75rem",
              fontWeight: 700,
              boxShadow: "0 2px 10px rgba(20, 184, 166, 0.3)",
            }}
          >
            JR
          </div>
          <div>
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", display: "block" }}>
              Jurist Counsel
            </span>
            <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>
              Advocate Edition
            </span>
          </div>
        </div>

        {/* Right Actions: Settings & Theme */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            onClick={toggleTheme}
            title="Toggle theme"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              background: "transparent",
              border: "none",
              color: "var(--text-tertiary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button
            onClick={onOpenSettings}
            title="Open Settings"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              background: "transparent",
              border: "none",
              color: "var(--text-tertiary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
          >
            <Settings size={15} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
