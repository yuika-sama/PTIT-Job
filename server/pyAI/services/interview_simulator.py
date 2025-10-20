# services/interview_simulator.py
import random
from typing import List, Dict
from sentence_transformers import util

from services.models import embedding_model
from utils.constants import BEHAVIORAL_QUESTIONS, TECH_QUESTION_BANK


def generate_interview_plan(cv_analysis_result: dict) -> list:
    plan = [random.choice(BEHAVIORAL_QUESTIONS)]
    matched_skills = cv_analysis_result.get("matching", {}).get("skills_matched", [])

    tech_questions_pool = []
    for skill in matched_skills:
        for key, questions in TECH_QUESTION_BANK.items():
            if key in skill.lower():
                tech_questions_pool.extend(questions)

    if tech_questions_pool:
        num_tech = min(len(set(q['question'] for q in tech_questions_pool)), 2)
        plan.extend(random.sample(tech_questions_pool, num_tech))

    experiences = cv_analysis_result.get("experiences", [])
    if experiences:
        top_exp = experiences[0]
        plan.append({
            "type": "project",
            "question": f"Your CV mentions '{top_exp.get('title')}' at '{top_exp.get('organization')}'. Can you elaborate on that experience?",
            "concepts": f"project details achievements responsibilities technical stack challenges outcome {top_exp.get('title')}"
        })
    return plan[:4]  # Limit to 4 questions max


def score_answer(question_data: dict, user_answer: str) -> float:
    if not user_answer or not user_answer.strip(): return 0.0

    concepts = question_data.get("concepts", "")
    answer_emb = embedding_model.encode(user_answer, convert_to_tensor=True)
    concepts_emb = embedding_model.encode(concepts, convert_to_tensor=True)
    score = util.cos_sim(answer_emb, concepts_emb).item()

    normalized_score = (score + 1) / 2  # Normalize to [0, 1]
    # Add bonus for longer, more detailed answers
    if len(user_answer.split()) > 40:
        normalized_score = min(1.0, normalized_score * 1.15)

    return normalized_score