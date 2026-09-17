/**
 * NyayaAI — Frontend API Client
 * Supports 13-stage SSE streaming, multimodal image/document ingestion,
 * statutory section discovery, case breakthroughs, and dual personas (Advocate vs Citizen).
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface StageUpdate {
  stage_id: string;
  status: "pending" | "running" | "done" | "failed";
  message: string;
  output_preview?: string;
}

export interface CitedArticle {
  article_number: string;
  title: string;
  text: string;
  relevance_score: number;
}

export interface StatutorySection {
  act: string;
  section: string;
  ipc_equivalent: string;
  title: string;
  bailable: string;
  punishment: string;
}

export interface CaseBreakthrough {
  category: "Procedural Flaw" | "Evidentiary Gap" | "Constitutional Shield" | "Winning Precedent" | "Cross-Examination Angle" | string;
  title: string;
  impact_level: "Critical" | "High" | "Medium" | string;
  description: string;
  statutory_basis: string;
  tactical_advantage: string;
}

export interface TrustMetrics {
  overall_score: number;
  source_grounding: number;
  hallucination_risk: number;
  jurisdictional_relevance: number;
  confidence_level: "high" | "medium" | "low";
}

export interface ExplainabilityData {
  reasoning_steps: string[];
  key_articles_cited: string[];
  plain_language_summary: string;
}

export interface FinalRecommendation {
  query: string;
  persona: "advocate" | "citizen" | string;
  domain: string;
  summary: string;
  detailed_analysis: string;
  applicable_articles: CitedArticle[];
  identified_sections: StatutorySection[];
  breakthroughs: CaseBreakthrough[];
  explainability: ExplainabilityData;
  trust_metrics: TrustMetrics;
  recommended_actions: string[];
  disclaimers: string[];
  processing_time_ms: number;
  timestamp: number;
}

export interface PipelineStageMeta {
  id: string;
  name: string;
  desc: string;
}

/**
 * Stream a legal query through the 13-stage pipeline via SSE.
 */
export async function streamLegalQuery(
  query: string,
  persona: "advocate" | "citizen" = "advocate",
  imageData?: string[],
  documentAttachments?: string[],
  onStageUpdate?: (update: StageUpdate) => void,
  onFinalResult?: (result: FinalRecommendation) => void,
  onError?: (errorMsg: string) => void
): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/api/query/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        persona,
        image_data: imageData,
        document_attachments: documentAttachments,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Network error" }));
      onError?.(err.detail || "Server error occurred");
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) {
      onError?.("Streaming response body unavailable");
      return;
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      let currentEvent = "";
      for (const line of lines) {
        if (line.startsWith("event:")) {
          currentEvent = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
          const rawData = line.slice(5).trim();
          try {
            const parsed = JSON.parse(rawData);
            if (currentEvent === "stage_update" || parsed.stage_id) {
              onStageUpdate?.(parsed as StageUpdate);
            } else if (currentEvent === "result" || parsed.query) {
              onFinalResult?.(parsed as FinalRecommendation);
            } else if (currentEvent === "error" || parsed.error) {
              onError?.(parsed.error || "Execution error in agent pipeline");
            }
          } catch {
            // ignore partial json
          }
        }
      }
    }
  } catch (err) {
    onError?.(err instanceof Error ? err.message : "Connection to NyayaAI backend failed");
  }
}

/**
 * Upload a document or evidence image (PDF, JPG, PNG) for OCR/Text extraction.
 */
export async function uploadLegalFile(file: File): Promise<{
  extracted_text: string;
  filename: string;
  file_type: "image" | "document";
  summary?: string;
  has_visual_evidence?: boolean;
}> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to analyze uploaded legal document or image");
  }
  return res.json();
}

/**
 * Submit lawyer-in-the-loop feedback.
 */
export async function submitHumanFeedback(params: {
  query: string;
  action: "accept" | "edit" | "reject";
  correction?: string;
  original_recommendation?: string;
}): Promise<{ status: string; adjusted_recommendation?: string }> {
  const res = await fetch(`${API_BASE}/api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error("Failed to record feedback");
  }
  return res.json();
}
