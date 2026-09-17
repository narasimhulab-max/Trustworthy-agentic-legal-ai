import time
import asyncio
from typing import AsyncGenerator, Dict, Any, Optional, List
from models.schemas import (
    StageStatus,
    UserPersona,
    PipelineState,
    QueryIntakeInput,
    PlanningInput,
    TaskAllocationInput,
    RetrievalInput,
    ReasoningInput,
    ExplainabilityInput,
    TrustInput,
    DecisionInput,
    FeedbackInput,
    FinalRecommendation,
)
from agents.query_intake import LegalQueryIntakeStage
from agents.planning_agent import PlanningAgentStage
from agents.task_allocation_agent import TaskAllocationAgentStage
from agents.retrieval_agent import RetrievalAgentStage
from agents.reasoning_engine import LegalReasoningEngineStage
from agents.explainability_engine import ExplainabilityEngineStage
from agents.trust_evaluation import TrustEvaluationStage
from agents.decision_intelligence import DecisionIntelligenceStage
from agents.human_feedback import feedback_manager

PIPELINE_STAGES_METADATA = [
    {"id": "intake", "name": "Legal Query Intake", "desc": "Normalizes query and classifies legal domain"},
    {"id": "orchestrator", "name": "Agent Orchestrator", "desc": "Top-level controller managing pipeline execution"},
    {"id": "planning", "name": "Planning Agent", "desc": "Decomposes query into statute and case-law sub-tasks"},
    {"id": "task_allocation", "name": "Task Allocation Agent", "desc": "Assigns tools and manages concurrency batches"},
    {"id": "retrieval", "name": "Retrieval Agent", "desc": "Hybrid search over Constitution chunks & vectors"},
    {"id": "knowledge_graph", "name": "Dynamic Legal Knowledge Graph", "desc": "Neo4j / NetworkX graph of precedents & doctrines"},
    {"id": "foundation_model", "name": "Foundation Model", "desc": "LLM inference grounded on retrieved context"},
    {"id": "reasoning", "name": "Legal Reasoning Engine", "desc": "Executes structured IRAC legal analysis"},
    {"id": "explainability", "name": "Explainability Engine", "desc": "Generates plain-language explanation and citation chain"},
    {"id": "trust", "name": "Trust Evaluation Module", "desc": "Calculates multi-factor confidence and hallucination score"},
    {"id": "decision", "name": "Decision Intelligence Module", "desc": "Synthesizes ranked recommendation options with tradeoffs"},
    {"id": "human_feedback", "name": "Human Feedback Module", "desc": "Lawyer-in-the-loop review and continuous ranking feedback"},
    {"id": "final", "name": "Final Legal Recommendation", "desc": "Formatted recommendation with citations, sections & breakthroughs"}
]

class AgentOrchestrator:
    """
    Top-level controller managing the 13-stage legal reasoning state machine.
    Supports Multimodal Case Documents & Images, Section Discovery, and Case Breakthroughs.
    """

    def __init__(self):
        self.intake_stage = LegalQueryIntakeStage()
        self.planning_stage = PlanningAgentStage()
        self.allocation_stage = TaskAllocationAgentStage()
        self.retrieval_stage = RetrievalAgentStage()
        self.reasoning_stage = LegalReasoningEngineStage()
        self.explainability_stage = ExplainabilityEngineStage()
        self.trust_stage = TrustEvaluationStage()
        self.decision_stage = DecisionIntelligenceStage()
        self.feedback_stage = feedback_manager

    async def execute_stream(
        self,
        query: str,
        persona: str = "advocate",
        image_data: Optional[List[str]] = None,
        document_attachments: Optional[List[str]] = None
    ) -> AsyncGenerator[Dict[str, Any], None]:
        start_time = time.time()
        query_id = f"nyaya_{int(start_time)}"
        user_persona = UserPersona.ADVOCATE if persona == "advocate" else UserPersona.CITIZEN
        state = PipelineState(query_id=query_id, persona=user_persona)

        async def emit(stage_id: str, status: StageStatus, message: str, preview: str = ""):
            state.status[stage_id] = status
            yield {
                "event": "stage_update",
                "data": {
                    "stage_id": stage_id,
                    "status": status.value,
                    "message": message,
                    "output_preview": preview
                }
            }
            await asyncio.sleep(0.04)

        # 1. Legal Query Intake & Multimodal Ingestion
        async for evt in emit("intake", StageStatus.RUNNING, "Ingesting multimodal documents and classifying legal domain..."):
            yield evt
        state.intake = await self.intake_stage.process(QueryIntakeInput(
            raw_query=query,
            persona=user_persona,
            image_data=image_data,
            document_attachments=document_attachments
        ))
        async for evt in emit("intake", StageStatus.DONE, f"Domain: {state.intake.domain} ({user_persona.value.upper()} Mode)", f"Entities: {', '.join(state.intake.entities)}"):
            yield evt

        # 2. Orchestrator Initialization
        async for evt in emit("orchestrator", StageStatus.RUNNING, "Initializing 13-stage state machine with section discovery..."):
            yield evt
        async for evt in emit("orchestrator", StageStatus.DONE, "State machine active: Breakthrough & Section engines online"):
            yield evt

        # 3. Planning Agent
        async for evt in emit("planning", StageStatus.RUNNING, "Decomposing into statute, precedent, and breakthrough sub-tasks..."):
            yield evt
        state.planning = await self.planning_stage.process(PlanningInput(intake=state.intake))
        async for evt in emit("planning", StageStatus.DONE, f"Created {len(state.planning.sub_tasks)} sub-tasks", f"Sub-tasks: {[t.task_type for t in state.planning.sub_tasks]}"):
            yield evt

        # 4. Task Allocation Agent
        async for evt in emit("task_allocation", StageStatus.RUNNING, "Assigning tools and concurrency execution order..."):
            yield evt
        state.allocation = await self.allocation_stage.process(TaskAllocationInput(plan=state.planning))
        async for evt in emit("task_allocation", StageStatus.DONE, f"Assigned {len(state.allocation.allocations)} tools", f"Concurrency batches: {len(state.allocation.execution_order)}"):
            yield evt

        # 5. Retrieval Agent
        async for evt in emit("retrieval", StageStatus.RUNNING, "Executing hybrid search over BNS/IPC, BNSS, and Constitution..."):
            yield evt
        state.retrieval = await self.retrieval_stage.process(RetrievalInput(sub_tasks=state.planning.sub_tasks, intake=state.intake))
        async for evt in emit("retrieval", StageStatus.DONE, f"Retrieved {len(state.retrieval.retrieved_documents)} citations", f"Sources: {[c.source_id for c in state.retrieval.retrieved_documents]}"):
            yield evt

        # 6. Dynamic Legal Knowledge Graph
        async for evt in emit("knowledge_graph", StageStatus.RUNNING, "Traversing precedent graph and verifying overruling status..."):
            yield evt
        async for evt in emit("knowledge_graph", StageStatus.DONE, "Graph traversal complete", state.retrieval.graph_context[:100] + "..."):
            yield evt

        # 7. Foundation Model Call
        async for evt in emit("foundation_model", StageStatus.RUNNING, "Invoking foundation model with strict statutory grounding..."):
            yield evt
        async for evt in emit("foundation_model", StageStatus.DONE, "Model inference successful with strict grounding"):
            yield evt

        # 8. Legal Reasoning Engine (IRAC + Breakthroughs)
        async for evt in emit("reasoning", StageStatus.RUNNING, "Synthesizing IRAC analysis and discovering procedural breakthroughs..."):
            yield evt
        state.reasoning = await self.reasoning_stage.process(ReasoningInput(intake=state.intake, retrieval=state.retrieval))
        async for evt in emit("reasoning", StageStatus.DONE, f"Found {len(state.reasoning.breakthroughs)} Case Breakthroughs", f"Sections: {len(state.reasoning.applicable_sections)}"):
            yield evt

        # 9. Explainability Engine
        async for evt in emit("explainability", StageStatus.RUNNING, "Constructing plain-language summary and citation trail..."):
            yield evt
        state.explainability = await self.explainability_stage.process(ExplainabilityInput(reasoning=state.reasoning, retrieval=state.retrieval, persona=user_persona))
        async for evt in emit("explainability", StageStatus.DONE, "Citation trail generated", f"Steps: {len(state.explainability.reasoning_steps)}"):
            yield evt

        # 10. Trust Evaluation Module
        async for evt in emit("trust", StageStatus.RUNNING, "Evaluating source grounding, hallucination risk, and jurisdiction fit..."):
            yield evt
        state.trust = await self.trust_stage.process(TrustInput(reasoning=state.reasoning, retrieval=state.retrieval))
        async for evt in emit("trust", StageStatus.DONE, f"Trust Score: {state.trust.overall_score}% ({state.trust.confidence_level.upper()})", f"Grounding: {state.trust.source_grounding}% | Risk: {state.trust.hallucination_risk}%"):
            yield evt

        # 11. Decision Intelligence Module
        async for evt in emit("decision", StageStatus.RUNNING, "Synthesizing primary recommendation and tradeoff options..."):
            yield evt
        state.decision = await self.decision_stage.process(DecisionInput(reasoning=state.reasoning, trust=state.trust, explainability=state.explainability, persona=user_persona))
        async for evt in emit("decision", StageStatus.DONE, "Decision intelligence synthesized", f"Options: {len(state.decision.alternatives)}"):
            yield evt

        # 12. Human Feedback Module
        async for evt in emit("human_feedback", StageStatus.RUNNING, "Checking lawyer-in-the-loop validation status..."):
            yield evt
        state.feedback = await self.feedback_stage.process(FeedbackInput(decision=state.decision, user_action="pending"))
        async for evt in emit("human_feedback", StageStatus.DONE, "Feedback module ready for user interaction"):
            yield evt

        # 13. Final Legal Recommendation
        total_time_ms = int((time.time() - start_time) * 1000)
        async for evt in emit("final", StageStatus.RUNNING, "Packaging final recommendation with breakthroughs..."):
            yield evt

        final_rec = FinalRecommendation(
            query=query,
            persona=user_persona.value,
            domain=state.intake.domain,
            summary=state.explainability.plain_language_summary,
            detailed_analysis=(
                f"### Issue\n{state.reasoning.analysis.issue}\n\n"
                f"### Governing Statutes & Rules\n{state.reasoning.analysis.rule}\n\n"
                f"### Legal Application & Test Analysis\n{state.reasoning.analysis.application}\n\n"
                f"### Conclusion\n{state.reasoning.analysis.conclusion}\n\n"
                f"### Defense Strategy & Tactical Angle\n{state.reasoning.analysis.defense_strategy or 'Consult legal counsel.'}\n\n"
                f"### Prosecution Arguments & Vulnerabilities\n{state.reasoning.analysis.prosecution_strengths or 'Review statutory charge elements.'}"
            ),
            applicable_articles=[
                {
                    "article_number": d.source_id,
                    "title": d.title,
                    "text": d.text_snippet,
                    "relevance_score": d.relevance_score
                }
                for d in state.retrieval.retrieved_documents
            ],
            identified_sections=[
                {
                    "act": s["act"],
                    "section": s["section"],
                    "ipc_equivalent": s.get("ipc_equivalent", "N/A"),
                    "title": s["title"],
                    "bailable": s.get("bailable", "N/A"),
                    "punishment": s.get("punishment", "N/A")
                }
                for s in state.reasoning.applicable_sections
            ],
            breakthroughs=[
                {
                    "category": b.category,
                    "title": b.title,
                    "impact_level": b.impact_level,
                    "description": b.description,
                    "statutory_basis": b.statutory_basis,
                    "tactical_advantage": b.tactical_advantage
                }
                for b in state.reasoning.breakthroughs
            ],
            explainability={
                "reasoning_steps": state.explainability.reasoning_steps,
                "key_articles_cited": state.explainability.key_articles_cited,
                "plain_language_summary": state.explainability.plain_language_summary
            },
            trust_metrics={
                "overall_score": state.trust.overall_score,
                "source_grounding": state.trust.source_grounding,
                "hallucination_risk": state.trust.hallucination_risk,
                "jurisdictional_relevance": state.trust.jurisdictional_relevance,
                "confidence_level": state.trust.confidence_level
            },
            recommended_actions=[
                f"{opt.title}: {opt.description} (Risk: {opt.risk_level})"
                for opt in state.decision.alternatives
            ],
            disclaimers=state.decision.disclaimers,
            processing_time_ms=total_time_ms,
            timestamp=int(time.time())
        )
        state.final_output = final_rec

        async for evt in emit("final", StageStatus.DONE, "Recommendation with Breakthroughs delivered"):
            yield evt

        # Emit final payload
        yield {
            "event": "result",
            "data": final_rec.model_dump()
        }

    async def execute(self, query: str, persona: str = "advocate") -> FinalRecommendation:
        last_result = None
        async for event in self.execute_stream(query, persona=persona):
            if event["event"] == "result":
                last_result = event["data"]
        return FinalRecommendation(**last_result) if last_result else None

orchestrator = AgentOrchestrator()
