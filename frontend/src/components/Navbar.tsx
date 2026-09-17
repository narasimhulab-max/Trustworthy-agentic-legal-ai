"use client";

import React, { useState, useEffect } from "react";
import { Scale, Sun, Moon, Sparkles } from "lucide-react";

export default function Navbar() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "68px",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        background: scrolled ? "var(--glass-2)" : "var(--glass-1)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderBottom: "1px solid var(--glass-border-outer)",
        boxShadow: "var(--glass-border-inner)",
        transition: "all 0.3s ease",
      }}
    >
      {/* Brand Logo & Name */}
      <a
        href="#"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          textDecoration: "none",
          color: "var(--text-primary)",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "rgba(20, 184, 166, 0.12)",
            border: "1px solid rgba(20, 184, 166, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-teal)",
          }}
        >
          <Scale size={20} strokeWidth={2.2} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "1.0625rem", fontWeight: 700, letterSpacing: "-0.03em" }}>
            Nyaya<span style={{ color: "var(--accent-teal)" }}>AI</span>
          </span>
          <span style={{ fontSize: "0.6875rem", color: "var(--text-tertiary)", fontWeight: 500, letterSpacing: "0.02em" }}>
            Constitution of India
          </span>
        </div>
      </a>

      {/* Center Nav Links */}
      <nav style={{ display: "flex", alignItems: "center", gap: "28px" }}>
        <button
          onClick={() => scrollTo("pipeline-section")}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
        >
          13-Stage Pipeline
        </button>
        <button
          onClick={() => scrollTo("features-section")}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
        >
          Knowledge Graph
        </button>
        <button
          onClick={() => scrollTo("chat-workspace")}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
        >
          Legal Assistant
        </button>
      </nav>

      {/* Right Actions: Theme Switcher & Query CTA */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={toggleTheme}
          title="Toggle light/dark theme"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "9999px",
            background: "var(--glass-2)",
            border: "1px solid var(--glass-border-outer)",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--text-primary)";
            e.currentTarget.style.background = "var(--glass-3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.background = "var(--glass-2)";
          }}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button
          className="btn-glass"
          onClick={() => scrollTo("chat-workspace")}
          style={{ fontSize: "0.8125rem", padding: "8px 16px" }}
        >
          <Sparkles size={14} color="var(--accent-teal)" />
          <span>Ask Legal Question</span>
        </button>
      </div>
    </header>
  );
}
