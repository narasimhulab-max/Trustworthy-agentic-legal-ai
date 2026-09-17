import json
import os
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse
from dotenv import load_dotenv

load_dotenv()

from agents.orchestrator import orchestrator, PIPELINE_STAGES_METADATA
from agents.human_feedback import feedback_manager
from agents.vision_document_engine import vision_engine
from models.schemas import FeedbackInput, DecisionOutput

app = FastAPI(
    title="NyayaAI Backend",
    description="Federated Agentic AI Framework for Secure and Privacy-Preserving Intelligent Legal Assistance",
    version="2.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str
    persona: Optional[str] = "advocate" # advocate or citizen
    image_data: Optional[List[str]] = None
    document_attachments: Optional[List[str]] = None

class UserFeedbackRequest(BaseModel):
    query: str
    action: str # accept, edit, reject
    correction: Optional[str] = None
    original_recommendation: Optional[str] = None

@app.get("/")
def root():
    return {
        "app": "NyayaAI",
        "version": "2.1.0",
        "status": "operational",
        "features": [
            "13-Stage Federated Multi-Agent Pipeline",
            "Statutory Sections Discovery (BNS, IPC, BNSS, CrPC, BSA)",
            "Strategic Case Breakthroughs & Defense Angles Engine",
            "Multimodal Image & Document OCR Vision Engine",
            "Dual Persona: Advocate Strategy & Citizen Guidance"
        ],
        "docs": "/docs",
    }

@app.get("/api/health")
def health():
    gemini_key = bool(os.getenv("GEMINI_API_KEY"))
    groq_key = bool(os.getenv("GROQ_API_KEY"))
    return {
        "status": "healthy",
        "providers": {
            "gemini": gemini_key,
            "groq": groq_key,
        },
        "pipeline_stages_count": len(PIPELINE_STAGES_METADATA),
    }

@app.get("/api/pipeline")
def get_pipeline():
    return {"stages": PIPELINE_STAGES_METADATA}

@app.post("/api/query/stream")
async def query_stream(req: QueryRequest):
    """
    SSE streaming endpoint executing the 13-stage pipeline live.
    Yields per-stage status updates, section mappings, breakthroughs, and final recommendations.
    """
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    async def event_generator():
        try:
            async for event in orchestrator.execute_stream(
                query=req.query,
                persona=req.persona or "advocate",
                image_data=req.image_data,
                document_attachments=req.document_attachments
            ):
                yield {
                    "event": event["event"],
                    "data": json.dumps(event["data"])
                }
        except Exception as e:
            print(f"[Stream Error] {e}")
            yield {
                "event": "error",
                "data": json.dumps({"error": str(e)})
            }

    return EventSourceResponse(event_generator())

@app.post("/api/query")
async def query_sync(req: QueryRequest):
    """Non-streaming query endpoint."""
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    try:
        result = await orchestrator.execute(req.query, persona=req.persona or "advocate")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Multimodal Upload Endpoint:
    Accepts Case Documents (PDF, TXT, MD) and Evidence Images (PNG, JPG, JPEG, WEBP).
    Extracts text, stamp/signature details, and statutory references.
    Uses PyMuPDF (fitz) for proper page-by-page PDF text extraction.
    """
    try:
        content = await file.read()
        filename = file.filename.lower()
        
        # Check if file is an image (FIR photo, court order scan, signature page)
        image_extensions = [".jpg", ".jpeg", ".png", ".webp", ".bmp"]
        if any(filename.endswith(ext) for ext in image_extensions):
            mime_type = file.content_type or "image/jpeg"
            vision_result = await vision_engine.analyze_legal_image(content, mime_type=mime_type)
            return {
                "filename": file.filename,
                "file_type": "image",
                "extracted_text": vision_result.get("extracted_text", ""),
                "summary": vision_result.get("summary", ""),
                "has_visual_evidence": True
            }

        # PDF: Use PyMuPDF for proper page-by-page layout-aware extraction
        if filename.endswith(".pdf"):
            try:
                import fitz  # PyMuPDF
                import io
                doc = fitz.open(stream=io.BytesIO(content), filetype="pdf")
                page_texts = []
                for page_num in range(min(doc.page_count, 20)):  # Max 20 pages
                    page = doc.load_page(page_num)
                    page_text = page.get_text("text")
                    if page_text.strip():
                        page_texts.append(f"[Page {page_num + 1}]\n{page_text.strip()}")
                doc.close()
                extracted_text = "\n\n".join(page_texts)
            except ImportError:
                # Fallback if PyMuPDF not yet installed
                extracted_text = content.decode("utf-8", errors="ignore")
            except Exception as pdf_err:
                print(f"[PDF Extraction] PyMuPDF error: {pdf_err}")
                extracted_text = content.decode("utf-8", errors="ignore")
        elif filename.endswith(".txt") or filename.endswith(".md"):
            extracted_text = content.decode("utf-8", errors="ignore")
        else:
            extracted_text = content.decode("utf-8", errors="ignore")

        cleaned = extracted_text.strip()[:8000]
        return {
            "filename": file.filename,
            "file_type": "document",
            "extracted_text": cleaned,
            "char_count": len(cleaned)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")

@app.post("/api/feedback")
async def handle_feedback(req: UserFeedbackRequest):
    dummy_decision = DecisionOutput(
        primary_recommendation=req.original_recommendation or "Constitutional recommendation",
        alternatives=[],
        breakthroughs_summary=[],
        disclaimers=[]
    )
    result = await feedback_manager.process(FeedbackInput(
        decision=dummy_decision,
        user_action=req.action,
        correction=req.correction
    ))
    return {
        "status": "success",
        "action": req.action,
        "feedback_applied": result.feedback_applied,
        "adjusted_recommendation": result.adjusted_recommendation
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
