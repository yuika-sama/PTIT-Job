# api/cv.py
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from typing import Optional
import fitz

from services import cv_parser, scorer
from services.models import nlp

router = APIRouter()


@router.post("/evaluate-cv")
async def evaluate_cv_endpoint(
        file: UploadFile = File(...),
        jd_text: str = Form(...),
        jd_skills: Optional[str] = Form(None)
):
    try:
        pdf_content = await file.read()
        doc = fitz.open(stream=pdf_content, filetype="pdf")
        raw_text = "".join(page.get_text() for page in doc)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading PDF file: {e}")

    cv_text = cv_parser.clean_text(raw_text)
    if not cv_text:
        raise HTTPException(status_code=400, detail="Could not extract text from CV.")

    # --- Parsing ---
    cv_doc = nlp(cv_text)
    contacts = cv_parser.extract_contacts(cv_doc)
    candidate_name = cv_parser.extract_name(cv_doc)
    cv_skills = cv_parser.extract_skills(cv_doc)
    sections = cv_parser.split_sections(cv_text)
    exp_text = sections.get("experience", "") or sections.get("work experience", "")
    experiences = cv_parser.extract_experience_blocks(exp_text or cv_text)
    edu_text = sections.get("education", "") or sections.get("academic background", "")
    education = cv_parser.extract_education(edu_text)

    # --- Scoring ---
    jd_skill_set = {s.strip().lower() for s in jd_skills.split(",")} if jd_skills else scorer.jd_skills_from_text(
        jd_text)
    coverage, matched, missing = scorer.skill_coverage(cv_skills, jd_skill_set)
    tfidf = scorer.tfidf_similarity(cv_text, jd_text)
    semantic = scorer.semantic_similarity(cv_text, jd_text)
    overall_score = scorer.weighted_score(tfidf, semantic, coverage)

    analysis = scorer.analyze_cv_comprehensively(overall_score, matched, missing)

    return {
        "candidate": {"name": candidate_name, "contacts": contacts},
        "experiences": experiences,
        "education": education,
        "skills": cv_skills,
        "matching": {"skills_matched": matched, "skills_missing": missing},
        "scoring": {
            "overall_score_percent": round(overall_score, 2),
            "skill_coverage_percent": round(coverage * 100, 2),
            "semantic_similarity_percent": round(semantic * 100, 2),
        },
        "analysis": analysis
    }


@router.get("/")
def checkHealth():
    try:
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading PDF file: {e}")