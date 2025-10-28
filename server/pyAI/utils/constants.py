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
    {"type": "behavioral", "question": "Hãy mô tả một vấn đề kỹ thuật khó khăn mà bạn gần đây đã giải quyết.", "concepts": "problem solving STAR method situation task action result technical details debugging logic solution approach outcome"},
    {"type": "behavioral", "question": "Bạn cập nhật kiến thức công nghệ mới như thế nào?", "concepts": "continuous learning blogs articles twitter conferences courses documentation pet projects online communities practice passion for technology"},
    {"type": "behavioral", "question": "Kể về một lần bạn có bất đồng quan điểm với thành viên trong team.", "concepts": "teamwork collaboration communication conflict resolution empathy professional compromise understanding perspective listening"},
    {"type": "behavioral", "question": "Bạn đã từng làm việc dưới áp lực deadline như thế nào?", "concepts": "time management stress management prioritization organization planning execution deadline delivery quality balance"},
    {"type": "behavioral", "question": "Mô tả một dự án mà bạn đặc biệt tự hào và vai trò của bạn trong đó.", "concepts": "achievement leadership contribution impact responsibility ownership technical decisions architecture results metrics success"},
    {"type": "behavioral", "question": "Bạn xử lý feedback tiêu cực hoặc criticism như thế nào?", "concepts": "growth mindset self improvement learning from mistakes resilience adaptability professional development constructive criticism emotional intelligence"},
    {"type": "behavioral", "question": "Kể về một lần bạn phải học một công nghệ mới trong thời gian ngắn.", "concepts": "learning ability adaptability quick study resources documentation tutorials practice hands-on experience problem solving persistence"},
    {"type": "behavioral", "question": "Bạn đã từng mentor hoặc giúp đỡ đồng nghiệp junior như thế nào?", "concepts": "mentorship teaching knowledge sharing patience guidance support team development leadership communication skills helping others"}
]

TECH_QUESTION_BANK = {
    "python": [
        {"question": "Sự khác biệt giữa list và tuple trong Python là gì?", "concepts": "mutable immutable performance hashable dictionary keys data integrity memory management reference semantics"},
        {"question": "Giải thích về Python GIL (Global Interpreter Lock) và ảnh hưởng của nó.", "concepts": "threading concurrency parallelism multiprocessing CPU-bound I/O-bound performance limitations workarounds multi-core"},
        {"question": "Decorators trong Python hoạt động như thế nào?", "concepts": "higher-order functions closures wrapper function metadata preservation functools syntax sugar metaprogramming"},
        {"question": "List comprehension và generator expression khác nhau như thế nào?", "concepts": "memory efficiency lazy evaluation iteration performance yield syntax memory consumption large datasets"}
    ],
    "fastapi": [
        {"question": "Ưu điểm chính của FastAPI so với Flask hoặc Django là gì?", "concepts": "performance async await asynchronous ASGI Pydantic data validation automatic docs Swagger UI type hints modern Python dependency injection"},
        {"question": "Dependency Injection trong FastAPI hoạt động như thế nào?", "concepts": "dependencies shared logic reusable components authentication database connections testing mocking clean code separation of concerns"},
        {"question": "Làm thế nào để xử lý background tasks trong FastAPI?", "concepts": "async tasks background processing email notifications cleanup operations queue workers celery response time performance"}
    ],
    "react": [
        {"question": "Virtual DOM là gì và tại sao nó quan trọng trong React?", "concepts": "reconciliation performance diffing algorithm UI updates state changes memory representation DOM manipulation optimization rendering efficiency"},
        {"question": "Sự khác biệt giữa useState và useRef trong React?", "concepts": "state management re-rendering side effects mutable values DOM references performance optimization hooks lifecycle persistent values"},
        {"question": "React Context API và Redux khác nhau như thế nào?", "concepts": "state management prop drilling global state middleware dev tools scalability performance complexity architecture patterns"},
        {"question": "Giải thích về React memo và khi nào nên sử dụng.", "concepts": "performance optimization re-rendering prevention pure components shallow comparison props equality memoization React.memo"}
    ],
    "javascript": [
        {"question": "Closures trong JavaScript là gì?", "concepts": "lexical scope function scope variable access private variables memory encapsulation inner functions outer variables"},
        {"question": "Event loop trong JavaScript hoạt động như thế nào?", "concepts": "asynchronous call stack callback queue microtasks macrotasks promises async await single-threaded non-blocking execution order"},
        {"question": "Sự khác biệt giữa var, let và const?", "concepts": "variable declaration scope hoisting block scope function scope reassignment immutability temporal dead zone ES6"},
        {"question": "Promise và async/await khác nhau như thế nào?", "concepts": "asynchronous programming error handling syntax readability chaining sequential parallel execution try-catch promise chain"}
    ],
    "sql": [
        {"question": "Sự khác biệt giữa INNER JOIN và LEFT JOIN?", "concepts": "relational database combining rows matching records common records all records from left table NULL values relationship query results"},
        {"question": "Index trong database hoạt động như thế nào và khi nào nên sử dụng?", "concepts": "query performance B-tree hash index composite index covering index cardinality selectivity write overhead optimization query plan"},
        {"question": "Giải thích về ACID properties trong database transactions.", "concepts": "atomicity consistency isolation durability transaction integrity concurrent access rollback commit data reliability concurrent transactions"},
        {"question": "Normalization và denormalization là gì?", "concepts": "database design normal forms redundancy data integrity performance read optimization write optimization schema design trade-offs"}
    ],
    "machine learning": [
        {"question": "Sự khác biệt giữa supervised và unsupervised learning?", "concepts": "labeled data unlabeled data classification regression clustering dimensionality reduction prediction pattern recognition training data ground truth"},
        {"question": "Overfitting là gì và làm thế nào để tránh nó?", "concepts": "generalization training error validation error test error regularization cross-validation dropout early stopping data augmentation model complexity"},
        {"question": "Giải thích về bias-variance tradeoff.", "concepts": "model complexity underfitting overfitting generalization error prediction accuracy training data test data model selection balance optimization"},
        {"question": "Feature engineering là gì và tại sao nó quan trọng?", "concepts": "feature extraction feature selection feature transformation domain knowledge data preprocessing model performance prediction accuracy dimensionality"}
    ],
    "docker": [
        {"question": "Docker container khác gì so với virtual machine?", "concepts": "containerization OS-level virtualization lightweight images Dockerfile isolation kernel sharing hypervisor resource efficiency startup time portability"},
        {"question": "Giải thích về Docker layers và caching.", "concepts": "image layers build optimization layer caching Dockerfile instructions base images intermediate layers storage efficiency rebuild time"},
        {"question": "Docker Compose được sử dụng để làm gì?", "concepts": "multi-container applications orchestration service definition networking volumes environment configuration YAML development environment microservices"}
    ],
    "git": [
        {"question": "Giải thích sự khác biệt giữa git merge và git rebase.", "concepts": "version control combining branches commit history linear history merge commit rewriting history conflict resolution workflow integration strategy"},
        {"question": "Git cherry-pick hoạt động như thế nào?", "concepts": "selective commits applying changes commit hash branch management history manipulation specific commit transfer workflow"},
        {"question": "Khi nào nên sử dụng git stash?", "concepts": "work in progress temporary storage context switching branch switching uncommitted changes clean working directory save state"}
    ],
    "nodejs": [
        {"question": "Event-driven architecture trong Node.js là gì?", "concepts": "non-blocking I/O asynchronous event loop callbacks event emitters scalability concurrent connections single-threaded performance"},
        {"question": "Sự khác biệt giữa process.nextTick() và setImmediate()?", "concepts": "event loop phases microtasks macrotasks execution order callback queue I/O operations timing priority"},
        {"question": "Làm thế nào để xử lý errors trong Node.js async code?", "concepts": "error handling try-catch async await promise rejection unhandled rejection error propagation callback error-first middleware"}
    ],
    "api": [
        {"question": "RESTful API design principles là gì?", "concepts": "HTTP methods resources stateless CRUD operations endpoints URL structure status codes JSON REST constraints idempotency"},
        {"question": "Sự khác biệt giữa authentication và authorization?", "concepts": "identity verification access control permissions roles JWT OAuth session token security user authentication authorization levels"},
        {"question": "Rate limiting trong API là gì và tại sao cần thiết?", "concepts": "API throttling abuse prevention DDoS protection resource management quotas request limits performance scalability fair usage"}
    ],
    "system design": [
        {"question": "Làm thế nào để thiết kế một hệ thống scalable?", "concepts": "horizontal scaling vertical scaling load balancing caching database sharding microservices distributed systems architecture bottlenecks performance"},
        {"question": "CAP theorem là gì?", "concepts": "consistency availability partition tolerance distributed systems trade-offs network partition failure modes database design NoSQL eventual consistency"},
        {"question": "Caching strategies có những loại nào?", "concepts": "cache-aside write-through write-back read-through TTL invalidation CDN Redis Memcached performance optimization"}
    ],
    "testing": [
        {"question": "Unit test và integration test khác nhau như thế nào?", "concepts": "test scope isolation dependencies mocking test pyramid test coverage test automation fast feedback component interaction"},
        {"question": "TDD (Test-Driven Development) là gì?", "concepts": "red-green-refactor test first development cycle code quality design improvement test coverage regression prevention continuous testing"},
        {"question": "Làm thế nào để viết testable code?", "concepts": "dependency injection loose coupling single responsibility SOLID principles pure functions side effects mocking interfaces separation of concerns"}
    ]
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