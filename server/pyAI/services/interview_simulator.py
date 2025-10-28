# services/interview_simulator.py
import random
from typing import List, Dict
from sentence_transformers import util

from services.models import embedding_model
from utils.constants import BEHAVIORAL_QUESTIONS, TECH_QUESTION_BANK


def generate_interview_plan(cv_analysis_result: dict) -> list:
    """
    Tạo kế hoạch phỏng vấn với số câu hỏi = min(20, tổng số câu hỏi có sẵn).
    Ưu tiên:
    - 3-4 câu hỏi behavioral (kỹ năng mềm, tình huống)
    - Phần còn lại là câu hỏi kỹ thuật dựa trên skills matched từ CV
    - 1-2 câu về projects/experiences từ CV
    """
    plan = []
    
    # 1. Behavioral questions (3-4 câu)
    num_behavioral = min(4, len(BEHAVIORAL_QUESTIONS))
    plan.extend(random.sample(BEHAVIORAL_QUESTIONS, num_behavioral))
    
    # 2. Technical questions dựa trên skills matched
    matched_skills = cv_analysis_result.get("matching", {}).get("skills_matched", [])
    tech_questions_pool = []
    
    for skill in matched_skills:
        skill_lower = skill.lower()
        for key, questions in TECH_QUESTION_BANK.items():
            if key in skill_lower:
                tech_questions_pool.extend(questions)
    
    # Remove duplicates while preserving order
    seen_questions = set()
    unique_tech_questions = []
    for q in tech_questions_pool:
        q_text = q['question']
        if q_text not in seen_questions:
            seen_questions.add(q_text)
            unique_tech_questions.append(q)
    
    # 3. Project-based questions (1-2 câu)
    experiences = cv_analysis_result.get("experiences", [])
    project_questions = []
    if experiences:
        # Lấy top 2 experiences quan trọng nhất
        for idx, exp in enumerate(experiences[:2]):
            title = exp.get('title', 'your role')
            org = exp.get('organization', 'the company')
            project_questions.append({
                "type": "project",
                "question": f"Bạn có thể mô tả chi tiết hơn về vai trò '{title}' tại '{org}' không? Bạn đã làm gì, sử dụng công nghệ gì, và đạt được kết quả như thế nào?",
                "concepts": f"project details achievements responsibilities technical stack challenges outcome metrics {title} {org}"
            })
    
    # 4. Tính toán số câu hỏi tối đa
    # Total available = behavioral + technical + project
    total_available = len(plan) + len(unique_tech_questions) + len(project_questions)
    max_questions = min(20, total_available)
    
    # Distribute questions
    # Already have behavioral questions in plan
    remaining_slots = max_questions - len(plan)
    
    # Add project questions first (important for context)
    if project_questions and remaining_slots > 0:
        num_projects = min(len(project_questions), 2, remaining_slots)
        plan.extend(project_questions[:num_projects])
        remaining_slots -= num_projects
    
    # Fill remaining with technical questions
    if unique_tech_questions and remaining_slots > 0:
        num_tech = min(len(unique_tech_questions), remaining_slots)
        plan.extend(random.sample(unique_tech_questions, num_tech))
    
    # Shuffle to mix question types (but keep first behavioral question at start)
    if len(plan) > 1:
        first_question = plan[0]
        rest = plan[1:]
        random.shuffle(rest)
        plan = [first_question] + rest
    
    print(f"[DEBUG] Generated interview plan: {len(plan)} questions (max: 20, available: {total_available})")
    return plan


def score_answer(question_data: dict, user_answer: str) -> float:
    """
    Chấm điểm câu trả lời với độ chính xác cao hơn.
    
    Scoring criteria:
    - Semantic similarity với concepts (60%)
    - Answer length và detail level (20%)
    - Keyword matching (20%)
    
    Returns: float từ 0.0 đến 1.0
    """
    if not user_answer or not user_answer.strip():
        return 0.0
    
    user_answer = user_answer.strip()
    concepts = question_data.get("concepts", "")
    question_type = question_data.get("type", "technical")
    
    # 1. Semantic similarity score (60%)
    answer_emb = embedding_model.encode(user_answer, convert_to_tensor=True)
    concepts_emb = embedding_model.encode(concepts, convert_to_tensor=True)
    cos_sim = util.cos_sim(answer_emb, concepts_emb).item()
    
    # Normalize cosine similarity from [-1, 1] to [0, 1]
    semantic_score = (cos_sim + 1) / 2
    
    # 2. Answer detail score (20%)
    word_count = len(user_answer.split())
    
    # Detail scoring thresholds
    if word_count < 10:
        detail_score = 0.2  # Too short
    elif word_count < 30:
        detail_score = 0.5  # Brief
    elif word_count < 60:
        detail_score = 0.75  # Good detail
    elif word_count < 100:
        detail_score = 0.9  # Excellent detail
    else:
        detail_score = 1.0  # Very comprehensive
    
    # 3. Keyword matching score (20%)
    concept_keywords = set(concepts.lower().split())
    answer_words = set(user_answer.lower().split())
    
    # Remove common words
    stopwords = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
                 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 
                 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 
                 'would', 'should', 'could', 'may', 'might', 'can', 'this', 'that', 
                 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'}
    
    concept_keywords = concept_keywords - stopwords
    answer_words = answer_words - stopwords
    
    if concept_keywords:
        matched_keywords = concept_keywords.intersection(answer_words)
        keyword_score = len(matched_keywords) / len(concept_keywords)
    else:
        keyword_score = 0.5  # neutral if no concepts
    
    # 4. Question type adjustment
    if question_type == "behavioral":
        # Behavioral questions value structure (STAR method)
        # Check for situation, task, action, result keywords
        star_keywords = ['situation', 'task', 'action', 'result', 'challenge', 
                        'problem', 'solution', 'outcome', 'learned', 'impact']
        star_matches = sum(1 for kw in star_keywords if kw in user_answer.lower())
        star_bonus = min(0.1, star_matches * 0.025)  # up to 10% bonus
    else:
        star_bonus = 0.0
    
    # 5. Combine scores with weights
    final_score = (
        semantic_score * 0.60 +
        detail_score * 0.20 +
        keyword_score * 0.20 +
        star_bonus
    )
    
    # Ensure score is in [0, 1]
    final_score = max(0.0, min(1.0, final_score))
    
    print(f"[DEBUG] Score breakdown - Semantic: {semantic_score:.2f}, Detail: {detail_score:.2f}, "
          f"Keywords: {keyword_score:.2f}, STAR bonus: {star_bonus:.2f}, Final: {final_score:.2f}")
    
    return final_score