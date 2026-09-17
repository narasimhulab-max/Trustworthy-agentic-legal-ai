/**
 * NyayaAI — Legal Report PDF Export Hook
 * Generates a professionally formatted legal report PDF client-side using jsPDF.
 * No server required — pure client-side generation.
 */

import type { FinalRecommendation } from "./api";

// ─── Color Palette ───
const COLORS = {
  teal: [20, 184, 166] as [number, number, number],
  cyan: [6, 182, 212] as [number, number, number],
  amber: [245, 158, 11] as [number, number, number],
  rose: [244, 63, 94] as [number, number, number],
  emerald: [16, 185, 129] as [number, number, number],
  dark: [15, 23, 42] as [number, number, number],
  mid: [71, 85, 105] as [number, number, number],
  light: [148, 163, 184] as [number, number, number],
  white: [248, 250, 252] as [number, number, number],
  bg: [6, 7, 10] as [number, number, number],
};

function wrapText(
  doc: import("jspdf").jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function drawSectionHeader(
  doc: import("jspdf").jsPDF,
  title: string,
  y: number,
  pageWidth: number
): number {
  // Draw left accent bar
  doc.setFillColor(...COLORS.teal);
  doc.rect(14, y - 4, 3, 7, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.teal);
  doc.text(title.toUpperCase(), 20, y);

  // Divider line
  doc.setDrawColor(...COLORS.teal);
  doc.setLineWidth(0.3);
  doc.line(20, y + 2, pageWidth - 14, y + 2);

  return y + 10;
}

function addPage(doc: import("jspdf").jsPDF, pageWidth: number): number {
  doc.addPage();
  // Footer line
  doc.setDrawColor(30, 40, 60);
  doc.setLineWidth(0.3);
  doc.line(14, 285, pageWidth - 14, 285);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.mid);
  doc.text(
    "NyayaAI — AI-Powered Legal Research | For informational purposes only. Not a substitute for enrolled legal counsel.",
    pageWidth / 2,
    290,
    { align: "center" }
  );
  return 20;
}

export async function exportLegalReportPDF(rec: FinalRecommendation): Promise<void> {
  // Dynamic import for SSR safety
  const { default: jsPDF } = await import("jspdf");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - 28; // 14mm margins each side
  let y = 20;

  // ─── Cover Page Header ───
  // Dark background banner
  doc.setFillColor(8, 10, 18);
  doc.rect(0, 0, pageWidth, 55, "F");

  // Teal accent bar on left
  doc.setFillColor(...COLORS.teal);
  doc.rect(0, 0, 5, 55, "F");

  // Logo / Brand
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(...COLORS.white);
  doc.text("Nyaya", 14, 24);
  doc.setTextColor(...COLORS.teal);
  doc.text("AI", 14 + doc.getTextWidth("Nyaya"), 24);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.light);
  doc.text("AI-Powered Legal Research Platform | Constitution of India", 14, 32);

  // Report title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.cyan);
  doc.text("LEGAL ANALYSIS REPORT", pageWidth - 14, 22, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.light);
  const timestamp = new Date(rec.timestamp * 1000).toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  });
  doc.text(`Generated: ${timestamp}`, pageWidth - 14, 30, { align: "right" });
  doc.text(`Processing Time: ${rec.processing_time_ms}ms`, pageWidth - 14, 36, { align: "right" });

  // Trust score badge
  const score = rec.trust_metrics?.overall_score ?? 0;
  const scoreColor =
    score >= 75 ? COLORS.emerald : score >= 50 ? COLORS.amber : COLORS.rose;
  doc.setFillColor(...scoreColor);
  doc.roundedRect(pageWidth - 60, 40, 46, 10, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `TRUST SCORE: ${score}% (${(rec.trust_metrics?.confidence_level ?? "N/A").toUpperCase()})`,
    pageWidth - 37,
    46.5,
    { align: "center" }
  );

  y = 65;

  // ─── Query & Domain ───
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.mid);
  doc.text("LEGAL QUERY", 14, y);
  y += 5;

  doc.setFillColor(12, 15, 25);
  doc.roundedRect(14, y - 4, contentWidth, 18, 2, 2, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.white);
  y = wrapText(doc, rec.query, 18, y + 2, contentWidth - 8, 5);
  y += 8;

  // Domain + Persona badges
  doc.setFillColor(...COLORS.teal);
  doc.roundedRect(14, y, 40, 7, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(rec.domain?.toUpperCase() ?? "GENERAL", 34, y + 4.5, { align: "center" });

  doc.setFillColor(...COLORS.cyan);
  doc.roundedRect(58, y, 36, 7, 1.5, 1.5, "F");
  doc.text(`${(rec.persona ?? "advocate").toUpperCase()} MODE`, 76, y + 4.5, { align: "center" });
  y += 16;

  // ─── Plain Language Summary ───
  y = drawSectionHeader(doc, "Plain Language Summary", y, pageWidth);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...COLORS.dark);
  y = wrapText(doc, rec.summary ?? "", 14, y, contentWidth, 5.5);
  y += 10;

  // ─── Case Breakthroughs ───
  if (rec.breakthroughs?.length) {
    y = drawSectionHeader(doc, `Case Breakthroughs & Defense Angles (${rec.breakthroughs.length})`, y, pageWidth);

    for (const bt of rec.breakthroughs) {
      if (y > 260) y = addPage(doc, pageWidth);

      // Impact badge
      const impactColor =
        bt.impact_level?.toLowerCase() === "critical"
          ? COLORS.rose
          : bt.impact_level?.toLowerCase() === "high"
          ? COLORS.amber
          : COLORS.cyan;

      doc.setFillColor(...impactColor);
      doc.roundedRect(14, y, 28, 5.5, 1, 1, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text((bt.impact_level ?? "High").toUpperCase(), 28, y + 3.8, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...COLORS.mid);
      doc.text(bt.category?.toUpperCase() ?? "", 46, y + 3.8);
      y += 8;

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.dark);
      y = wrapText(doc, bt.title ?? "", 14, y, contentWidth, 5.5);
      y += 3;

      // Description
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...COLORS.mid);
      y = wrapText(doc, bt.description ?? "", 14, y, contentWidth, 5);
      y += 3;

      // Statutory basis
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.teal);
      doc.text(`Statutory Basis: ${bt.statutory_basis ?? ""}`, 14, y);
      y += 5;

      // Tactical advantage box
      doc.setFillColor(10, 15, 28);
      doc.roundedRect(14, y, contentWidth, 1, 0, 0, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...COLORS.cyan);
      doc.text("▸ TACTICAL COURT LEVERAGE:", 14, y + 7);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...COLORS.dark);
      y = wrapText(doc, bt.tactical_advantage ?? "", 14, y + 11, contentWidth, 5);
      y += 8;

      // Separator
      doc.setDrawColor(220, 230, 245);
      doc.setLineWidth(0.2);
      doc.line(14, y, pageWidth - 14, y);
      y += 6;
    }
  }

  // ─── Applicable Sections ───
  if (rec.identified_sections?.length) {
    if (y > 240) y = addPage(doc, pageWidth);
    y = drawSectionHeader(doc, `Applicable Statutory Sections (${rec.identified_sections.length})`, y, pageWidth);

    for (const sec of rec.identified_sections) {
      if (y > 265) y = addPage(doc, pageWidth);

      const isNonBailable = sec.bailable?.toLowerCase().includes("non-bailable");
      const bailColor = isNonBailable ? COLORS.rose : COLORS.emerald;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.teal);
      doc.text(sec.section ?? "", 14, y);

      if (sec.ipc_equivalent && sec.ipc_equivalent !== "N/A") {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.mid);
        doc.text(`(Equiv: ${sec.ipc_equivalent})`, 14 + doc.getTextWidth(sec.section ?? "") + 4, y);
      }

      if (sec.bailable && sec.bailable !== "N/A") {
        doc.setFillColor(...bailColor);
        doc.roundedRect(pageWidth - 55, y - 4, 41, 5.5, 1, 1, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(6.5);
        doc.setTextColor(255, 255, 255);
        doc.text(sec.bailable.toUpperCase(), pageWidth - 34.5, y - 0.5, { align: "center" });
      }
      y += 5;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.dark);
      y = wrapText(doc, sec.title ?? "", 14, y, contentWidth, 5);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.light);
      doc.text(sec.act ?? "", 14, y);
      y += 5;

      if (sec.punishment && sec.punishment !== "N/A") {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.mid);
        y = wrapText(doc, `Punishment: ${sec.punishment}`, 14, y, contentWidth, 5);
      }
      y += 7;
    }
  }

  // ─── IRAC Analysis ───
  if (rec.detailed_analysis) {
    if (y > 200) y = addPage(doc, pageWidth);
    y = drawSectionHeader(doc, "IRAC Legal Analysis (Structured Reasoning)", y, pageWidth);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.dark);
    // Remove markdown headers, use plain text
    const cleanedAnalysis = rec.detailed_analysis
      .replace(/^###\s+/gm, "")
      .replace(/\*\*/g, "")
      .trim();
    y = wrapText(doc, cleanedAnalysis, 14, y, contentWidth, 5.5);
    y += 10;
  }

  // ─── Trust Metrics ───
  if (rec.trust_metrics) {
    if (y > 240) y = addPage(doc, pageWidth);
    y = drawSectionHeader(doc, "Trust & Confidence Metrics", y, pageWidth);

    const metrics = [
      { label: "Overall Trust Score", value: `${rec.trust_metrics.overall_score}%`, color: COLORS.teal },
      { label: "Source Grounding", value: `${rec.trust_metrics.source_grounding}%`, color: COLORS.emerald },
      { label: "Hallucination Risk", value: `${rec.trust_metrics.hallucination_risk}%`, color: COLORS.rose },
      { label: "Jurisdictional Relevance", value: `${rec.trust_metrics.jurisdictional_relevance}%`, color: COLORS.cyan },
    ];

    for (let i = 0; i < metrics.length; i++) {
      const m = metrics[i];
      const xBase = i % 2 === 0 ? 14 : pageWidth / 2 + 4;
      if (i % 2 === 0 && i > 0) y += 14;
      const startY = i < 2 ? y : y;

      doc.setFillColor(12, 18, 32);
      doc.roundedRect(xBase, startY, contentWidth / 2 - 4, 12, 2, 2, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...m.color);
      doc.text(m.label, xBase + 4, startY + 5);

      doc.setFontSize(12);
      doc.setTextColor(...COLORS.white);
      doc.text(m.value, xBase + contentWidth / 2 - 10, startY + 8, { align: "right" });
    }
    y += 26;
  }

  // ─── Citations / Applicable Articles ───
  if (rec.applicable_articles?.length) {
    if (y > 220) y = addPage(doc, pageWidth);
    y = drawSectionHeader(doc, `Constitutional Citations & Precedents (${rec.applicable_articles.length})`, y, pageWidth);

    for (const art of rec.applicable_articles.slice(0, 6)) {
      if (y > 265) y = addPage(doc, pageWidth);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.teal);
      doc.text(`[${art.article_number}] ${art.title}`, 14, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.mid);
      y = wrapText(doc, art.text ?? "", 18, y, contentWidth - 4, 4.5);
      y += 5;
    }
  }

  // ─── Recommended Actions ───
  if (rec.recommended_actions?.length) {
    if (y > 220) y = addPage(doc, pageWidth);
    y = drawSectionHeader(doc, "Recommended Actions & Strategic Steps", y, pageWidth);

    for (let i = 0; i < rec.recommended_actions.length; i++) {
      if (y > 265) y = addPage(doc, pageWidth);
      doc.setFillColor(...COLORS.teal);
      doc.circle(17, y - 1, 1.5, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...COLORS.dark);
      y = wrapText(doc, rec.recommended_actions[i], 22, y, contentWidth - 8, 5);
      y += 4;
    }
  }

  // ─── Legal Disclaimer ───
  if (y > 250) y = addPage(doc, pageWidth);
  y += 6;
  doc.setFillColor(18, 24, 40);
  doc.roundedRect(14, y, contentWidth, 22, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.amber);
  doc.text("⚠  IMPORTANT LEGAL DISCLAIMER", 18, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.light);
  const disclaimer =
    "NyayaAI provides AI-powered legal research and decision support for educational purposes only. " +
    "It does not constitute legal advice and does not establish an advocate-client relationship under the Advocates Act, 1961. " +
    "Always consult an enrolled legal practitioner for formal legal advice in your specific case.";
  wrapText(doc, disclaimer, 18, y + 12, contentWidth - 8, 4.5);

  // ─── Save PDF ───
  const safeQuery = rec.query.slice(0, 40).replace(/[^a-z0-9]/gi, "_");
  doc.save(`NyayaAI_Legal_Report_${safeQuery}_${Date.now()}.pdf`);
}
