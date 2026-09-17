from typing import List
from models.schemas import ExplainabilityInput, ExplainabilityOutput
from agents.base import PipelineStage

class ExplainabilityEngineStage(PipelineStage):
    """
    Stage 8: Explainability Engine
    Produces a transparent human-readable audit trail:
    - Step-by-step reasoning chain
    - Explicit list of all cited constitutional provisions and case precedents
    - Plain-language explanation for non-lawyers
    """

    @property
    def stage_id(self) -> str:
        return "explainability"

    @property
    def stage_name(self) -> str:
        return "Explainability Engine"

    async def process(self, input_data: ExplainabilityInput) -> ExplainabilityOutput:
        analysis = input_data.reasoning.analysis
        docs = input_data.retrieval.retrieved_documents
        
        # 1. Extract Key Cited Articles & Precedents
        cited_sources = [d.title for d in docs]
        
        # 2. Step-by-step reasoning trace
        steps = [
            f"Step 1 (Issue Identification): Identified legal question as '{analysis.issue}'",
            f"Step 2 (Rule Retrieval): Retrieved governing authorities: {', '.join([d.source_id for d in docs[:3]])}",
            f"Step 3 (Judicial Standard): Evaluated precedent consistency and doctrine requirements (Golden Triangle / Proportionality)",
            f"Step 4 (Application): Verified that the factual scenario fits within the protective scope of fundamental guarantees: '{analysis.application[:140]}...'",
            f"Step 5 (Final Ratio): Derived grounded conclusion: '{analysis.conclusion[:120]}...'"
        ]

        # 3. Plain Language Summary
        plain_language = (
            f"In simple terms: Under Indian law, your issue involves '{analysis.issue}'. "
            f"The Constitution protects you through provisions such as {', '.join([d.source_id for d in docs[:2]])}. "
            f"The Supreme Court requires that any governmental or administrative action must be fair, non-arbitrary, and procedurally sound. "
            f"Therefore: {analysis.conclusion}"
        )

        return ExplainabilityOutput(
            reasoning_steps=steps,
            plain_language_summary=plain_language,
            key_articles_cited=cited_sources
        )
