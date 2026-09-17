from enum import Enum
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class StageStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    DONE = "done"
    FAILED = "failed"

class UserPersona(str, Enum):
    ADVOCATE = "advocate"
    CITIZEN = "citizen"

class Citation(BaseModel):
    source_id: str
    title: str
    act_name: str = Field(default="Constitution of India", description="e.g., BNS/IPC, BNSS/CrPC, Constitution")
    section_or_article: str = Field(default="Section/Article", description="Specific section or article number")
    text_snippet: str
    relevance_score: float

class CaseBreakthrough(BaseModel):
    category: str = Field(description="Procedural Flaw | Evidentiary Gap | Constitutional Shield | Winning Precedent | Cross-Examination Angle")
    title: str
    impact_level: str = Field(description="High | Medium | Critical")
    description: str
    statutory_basis: str = Field(description="Governing section or article (e.g. Sec 41A CrPC / 35 BNSS, Art 21)")
    tactical_advantage: str = Field(description="How to leverage this in court or representation")

class QueryIntakeInput(BaseModel):
    raw_query: str
    persona: UserPersona = UserPersona.ADVOCATE
    image_data: Optional[List[str]] = Field(default=None, description="Base64 encoded image strings or image file text")
    document_attachments: Optional[List[str]] = Field(default=None, description="List of document text attachments")

class QueryIntakeOutput(BaseModel):
    normalized_query: str
    persona: UserPersona
    domain: str = Field(description="e.g. Constitutional, Criminal, Civil, Corporate, Family")
    entities: List[str] = Field(description="Extracted entities, sections, and case numbers")
    identified_sections: List[str] = Field(default_factory=list, description="Sections like BNS 103, IPC 302, CrPC 437, Art 21")
    document_summary: Optional[str] = None
    has_visual_evidence: bool = False

class PlanningInput(BaseModel):
    intake: QueryIntakeOutput

class SubTask(BaseModel):
    task_id: str
    description: str
    task_type: str = Field(description="retrieve_statute | retrieve_case | analyze_breakthroughs | procedural_audit")

class PlanningOutput(BaseModel):
    sub_tasks: List[SubTask]

class TaskAllocationInput(BaseModel):
    plan: PlanningOutput

class TaskAllocationOutput(BaseModel):
    allocations: Dict[str, str]
    execution_order: List[List[str]]

class RetrievalInput(BaseModel):
    sub_tasks: List[SubTask]
    intake: QueryIntakeOutput

class RetrievalOutput(BaseModel):
    retrieved_documents: List[Citation]
    graph_context: str
    relevant_statutes: List[Dict[str, Any]] = Field(default_factory=list)

class ReasoningInput(BaseModel):
    intake: QueryIntakeOutput
    retrieval: RetrievalOutput

class IRACAnalysis(BaseModel):
    issue: str
    rule: str
    application: str
    conclusion: str
    defense_strategy: Optional[str] = None
    prosecution_strengths: Optional[str] = None

class ReasoningOutput(BaseModel):
    analysis: IRACAnalysis
    applicable_sections: List[Dict[str, str]] = Field(default_factory=list)
    breakthroughs: List[CaseBreakthrough] = Field(default_factory=list)

class ExplainabilityInput(BaseModel):
    reasoning: ReasoningOutput
    retrieval: RetrievalOutput
    persona: UserPersona

class ExplainabilityOutput(BaseModel):
    reasoning_steps: List[str]
    plain_language_summary: str
    key_articles_cited: List[str]
    advocate_action_plan: Optional[List[str]] = None
    citizen_guidance: Optional[List[str]] = None

class TrustInput(BaseModel):
    reasoning: ReasoningOutput
    retrieval: RetrievalOutput

class TrustOutput(BaseModel):
    overall_score: float
    source_grounding: float
    hallucination_risk: float
    jurisdictional_relevance: float
    confidence_level: str

class DecisionInput(BaseModel):
    reasoning: ReasoningOutput
    trust: TrustOutput
    explainability: ExplainabilityOutput
    persona: UserPersona

class RecommendationOption(BaseModel):
    title: str
    description: str
    pros: List[str]
    cons: List[str]
    risk_level: str
    estimated_timeline: Optional[str] = None

class DecisionOutput(BaseModel):
    primary_recommendation: str
    alternatives: List[RecommendationOption]
    breakthroughs_summary: List[CaseBreakthrough]
    disclaimers: List[str]

class FeedbackInput(BaseModel):
    decision: DecisionOutput
    user_action: str
    correction: Optional[str] = None

class FeedbackOutput(BaseModel):
    feedback_applied: bool
    adjusted_recommendation: Optional[str] = None

class FinalRecommendation(BaseModel):
    query: str
    persona: str = "advocate"
    domain: str
    summary: str
    detailed_analysis: str
    applicable_articles: List[Dict[str, Any]]
    identified_sections: List[Dict[str, Any]] = Field(default_factory=list)
    breakthroughs: List[Dict[str, Any]] = Field(default_factory=list)
    explainability: Dict[str, Any]
    trust_metrics: Dict[str, Any]
    recommended_actions: List[str]
    disclaimers: List[str]
    processing_time_ms: int
    timestamp: int

class PipelineState(BaseModel):
    query_id: str
    persona: UserPersona = UserPersona.ADVOCATE
    status: Dict[str, StageStatus] = Field(default_factory=dict)
    intake: Optional[QueryIntakeOutput] = None
    planning: Optional[PlanningOutput] = None
    allocation: Optional[TaskAllocationOutput] = None
    retrieval: Optional[RetrievalOutput] = None
    reasoning: Optional[ReasoningOutput] = None
    explainability: Optional[ExplainabilityOutput] = None
    trust: Optional[TrustOutput] = None
    decision: Optional[DecisionOutput] = None
    feedback: Optional[FeedbackOutput] = None
    final_output: Optional[FinalRecommendation] = None
