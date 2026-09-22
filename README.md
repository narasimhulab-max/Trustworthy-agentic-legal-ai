# Trustworthy Agentic Foundation Model Framework for Explainable Legal Reasoning and Decision Intelligence

<div align="center">

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)

**A production-grade, multi-agent AI framework for trustworthy, explainable, and evidence-grounded legal decision intelligence.**

*Grounded in Indian Constitutional Law · IRAC Legal Reasoning · Multi-Factor Trust Evaluation*

</div>

---

## 📌 Project Overview

This project proposes a **Trustworthy Agentic Foundation Model Framework** for Explainable Legal Reasoning and Decision Intelligence using **Multi-Agent Retrieval-Augmented Generation (RAG)** and **Dynamic Legal Knowledge Graphs**.

The framework addresses major limitations of existing Legal AI systems:

| Problem | Our Solution |
|---|---|
| Hallucinated legal interpretations | Multi-factor Trust Evaluation Module |
| Inadequate citation verification | Citation Verification Agent with source grounding |
| Limited reasoning transparency | IRAC-structured Explainability Engine |
| Static legal knowledge | Dynamic Legal Knowledge Graph (NetworkX/Neo4j) |
| Poor adaptability to evolving legislation | Live graph updates with overruling detection |
| Insufficient trust evaluation | Radial SVG confidence gauge (Grounding % · Hallucination Risk % · Statutory Fit %) |

The system combines **Foundation Models**, **Multi-Agent Systems**, **RAG**, **Dynamic Legal Knowledge Graphs**, **Explainable AI**, and **Trustworthy AI** into a unified architecture for reliable, evidence-supported legal decision assistance.

> **Note:** This project is intended for research and decision-support purposes only. It does not replace professional legal advice or create an advocate-client relationship.

---

## 🎯 Research Objectives

- Design a **trustworthy multi-agent Legal AI framework** with inspectable per-stage I/O
- Integrate **Foundation Models** (Gemini, Llama) with **Retrieval-Augmented Generation**
- Build a **Dynamic Legal Knowledge Graph** mapping statutes ↔ landmark cases ↔ overrulings ↔ doctrines
- Enable **structured IRAC legal reasoning** (Issue → Rule → Application → Conclusion)
- Perform **citation verification** and evidence-grounded response generation
- **Detect and reduce hallucinated** legal information via multi-factor scoring
- Develop a **Trust Evaluation Module** with quantitative confidence metrics
- Incorporate **human expert feedback** (Lawyer-in-the-Loop: Accept / Edit / Reject)
- Support **evidence-based decision intelligence** with ranked recommendation options
- Evaluate the framework using publicly available legal datasets and benchmarks

---

## 🏗️ System Architecture

The pipeline is an **inspectable 13-stage state machine** — every stage is an isolated, typed module with Pydantic I/O contracts:

```
User Query / Legal Document
          ↓
[Stage 01] Legal Query Intake       — Domain Classification & Entity Extraction
          ↓
[Stage 02] Agent Orchestrator       — Run State Machine & SSE Streaming
          ↓
[Stage 03] Planning Agent           — Sub-Task Decomposition
          ↓
[Stage 04] Task Allocation Agent    — Concurrency & Tool Assignment
          ↓
[Stage 05] Retrieval Agent          — Dense Hybrid Vector Search (FAISS + BM25)
          ↓
[Stage 06] Dynamic Legal Knowledge Graph — Statutes ↔ Cases ↔ Overrulings ↔ Doctrines
          ↓
[Stage 07] Foundation Model         — Strict Context-Grounded LLM Call
          ↓
[Stage 08] Legal Reasoning Engine   — IRAC: Issue → Rule → Application → Conclusion
          ↓
[Stage 09] Explainability Engine    — Audit Trail & Plain-Language Takeaway
          ↓
[Stage 10] Trust Evaluation Module  — Multi-Factor Scoring: Grounding · Hallucination · Statutory Fit
          ↓
[Stage 11] Decision Intelligence    — Ranked Recommendation Options & Tradeoffs
          ↓
[Stage 12] Human Feedback Module    — Lawyer-in-the-Loop: Accept / Edit / Reject
          ↓
[Stage 13] Final Legal Recommendation — Formatted Output, Radial Trust Gauge & Citations
```

---

## ✨ Key Features

1. **13 Inspectable Pipeline Stages** — Each stage is an isolated, typed class with Pydantic I/O contracts
2. **Constitution of India Grounding** — Direct indexing over Articles 1–395, Parts, Schedules, and Fundamental Rights
3. **Dynamic Legal Knowledge Graph** — In-memory NetworkX / Neo4j-compatible graph mapping precedents (e.g. *Kesavananda Bharati*, *Maneka Gandhi*, *Puttaswamy*) and flagging overruled judgments (e.g. *A.K. Gopalan*)
4. **Structured IRAC Legal Reasoning** — Issue formulation → Rule identification → Application to facts → Grounded conclusion
5. **Multi-Factor Trust Scoring** — Radial SVG confidence gauge measuring Source Grounding (%), Hallucination Risk (%), and Indian Statutory Fit (%)
6. **Pluggable Foundation Models** — Google Gemini (2.5 Flash / 1.5 Pro), Groq (Llama 3.3 70B), or local OpenAI-compatible endpoints
7. **Multimodal Document Ingestion** — Drag-and-drop support for FIRs, petitions, contracts, and court orders (PDF / Image / Text)
8. **Lawyer-in-the-Loop Validation** — Interactive feedback controls that feed back into retrieval ranking
9. **Dual Persona Mode** — Advocate Strategy view vs. Citizen Guidance view
10. **Glassmorphism UI** — Multi-depth frosted glass panels, Inter typography, Framer Motion micro-interactions, adaptive light/dark theme

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router, TypeScript), Framer Motion, Lucide Icons |
| **Styling** | Vanilla CSS — iOS-grade multi-depth glassmorphism design tokens |
| **Backend** | Python 3.11+, FastAPI, SSE Streaming (`sse-starlette`), Pydantic v2 |
| **Multi-Agent Engine** | Stateful State Machine Orchestrator with async per-stage streaming |
| **Knowledge Graph** | NetworkX / Neo4j-compatible in-memory dynamic legal graph |
| **Vector Search** | Hybrid FAISS / BM25 constitution semantic retrieval |
| **Foundation LLM** | Google Gemini 2.5 Flash, Groq (Llama 3.3 70B), or local endpoints |
| **Document OCR** | PyMuPDF (`fitz`) — page-by-page layout-aware PDF extraction |

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.11+**
- **Node.js 18+** and npm

### 1. Clone the Repository

```bash
git clone https://github.com/narasimhulab-max/Trustworthy-agentic-legal-ai.git
cd Trustworthy-agentic-legal-ai
```

### 2. Backend Setup

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Configure API keys
cp .env.example .env
# Edit .env and add your keys:
# GEMINI_API_KEY=your_gemini_api_key_here
# GROQ_API_KEY=your_groq_api_key_here   (optional)

# Start the backend server
python main.py
```

Backend API starts at **http://localhost:8000**  
Interactive Swagger docs at **http://localhost:8000/docs**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the Next.js development server
npm run dev
```

Frontend starts at **http://localhost:3000**

---

## ⚙️ Environment Variables

Create `backend/.env` from `backend/.env.example`:

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API key |
| `GEMINI_MODEL` | No | Model name (default: `gemini-2.0-flash`) |
| `GROQ_API_KEY` | No | Groq key for Llama 3.3 70B fallback |

---

## 📁 Project Structure

```
Trustworthy-agentic-legal-ai/
├── backend/
│   ├── agents/               # 13-stage pipeline modules
│   │   ├── orchestrator.py       # State machine & SSE streaming
│   │   ├── query_intake.py       # Stage 01 — domain classification
│   │   ├── planning_agent.py     # Stage 03 — sub-task decomposition
│   │   ├── retrieval_agent.py    # Stage 05 — hybrid vector search
│   │   ├── reasoning_engine.py   # Stage 08 — IRAC reasoning
│   │   ├── trust_evaluation.py   # Stage 10 — multi-factor scoring
│   │   ├── decision_intelligence.py # Stage 11 — ranked recommendations
│   │   ├── human_feedback.py     # Stage 12 — lawyer-in-the-loop
│   │   └── vision_document_engine.py # Multimodal OCR
│   ├── graph/
│   │   └── legal_graph.py        # Dynamic legal knowledge graph
│   ├── llm/
│   │   └── provider.py           # Pluggable LLM provider interface
│   ├── models/
│   │   └── schemas.py            # Pydantic I/O contracts
│   ├── rag/
│   │   ├── vector_store.py       # FAISS vector store
│   │   ├── embeddings.py         # Sentence transformer embeddings
│   │   ├── knowledge_base.py     # Constitution & statute indexing
│   │   └── indian_statutes.py    # BNS, IPC, BNSS, CrPC, BSA corpus
│   ├── main.py                   # FastAPI entry point
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── app/                  # Next.js App Router pages
│       ├── components/           # UI components
│       │   ├── ChatInterface.tsx     # Main query interface
│       │   ├── AgentPipeline.tsx     # Live pipeline visualizer
│       │   ├── Sidebar.tsx           # Session history
│       │   ├── TrustGauge.tsx        # Radial SVG confidence gauge
│       │   ├── FeedbackPanel.tsx     # Lawyer-in-the-loop controls
│       │   └── CitationTrail.tsx     # Source audit trail
│       └── lib/
│           ├── api.ts                # SSE streaming API client
│           └── reportExport.ts       # PDF report export
├── Document/                     # Research documents & reference papers
└── README.md
```

---

## 🧪 Testing

Run the full 13-stage pipeline end-to-end:

```bash
cd backend
python test_pipeline_e2e.py
```

Run the backend health check:

```bash
python test_backend.py
```

---

## 👥 Contributors

| Contributor | GitHub |
|---|---|
| Patchala Naga Mahitha | [@PatchalaMahitha](https://github.com/PatchalaMahitha) |
| Sriharshitha | [@sriharshithakaja](https://github.com/sriharshithakaja) |
| Varalakshmi | [@varam-77](https://github.com/varam-77) |
| Harsha | [@harsha996612](https://github.com/harsha996612) |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## ⚖️ Legal Disclaimer

This system is an AI-powered legal research and decision-support tool designed for **educational and informational purposes**. It does **not** create an advocate-client relationship under the Advocates Act, 1961. Always consult an enrolled legal practitioner for formal legal advice.

---

<div align="center">
  <sub>Built with ❤️ for trustworthy, explainable, and grounded legal AI</sub>
</div>
