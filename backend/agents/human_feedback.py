import time
from typing import Optional, Dict, Any, List
from models.schemas import FeedbackInput, FeedbackOutput
from agents.base import PipelineStage

class HumanFeedbackStage(PipelineStage):
    """
    Stage 11: Human Feedback Module
    Enables lawyer-in-the-loop validation:
    - Accepts, edits, or rejects generated legal recommendations
    - Logs structured feedback for continuous refinement of retrieval ranking
    """

    def __init__(self):
        self.feedback_log: List[Dict[str, Any]] = []

    @property
    def stage_id(self) -> str:
        return "human_feedback"

    @property
    def stage_name(self) -> str:
        return "Human Feedback Module"

    async def process(self, input_data: FeedbackInput) -> FeedbackOutput:
        action = input_data.user_action.lower()
        decision = input_data.decision
        
        log_entry = {
            "timestamp": time.time(),
            "action": action,
            "correction": input_data.correction,
            "original_rec": decision.primary_recommendation
        }
        self.feedback_log.append(log_entry)
        
        adjusted_text = None
        if action == "edit" and input_data.correction:
            adjusted_text = f"Lawyer-Verified Amendment: {input_data.correction}\n\nUnderlying Framework: {decision.primary_recommendation}"
        elif action == "reject":
            adjusted_text = f"Recommendation flagged for manual senior jurist review. Caveat: {input_data.correction or 'User flagged discrepancy.'}"

        return FeedbackOutput(
            feedback_applied=True,
            adjusted_recommendation=adjusted_text
        )

# Global singleton instance
feedback_manager = HumanFeedbackStage()
