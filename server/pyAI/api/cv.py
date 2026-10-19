# api/cv.py
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from typing import Optional
import fitz

from services import cv_parser, scorer
from services.models import nlp
from utils.constants import SKILL_ALIASES

router = APIRouter()


@router.post("/evaluate-cv")
async def evaluate_cv_endpoint(
        file: UploadFile = File(...),
        jd_text: str = Form(...),
        jd_skills: Optional[str] = Form(None)
):
    # 1. Validation file input
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Hệ thống hiện tại chỉ hỗ trợ định dạng file PDF.")

    try:
        pdf_content = await file.read()
        if len(pdf_content) > 20 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Dung lượng file vượt quá giới hạn cho phép (tối đa 20MB).")

        doc = fitz.open(stream=pdf_content, filetype="pdf")
        # Sử dụng ngắt dòng giữa các trang để không dính từ cuối trang này với đầu trang sau
        raw_text = "\n".join(page.get_text() for page in doc)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Không thể đọc file PDF: {str(e)}")

    cv_text = cv_parser.clean_text(raw_text)
    if not cv_text or len(cv_text.strip()) < 30:
        raise HTTPException(
            status_code=400,
            detail="Không thể trích xuất văn bản từ CV. Vui lòng đảm bảo file PDF chứa văn bản có thể chọn được (không phải hình ảnh scan) và không bị khóa mật khẩu."
        )

    # 2. Parsing CV sections & candidate information
    cv_doc = nlp(cv_text)
    contacts = cv_parser.extract_contacts(cv_doc)
    candidate_name = cv_parser.extract_name(cv_doc) or "Ứng viên"
    cv_skills = cv_parser.extract_skills(cv_doc)
    sections = cv_parser.split_sections(cv_text)

    # Experience section extraction with fallback
    exp_text = sections.get("experience", "") or sections.get("work experience", "")
    experiences = cv_parser.extract_experience_blocks(exp_text or cv_text)

    # Education section extraction with fallback
    edu_text = sections.get("education", "") or sections.get("academic background", "")
    education = cv_parser.extract_education(edu_text or cv_text)

    # 3. Matching & Scoring Logic
    # Parse JD skills: ưu tiên danh sách người dùng nhập, nếu không có thì trích xuất từ jd_text
    if jd_skills and jd_skills.strip():
        raw_jd_skills = [s.strip().lower() for s in jd_skills.split(",") if s.strip()]
        jd_skill_set = {SKILL_ALIASES.get(s, s) for s in raw_jd_skills}
    else:
        jd_skill_set = scorer.jd_skills_from_text(jd_text)

    coverage, matched, missing = scorer.skill_coverage(cv_skills, jd_skill_set)
    tfidf = scorer.tfidf_similarity(cv_text, jd_text)
    semantic = scorer.semantic_similarity(cv_text, jd_text)
    overall_score = scorer.weighted_score(tfidf, semantic, coverage)

    analysis = scorer.analyze_cv_comprehensively(overall_score, matched, missing)

    # 4. Formatted response (duy trì tương thích 100% với Frontend hiện tại và bổ sung thông tin giá trị)
    return {
        "candidate": {
            "name": candidate_name,
            "contacts": contacts
        },
        "experiences": experiences,
        "education": education,
        "skills": cv_skills,
        "matching": {
            "skills_matched": matched,
            "skills_missing": missing
        },
        "scoring": {
            "overall_score_percent": round(overall_score, 2),
            "skill_coverage_percent": round(coverage * 100, 2),
            "semantic_similarity_percent": round(semantic * 100, 2),
            "tfidf_similarity_percent": round(tfidf * 100, 2)
        },
        "analysis": analysis
    }


@router.get("/")
def checkHealth():
    return {"status": "ok", "service": "AI CV & Interview Evaluation API"}