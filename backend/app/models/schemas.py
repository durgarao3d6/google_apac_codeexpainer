from pydantic import BaseModel
from typing import Optional, List

class ExplanationRequest(BaseModel):
    code: str
    language: str

class ExplanationStep(BaseModel):
    title: str
    description: str

class ExplanationResponse(BaseModel):
    summary: str
    steps: List[ExplanationStep]
    notes: Optional[str] = None
