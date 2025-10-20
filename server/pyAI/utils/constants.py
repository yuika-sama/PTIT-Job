# utils/constants.py
import re

SKILL_ONTOLOGY = {
    "hard": [
        "python", "fastapi", "django", "flask", "nodejs", "react", "javascript",
        "machine learning", "deep learning", "nlp", "natural language processing",
        "scikit-learn", "pandas", "numpy", "matplotlib", "seaborn",
        "pytorch", "tensorflow", "keras",
        "data analysis", "data preprocessing", "feature engineering",
        "sql", "postgresql", "mysql", "mongodb",
        "docker", "kubernetes", "airflow",
        "rest api", "graphql", "microservices",
        "git", "linux", "bash", "pytest",
        "transformers", "sentence transformers", "sbert", "spacy", "nltk", "gensim"
    ],
    "tools": [
        "jupyter", "colab", "mlflow", "dvc",
        "streamlit", "gradio",
        "aws", "gcp", "azure"
    ],
    "soft": [
        "teamwork", "communication", "problem solving",
        "leadership", "time management",
        "collaboration", "adaptability", "critical thinking",
        "presentation", "mentoring"
    ]
}

SECTION_HEADINGS = [
    "skills", "technical skills", "tech skills", "programming skills",
    "core competencies", "competencies", "key skills", "professional skills",
    "experience", "work experience", "professional experience", "employment",
    "projects", "personal projects", "selected projects", "academic projects",
    "education", "academic background", "academic history", "academic qualifications",
    "summary", "professional summary", "career summary", "profile", "personal profile",
    "objective", "career objective", "about me", "personal statement",
    "certifications", "certificates", "licenses & certifications", "credentials",
    "awards", "awards & honors", "honors", "achievements", "key achievements",
    "publications", "research", "patents", "presentations",
    "interests", "hobbies", "personal interests",
]

JOB_TITLE_HINTS = [
    "engineer", "developer", "data scientist", "machine learning", "ml", "nlp", "ai",
    "analyst", "consultant", "architect", "manager", "lead", "specialist", "intern",
    "researcher", "devops", "backend", "frontend", "fullstack", "software", "android", "ios"
]

# Ngân hàng câu hỏi phỏng vấn
BEHAVIORAL_QUESTIONS = [
    {"type": "behavioral", "question": "Can you describe a challenging technical problem you recently solved?", "concepts": "problem solving STAR method situation task action result technical details debugging logic solution"},
    {"type": "behavioral", "question": "How do you stay updated with the latest technologies?", "concepts": "continuous learning blogs articles twitter conferences pet projects documentation passion for technology"},
    {"type": "behavioral", "question": "Tell me about a time you had a disagreement with a team member.", "concepts": "teamwork collaboration communication conflict resolution empathy professional compromise"}
]

TECH_QUESTION_BANK = {
    "python": [{"question": "What is the difference between a list and a tuple in Python?", "concepts": "mutable immutable performance hashable dictionary keys data integrity"}],
    "fastapi": [{"question": "What are the key advantages of using FastAPI over Flask or Django?", "concepts": "performance async await asynchronous ASGI Pydantic data validation automatic docs Swagger UI"}],
    "react": [{"question": "What is the Virtual DOM and why is it important in React?", "concepts": "reconciliation performance diffing algorithm UI updates state changes memory representation"}],
    "sql": [{"question": "What is the difference between an INNER JOIN and a LEFT JOIN?", "concepts": "relational database combining rows matching records common records all records from left table"}],
    "machine learning": [{"question": "Difference between supervised and unsupervised learning?", "concepts": "labeled data unlabeled data classification regression clustering dimensionality reduction prediction"}],
    "docker": [{"question": "What is a Docker container, and how is it different from a virtual machine?", "concepts": "containerization OS-level virtualization lightweight images Dockerfile isolation kernel sharing hypervisor"}],
    "git": [{"question": "Can you explain the difference between `git merge` and `git rebase`?", "concepts": "version control combining branches commit history linear history merge commit rewriting history"}]
}

# --- Regex Patterns ---
JOB_TITLE_RX = re.compile(r"(?i)\b(" + "|".join(map(re.escape, JOB_TITLE_HINTS)) + r")\b")
ORG_HINT_RX = re.compile(r"(?i)\b(inc|ltd|llc|corp|co\.|company|group|studio|systems|solutions|technologies|university|bank|jsc|joint stock)\b")
DATE_SPANS_RX = [
    re.compile(r"(?i)\b(?P<m1>jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\s+(?P<y1>\d{4})\s*[–\-to]+\s*(?:(?P<m2>jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\s+)?(?P<y2>\d{4}|present|current|now)\b"),
    re.compile(r"(?i)\b(?P<y1>\d{4})\s*[–\-to]+\s*(?P<y2>\d{4}|present|current|now)\b"),
    re.compile(r"(?i)\b(?P<m1>\d{1,2})/(?P<y1>\d{4})\s*[–\-to]+\s*(?P<m2>\d{1,2})/(?P<y2>\d{4}|present|current|now)\b"),
]
_MONTHS = {'jan':1,'january':1,'feb':2,'february':2,'mar':3,'march':3,'apr':4,'april':4,'may':5,'jun':6,'june':6,'jul':7,'july':7,'aug':8,'august':8,'sep':9,'sept':9,'september':9,'oct':10,'october':10,'nov':11,'november':11,'dec':12,'december':12}