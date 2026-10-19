# services/scorer.py
from typing import Dict, List, Tuple, Set, Any
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import util

from services.models import embedding_model, nlp
from services.cv_parser import extract_skills, clean_text
from utils.constants import SKILL_ALIASES


def jd_skills_from_text(jd_text: str) -> Set[str]:
    """
    Trích xuất toàn bộ kỹ năng xuất hiện trong Job Description (JD).
    """
    cleaned = clean_text(jd_text)
    doc = nlp(cleaned)
    skills = extract_skills(doc)
    all_skills = set()
    for skill_list in skills.values():
        for skill in skill_list:
            canonical = SKILL_ALIASES.get(skill.lower(), skill.lower())
            all_skills.add(canonical)
    return all_skills


def skill_coverage(cv_skills: Dict[str, List[str]], jd_required: Set[str]) -> Tuple[float, List[str], List[str]]:
    """
    Đo lường mức độ bao phủ kỹ năng giữa CV và JD.
    Trả về: (coverage_ratio, matched_skills, missing_skills)
    """
    cv_all = set()
    for skill_list in cv_skills.values():
        for skill in skill_list:
            canonical = SKILL_ALIASES.get(skill.lower(), skill.lower())
            cv_all.add(canonical)

    if not jd_required:
        # Nếu JD không có yêu cầu cụ thể, tính theo số lượng kỹ năng thực tế của ứng viên
        matched = sorted(list(cv_all))
        coverage = min(1.0, len(matched) / 8.0) if matched else 0.5
        return coverage, matched, []

    matched = sorted(list(cv_all.intersection(jd_required)))
    missing = sorted(list(jd_required.difference(cv_all)))
    coverage = len(matched) / len(jd_required)

    return min(1.0, coverage), matched, missing


def tfidf_similarity(cv_text: str, jd_text: str) -> float:
    """
    Tính tương đồng TF-IDF từ vựng, hỗ trợ tốt cả tiếng Việt và các từ khóa kỹ thuật.
    """
    try:
        vec = TfidfVectorizer(
            ngram_range=(1, 2),
            token_pattern=r"(?u)\b[\w\+\#\.]+\b",
            min_df=1
        )
        tfidf = vec.fit_transform([cv_text, jd_text])
        sim = float(cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0])
        return max(0.0, min(1.0, sim))
    except Exception:
        return 0.0


def _chunk_text(text: str, max_chunk_words: int = 150) -> List[str]:
    """
    Chia nhỏ văn bản thành các đoạn hợp lý để tránh bị mô hình Transformer cắt bớt (truncate).
    """
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks = []
    current_chunk = []
    current_words = 0

    for para in paragraphs:
        para_words = len(para.split())
        if current_words + para_words > max_chunk_words and current_chunk:
            chunks.append(" ".join(current_chunk))
            current_chunk = [para]
            current_words = para_words
        else:
            current_chunk.append(para)
            current_words += para_words

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks or [text[:1000]]


def semantic_similarity(cv_text: str, jd_text: str) -> float:
    """
    Tính tương đồng ngữ nghĩa bằng Sentence Transformer đa khối (Chunk-pooled):
    So khớp từng phần quan trọng của CV với JD để không bị mất thông tin do token truncation.
    Chuẩn hóa cosine similarity từ khoảng thực tế [0.15, 0.75] sang [0.0, 1.0].
    """
    try:
        cv_chunks = _chunk_text(cv_text, max_chunk_words=120)
        jd_chunks = _chunk_text(jd_text, max_chunk_words=120)

        # Giới hạn tối đa 6 chunks tiêu biểu
        cv_chunks = cv_chunks[:6]
        jd_chunks = jd_chunks[:4]

        cv_embeddings = embedding_model.encode(cv_chunks, convert_to_tensor=True)
        jd_embeddings = embedding_model.encode(jd_chunks, convert_to_tensor=True)

        # Ma trận cosine similarity giữa các chunks
        sim_matrix = util.cos_sim(cv_embeddings, jd_embeddings).cpu().numpy()

        # Lấy điểm tốt nhất của mỗi phần trong CV khi so với các yêu cầu của JD
        top_matches = np.max(sim_matrix, axis=1)
        raw_sim = float(np.mean(top_matches))

        # Re-scale cosine: 0.15 (không liên quan) -> 0.0; 0.75 (khớp cao) -> 1.0
        normalized_sim = (raw_sim - 0.15) / 0.60
        return max(0.0, min(1.0, normalized_sim))
    except Exception:
        # Fallback nếu gặp lỗi bộ nhớ hoặc tensor
        try:
            emb_cv = embedding_model.encode(cv_text[:600], convert_to_tensor=True)
            emb_jd = embedding_model.encode(jd_text[:600], convert_to_tensor=True)
            sim = util.cos_sim(emb_cv, emb_jd).item()
            return max(0.0, min(1.0, (sim - 0.15) / 0.60))
        except Exception:
            return 0.5


def weighted_score(tfidf: float, semantic: float, coverage: float) -> float:
    """
    Tính điểm tổng hợp (%):
    - Độ bao phủ kỹ năng (Coverage): 45%
    - Mức độ phù hợp ngữ nghĩa sâu (Semantic): 45%
    - Trùng khớp từ khóa & thuật ngữ (TF-IDF chuẩn hóa): 10%
    """
    # TF-IDF thực tế giữa CV và JD thường dao động từ 0.10 - 0.45 do khác biệt cấu trúc văn bản
    normalized_tfidf = min(1.0, tfidf * 2.0)
    score = (0.45 * coverage + 0.45 * semantic + 0.10 * normalized_tfidf) * 100
    return max(0.0, min(100.0, score))


def analyze_cv_comprehensively(overall_score: float, matched_skills: List[str], missing_skills: List[str]) -> Dict[str, Any]:
    """
    Tạo báo cáo phân tích chi tiết, mang tính định hướng thực tiễn và chuyên nghiệp.
    """
    strengths, improvements, recommendations = [], [], []

    # 1. Strengths
    if len(matched_skills) >= 6:
        strengths.append(f"Hồ sơ sở hữu độ khớp kỹ năng kỹ thuật rất cao ({len(matched_skills)} kỹ năng khớp): {', '.join(matched_skills[:5])}...")
    elif len(matched_skills) >= 3:
        strengths.append(f"Có nền tảng vững chắc ở các công nghệ cốt lõi: {', '.join(matched_skills)}.")
    else:
        strengths.append("Hồ sơ thể hiện tinh thần sẵn sàng học hỏi và tiếp thu công nghệ mới.")

    if overall_score >= 80:
        strengths.append("Ngữ cảnh kinh nghiệm và định hướng công việc rất tương thích với yêu cầu của vị trí tuyển dụng.")
    elif overall_score >= 60:
        strengths.append("Tổng thể hồ sơ đáp ứng tốt phần lớn các yêu cầu then chốt của công việc.")

    # 2. Improvements
    if missing_skills:
        key_missing = missing_skills[:4]
        improvements.append(f"Cân nhắc bổ sung hoặc nhấn mạnh hơn các kỹ năng quan trọng còn thiếu: {', '.join(key_missing)}.")

    if overall_score < 65:
        improvements.append("Cần tối ưu lại các mô tả dự án trong CV sát hơn với từ khóa và công nghệ yêu cầu trong Job Description.")

    improvements.append("Nên định lượng các thành tích đạt được trong công việc (ví dụ: tối ưu hiệu năng bao nhiêu %, phục vụ bao nhiêu người dùng).")

    # 3. Recommendations
    recommendations.append("Chuẩn bị kỹ các tình huống thực tế và ví dụ dự án cho các kỹ năng đã khớp khi tham gia phỏng vấn.")
    recommendations.append("Sử dụng mô hình STAR (Situation - Task - Action - Result) khi trả lời các câu hỏi về kinh nghiệm làm việc.")
    if missing_skills:
        recommendations.append(f"Tìm hiểu tổng quan về {missing_skills[0]} trước buổi phỏng vấn để thể hiện sự chủ động.")

    # Rating tag
    if overall_score >= 80:
        fit_level = "Xuất sắc (Strong Fit)"
    elif overall_score >= 65:
        fit_level = "Phù hợp (Good Fit)"
    elif overall_score >= 50:
        fit_level = "Tiềm năng (Potential Fit)"
    else:
        fit_level = "Cần cải thiện (Needs Development)"

    return {
        "fit_level": fit_level,
        "strengths": strengths,
        "improvements": improvements,
        "recommendations": recommendations
    }