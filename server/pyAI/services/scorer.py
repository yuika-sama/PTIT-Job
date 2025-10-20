# services/scorer.py
from typing import Dict, List, Tuple, Set
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import util

from services.models import embedding_model, nlp
from services.cv_parser import extract_skills


def jd_skills_from_text(jd_text: str) -> Set[str]:
    doc = nlp(jd_text)
    skills = extract_skills(doc)
    return {skill for skill_list in skills.values() for skill in skill_list}


def skill_coverage(cv_skills: Dict[str, List[str]], jd_required: Set[str]) -> Tuple[float, List[str], List[str]]:
    cv_all = {skill for skill_list in cv_skills.values() for skill in skill_list}
    matched = sorted(list(cv_all.intersection(jd_required)))
    missing = sorted(list(jd_required.difference(cv_all)))
    coverage = len(matched) / max(1, len(jd_required))
    return coverage, matched, missing


def tfidf_similarity(cv_text: str, jd_text: str) -> float:
    vec = TfidfVectorizer(stop_words='english')
    tfidf = vec.fit_transform([cv_text, jd_text])
    return float(cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0])


def semantic_similarity(cv_text: str, jd_text: str) -> float:
    emb_cv = embedding_model.encode(cv_text, convert_to_tensor=True)
    emb_jd = embedding_model.encode(jd_text, convert_to_tensor=True)
    sim = util.cos_sim(emb_cv, emb_jd).item()
    return (sim + 1) / 2  # Normalize to [0, 1]


def weighted_score(tfidf: float, semantic: float, coverage: float) -> float:
    return (0.25 * tfidf + 0.45 * semantic + 0.30 * coverage) * 100


def analyze_cv_comprehensively(overall_score: float, matched_skills: List[str], missing_skills: List[str]) -> Dict:
    strengths, improvements = [], []
    if len(matched_skills) >= 5:
        strengths.append(f"Strong alignment with job requirements, matching {len(matched_skills)} key skills.")
    if overall_score > 75:
        strengths.append("Excellent overall match based on content and semantics.")
    if missing_skills:
        improvements.append(f"Consider highlighting or acquiring skills like: {', '.join(missing_skills[:3])}.")
    if overall_score < 50:
        improvements.append("Refine CV content to better match the job description's keywords and focus.")

    return {
        "strengths": strengths if strengths else ["Good starting point for this role."],
        "improvements": improvements if improvements else [
            "The CV is well-aligned, minor tweaks could improve keyword matching."],
        "recommendations": ["Showcase projects that used matched skills.",
                            "Quantify achievements in experience descriptions."]
    }