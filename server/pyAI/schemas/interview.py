# schemas/interview.py
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ChatMessage(BaseModel):
    sender: str
    text: str
    state: Optional[Dict[str, Any]] = None

class InterviewRequest(BaseModel):
    history: List[ChatMessage] = []
    cv_analysis_result: Optional[Dict[str, Any]] = None
    state: Optional[Dict[str, Any]] = None