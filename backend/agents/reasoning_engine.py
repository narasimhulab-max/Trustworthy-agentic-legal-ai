import json
from models.schemas import ReasoningInput, ReasoningOutput, IRACAnalysis
from agents.base import PipelineStage
from agents.breakthrough_engine import breakthrough_engine
from rag.indian_statutes import search_applicable_sections
from llm.provider import get_llm_provider

class LegalReasoningEngineStage(PipelineStage):
    """
    Stage 6 & 7: Foundation Model & Legal Reasoning Engine
    Executes structured IRAC (Issue, Rule, Application, Conclusion) analysis,
    maps all applicable statutory sections (BNS/IPC, BNSS/CrPC, BSA, Constitution),
    and discovers tactical case breakthroughs.
    """

    @property
    def stage_id(self) -> str:
        return "reasoning"

    @property
    def stage_name(self) -> str:
        return "Legal Reasoning & Breakthroughs Engine"

    async def process(self, input_data: ReasoningInput) -> ReasoningOutput:
        intake = input_data.intake
        retrieval = input_data.retrieval
        
        # 1. Search applicable statutory sections from Indian Law Database
        matched_statutes = search_applicable_sections(intake.normalized_query)
        applicable_sections_formatted = [
            {
                "act": s["act"],
                "section": s["bns_section"],
                "ipc_equivalent": s.get("ipc_equivalent", "N/A"),
                "title": s["title"],
                "bailable": s.get("bailable", "N/A"),
                "punishment": s.get("punishment", "N/A")
            }
            for s in matched_statutes
        ]

        # 2. Extract strategic case breakthroughs (hybrid: keyword + AI enrichment)
        breakthroughs = await breakthrough_engine.analyze_breakthroughs_async(intake, retrieval)

        # 3. Format citations
        citations_text = "\n\n".join([
            f"[{c.source_id}] {c.title}\n{c.text_snippet}"
            for c in retrieval.retrieved_documents
        ])
        
        system_prompt = (
            "You are a Senior Indian Constitutional Law Advocate and Criminal Defense Strategist. "
            "Perform a rigorous IRAC analysis and provide strategic legal breakthroughs for the case. "
            "STRICT GROUNDING: Rely strictly on Indian statutes (BNS/IPC, BNSS/CrPC, BSA) and constitutional jurisprudence. "
            "Return JSON matching:\n"
            "{\n"
            '  "issue": "Precise legal question presented",\n'
            '  "rule": "Governing statutory sections and landmark Supreme Court precedents",\n'
            '  "application": "Application of legal principles, tests (proportionality, arbitrariness, procedural notice)",\n'
            '  "conclusion": "Clear grounded legal answer",\n'
            '  "defense_strategy": "Concrete tactical steps for advocate/client to defend or pursue relief",\n'
            '  "prosecution_strengths": "Vulnerabilities or counter-arguments from the opposing side"\n'
            "}"
        )
        
        user_prompt = (
            f"Query/Case Details: {intake.normalized_query}\n"
            f"Persona: {intake.persona.value.upper()}\n"
            f"Domain: {intake.domain}\n"
            f"Statutory References: {', '.join([s['section'] for s in applicable_sections_formatted])}\n\n"
            f"--- STATUTES & PRECEDENTS ---\n{citations_text}\n\n"
            f"--- KNOWLEDGE GRAPH CONTEXT ---\n{retrieval.graph_context}\n\n"
            "Produce the IRAC analysis JSON."
        )

        llm = get_llm_provider()
        raw_response = await llm.generate_text(user_prompt, system_prompt=system_prompt, temperature=0.1)
        
        try:
            cleaned = raw_response.strip()
            if "```json" in cleaned:
                cleaned = cleaned.split("```json")[1].split("```")[0].strip()
            elif "```" in cleaned:
                cleaned = cleaned.split("```")[1].split("```")[0].strip()
            data = json.loads(cleaned)
            irac = IRACAnalysis(
                issue=data.get("issue", f"Legal question regarding {intake.normalized_query}"),
                rule=data.get("rule", f"Governed by {', '.join([s['section'] for s in applicable_sections_formatted[:3]])} and Indian constitutional jurisprudence."),
                application=data.get("application", "The action must satisfy the test of non-arbitrariness, proportionality, and statutory procedural safeguards."),
                conclusion=data.get("conclusion", "Actionable grounds exist under the governing statutory framework."),
                defense_strategy=data.get("defense_strategy", "Invoke procedural non-compliance and seek interim relief / quashing."),
                prosecution_strengths=data.get("prosecution_strengths", "Opposing party may contend prima facie statutory violations.")
            )
        except Exception:
            irac = IRACAnalysis(
                issue=f"Whether statutory protections and judicial remedies apply to: {intake.normalized_query}",
                rule=f"Governed by {', '.join([s['section'] for s in applicable_sections_formatted[:2]])} and landmark Supreme Court jurisprudence.",
                application=f"Applying the principles of {intake.domain}, any state or private infringement must be strictly backed by valid law and conform to natural justice.",
                conclusion=f"The individual holds strong actionable remedies under Indian law.",
                defense_strategy=f"Issue a formal legal representation, highlight procedural non-compliance under BNSS/CrPC, and petition the High Court under Article 226 or Section 528 BNSS / 482 CrPC.",
                prosecution_strengths=f"Opposing side may rely on formal statutory registration or disputed questions of fact requiring trial."
            )

        return ReasoningOutput(
            analysis=irac,
            applicable_sections=applicable_sections_formatted,
            breakthroughs=breakthroughs
        )
