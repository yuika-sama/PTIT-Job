# services/cv_parser.py
import re
from typing import Dict, List, Optional
from collections import defaultdict
from spacy.matcher import PhraseMatcher

from services.models import nlp
from utils.constants import (
    SKILL_ONTOLOGY, SECTION_HEADINGS, DATE_SPANS_RX, _MONTHS,
    JOB_TITLE_RX, ORG_HINT_RX
)

_phrase_matcher: Optional[PhraseMatcher] = None

def _build_phrase_matcher():
    global _phrase_matcher
    if _phrase_matcher is not None:
        return
    _phrase_matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
    for group, terms in SKILL_ONTOLOGY.items():
        patterns = [nlp.make_doc(term) for term in set(terms)]
        _phrase_matcher.add(group, patterns)

def clean_text(t: str) -> str:
    t = re.sub(r"[^\x09\x0A\x0D\x20-\x7EÀ-ỹ]", " ", t)
    t = re.sub(r"\s+\n", "\n", t)
    t = re.sub(r"[ \t]+", " ", t)
    t = re.sub(r"\n{2,}", "\n\n", t)
    return t.strip()

def split_sections(text: str) -> Dict[str, str]:
    pattern = r"(?im)^\s*(" + "|".join(map(re.escape, SECTION_HEADINGS)) + r")\s*[:\-]?\s*$"
    parts = re.split(pattern, text)
    sections = {}
    if len(parts) >= 3:
        it = iter(parts[1:])
        for heading, body in zip(it, it):
            sections[heading.lower()] = body.strip()
    else:
        sections["full"] = text
    return sections

def extract_contacts(doc_spacy) -> Dict[str, List[str]]:
    emails = sorted({t.text for t in doc_spacy if t.like_email})
    links = sorted({t.text for t in doc_spacy if t.like_url})
    phones = sorted({re.sub(r"[^\d+]", "", m.group(0)) for m in re.finditer(r"(\+?\d[\d\-\s\(\)]{7,}\d)", doc_spacy.text)})
    return {"emails": emails, "phones": phones, "links": links}

def extract_name(doc_spacy) -> Optional[str]:
    persons = [ent.text.strip() for ent in doc_spacy.ents if ent.label_ == "PERSON"]
    if persons:
        first_person = persons[0]
        if 2 <= len(first_person.split()) <= 4 and not re.search(r'[\d@#$]', first_person):
            return first_person
    for line in doc_spacy.text.strip().splitlines()[:3]:
        line = line.strip()
        if 2 <= len(line.split()) <= 4 and line.istitle() and not re.search(r'[\d@#$]', line):
            if not any(kw in line.lower() for kw in ['cv', 'resume', 'profile', 'contact']):
                return line
    return None

def extract_skills(nlp_doc) -> Dict[str, List[str]]:
    _build_phrase_matcher()
    matches = _phrase_matcher(nlp_doc)
    bucket = defaultdict(set)
    for match_id, start, end in matches:
        group = nlp.vocab.strings[match_id]
        bucket[group].add(nlp_doc[start:end].text.lower().strip())
    return {group: sorted(list(skills)) for group, skills in bucket.items()}

def extract_education(text: str) -> List[str]:
    # A simplified version for brevity. Can be expanded.
    edu_keywords = ['university', 'college', 'institute', 'bachelor', 'master', 'phd', 'degree']
    results = []
    for line in text.split('\n'):
        if any(keyword in line.lower() for keyword in edu_keywords):
            cleaned_line = line.strip()
            if cleaned_line:
                results.append(cleaned_line)
    return results[:5]

def extract_experience_blocks(text: str) -> List[Dict[str, any]]:
    # Simplified version using semantic blocks
    doc = nlp(text)
    sentences = [s.text.strip() for s in doc.sents if s.text.strip()]
    if not sentences: return []

    blocks, current_block = [], []
    for sent in sentences:
        if any([re.search(r'\d{4}', sent), JOB_TITLE_RX.search(sent), ORG_HINT_RX.search(sent)]) and current_block:
            blocks.append(" ".join(current_block))
            current_block = [sent]
        else:
            current_block.append(sent)
    if current_block: blocks.append(" ".join(current_block))

    results = []
    for block_text in blocks:
        # Simplified extraction logic
        title_match = JOB_TITLE_RX.search(block_text)
        org_match = ORG_HINT_RX.search(block_text)
        date_info = _extract_date_span(block_text)
        results.append({
            "raw": block_text[:400] + "...",
            "title": title_match.group(0) if title_match else None,
            "organization": org_match.group(0) if org_match else None,
            "dates": date_info["text"],
            "recency_key": date_info["sortkey"]
        })
    results.sort(key=lambda x: x["recency_key"], reverse=True)
    return results[:10]

def _month_to_int(m: str) -> int:
    if not m: return 1
    m = m.lower()
    return _MONTHS.get(m, 1) if not m.isdigit() else (int(m) if 1 <= int(m) <= 12 else 1)

def _span_to_sortkey(m1: str, y1: str, m2: str, y2: str) -> int:
    try:
        y2n = 9999 if y2.lower() in ("present", "current", "now") else int(y2)
        m2n = 12 if y2.lower() in ("present", "current", "now") else _month_to_int(m2 or "12")
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
            return {"text": m.group(0), "sortkey": key}
    return {"text": None, "sortkey": 0}