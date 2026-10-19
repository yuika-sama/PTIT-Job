# services/interview_simulator.py
import re
import random
from typing import List, Dict, Any, Tuple
from sentence_transformers import util

from services.models import embedding_model
from utils.constants import (
    BEHAVIORAL_QUESTIONS, TECH_QUESTION_BANK, EXACT_MEANINGLESS_RESPONSES
)

# Common Stopwords (Vietnamese + English) to filter before keyword intersection
STOPWORDS = {
    # English
    'the', 'a', 'an', 'and', 'or', 'but', 'if', 'while', 'because', 'as', 'until',
    'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'about', 'into',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'shall', 'should', 'can', 'could',
    'this', 'that', 'these', 'those', 'it', 'its', 'they', 'them', 'their',
    'i', 'you', 'he', 'she', 'we', 'my', 'your', 'our', 'what', 'which', 'who',
    # Vietnamese
    'và', 'hoặc', 'nhưng', 'bởi', 'vì', 'do', 'tại', 'nên', 'nếu', 'khi', 'để',
    'với', 'cho', 'như', 'rồi', 'thì', 'là', 'có', 'không', 'chưa', 'đã', 'sẽ',
    'đang', 'vẫn', 'được', 'bị', 'bằng', 'cùng', 'trong', 'ngoài', 'trên', 'dưới',
    'này', 'đó', 'kia', 'ấy', 'các', 'một', 'những', 'của', 'tôi', 'mình', 'em',
    'bạn', 'chúng', 'người', 'cũng', 'rất', 'khá', 'thực', 'sự', 'thế', 'vậy'
}


def _is_meaningless_answer(user_answer: str) -> bool:
    """
    Kiểm tra chính xác câu trả lời rác / bỏ qua / không biết:
    Dùng so khớp tập hợp và regex biên từ, TUYỆT ĐỐI KHÔNG dùng substring bừa bãi
    để tránh phạt oan các câu chứa 'unit test', 'socket', 'token', 'argument'...
    """
    cleaned = re.sub(r"[^\w\s\À-ỹ]", "", user_answer.strip().lower())
    words = cleaned.split()

    if not words:
        return True

    # 1. So khớp chính xác trong danh sách cụm từ rác
    if cleaned in EXACT_MEANINGLESS_RESPONSES:
        return True

    # 2. Câu quá ngắn (1-3 từ) chứa các từ bỏ qua điển hình
    if len(words) <= 4:
        skip_pattern = r"^(?:em|tôi|tui|mình|minh|anh|chị)?\s*(?:k|ko|không|chưa)?\s*(?:biết|rõ|nhớ|hiểu|chịu|pass|skip|idk|dunno|chiu|thua|none)(?:\s*(?:ạ|nữa|gì|đâu|nhe|nhé))?$"
        if re.match(skip_pattern, cleaned):
            return True
        # Chuỗi phím bấm ngẫu nhiên (aaaa, asdf, 1234...)
        if re.match(r"^([a-z])\1{2,}$|^(?:asdf|qwer|zxcv|1234|test)$", cleaned):
            return True

    return False


def generate_interview_plan(cv_analysis_result: dict, target_count: int = 6) -> list:
    """
    Tạo kế hoạch phỏng vấn cân bằng, thông minh và mang tính thực tế:
    - 1 câu mở đầu / Icebreaker
    - 3-4 câu kỹ thuật khớp chính xác với skills trong CV và JD
    - 1 câu khai thác sâu dự án / kinh nghiệm thực tế của ứng viên
    - 1 câu tình huống hành vi (STAR)
    Tổng số câu phỏng vấn mặc định: 5 - 7 câu (thay vì 20 câu gây mệt mỏi cho người dùng).
    """
    plan = []

    # 1. Câu hỏi khởi động (Icebreaker)
    plan.append({
        "type": "icebreaker",
        "topic": "Giới thiệu bản thân & Mục tiêu",
        "question": "Chào bạn! Hãy giới thiệu đôi nét về bản thân, các thế mạnh công nghệ nổi bật nhất của bạn và mục tiêu phát triển nghề nghiệp sắp tới.",
        "concepts": "giới thiệu bản thân kinh nghiệm kỹ năng điểm mạnh mục tiêu nghề nghiệp background strengths career goals passion định hướng"
    })

    # 2. Câu hỏi kỹ thuật dựa trên matched skills
    matched_skills = cv_analysis_result.get("matching", {}).get("skills_matched", [])
    tech_pool = []

    for skill in matched_skills:
        skill_lower = skill.lower().strip()
        for bank_key, questions in TECH_QUESTION_BANK.items():
            if bank_key == skill_lower or bank_key in skill_lower:
                for q in questions:
                    q_copy = dict(q)
                    q_copy["type"] = "technical"
                    q_copy["topic"] = bank_key.title()
                    tech_pool.append(q_copy)

    # Nếu ít skill khớp, bổ sung câu hỏi kỹ thuật nền tảng (API, Git, System Design, SQL)
    if len(tech_pool) < 3:
        for fallback_key in ["sql", "git", "api", "system design"]:
            if fallback_key in TECH_QUESTION_BANK:
                for q in TECH_QUESTION_BANK[fallback_key]:
                    q_copy = dict(q)
                    q_copy["type"] = "technical"
                    q_copy["topic"] = fallback_key.title()
                    tech_pool.append(q_copy)

    # Lọc trùng lặp câu hỏi kỹ thuật
    unique_tech = []
    seen_q = set()
    for q in tech_pool:
        if q["question"] not in seen_q:
            seen_q.add(q["question"])
            unique_tech.append(q)

    # Chọn 3-4 câu kỹ thuật đa dạng chủ đề
    random.shuffle(unique_tech)
    selected_tech = unique_tech[:min(4, max(2, target_count - 3))]
    plan.extend(selected_tech)

    # 3. Câu hỏi dự án thực tế từ CV (Project-based)
    experiences = cv_analysis_result.get("experiences", [])
    if experiences:
        exp = experiences[0]
        title = exp.get("title") or "Lập trình viên"
        org = exp.get("organization") or "công ty/dự án trước đây"
        plan.append({
            "type": "project",
            "topic": "Dự án thực tế",
            "question": f"Trong CV bạn có đề cập vai trò '{title}' tại '{org}'. Bạn có thể chia sẻ chi tiết về bài toán khó nhất bạn từng giải quyết hoặc kiến trúc công nghệ bạn đã áp dụng tại đây không?",
            "concepts": f"dự án kiến trúc kỹ thuật giải pháp công nghệ khó khăn tối ưu bài học vai trò trách nhiệm kết quả {title} {org} architecture problem solving technical stack"
        })

    # 4. Câu hỏi hành vi (Behavioral STAR)
    behavioral_choice = dict(random.choice(BEHAVIORAL_QUESTIONS))
    behavioral_choice["topic"] = "Kỹ năng hành vi & Làm việc nhóm"
    plan.append(behavioral_choice)

    # Đảm bảo số lượng câu theo target_count (tối đa 8 câu để trải nghiệm tốt nhất)
    if len(plan) > target_count:
        plan = [plan[0]] + plan[1:target_count]

    return plan


def score_answer(question_data: dict, user_answer: str) -> float:
    """
    Chấm điểm câu trả lời đa tiêu chí với độ chính xác cao:
    - Semantic similarity (Ngữ nghĩa sâu): 50%
    - Keyword / Concept matching (Bilingual Anh - Việt): 30%
    - Detail & Structure (Độ chi tiết, mạch lạc): 20%
    - STAR method bonus cho câu hỏi hành vi / tình huống (+10%)
    """
    if not user_answer or not user_answer.strip():
        return 0.0

    raw_answer = user_answer.strip()

    # Kiểm tra câu trả lời không có nội dung / rác
    if _is_meaningless_answer(raw_answer):
        return 0.0

    word_count = len(raw_answer.split())
    if word_count < 3:
        return 0.1

    concepts = question_data.get("concepts", "")
    question_type = question_data.get("type", "technical")

    # 1. Semantic Similarity (50%)
    try:
        answer_emb = embedding_model.encode(raw_answer, convert_to_tensor=True)
        concepts_emb = embedding_model.encode(concepts, convert_to_tensor=True)
        raw_cos = util.cos_sim(answer_emb, concepts_emb).item()

        # Re-scale cosine: 0.15 -> 0.0; 0.70 -> 1.0
        semantic_score = max(0.0, min(1.0, (raw_cos - 0.15) / 0.55))
    except Exception:
        semantic_score = 0.5

    # 2. Concept & Keyword Matching (30%)
    concept_tokens = {
        w.lower().strip() for w in re.split(r"[\s,;]+", concepts)
        if len(w) > 2 and w.lower() not in STOPWORDS
    }
    answer_tokens = {
        w.lower().strip() for w in re.split(r"[\s,;\.\?!]+", raw_answer)
        if len(w) > 2 and w.lower() not in STOPWORDS
    }

    if concept_tokens:
        matched_tokens = concept_tokens.intersection(answer_tokens)
        keyword_score = min(1.0, (len(matched_tokens) / max(3, len(concept_tokens) * 0.4)))
    else:
        keyword_score = 0.5

    # 3. Detail & Completeness Score (20%)
    if word_count < 10:
        detail_score = 0.3
    elif word_count < 25:
        detail_score = 0.6
    elif word_count < 60:
        detail_score = 0.85
    elif word_count < 120:
        detail_score = 0.95
    else:
        detail_score = 1.0

    # 4. STAR method bonus for behavioral / project questions
    star_bonus = 0.0
    if question_type in ("behavioral", "project"):
        star_markers = [
            'tình huống', 'bối cảnh', 'nhiệm vụ', 'mục tiêu', 'giải pháp', 'hành động',
            'kết quả', 'bài học', 'kinh nghiệm', 'situation', 'task', 'action', 'result',
            'thực hiện', 'triển khai', 'đạt được', 'tối ưu', 'khó khăn'
        ]
        matched_star = sum(1 for sm in star_markers if sm in raw_answer.lower())
        if matched_star >= 3:
            star_bonus = 0.10
        elif matched_star >= 1:
            star_bonus = 0.05

    # Tổng hợp điểm số [0.0, 1.0]
    total_score = (
        0.50 * semantic_score +
        0.30 * keyword_score +
        0.20 * detail_score +
        star_bonus
    )

    return max(0.0, min(1.0, total_score))


def generate_turn_feedback(question_data: dict, user_answer: str, score: float) -> Dict[str, Any]:
    """
    Sinh nhận xét tức thì (instant feedback) và câu chuyển tiếp giao tiếp tự nhiên sau mỗi lượt trả lời.
    """
    topic = question_data.get("topic") or "kỹ thuật"
    score_percent = round(score * 100, 1)

    if score >= 0.80:
        evaluation = "Rất tốt"
        comment = f"Câu trả lời về chủ đề {topic} rất rõ ràng, nêu đúng bản chất kỹ thuật và có ví dụ minh họa cụ thể."
        transition = "Rất tuyệt vời! Chúng ta cùng đi tới câu hỏi tiếp theo nhé:"
    elif score >= 0.60:
        evaluation = "Khá"
        comment = f"Bạn đã nắm được ý chính của phần {topic}. Nếu bổ sung thêm ví dụ thực tế hoặc phân tích sâu hơn về ưu/nhược điểm thì câu trả lời sẽ hoàn hảo hơn."
        transition = "Cảm ơn câu trả lời của bạn. Hãy tiếp tục với câu hỏi sau:"
    elif score >= 0.40:
        evaluation = "Trung bình"
        comment = f"Câu trả lời đã đề cập được một số khái niệm cơ bản về {topic}, nhưng còn khá ngắn gọn và chưa làm nổi bật cách áp dụng vào thực tế."
        transition = "Ghi nhận câu trả lời của bạn. Chúng ta cùng chuyển sang câu hỏi tiếp theo:"
    else:
        evaluation = "Cần bổ sung"
        comment = f"Ý trả lời ở phần {topic} còn sơ sài hoặc chưa đi thẳng vào trọng tâm câu hỏi. Bạn nên củng cố thêm kiến thức nền tảng ở mảng này."
        transition = "Không sao cả, hãy tự tin trả lời câu hỏi tiếp theo dưới đây:"

    return {
        "score_percent": score_percent,
        "evaluation": evaluation,
        "comment": comment,
        "transition": transition
    }