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
        print("[DEBUG] Empty answer - score: 0.0")
        return 0.0
    
    user_answer = user_answer.strip()
    
    # Validation: câu trả lời quá ngắn hoặc không có ý nghĩa
    word_count = len(user_answer.split())
    
    # Câu trả lời dưới 3 từ hoặc chỉ là "ok", "yes", "no", "idk"... → 0 điểm
    if word_count < 3:
        print(f"[DEBUG] Answer too short ({word_count} words) - score: 0.0")
        return 0.0
    
    # Check các câu trả lời vô nghĩa phổ biến
    meaningless_patterns = [
        # ======= ENGLISH "DON'T KNOW" EXPRESSIONS =======
        'i dont know', "i don't know", "i do not know", 'idk', 'dk', 'dunno', "i dunno",
        'no idea', 'not sure', "i'm not sure", "im not sure", 'maybe', 'perhaps', 'no clue',
        'nothing', 'none', 'not really', 'nope', 'nah', 'no thanks', 'not yet',
        'no opinion', 'no answer', 'no comment', 'can\'t say', 'cant say',
        "don't remember", 'forgot', 'don\'t recall', 'unsure', 'idc', "i don't care",
        'whatever', 'who cares', "doesn't matter", 'meh', 'anything', 'something', 'stuff',

        # ======= VIETNAMESE "KHÔNG BIẾT" & UNCERTAIN =======
        'không biết', 'ko biết', 'k biết', 'hong biết', 'hổng biết', 'hông biết',
        'tôi không biết', 'tui không biết', 'mình không biết', 'chả biết', 'éo biết',
        'đéo biết', 'méo biết', 'chịu', 'chịu thua', 'chịu luôn', 'không nhớ', 'ko nhớ',
        'k nhớ', 'chưa biết', 'chưa rõ', 'chưa nghĩ ra', 'chưa có ý kiến',
        'không rõ', 'ko rõ', 'k rõ', 'chưa hiểu', 'chưa nghĩ', 'không quan tâm',
        'sao cũng được', 'gì cũng được', 'tùy', 'tuỳ', 'tùy thôi', 'tuỳ thôi',
        'tùy bạn', 'tuỳ bạn', 'thế nào cũng được', 'bình thường thôi', 'ko quan trọng',

        # ======= PASS / SKIP / PLACEHOLDER =======
        'pass', 'skip', 'next', 'bỏ qua', 'qua câu khác', 'để sau', 'sau đi',
        'kế tiếp', 'none', 'n/a', 'na', 'not applicable', 'null', 'empty', 'trống',
        'default', 'demo', 'sample', 'placeholder', 'test', 'testing', 'abc', 'xyz',
        'lorem', 'ipsum', 'temp', 'draft', 'unknown', 'undefined',

        # ======= RANDOM STRINGS & KEYBOARD MASHES =======
        'aaa', 'aaaa', 'aaaaa', 'aaaaaa', 'bbb', 'bbbbb', 'ccc', 'ccc', 'ddd', 'eee',
        'asdf', 'asdfg', 'asdfgh', 'asdfghjkl', 'qwerty', 'qwert', 'zxcv', 'zxcvb',
        '123', '1234', '12345', '123456', '000', '0000', '111', '1111', '999', '9999',
        'abc123', 'xyz123', 'test123', 'random', 'rubbish', 'nonsense',

        # ======= SHORT FILLERS / REACTIONS =======
        'ok', 'oke', 'okie', 'okay', 'okok', 'yes', 'no', 'yeah', 'yep', 'noo',
        'uh', 'uhm', 'umm', 'um', 'hmm', 'hmmm', 'hm', 'uhhh', 'ah', 'oh', 'eh',
        'bruh', 'bro', 'yo', 'hi', 'hello', 'hey', 'yooo', 'haha', 'hihi', 'hehe',
        'huhu', 'kkk', 'lol', 'lmao', 'rofl', 'wtf', 'wtfff', 'idfk', 'idc', 'omg',
        'wow', 'ouch', 'nah', 'ye', 'ya', 'ayo', 'yuh', 'hmmmmm', 'zzzz', 'zzz',

        # ======= PUNCTUATION / SYMBOLS =======
        '?', '??', '???', '????', '?????', '!', '!!', '!!!', '!!!!', '.....', '....',
        '...', '??!!', '?!', '!?', '???!!!', '???...', '~~~', '---', '///', '\\\\\\',
        '...', '......', '...', '--', '__', '___', '__', '~', '~ ~', '~~~',

        # ======= NON-INFORMATIVE EMOJIS / REACTIONS =======
        '¯\\_(ツ)_/¯', ':)', ':(', ':v', ':D', ':P', ':3', ':|', ':O',
        '😅', '😂', '🤣', '😐', '🤷', '🤷‍♂️', '🤷‍♀️', '😕', '🙃', '😶', '😒', '😔',
        '😞', '😢', '😭', '😆', '😎', '🥲', '🫠', '🤦', '🤦‍♂️', '🤦‍♀️',

        # ======= INDIFFERENCE OR UNCLEAR MEANING =======
        'whatever', 'anything', 'nothing special', 'no matter', 'up to you',
        'as you wish', 'fine', 'it\'s fine', 'i guess', 'guess so', 'maybe later',
        'not important', 'irrelevant', 'no difference', 'same', 'same thing',
        'tùy thôi', 'cũng được', 'gì cũng được', 'tùy mà', 'tuỳ mà', 'hên xui',

        # ======= CONFUSED / UNDECIDED REACTIONS =======
        'not sure yet', 'still thinking', 'thinking', 'hmm i don\'t know',
        'let me think', 'don\'t know yet', 'still unsure', 'idk yet', 'no thought',
        'maybe no', 'maybe yes', 'possibly', 'probably not', 'perhaps later',

        # ======= JOKING OR TROLL RESPONSES =======
        'ask google', 'google it', 'who cares', 'ask chatgpt', 'your mom', 'bro idk',
        'lol idk', 'idk man', 'idk bro', 'idk dude', '¯\\_(ツ)_/¯', 'don’t ask me',
        'ai mà biết', 'trời biết', 'ai biết', 'biết chết liền', 'chịu chết',
        'chịu luôn', 'hỏi làm gì', 'kệ đi', 'thôi kệ', 'thích thì trả lời',
        'ai quan tâm', 'cần gì biết', 'tào lao', 'linh tinh', 'vớ vẩn', 'đéo', 'khum'   
    ]

    
    answer_lower = user_answer.lower()
    if any(pattern in answer_lower for pattern in meaningless_patterns):
        print(f"[DEBUG] Meaningless answer detected - score: 0.0")
        return 0.0
    
    # Nếu câu trả lời chỉ có 1 câu ngắn (< 5 từ) và không liên quan
    if word_count < 5:
        # Check xem có phải câu trả lời thực sự không
        has_technical_words = any(word in answer_lower for word in [
            # ======= ENGLISH EXPLANATORY / TECHNICAL CONNECTORS =======
            'because', 'since', 'as', 'so that', 'in order to', 'therefore', 'thus',
            'hence', 'for example', 'for instance', 'such as', 'including',
            'when', 'while', 'whenever', 'once', 'after', 'before', 'until', 'unless',
            'how', 'why', 'what', 'which', 'where', 'who', 'whose', 'whom',
            'although', 'though', 'even though', 'despite', 'in spite of',
            'can', 'could', 'should', 'would', 'may', 'might', 'must', 'will',
            'is', 'are', 'was', 'were', 'be', 'being', 'been', 'does', 'did', 'do',
            'if', 'then', 'else', 'otherwise',
            'therefore', 'hence', 'consequently', 'accordingly', 'meanwhile', 'overall',
            'depends', 'relates to', 'connected', 'based on', 'due to', 'caused by',
            'function', 'process', 'method', 'algorithm', 'logic', 'condition',
            'input', 'output', 'data', 'variable', 'parameter', 'result', 'return',
            'calculate', 'compute', 'determine', 'reason', 'explain', 'define', 'describe',
            'purpose', 'objective', 'goal', 'effect', 'impact', 'difference',
            'approach', 'model', 'system', 'structure', 'workflow', 'pipeline',

            # ======= VIETNAMESE LOGICAL / TECHNICAL CONNECTORS =======
            'vì', 'bởi vì', 'do', 'do đó', 'nên', 'vì vậy', 'thành ra', 'cho nên',
            'tại sao', 'bởi vậy', 'vì thế', 'vì lí do', 'bởi lẽ', 'tại vì',
            'khi', 'nếu', 'khi nào', 'nếu như', 'trong khi', 'miễn là',
            'như thế nào', 'bằng cách', 'cách mà', 'là gì', 'gì đó', 'cách thức',
            'lúc', 'sau khi', 'trước khi', 'đến khi', 'điều kiện', 'giả sử',
            'nào', 'ở đâu', 'tại đâu', 'bao giờ', 'thế nào',
            'có thể', 'nên', 'sẽ', 'được', 'phải', 'cần', 'cần phải', 'nên phải',
            'để', 'mục đích', 'nhằm', 'giúp cho', 'dẫn đến', 'ảnh hưởng đến',
            'liên quan', 'phụ thuộc', 'dựa vào', 'dựa trên', 'gây ra', 'tạo ra',
            'kết quả', 'nguyên nhân', 'hiệu ứng', 'tác động', 'ý nghĩa', 'đặc điểm',
            'quy trình', 'hệ thống', 'cấu trúc', 'phương pháp', 'cách tiếp cận',
            'ví dụ', 'chẳng hạn', 'bao gồm', 'tức là', 'nghĩa là', 'cụ thể là',

            # ======= TECHNICAL CONTEXT WORDS (domain-relevant) =======
            'code', 'coding', 'program', 'algorithm', 'data', 'database', 'function',
            'method', 'class', 'object', 'variable', 'parameter', 'module', 'system',
            'model', 'architecture', 'framework', 'library', 'component', 'process',
            'server', 'client', 'frontend', 'backend', 'api', 'query', 'sql', 'json',
            'analyze', 'analysis', 'logic', 'condition', 'loop', 'iterate', 'return',
            'deploy', 'execute', 'performance', 'optimize', 'debug', 'compile', 'build',

            # ======= VIETNAMESE TECHNICAL TERMS =======
            'hàm', 'biến', 'dữ liệu', 'tham số', 'kết quả', 'trả về', 'chạy', 'thực thi',
            'hiệu năng', 'thuật toán', 'mô hình', 'phân tích', 'xử lý', 'triển khai',
            'tối ưu', 'gỡ lỗi', 'xây dựng', 'thực hiện', 'kiến trúc', 'hệ thống',
            'thành phần', 'module', 'chương trình', 'cơ sở dữ liệu', 'truy vấn',
            'đầu vào', 'đầu ra', 'vòng lặp', 'điều kiện', 'phương thức', 'hàm số'
        ])

        if not has_technical_words:
            print(f"[DEBUG] Very short answer without substance ({word_count} words) - low score")
            return 0.1  # Cho điểm tối thiểu
    
    concepts = question_data.get("concepts", "")
    question_type = question_data.get("type", "technical")
    
    # 1. Semantic similarity score (60%)
    answer_emb = embedding_model.encode(user_answer, convert_to_tensor=True)
    concepts_emb = embedding_model.encode(concepts, convert_to_tensor=True)
    cos_sim = util.cos_sim(answer_emb, concepts_emb).item()
    
    # Normalize cosine similarity from [-1, 1] to [0, 1]
    semantic_score = (cos_sim + 1) / 2
    
    # Penalty cho semantic score quá thấp (< 0.3) → câu trả lời không liên quan
    if semantic_score < 0.3:
        print(f"[DEBUG] Very low semantic similarity ({semantic_score:.2f}) - likely irrelevant answer")
        semantic_score = semantic_score * 0.5  # Giảm thêm 50%
    
    # 2. Answer detail score (20%)
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
    stopwords = {
        # ===== ENGLISH STOPWORDS =====
        'the', 'a', 'an', 'and', 'or', 'but', 'if', 'while', 'although', 'though', 'even', 'unless',
        'because', 'since', 'so', 'therefore', 'thus', 'however', 'then', 'also', 'too', 'either', 'neither',
        'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'about', 'as', 'into', 'onto', 'over',
        'under', 'above', 'below', 'through', 'across', 'between', 'among', 'without', 'within', 'before', 'after',
        'up', 'down', 'out', 'off', 'again', 'further', 'once',
        'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
        'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing',
        'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must',
        'this', 'that', 'these', 'those', 'it', 'its', 'it\'s', 'there', 'their', 'theirs', 'them',
        'i', 'me', 'my', 'mine', 'you', 'your', 'yours', 'he', 'him', 'his', 'she', 'her', 'hers',
        'we', 'our', 'ours', 'they', 'their', 'ourselves', 'themselves', 'yourself', 'yourselves',
        'who', 'whom', 'whose', 'what', 'which', 'where', 'when', 'why', 'how',
        'yes', 'no', 'not', 'nor', 'very', 'just', 'only', 'own', 'same', 'such', 'than', 'too', 'so',
        'more', 'most', 'some', 'any', 'each', 'few', 'many', 'much', 'several', 'all', 'both', 'either', 'neither',
        'ever', 'never', 'always', 'sometimes', 'often', 'usually', 'rarely',
        'oh', 'uh', 'um', 'hmm', 'huh', 'lol', 'yeah', 'yep', 'nope', 'ok', 'okay', 'alright',

        # ===== VIETNAMESE STOPWORDS =====
        'và', 'hoặc', 'nhưng', 'bởi', 'vì', 'do', 'tại', 'nên', 'nếu', 'khi', 'để', 'với', 'cho', 'như', 
        'rồi', 'thì', 'là', 'có', 'không', 'chưa', 'đã', 'sẽ', 'đang', 'vẫn', 'được', 'bị', 'bằng', 'cùng', 
        'trong', 'ngoài', 'trên', 'dưới', 'giữa', 'vào', 'ra', 'đến', 'tới', 'qua', 'về', 'theo', 'tại', 'ở',
        'này', 'kia', 'đó', 'ấy', 'nọ', 'các', 'một', 'hai', 'ba', 'nhiều', 'ít', 'mọi', 'tất cả', 'toàn bộ',
        'ai', 'gì', 'cái', 'nào', 'đâu', 'sao', 'vì sao', 'tại sao', 'bao nhiêu', 'thế nào', 'ra sao',
        'tôi', 'ta', 'mình', 'chúng tôi', 'chúng ta', 'bạn', 'cậu', 'mày', 'mình', 'họ', 'ông', 'bà', 'anh', 'chị', 'em',
        'nó', 'hắn', 'người', 'ai đó', 'gì đó', 'cái đó', 'này nọ',
        'đây', 'kia', 'ấy', 'đó', 'chính', 'vừa', 'cũng', 'đều', 'thậm chí', 'cả', 'đôi khi', 'lắm', 'rất', 'hơi', 'quá',
        'vừa mới', 'đã từng', 'đang khi', 'đang lúc', 'vì vậy', 'do đó', 'bởi vậy', 'bởi thế',
        'nên là', 'cho nên', 'tuy nhiên', 'nhưng mà', 'mà', 'thế nên', 'vì thế', 'vì vậy nên',
        'đúng', 'sai', 'vâng', 'dạ', 'ừ', 'ờ', 'ok', 'ừm', 'à', 'ơ', 'hả', 'hử', 'ờm', 'ừa', 'vậy', 'thế',
        'hết', 'xong', 'đâu', 'chưa', 'rồi', 'nữa', 'còn', 'cũng như', 'hay là', 'thì ra', 'ngay', 'liền', 'luôn',
        'thật', 'ra', 'thật ra', 'thực ra', 'thực tế', 'nói chung', 'nói thật', 'đại loại', 'kiểu như',
        'với lại', 'dù sao', 'tức là', 'nghĩa là', 'như là', 'bao gồm', 'chẳng hạn', 'ví dụ', 'vậy thôi', 'thế thôi',

        # ===== GENERIC FILLER / LOW-INFORMATION WORDS =====
        'uh', 'ừm', 'ờm', 'ờ', 'à', 'á', 'hả', 'ơ', 'hử', 'ừ', 'dạ', 'vâng',
        'ha', 'hihi', 'haha', 'hehe', 'huhu', 'lol', 'lmao', 'bruh', 'bro', 'okay', 'okie',
        'yeah', 'nope', 'uhh', 'umm', 'uhm', 'hmm', 'hmmm', 'à nha', 'ờ ha', 'thế à',
        'ờ kìa', 'ờ nhỉ', 'ờ há', 'ơ kìa', 'ơ hả', 'ơ nhỉ', 'ừ ha', 'ừ nhỉ',
    }

    
    concept_keywords = concept_keywords - stopwords
    answer_words = answer_words - stopwords
    
    if concept_keywords:
        matched_keywords = concept_keywords.intersection(answer_words)
        keyword_score = len(matched_keywords) / len(concept_keywords)
        
        # Penalty nếu không match keyword nào
        if len(matched_keywords) == 0:
            print(f"[DEBUG] No keyword matches - likely off-topic answer")
            keyword_score = 0.0
    else:
        keyword_score = 0.5  # neutral if no concepts
    
    # 4. Question type adjustment
    if question_type == "behavioral":
        # Behavioral questions value structure (STAR method)
        # Check for situation, task, action, result keywords
        star_keywords = [
            # ===== ENGLISH: SITUATION =====
            'situation', 'context', 'background', 'circumstance', 'scenario', 'case',
            'environment', 'condition', 'state', 'setting', 'stage', 'problem statement',
            'issue', 'challenge', 'difficulty', 'obstacle', 'barrier', 'risk',
            'problem', 'incident', 'event', 'example', 'experience',

            # ===== ENGLISH: TASK =====
            'task', 'objective', 'goal', 'target', 'responsibility', 'duty', 'assignment',
            'requirement', 'mission', 'expectation', 'job', 'role', 'purpose',
            'aim', 'intention', 'thing to do', 'thing i had to do', 'deliverable',

            # ===== ENGLISH: ACTION =====
            'action', 'step', 'measure', 'activity', 'process', 'initiative', 'implementation',
            'solution', 'approach', 'strategy', 'plan', 'method', 'procedure', 'operation',
            'execution', 'handled', 'responded', 'did', 'performed', 'applied',
            'contributed', 'supported', 'led', 'organized', 'collaborated', 'communicated',

            # ===== ENGLISH: RESULT =====
            'result', 'outcome', 'impact', 'effect', 'consequence', 'benefit', 'achievement',
            'accomplishment', 'success', 'improvement', 'growth', 'learned', 'lesson',
            'gain', 'insight', 'value', 'metric', 'feedback', 'recognition', 'reward',
            'performance', 'progress', 'impactful', 'delivered', 'output', 'what happened',

            # ===== ENGLISH: REFLECTION =====
            'what i learned', 'what i gained', 'lesson learned', 'insight gained',
            'reflection', 'takeaway', 'realized', 'understood', 'found out', 'discovered',

            # ===== VIETNAMESE: SITUATION =====
            'tình huống', 'bối cảnh', 'hoàn cảnh', 'trường hợp', 'môi trường',
            'vấn đề', 'thách thức', 'khó khăn', 'rào cản', 'nguy cơ', 'trở ngại',
            'sự cố', 'sự kiện', 'ví dụ', 'kinh nghiệm', 'tình trạng',

            # ===== VIETNAMESE: TASK =====
            'nhiệm vụ', 'mục tiêu', 'mục đích', 'trách nhiệm', 'công việc', 'vai trò',
            'yêu cầu', 'sứ mệnh', 'điều cần làm', 'việc phải làm', 'mong đợi', 'kỳ vọng',
            'kế hoạch', 'đề bài', 'nhiệm vụ được giao', 'điều được giao',

            # ===== VIETNAMESE: ACTION =====
            'hành động', 'bước', 'biện pháp', 'hoạt động', 'quy trình', 'cách xử lý',
            'giải pháp', 'cách giải quyết', 'cách tiếp cận', 'phương pháp', 'cách làm',
            'kế hoạch hành động', 'thực hiện', 'ứng dụng', 'triển khai', 'thực thi',
            'phối hợp', 'hỗ trợ', 'tham gia', 'đóng góp', 'tổ chức', 'lãnh đạo', 'giải quyết',

            # ===== VIETNAMESE: RESULT =====
            'kết quả', 'tác động', 'ảnh hưởng', 'hiệu quả', 'thành công', 'thành tựu',
            'cải thiện', 'tiến bộ', 'phát triển', 'đóng góp', 'thay đổi', 'đạt được',
            'học được', 'rút ra', 'bài học', 'kinh nghiệm', 'đánh giá', 'phản hồi',
            'nhận được', 'ghi nhận', 'khen thưởng', 'tăng trưởng', 'hiệu suất',

            # ===== VIETNAMESE: REFLECTION =====
            'điều tôi học được', 'tôi nhận ra', 'tôi hiểu rằng', 'bài học rút ra',
            'điều rút ra', 'kinh nghiệm quý', 'bài học kinh nghiệm', 'đúc kết', 'nhận thức được',
            'ý nghĩa', 'bài học cá nhân'
        ]

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