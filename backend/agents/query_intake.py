import re
from typing import List
from models.schemas import QueryIntakeInput, QueryIntakeOutput, UserPersona
from agents.base import PipelineStage

class LegalQueryIntakeStage(PipelineStage):
    """
    Stage 1: Legal Query Intake & Multimodal Document Normalization
    Receives raw user query, attached case documents, or image OCR text,
    classifies the legal domain, extracts sections, and tags user persona (Advocate vs Citizen).
    """
    
    @property
    def stage_id(self) -> str:
        return "intake"
        
    @property
    def stage_name(self) -> str:
        return "Legal Query Intake"

    async def process(self, query_input: QueryIntakeInput) -> QueryIntakeOutput:
        raw_text = query_input.raw_query.strip()
        
        # 1. Include text from document attachments if present
        if query_input.document_attachments:
            raw_text += "\n" + "\n".join(query_input.document_attachments)
        
        # 2. Normalization
        normalized = re.sub(r'\s+', ' ', raw_text)
        
        # 3. Domain Classification
        lower = normalized.lower()
        domain = "Constitutional Law"
        if any(w in lower for w in ["murder", "theft", "fir", "police", "arrest", "bail", "ipc", "crpc", "bns", "bnss", "remand", "custody", "detain", "detention"]):
            domain = "Criminal Law & Procedure"
        elif any(w in lower for w in ["contract", "breach", "property", "rent", "tenant", "tort", "cpc", "damages", "agreement", "lease"]):
            domain = "Civil & Commercial Law"
        elif any(w in lower for w in ["company", "shares", "director", "tax", "gst", "sebi", "merger", "insolvency", "ibc", "cheating", "fraud"]):
            domain = "Corporate & Financial Law"
        elif any(w in lower for w in ["marriage", "divorce", "custody", "maintenance", "succession", "will", "hindu", "muslim", "498a"]):
            domain = "Family & Personal Law"
        elif any(w in lower for w in ["worker", "union", "wages", "termination", "gratuity", "industrial dispute"]):
            domain = "Labor & Employment Law"
            
        # 4. Entity & Section Extraction (Articles, Acts, Sections)
        entities = []
        identified_sections = []

        # Find Section mentions (e.g. Section 41A, Sec 482, Section 302, 318 BNS)
        sec_matches = re.findall(r'(?:Section|Sec\.?)\s*(\d+[A-Z]?(?:\(\d+\))?)', normalized, re.IGNORECASE)
        for s in sec_matches:
            identified_sections.append(f"Section {s.upper()}")
            entities.append(f"Section {s.upper()}")

        art_matches = re.findall(r'(?:Article|Art\.?)\s*(\d+[A-Z]?)', normalized, re.IGNORECASE)
        for m in art_matches:
            identified_sections.append(f"Article {m.upper()}")
            entities.append(f"Article {m.upper()}")
            
        key_concepts = [
            ("fundamental rights", "Fundamental Rights (Part III)"),
            ("privacy", "Right to Privacy (Art 21)"),
            ("speech", "Freedom of Speech (Art 19)"),
            ("life", "Right to Life & Liberty (Art 21)"),
            ("arrest", "Pre-Arrest Notice Safeguards (Sec 35 BNSS / 41A CrPC)"),
            ("bail", "Bail & Personal Liberty Jurisprudence"),
            ("quash", "High Court Quashing Jurisdiction (Sec 528 BNSS / 482 CrPC)"),
            ("default bail", "Statutory Default Bail (Sec 187 BNSS / 167 CrPC)"),
            ("electronic evidence", "Electronic Record Certification (Sec 63 BSA / 65B IEA)"),
            ("writ", "Writ Jurisdiction (Art 32/226)"),
            ("habeas corpus", "Writ of Habeas Corpus (Illegal Detention)"),
            ("mandamus", "Writ of Mandamus")
        ]
        for term, label in key_concepts:
            if term in lower:
                entities.append(label)
                
        entities = list(dict.fromkeys(entities))
        if not entities:
            entities.append("Indian Constitutional & Statutory Framework")

        has_visual = bool(query_input.image_data and len(query_input.image_data) > 0)

        return QueryIntakeOutput(
            normalized_query=normalized,
            persona=query_input.persona,
            domain=domain,
            entities=entities,
            identified_sections=identified_sections,
            has_visual_evidence=has_visual
        )
