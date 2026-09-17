from typing import Dict, List
from models.schemas import TaskAllocationInput, TaskAllocationOutput
from agents.base import PipelineStage

class TaskAllocationAgentStage(PipelineStage):
    """
    Stage 3: Task Allocation Agent
    Assigns each sub-task to the appropriate retrieval/engine backend
    and establishes execution order and concurrency groups.
    """

    @property
    def stage_id(self) -> str:
        return "task_allocation"

    @property
    def stage_name(self) -> str:
        return "Task Allocation Agent"

    async def process(self, input_data: TaskAllocationInput) -> TaskAllocationOutput:
        allocations: Dict[str, str] = {}
        batch_1: List[str] = [] # Can run in parallel
        batch_2: List[str] = [] # Dependent tasks

        for task in input_data.plan.sub_tasks:
            if task.task_type == "retrieve_statute":
                allocations[task.task_id] = "FAISS_Vector_Store + Constitution_Parser"
                batch_1.append(task.task_id)
            elif task.task_type == "retrieve_case":
                allocations[task.task_id] = "NetworkX_Legal_Knowledge_Graph"
                batch_1.append(task.task_id)
            else:
                allocations[task.task_id] = "Legal_Reasoning_Engine (IRAC)"
                batch_2.append(task.task_id)

        execution_order = []
        if batch_1:
            execution_order.append(batch_1)
        if batch_2:
            execution_order.append(batch_2)

        return TaskAllocationOutput(
            allocations=allocations,
            execution_order=execution_order
        )
