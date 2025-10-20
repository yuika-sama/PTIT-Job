#!/usr/bin/env python3
# simple_server.py - Minimal FastAPI server for testing

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    sender: str
    text: str
    state: Optional[Dict[str, Any]] = None

class InterviewRequest(BaseModel):
    history: List[ChatMessage] = []
    cv_analysis_result: Optional[Dict[str, Any]] = None

@app.get("/")
async def root():
    return {"message": "Simple Interview API Running!"}

@app.post("/api/v1/evaluate-cv")
async def mock_evaluate_cv(file: UploadFile = File(...), jd_text: str = Form(...)):
    print(f"[DEBUG] CV upload: {file.filename}, JD: {jd_text[:50]}...")
    # Mock CV analysis response
    return {
        "candidate": {"name": "Nguyễn Văn A"},
        "experiences": [
            {"title": "Software Developer", "organization": "Tech Corp", "raw": "Software Developer at Tech Corp"}
        ],
        "education": [
            {"degree": "Bachelor", "field": "Computer Science", "institution": "University"}
        ],
        "skills": {
            "hard": ["Python", "React", "JavaScript"],
            "tools": ["Git", "Docker"],
            "soft": ["Teamwork", "Communication"]
        },
        "matching": {
            "skills_matched": ["Python", "React", "JavaScript"],
            "skills_missing": ["Docker", "Kubernetes"]
        },
        "scoring": {
            "overall_score_percent": 85.5,
            "skill_coverage_percent": 75.0,
            "semantic_similarity_percent": 80.0
        },
        "analysis": "Good candidate with strong technical skills"
    }

@app.post("/api/v1/interview")
async def simple_interview(request: InterviewRequest):
    print(f"[DEBUG] Received interview request with {len(request.history)} messages")
    
    # Simple mock response
    if not request.history:  # First message
        response = "Hello! I'm excited to interview you today. Let's start with a simple question: Can you tell me about yourself and your background?"
        return {
            "response": response,
            "finished": False,
            "state": {"question_count": 1},
            "progress": {"current": 1, "total": 3}
        }
    elif len(request.history) < 4:  # Continue interview
        responses = [
            "That's interesting! What programming languages are you most comfortable with?",
            "Great! Can you describe a challenging project you've worked on recently?",
            "Excellent! What are your career goals for the next few years?"
        ]
        response = responses[len(request.history) // 2]
        return {
            "response": response,
            "finished": False,
            "state": {"question_count": len(request.history) // 2 + 1},
            "progress": {"current": len(request.history) // 2 + 1, "total": 3}
        }
    else:  # End interview
        return {
            "response": "Thank you for the great interview! Here's your assessment:\n- Technical Skills: **85%**\n- Communication: **90%**\n\n### Final Score: **87.5%**",
            "finished": True,
            "final_score": 87.5,
            "breakdown": {"cv_score": 85, "interview_score": 90}
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)