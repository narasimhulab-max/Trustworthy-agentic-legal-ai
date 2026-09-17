from abc import ABC, abstractmethod
from pydantic import BaseModel

class PipelineStage(ABC):
    """
    Abstract base class for all NyayaAI pipeline stages.
    Enforces typed I/O contracts via Pydantic models.
    """
    
    @property
    @abstractmethod
    def stage_id(self) -> str:
        """Unique identifier for the stage (e.g., 'planning')"""
        pass
        
    @property
    @abstractmethod
    def stage_name(self) -> str:
        """Human-readable name for the stage (e.g., 'Planning Agent')"""
        pass

    @abstractmethod
    async def process(self, *args, **kwargs) -> BaseModel:
        """
        Executes the stage logic.
        Must return a valid Pydantic model corresponding to the stage's output schema.
        """
        pass
