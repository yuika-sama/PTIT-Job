# api/interview.py
from fastapi import APIRouter, HTTPException
from typing import Optional, Dict, Any, List

from services import interview_simulator
from schemas.interview import InterviewRequest

router = APIRouter()


def _extract_topics(q_item: Dict[str, Any]) -> List[str]:
    """
    Trích xuất danh sách chủ đề của câu hỏi từ item kế hoạch phỏng vấn.
    """
    candidates = []
    for key in ("topic", "topics", "skill", "skills", "category", "criteria", "tags"):
        val = q_item.get(key)
        if isinstance(val, str) and val.strip():
            candidates.append(val.strip())
        elif isinstance(val, list):
            for v in val:
                if isinstance(v, str) and v.strip():
                    candidates.append(v.strip())

    if candidates:
        seen = set()
        out = []
        for c in candidates:
            if c.lower() not in seen:
                seen.add(c.lower())
                out.append(c)
        return out[:3]

    # Heuristic dựa trên nội dung text câu hỏi
    q_text = (q_item.get("question") or "").lower()
    hints = []
    if any(k in q_text for k in ["algorithm", "data structure", "cấu trúc dữ liệu", "thuật toán", "độ phức tạp"]):
        hints.append("Thuật toán & Cấu trúc dữ liệu")
    if any(k in q_text for k in ["system design", "kiến trúc", "scale", "phân tán", "microservices"]):
        hints.append("System Design & Architecture")
    if any(k in q_text for k in ["database", "sql", "nosql", "transaction", "index"]):
        hints.append("Database / SQL")
    if any(k in q_text for k in ["frontend", "react", "ui", "ux", "dom", "vue"]):
        hints.append("Frontend Development")
    if any(k in q_text for k in ["backend", "api", "rest", "grpc", "node", "fastapi", "spring"]):
        hints.append("Backend & API")
    if any(k in q_text for k in ["docker", "cloud", "aws", "devops", "kubernetes", "ci/cd"]):
        hints.append("DevOps & Cloud")
    if any(k in q_text for k in ["behavioral", "tình huống", "conflict", "giao tiếp", "team", "áp lực"]):
        hints.append("Kỹ năng hành vi (Behavioral)")

    return hints[:3] if hints else ["Kỹ năng chuyên môn"]


def _compile_improvements(state: Dict[str, Any]) -> List[Dict[str, str]]:
    """
    Tổng hợp gợi ý cải thiện có tính hành động cao dựa trên kết quả từng câu hỏi.
    """
    improvements: List[Dict[str, str]] = []

    cv_score = float(state.get("cv_score", 0.0))
    scores: List[float] = state.get("interview_scores", []) or []
    feedback_items: List[Dict[str, Any]] = state.get("feedback_items", []) or []

    avg_interview_score = (sum(scores) / len(scores)) if scores else 0.0  # 0..1

    # 1) Các chủ đề còn yếu (< 60%)
    weak_topics: Dict[str, List[float]] = {}
    for item in feedback_items:
        s = float(item.get("score", 0.0))
        if s < 0.60:
            for t in item.get("topics", []):
                weak_topics.setdefault(t, []).append(s)

    for topic, arr in weak_topics.items():
        mean_s = sum(arr) / len(arr)
        improvements.append({
            "area": topic,
            "tip": (
                f"Điểm số ở mảng {topic} còn khiêm tốn (~{mean_s*100:.0f}%). "
                "Cần nắm vững lý thuyết cốt lõi (bản chất hoạt động, ưu nhược điểm) và chuẩn bị ví dụ thực tế "
                "theo mô hình STAR (Situation - Task - Action - Result) có số liệu chứng minh."
            )
        })

    # 2) Đánh giá chung nếu điểm phỏng vấn chưa cao
    if avg_interview_score < 0.70:
        improvements.append({
            "area": "Kỹ năng trình bày và diễn đạt kỹ thuật",
            "tip": (
                "Nên trả lời theo cấu trúc rõ ràng: Định nghĩa ngắn gọn → Bản chất kỹ thuật → "
                "Trường hợp áp dụng thực tế → Trade-offs (đánh đổi giải pháp). Tránh trả lời quá ngắn hoặc thiếu dẫn chứng."
            )
        })

    # 3) Nếu điểm CV thấp
    if cv_score < 60:
        improvements.append({
            "area": "Tối ưu hóa nội dung CV",
            "tip": (
                "Bổ sung các từ khóa công nghệ sát với Job Description, đưa các dự án tiêu biểu lên đầu "
                "và định lượng thành tích trong CV (VD: tăng tốc độ tải trang 40%, xử lý 10.000 requests/ngày)."
            )
        })

    if not improvements:
        improvements.append({
            "area": "Đào sâu kiến trúc & tối ưu hóa nâng cao",
            "tip": (
                "Bạn đã thể hiện rất tốt các câu hỏi tiêu chuẩn! Hãy đào sâu hơn vào các bài toán mở rộng (scalability), "
                "bảo mật (security) và giám sát hệ thống (monitoring) để tạo ấn tượng xuất sắc với nhà tuyển dụng."
            )
        })

    return improvements


@router.post("/interview")
async def dynamic_interview_chat_endpoint(request: InterviewRequest):
    history = request.history or []
    cv_analysis_result = request.cv_analysis_result
    state: Dict[str, Any] = request.state or {}

    is_start = len(history) == 0

    # Khôi phục state từ message cuối nếu không có trong request body
    if not state and not is_start:
        last_ai_turn = next((msg for msg in reversed(history) if msg.sender == "ai"), None)
        if last_ai_turn and last_ai_turn.state:
            state = last_ai_turn.state
        else:
            raise HTTPException(
                status_code=400,
                detail="Trạng thái phỏng vấn (state) bị thiếu hoặc đã hết hạn. Vui lòng bắt đầu lại buổi phỏng vấn."
            )

    # ==================== LƯỢT ĐẦU TIÊN (START) ====================
    if is_start:
        if not cv_analysis_result:
            raise HTTPException(status_code=400, detail="Cần kết quả phân tích CV để khởi tạo buổi phỏng vấn.")

        cv_score_raw = cv_analysis_result.get("scoring", {}).get("overall_score_percent", 0)
        cv_score = float(cv_score_raw) if cv_score_raw else 0.0

        target_count = request.total_questions or 6
        try:
            plan = interview_simulator.generate_interview_plan(cv_analysis_result, target_count=target_count)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Không thể tạo kế hoạch phỏng vấn: {str(e)}")

        if not plan:
            raise HTTPException(status_code=500, detail="Kế hoạch phỏng vấn trống.")

        state = {
            "cv_score": cv_score,
            "question_plan": plan,
            "current_question_index": 0,
            "interview_scores": [],
            "feedback_items": []
        }

        first_question = plan[0]
        intro_text = (
            "👋 **Chào mừng bạn đến với buổi phỏng vấn giả lập cùng AI!**\n\n"
            f"Dựa trên hồ sơ CV của bạn, buổi phỏng vấn sẽ bao gồm **{len(plan)} câu hỏi trọng tâm** "
            "về kỹ thuật, dự án và kỹ năng giải quyết vấn đề.\n\n"
            f"**Câu hỏi 1/{len(plan)}:**\n{first_question.get('question')}"
        )

        return {
            "response": intro_text,
            "finished": False,
            "state": state,
            "progress": {"current": 1, "total": len(plan)},
            "current_question": first_question.get("question")
        }

    # ==================== CÁC LƯỢT TIẾP THEO ====================
    last_user_msg = next((msg for msg in reversed(history) if msg.sender == "user"), None)
    last_user_answer = last_user_msg.text if last_user_msg else ""

    plan = state.get("question_plan", [])
    if not plan:
        raise HTTPException(
            status_code=400,
            detail="Trạng thái phỏng vấn không hợp lệ (không tìm thấy câu hỏi). Vui lòng bắt đầu lại."
        )

    current_idx = int(state.get("current_question_index", 0))

    # Chấm điểm câu hỏi vừa trả lời
    latest_feedback = None
    if 0 <= current_idx < len(plan):
        current_question = plan[current_idx]
        try:
            score = interview_simulator.score_answer(current_question, last_user_answer)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Lỗi khi đánh giá câu trả lời: {str(e)}")

        state.setdefault("interview_scores", []).append(score)
        topics = _extract_topics(current_question)

        # Tạo phản hồi tức thì về câu trả lời vừa rồi
        latest_feedback = interview_simulator.generate_turn_feedback(current_question, last_user_answer, score)

        state.setdefault("feedback_items", []).append({
            "index": current_idx,
            "question": current_question.get("question"),
            "topics": topics,
            "score": score,
            "evaluation": latest_feedback["evaluation"],
            "feedback": latest_feedback["comment"]
        })

        # Chuyển sang câu hỏi kế tiếp
        state["current_question_index"] = current_idx + 1
        current_idx = state["current_question_index"]

    # Nếu vẫn còn câu hỏi -> gửi câu hỏi tiếp theo kèm phản hồi ngắn
    if current_idx < len(plan):
        next_question = plan[current_idx]
        fb_comment = latest_feedback["comment"] if latest_feedback else "Cảm ơn câu trả lời của bạn."
        fb_transition = latest_feedback["transition"] if latest_feedback else "Chúng ta cùng đến với câu hỏi tiếp theo:"

        turn_response_text = (
            f"💬 **Nhận xét nhanh:** {fb_comment}\n\n"
            f"{fb_transition}\n\n"
            f"**Câu hỏi {current_idx + 1}/{len(plan)}:**\n{next_question.get('question')}"
        )

        return {
            "response": turn_response_text,
            "finished": False,
            "state": state,
            "progress": {"current": current_idx + 1, "total": len(plan)},
            "current_question": next_question.get("question"),
            "turn_feedback": latest_feedback,
            "turn_score": latest_feedback["score_percent"] if latest_feedback else 0.0
        }

    # ==================== HOÀN THÀNH PHỎNG VẤN (TỔNG KẾT) ====================
    cv_score = float(state.get("cv_score", 0.0))
    scores = state.get("interview_scores", [])

    avg_interview_score = (sum(scores) / len(scores) * 100.0) if scores else 0.0

    # Phân bổ kết quả theo thang điểm
    interview_breakdown = {
        "total_questions": len(scores),
        "average_score": round(avg_interview_score, 2),
        "min_score": round(min(scores) * 100, 2) if scores else 0,
        "max_score": round(max(scores) * 100, 2) if scores else 0,
        "scores_distribution": {
            "excellent": sum(1 for s in scores if s >= 0.8),
            "good": sum(1 for s in scores if 0.6 <= s < 0.8),
            "average": sum(1 for s in scores if 0.4 <= s < 0.6),
            "poor": sum(1 for s in scores if s < 0.4)
        }
    }

    # Trọng số: CV 30%, Phỏng vấn 70%
    cv_weight = 0.30
    interview_weight = 0.70
    final_score = (cv_weight * cv_score) + (interview_weight * avg_interview_score)

    if final_score >= 80:
        overall_assessment = "Xuất sắc"
        recommendation = "Ứng viên sở hữu kiến thức vững chắc và kỹ năng giao tiếp tốt. Rất phù hợp với vị trí."
    elif final_score >= 70:
        overall_assessment = "Tốt"
        recommendation = "Ứng viên có tiềm năng lớn, đáp ứng tốt yêu cầu công việc. Khuyến nghị vòng tiếp theo."
    elif final_score >= 55:
        overall_assessment = "Khá / Trung bình khá"
        recommendation = "Ứng viên có nền tảng cơ bản, cần trau dồi thêm kinh nghiệm thực tế và độ sâu kiến trúc."
    else:
        overall_assessment = "Cần cải thiện"
        recommendation = "Ứng viên cần củng cố thêm kiến thức kỹ thuật và rèn luyện kỹ năng trả lời phỏng vấn."

    improvements = _compile_improvements(state)

    # Soạn thảo báo cáo Markdown đẹp mắt
    lines = [
        "🎉 **Chúc mừng bạn đã hoàn thành xuất sắc buổi phỏng vấn giả lập!**",
        "",
        "---",
        "",
        "## 📊 Bảng tổng kết kết quả",
        "",
        f"### 📄 Điểm CV: **{cv_score:.1f}%** *(Trọng số: {cv_weight*100:.0f}%)*",
        "- Đánh giá mức độ khớp kỹ năng, kinh nghiệm và nền tảng học vấn từ CV với JD.",
        "",
        f"### 🎙️ Điểm Phỏng vấn: **{avg_interview_score:.1f}%** *(Trọng số: {interview_weight*100:.0f}%)*",
        f"- Tổng số câu hỏi: **{interview_breakdown['total_questions']} câu**",
        f"- Xuất sắc (≥80%): **{interview_breakdown['scores_distribution']['excellent']} câu**",
        f"- Đạt yêu cầu (60-79%): **{interview_breakdown['scores_distribution']['good']} câu**",
        f"- Trung bình (40-59%): **{interview_breakdown['scores_distribution']['average']} câu**",
        f"- Cần cải thiện (<40%): **{interview_breakdown['scores_distribution']['poor']} câu**",
        "",
        "---",
        "",
        f"## 🎯 ĐIỂM TỔNG HỢP: **{final_score:.1f}%**",
        f"**Đánh giá chung: {overall_assessment}**",
        "",
        f"*{recommendation}*",
        "",
        "---",
        "",
        "## 💡 Lộ trình cải thiện & Lời khuyên",
        ""
    ]

    for idx, imp in enumerate(improvements, 1):
        lines.append(f"### {idx}. {imp['area']}")
        lines.append(f"{imp['tip']}")
        lines.append("")

    response_text = "\n".join(lines)

    return {
        "response": response_text,
        "finished": True,
        "final_score": round(final_score, 2),
        "overall_assessment": overall_assessment,
        "recommendation": recommendation,
        "breakdown": {
            "cv_score": round(cv_score, 2),
            "cv_weight": cv_weight,
            "interview_score": round(avg_interview_score, 2),
            "interview_weight": interview_weight,
            "interview_details": interview_breakdown,
            "question_details": state.get("feedback_items", [])
        },
        "improvements": improvements
    }
