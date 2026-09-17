import uuid
from typing import List
from models.schemas import PlanningInput, PlanningOutput, SubTask
from agents.base import PipelineStage

class PlanningAgentStage(PipelineStage):
    """
    Stage 2: Planning Agent
    Decomposes the query intake into structured sub-tasks:
    - Statute and Constitutional provision retrieval
    - Landmark judicial precedent and case law lookup
    - Limitation, locus standi, or procedural prerequisites check
    """

    @property
    def stage_id(self) -> str:
        return "planning"

    @property
    def stage_name(self) -> str:
        return "Planning Agent"

    async def process(self, input_data: PlanningInput) -> PlanningOutput:
        intake = input_data.intake
        sub_tasks: List[SubTask] = []
        
        # Sub-task 1: Statute Retrieval
        sub_tasks.append(SubTask(
            task_id=f"task_statute_{uuid.uuid4().hex[:6]}",
            description=f"Identify governing constitutional articles and statutes for domain '{intake.domain}' related to: {', '.join(intake.entities)}",
            task_type="retrieve_statute"
        ))

        # Sub-task 2: Case Law & Precedent Lookup
        sub_tasks.append(SubTask(
            task_id=f"task_case_{uuid.uuid4().hex[:6]}",
            description=f"Retrieve landmark Supreme Court and High Court precedents interpreting {', '.join(intake.entities)} and check for overruling status",
            task_type="retrieve_case"
        ))

        # Sub-task 3: Legal Principle & Standard Application
        sub_tasks.append(SubTask(
            task_id=f"task_doctrine_{uuid.uuid4().hex[:6]}",
            description=f"Evaluate applicable tests (e.g., proportionality, reasonable classification, natural justice) in the context of '{intake.normalized_query}'",
            task_type="analyze_principle"
        ))

        return PlanningOutput(sub_tasks=sub_tasks)
