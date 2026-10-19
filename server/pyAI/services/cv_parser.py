# services/cv_parser.py
import re
import unicodedata
from typing import Dict, List, Optional, Any
from collections import defaultdict
from spacy.matcher import PhraseMatcher

from services.models import nlp
from utils.constants import (
    SKILL_ONTOLOGY, SKILL_ALIASES, SECTION_HEADINGS, DATE_SPANS_RX, _MONTHS,
    JOB_TITLE_RX, ORG_HINT_RX
)

_phrase_matcher: Optional[PhraseMatcher] = None

# Section canonical mapping table
SECTION_CANONICAL_MAP = {
    # Experience
    "experience": "experience", "work experience": "experience", "professional experience": "experience",
    "employment": "experience", "work history": "experience", "employment history": "experience",
    "kinh nghiệm": "experience", "kinh nghiệm làm việc": "experience", "quá trình làm việc": "experience",
    "lịch sử làm việc": "experience", "kinh nghiệm chuyên môn": "experience", "kinh nghiệm thực tế": "experience",

    # Skills
    "skills": "skills", "technical skills": "skills", "tech skills": "skills", "programming skills": "skills",
    "core competencies": "skills", "competencies": "skills", "key skills": "skills", "professional skills": "skills",
    "skills & tools": "skills", "kỹ năng": "skills", "kỹ năng chuyên môn": "skills", "kỹ năng kỹ thuật": "skills",
    "kỹ năng chính": "skills", "các kỹ năng": "skills", "kỹ năng lập trình": "skills",

    # Projects
    "projects": "projects", "personal projects": "projects", "selected projects": "projects",
    "academic projects": "projects", "key projects": "projects",
    "dự án": "projects", "dự án cá nhân": "projects", "dự án tiêu biểu": "projects",
    "các dự án": "projects", "dự án đã tham gia": "projects",

    # Education
    "education": "education", "academic background": "education", "academic history": "education",
    "academic qualifications": "education", "educational background": "education",
    "học vấn": "education", "trình độ học vấn": "education", "quá trình học vấn": "education",
    "bằng cấp": "education", "học vấn & bằng cấp": "education", "trình độ": "education",

    # Summary
    "summary": "summary", "professional summary": "summary", "career summary": "summary",
    "profile": "summary", "personal profile": "summary", "objective": "summary", "career objective": "summary",
    "about me": "summary", "personal statement": "summary",
    "mục tiêu nghề nghiệp": "summary", "mục tiêu": "summary", "tổng quan": "summary",
    "giới thiệu": "summary", "giới thiệu bản thân": "summary", "thông tin bản thân": "summary",

    # Certifications
    "certifications": "certifications", "certificates": "certifications",
    "licenses & certifications": "certifications", "credentials": "certifications",
    "chứng chỉ": "certifications", "chứng chỉ chuyên môn": "certifications", "chứng nhận": "certifications",

    # Awards
    "awards": "awards", "awards & honors": "awards", "honors": "awards", "achievements": "awards",
    "giải thưởng": "awards", "thành tích": "awards", "thành tựu": "awards",

    # Contact
    "contact": "contact", "contact information": "contact", "thông tin liên hệ": "contact",
    "liên hệ": "contact", "thông tin cá nhân": "contact"
}


def _build_phrase_matcher():
    global _phrase_matcher
    if _phrase_matcher is not None:
        return
    _phrase_matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
    for group, terms in SKILL_ONTOLOGY.items():
        patterns = [nlp.make_doc(term) for term in set(terms) if len(term.strip()) > 1]
        _phrase_matcher.add(group, patterns)


def clean_text(t: str) -> str:
    """
    Chuẩn hóa văn bản đầu vào:
    - Chuẩn hóa Unicode NFC (giữ nguyên đầy đủ tiếng Việt có dấu)
    - Thay thế các ký tự gạch ngang đặc biệt, bullet points, dấu ngoặc thông minh
    - Loại bỏ ký tự điều khiển ẩn rác từ PDF
    """
    if not t:
        return ""
    # Unicode NFC normalization for consistent Vietnamese accents
    t = unicodedata.normalize('NFC', t)

    # Replace special bullet points and typographic dashes/quotes
    t = re.sub(r"[–—―]", "-", t)
    t = re.sub(r"[“”«»]", '"', t)
    t = re.sub(r"[‘’`´]", "'", t)
    t = re.sub(r"[•▪►●★\*\t]", " ", t)
    t = t.replace("\u00a0", " ")

    # Remove non-printable control characters while keeping whitespace and valid unicode
    t = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", " ", t)

    # Normalize line breaks and spaces
    t = re.sub(r"[ \t]+", " ", t)
    t = re.sub(r"\s+\n", "\n", t)
    t = re.sub(r"\n{3,}", "\n\n", t)
    return t.strip()


def split_sections(text: str) -> Dict[str, str]:
    """
    Chia tách CV thành các section chuẩn hóa (experience, skills, education, projects, summary...)
    Hỗ trợ cả CV tiếng Anh và tiếng Việt, đánh số thứ tự hoặc gạch đầu dòng.
    """
    heading_pattern = r"(?im)^\s*(?:(?:\d+\.|\b[IVXLCDM]+\.)\s*)?(" + "|".join(map(re.escape, SECTION_HEADINGS)) + r")\s*[:\-]?\s*$"
    parts = re.split(heading_pattern, text)
    sections: Dict[str, str] = {}

    if len(parts) >= 3:
        it = iter(parts[1:])
        for heading, body in zip(it, it):
            raw_key = heading.strip().lower()
            canonical_key = SECTION_CANONICAL_MAP.get(raw_key, raw_key)
            if canonical_key in sections:
                sections[canonical_key] += "\n\n" + body.strip()
            else:
                sections[canonical_key] = body.strip()
            sections[raw_key] = body.strip()
    else:
        sections["full"] = text

    return sections


def extract_contacts(doc_spacy) -> Dict[str, Any]:
    """
    Trích xuất thông tin liên hệ chính xác:
    - Email (Regex + spaCy)
    - Số điện thoại (Chuyên biệt cho định dạng Việt Nam & quốc tế, loại trừ năm 2020-2024)
    - Đường dẫn (Links, GitHub, LinkedIn, Portfolio)
    """
    text = doc_spacy.text

    # Extract emails
    email_regex = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")
    emails = set(email_regex.findall(text))
    for token in doc_spacy:
        if token.like_email:
            emails.add(token.text.strip())
    sorted_emails = sorted(list(emails))

    # Extract phone numbers
    vn_phone_pattern = re.compile(
        r"(?:(?:\+84|84|0)(?:3[2-9]|5[689]|7[06-9]|8[1-9]|9[0-9])[\s\.\-]?\d{3}[\s\.\-]?\d{4}\b)|"
        r"(?:\+?\d{1,3}[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b)"
    )
    phones = set()
    for m in vn_phone_pattern.finditer(text):
        match_str = m.group(0).strip()
        digits = re.sub(r"[^\d+]", "", match_str)
        # Avoid year spans like 20202024
        if 9 <= len(digits) <= 12 and not match_str.startswith("20") and not match_str.startswith("19"):
            phones.add(match_str)
    sorted_phones = sorted(list(phones))

    # Extract URLs and categorize
    links = sorted({t.text for t in doc_spacy if t.like_url or re.search(r'https?://[^\s]+|www\.[^\s]+', t.text)})
    github = [link for link in links if "github.com" in link.lower()]
    linkedin = [link for link in links if "linkedin.com" in link.lower()]
    portfolio = [link for link in links if link not in github and link not in linkedin]

    return {
        "emails": sorted_emails,
        "phones": sorted_phones,
        "links": links,
        "github": github,
        "linkedin": linkedin,
        "portfolio": portfolio
    }


def extract_name(doc_spacy) -> Optional[str]:
    """
    Trích xuất tên ứng viên thông minh:
    1. Kiểm tra prefix: 'Họ và tên:', 'Full Name:', 'Candidate:'
    2. Quét các dòng đầu của CV (hỗ trợ cả CHỮ HOA NGUYỄN VĂN A và Title Case)
    3. Fallback bằng spaCy Named Entity Recognition (PERSON)
    """
    text = doc_spacy.text

    # 1. Pattern-based extraction with label
    prefix_match = re.search(
        r"(?im)^\s*(?:họ\s*(?:và\s*)?tên|full\s*name|họ\s*tên|candidate\s*name|tên\s*ứng\s*viên|name)\s*[:\-]\s*([A-Za-zÀ-ỹ\s]{2,40})$",
        text
    )
    if prefix_match:
        cand = prefix_match.group(1).strip()
        if 2 <= len(cand.split()) <= 5 and not re.search(r'[\d@#$\*/]', cand):
            return cand

    # Words that should never be treated as candidate name
    blacklist_words = {
        'cv', 'resume', 'curriculum vitae', 'profile', 'contact', 'thông tin',
        'mục tiêu', 'developer', 'engineer', 'software', 'backend', 'frontend',
        'fullstack', 'intern', 'fresher', 'junior', 'senior', 'kinh nghiệm',
        'học vấn', 'kỹ năng', 'dự án', 'portfolio', 'page', 'trang', 'about me'
    }

    # 2. Top lines heuristic
    lines = [line.strip() for line in text.splitlines()[:6] if line.strip()]
    for line in lines:
        line_clean = re.sub(r"^[•\*\-\s]+", "", line).strip()
        words = line_clean.split()

        # Check word length (typically 2 to 4 words in Vietnam and international names)
        if 2 <= len(words) <= 4:
            # Must not contain digits, email symbols, or URLs
            if not re.search(r'[\d@#$:/\\_\.\+]', line_clean):
                line_lower = line_clean.lower()
                if not any(bw in line_lower for bw in blacklist_words):
                    # Accept ALL CAPS (e.g., NGUYEN VAN A) or Title Case (Nguyen Van A)
                    if line_clean.isupper() or line_clean.istitle() or all(w[0].isupper() for w in words if w):
                        return line_clean

    # 3. Fallback: spaCy PERSON entity
    persons = [ent.text.strip() for ent in doc_spacy.ents if ent.label_ == "PERSON"]
    for p in persons:
        words = p.split()
        if 2 <= len(words) <= 4 and not re.search(r'[\d@#$\*/\+]', p):
            if not any(bw in p.lower() for bw in blacklist_words):
                return p

    return None


def extract_skills(nlp_doc) -> Dict[str, List[str]]:
    """
    Trích xuất kỹ năng bằng PhraseMatcher kết hợp chuẩn hóa Alias (ReactJS -> React, K8s -> Kubernetes)
    Đảm bảo các kỹ năng ngắn như 'C', 'R', 'Go' không bị nhận diện sai.
    """
    _build_phrase_matcher()
    matches = _phrase_matcher(nlp_doc)
    bucket = defaultdict(set)

    for match_id, start, end in matches:
        group = nlp.vocab.strings[match_id]
        skill_raw = nlp_doc[start:end].text.lower().strip()
        # Normalize skill with canonical aliases
        canonical_skill = SKILL_ALIASES.get(skill_raw, skill_raw)
        bucket[group].add(canonical_skill)

    # Word-boundary check for short special languages like C, C++, C#, R, Go
    full_text = nlp_doc.text
    if re.search(r"(?i)\b(c\+\+)\b", full_text):
        bucket["hard"].add("c++")
    if re.search(r"(?i)\b(c\#|\.net)\b", full_text):
        bucket["hard"].add("c#")
    if re.search(r"(?i)\b(golang|go\s+language)\b", full_text):
        bucket["hard"].add("go")

    return {group: sorted(list(skills)) for group, skills in bucket.items()}


def extract_education(text: str) -> List[str]:
    """
    Trích xuất thông tin học vấn, hỗ trợ cả trường đại học Việt Nam, quốc tế, chuyên ngành và GPA.
    """
    edu_keywords = [
        'university', 'college', 'institute', 'academy', 'bachelor', 'master', 'phd',
        'degree', 'gpa', 'đại học', 'cao đẳng', 'học viện', 'cử nhân', 'kỹ sư',
        'thạc sĩ', 'tiến sĩ', 'chuyên ngành', 'bằng cấp', 'khoa công nghệ', 'bách khoa'
    ]
    results = []
    for line in text.split('\n'):
        line_clean = line.strip()
        if not line_clean:
            continue
        line_lower = line_clean.lower()
        if any(keyword in line_lower for keyword in edu_keywords):
            if len(line_clean) > 5 and not any(kw in line_lower for kw in ['kinh nghiệm', 'kỹ năng']):
                results.append(line_clean)

    return results[:5]


def _month_to_int(m: str) -> int:
    if not m:
        return 1
    m = m.lower().strip()
    return _MONTHS.get(m, 1) if not m.isdigit() else (int(m) if 1 <= int(m) <= 12 else 1)


def _span_to_sortkey(m1: str, y1: str, m2: str, y2: str) -> int:
    try:
        y2_clean = (y2 or "").lower().strip()
        is_current = y2_clean in ("present", "current", "now", "hiện tại", "nay")
        y2n = 9999 if is_current else int(y2)
        m2n = 12 if is_current else _month_to_int(m2 or "12")
        return y2n * 100 + m2n
    except (ValueError, TypeError):
        try:
            return int(y1) * 100 + _month_to_int(m1 or "1")
        except (ValueError, TypeError):
            return 0


def _extract_date_span(text: str) -> dict:
    for rx in DATE_SPANS_RX:
        m = rx.search(text)
        if m:
            gd = m.groupdict()
            y1, y2, m1, m2 = gd.get("y1"), gd.get("y2"), gd.get("m1"), gd.get("m2")
            key = _span_to_sortkey(m1, y1, m2, y2)
            return {"text": m.group(0), "sortkey": key, "start_year": y1, "end_year": y2}
    return {"text": None, "sortkey": 0, "start_year": None, "end_year": None}


def extract_experience_blocks(text: str) -> List[Dict[str, Any]]:
    """
    Phân tích các khối kinh nghiệm làm việc:
    - Chức danh (Title)
    - Công ty/Tổ chức (Organization)
    - Khoảng thời gian (Dates & Recency Sortkey)
    """
    doc = nlp(text)
    sentences = [s.text.strip() for s in doc.sents if s.text.strip()]
    if not sentences:
        return []

    blocks, current_block = [], []
    for sent in sentences:
        has_year = bool(re.search(r'\b(20\d{2}|19\d{2})\b', sent))
        has_title = bool(JOB_TITLE_RX.search(sent))
        has_org = bool(ORG_HINT_RX.search(sent))

        if (has_year or has_title or has_org) and current_block:
            blocks.append(" ".join(current_block))
            current_block = [sent]
        else:
            current_block.append(sent)

    if current_block:
        blocks.append(" ".join(current_block))

    results = []
    for block_text in blocks:
        title_match = JOB_TITLE_RX.search(block_text)
        org_match = ORG_HINT_RX.search(block_text)
        date_info = _extract_date_span(block_text)

        # Clean block snippet
        clean_snippet = block_text[:400] + ("..." if len(block_text) > 400 else "")

        results.append({
            "raw": clean_snippet,
            "title": title_match.group(0).title() if title_match else None,
            "organization": org_match.group(0) if org_match else None,
            "dates": date_info["text"],
            "recency_key": date_info["sortkey"]
        })

    results.sort(key=lambda x: x["recency_key"], reverse=True)
    return results[:10]