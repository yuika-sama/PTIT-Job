# api/interview.py
from fastapi import APIRouter, HTTPException
from typing import Optional, Dict, Any, List

from services import interview_simulator
from schemas.interview import InterviewRequest

router = APIRouter()


def _extract_topics(q_item: Dict[str, Any]) -> List[str]:
    """
    Cố gắng lấy 'chủ đề' của câu hỏi từ plan item.
    Ưu tiên các trường thường gặp; fallback: suy diễn đơn giản từ question.
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
        # unique, giữ tối đa 3 chủ đề
        seen = set()
        out = []
        for c in candidates:
            if c.lower() not in seen:
                seen.add(c.lower())
                out.append(c)
        return out[:3]

    # Fallback: heuristic dựa trên text
    q_text = (q_item.get("question") or "").lower()
    hints = []
    if any(k in q_text for k in ["algorithm", "data structure", "time complexity", "độ phức tạp"]):
        hints.append("Thuật toán & Cấu trúc dữ liệu")
    if any(k in q_text for k in ["system design", "kiến trúc", "scale", "phân tán"]):
        hints.append("System Design")
    if any(k in q_text for k in ["database", "sql", "nosql", "transaction"]):
        hints.append("Database/SQL")
    if any(k in q_text for k in ["frontend", "react", "ui", "ux"]):
        hints.append("Frontend/React")
    if any(k in q_text for k in ["backend", "api", "microservice", "rest", "grpc"]):
        hints.append("Backend/API")
    if any(k in q_text for k in ["cloud", "aws", "gcp", "azure", "docker", "kubernetes"]):
        hints.append("Cloud/DevOps")
    if any(k in q_text for k in ["behavioral", "tình huống", "conflict", "giao tiếp", "team"]):
        hints.append("Kỹ năng hành vi (Behavioral)")

    return hints[:3] if hints else ["Trình bày & ví dụ minh hoạ"]


def _compile_improvements(state: Dict[str, Any]) -> List[Dict[str, str]]:
    """
    Sinh danh sách gợi ý cải thiện dựa trên:
    - các câu có điểm thấp (< 0.6)
    - điểm phỏng vấn tổng thể
    - điểm CV
    Trả về dạng: [{"area": "...", "tip": "..."}]
    """
    improvements: List[Dict[str, str]] = []

    cv_score = float(state.get("cv_score", 0.0))
    scores: List[float] = state.get("interview_scores", []) or []
    feedback_items: List[Dict[str, Any]] = state.get("feedback_items", []) or []

    avg_interview_score = (sum(scores) / len(scores)) if scores else 0.0  # 0..1

    # 1) Chủ đề yếu (score < 0.6)
    weak_topics: Dict[str, List[float]] = {}
    for item in feedback_items:
        s = float(item.get("score", 0.0))
        if s < 0.6:
            for t in item.get("topics", []):
                weak_topics.setdefault(t, []).append(s)

    for topic, arr in weak_topics.items():
        mean_s = sum(arr) / len(arr)
        improvements.append({
            "area": topic,
            "tip": (
                f"Điểm trung bình ở chủ đề này còn thấp (~{mean_s*100:.0f}%). "
                "Hãy dùng cấu trúc STAR (Situation–Task–Action–Result), đưa ví dụ dự án thật, "
                "nêu rõ vai trò cá nhân, công nghệ đã dùng và con số kết quả (VD: giảm latency 35%, tăng CTR 12%)."
            )
        })

    # 2) Nếu điểm phỏng vấn chung thấp
    if avg_interview_score < 0.7:
        improvements.append({
            "area": "Cách trình bày câu trả lời",
            "tip": (
                "Câu trả lời nên mạch lạc, theo trình tự: bối cảnh → mục tiêu → giải pháp → tác động. "
                "Tránh mô tả chung chung; hãy cụ thể hoá bằng số liệu, quy mô hệ thống, đội nhóm, công cụ & trade-offs."
            )
        })
        improvements.append({
            "area": "Làm rõ kỹ thuật cốt lõi",
            "tip": (
                "Khi nói về kỹ thuật, hãy chỉ ra vì sao chọn giải pháp A thay vì B (ví dụ: Postgres vs. Elasticsearch), "
                "phân tích độ phức tạp, bottlenecks, và cách bạn theo dõi/giám sát chất lượng (metrics, alerting)."
            )
        })

    # 3) Nếu CV score thấp → gợi ý tailor CV
    if cv_score < 60:
        improvements.append({
            "area": "Tối ưu hoá CV theo JD",
            "tip": (
                "Bổ sung từ khoá sát JD (kỹ năng, công cụ), nhấn mạnh kết quả định lượng cho từng trải nghiệm, "
                "đưa lên đầu những kỹ năng/ dự án khớp vị trí, và làm rõ mức độ thành thạo (VD: React 3 năm, Docker 2 năm)."
            )
        })

    # Nếu chưa có gì cụ thể, thêm gợi ý chung
    if not improvements:
        improvements.append({
            "area": "Đào sâu ví dụ và tác động",
            "tip": (
                "Ngay cả khi trả lời đúng, hãy đào sâu hơn: mô hình kiến trúc, dữ liệu, độ phức tạp, "
                "benchmark, bài học rút ra và tác động tới người dùng/doanh nghiệp."
            )
        })

    return improvements


@router.post("/interview")
async def dynamic_interview_chat_endpoint(request: InterviewRequest):
    # Debug logs
    print(f"[DEBUG] Interview request received: {len(request.history)} messages")
    print(f"[DEBUG] CV analysis present: {request.cv_analysis_result is not None}")
    print(f"[DEBUG] State provided in body: {request.state is not None}")

    history = request.history or []
    cv_analysis_result = request.cv_analysis_result
    state: Dict[str, Any] = request.state or {}

    # Chỉ coi là bắt đầu khi KHÔNG có lịch sử (lần đầu)
    is_start = len(history) == 0

    # Nếu chưa có state trong body và không phải lượt đầu, thử khôi phục từ AI message gần nhất
    if not state and not is_start:
        last_ai_turn = next((msg for msg in reversed(history) if msg.sender == "ai"), None)
        if last_ai_turn and last_ai_turn.state:
            state = last_ai_turn.state
            print("[DEBUG] Restored state from last AI message.")
        else:
            print("[DEBUG] Missing state on non-start turn.")
            raise HTTPException(
                status_code=400,
                detail="Interview state missing or expired. Please restart the interview."
            )

    if is_start:
        if not cv_analysis_result:
            raise HTTPException(status_code=400, detail="CV analysis result is required to start an interview.")

        print(f"[DEBUG] Generating interview plan...")
        try:
            plan = interview_simulator.generate_interview_plan(cv_analysis_result)
            print(f"[DEBUG] Plan generated: {len(plan)} questions")
        except Exception as e:
            print(f"[DEBUG] Error generating plan: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to generate interview plan: {str(e)}")

        if not plan:
            raise HTTPException(status_code=500, detail="Empty interview plan generated.")

        state = {
            "cv_score": cv_analysis_result.get("scoring", {}).get("overall_score_percent", 0),
            "question_plan": plan,
            "current_question_index": 0,
            "interview_scores": [],
            "feedback_items": []  # lưu score + topic theo câu
        }

        # Trả về CÂU HỎI MỞ ĐẦU NGAY Ở LƯỢT START
        next_question = plan[0]
        return {
            "response": next_question.get("question"),
            "finished": False,
            "state": state,
            "progress": {"current": 1, "total": len(plan)}
        }

    # Các lượt sau: chấm điểm câu hiện tại và chuyển sang câu tiếp theo
    last_user_msg = next((msg for msg in reversed(history) if msg.sender == "user"), None)
    last_user_answer = last_user_msg.text if last_user_msg else ""

    plan = state.get("question_plan", [])
    if not plan:
        print("[DEBUG] No plan found in state at mid-interview.")
        raise HTTPException(
            status_code=400,
            detail="Interview state invalid (no plan). Please restart the interview."
        )

    current_idx = int(state.get("current_question_index", 0))

    # Chấm điểm câu hỏi hiện tại (nếu còn trong phạm vi plan)
    if 0 <= current_idx < len(plan):
        current_question = plan[current_idx]
        try:
            score = interview_simulator.score_answer(current_question, last_user_answer)  # 0..1
        except Exception as e:
            print(f"[DEBUG] Error scoring answer: {e}")
            raise HTTPException(status_code=500, detail=f"Scoring failed: {str(e)}")

        state.setdefault("interview_scores", []).append(score)
        # Lưu feedback theo câu hỏi
        topics = _extract_topics(current_question)
        state.setdefault("feedback_items", []).append({
            "index": current_idx,
            "question": current_question.get("question"),
            "topics": topics,
            "score": score
        })
        # Tăng chỉ số sang câu tiếp theo
        state["current_question_index"] = current_idx + 1
        current_idx = state["current_question_index"]

    # Nếu còn câu hỏi → gửi câu tiếp theo
    if current_idx < len(plan):
        next_question = plan[current_idx]
        return {
            "response": next_question.get("question"),
            "finished": False,
            "state": state,
            "progress": {"current": current_idx + 1, "total": len(plan)}
        }

    # Hết câu hỏi → tổng kết + gợi ý cải thiện
    cv_score = float(state.get("cv_score", 0.0))
    scores = state.get("interview_scores", [])
    
    # Tính điểm phỏng vấn trung bình (0-100)
    avg_interview_score = (sum(scores) / len(scores) * 100.0) if scores else 0.0
    
    # Phân tích chi tiết điểm phỏng vấn
    interview_breakdown = {
        "total_questions": len(scores),
        "average_score": round(avg_interview_score, 2),
        "min_score": round(min(scores) * 100, 2) if scores else 0,
        "max_score": round(max(scores) * 100, 2) if scores else 0,
        "scores_distribution": {
            "excellent": sum(1 for s in scores if s >= 0.8),  # >= 80%
            "good": sum(1 for s in scores if 0.6 <= s < 0.8),  # 60-79%
            "average": sum(1 for s in scores if 0.4 <= s < 0.6),  # 40-59%
            "poor": sum(1 for s in scores if s < 0.4)  # < 40%
        }
    }
    
    # Công thức tính điểm tổng hợp cải thiện:
    # - CV score chiếm 30% (đánh giá background và kinh nghiệm)
    # - Interview score chiếm 70% (đánh giá khả năng thực tế và communication)
    # Lý do: Phỏng vấn phản ánh khả năng thực tế tốt hơn CV
    cv_weight = 0.30
    interview_weight = 0.70
    final_score = cv_weight * cv_score + interview_weight * avg_interview_score
    
    # Đánh giá mức độ tổng thể
    if final_score >= 80:
        overall_assessment = "Xuất sắc"
        recommendation = "Ứng viên rất phù hợp với vị trí. Đề xuất tiếp tục quy trình tuyển dụng."
    elif final_score >= 70:
        overall_assessment = "Tốt"
        recommendation = "Ứng viên có tiềm năng. Cân nhắc phỏng vấn vòng tiếp theo với các câu hỏi chuyên sâu hơn."
    elif final_score >= 60:
        overall_assessment = "Trung bình khá"
        recommendation = "Ứng viên có nền tảng cơ bản. Có thể cân nhắc cho vị trí junior hoặc với mentoring."
    elif final_score >= 50:
        overall_assessment = "Trung bình"
        recommendation = "Ứng viên cần cải thiện thêm. Xem xét training hoặc vị trí phù hợp hơn với kỹ năng hiện tại."
    else:
        overall_assessment = "Cần cải thiện"
        recommendation = "Ứng viên chưa đáp ứng yêu cầu cơ bản cho vị trí này."
    
    improvements = _compile_improvements(state)

    # Soạn response text thân thiện (Markdown)
    lines = [
        "🎉 **Cảm ơn bạn đã hoàn thành buổi phỏng vấn!**",
        "",
        "---",
        "",
        "## 📊 Tổng kết điểm số",
        "",
        f"### Điểm CV: **{cv_score:.2f}%** (trọng số: {cv_weight*100:.0f}%)",
        "- Đánh giá background, kỹ năng và kinh nghiệm từ CV",
        "",
        f"### Điểm phỏng vấn: **{avg_interview_score:.2f}%** (trọng số: {interview_weight*100:.0f}%)",
        f"- Tổng số câu hỏi: {interview_breakdown['total_questions']}",
        f"- Xuất sắc (≥80%): {interview_breakdown['scores_distribution']['excellent']} câu",
        f"- Tốt (60-79%): {interview_breakdown['scores_distribution']['good']} câu",
        f"- Trung bình (40-59%): {interview_breakdown['scores_distribution']['average']} câu",
        f"- Cần cải thiện (<40%): {interview_breakdown['scores_distribution']['poor']} câu",
        "",
        "---",
        "",
        f"## 🎯 Điểm tổng hợp: **{final_score:.2f}%**",
        f"**Đánh giá: {overall_assessment}**",
        "",
        f"_{recommendation}_",
        "",
        "---",
        "",
        "## 💡 Những điểm cần cải thiện",
        ""
    ]
    
    if improvements:
        for idx, imp in enumerate(improvements, 1):
            lines.append(f"### {idx}. {imp['area']}")
            lines.append(f"{imp['tip']}")
            lines.append("")
    else:
        lines.append("Bạn đã thể hiện rất tốt! Tiếp tục duy trì và phát triển kỹ năng của mình.")
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
            "interview_details": interview_breakdown
        },
        "improvements": improvements  # <-- cấu trúc máy đọc được để FE render đẹp
    }
