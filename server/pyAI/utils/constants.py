# utils/constants.py
import re

SKILL_ONTOLOGY = {
    "hard": [
        # Programming Languages
        "python", "java", "javascript", "typescript", "c++", "c#", "golang", "go",
        "php", "ruby", "rust", "kotlin", "swift", "dart", "scala", "r",
        "html", "html5", "css", "css3", "sass", "scss", "sql", "bash", "shell",

        # Frontend Frameworks & Libraries
        "react", "reactjs", "react.js", "vue", "vuejs", "vue.js", "angular",
        "next.js", "nextjs", "nuxt", "nuxtjs", "svelte", "redux", "zustand",
        "tailwind", "tailwindcss", "bootstrap", "material ui", "ant design",

        # Backend Frameworks
        "fastapi", "django", "flask", "nodejs", "node.js", "express", "expressjs",
        "nestjs", "nest.js", "spring", "spring boot", "asp.net", ".net", ".net core",
        "laravel", "symfony", "gin", "echo", "fiber", "ruby on rails", "rails",

        # Mobile Development
        "flutter", "react native", "android", "ios",

        # AI, Data Science & Machine Learning
        "machine learning", "deep learning", "nlp", "natural language processing",
        "computer vision", "llm", "large language models", "generative ai", "genai",
        "langchain", "rag", "scikit-learn", "pandas", "numpy", "matplotlib", "seaborn",
        "pytorch", "tensorflow", "keras", "opencv", "huggingface",
        "transformers", "sentence transformers", "sbert", "spacy", "nltk", "gensim",
        "data analysis", "data science", "data preprocessing", "feature engineering",
        "etl", "data pipeline", "spark", "pyspark", "hadoop",

        # Databases, ORM & Caching
        "postgresql", "postgres", "mysql", "mongodb", "redis", "elasticsearch",
        "sqlite", "oracle", "mariadb", "cassandra", "dynamodb", "neo4j",
        "prisma", "typeorm", "hibernate", "sqlalchemy", "sequelize",

        # Cloud, DevOps & System Architecture
        "docker", "kubernetes", "k8s", "airflow", "terraform", "ansible",
        "jenkins", "github actions", "gitlab ci", "ci/cd",
        "linux", "ubuntu", "nginx", "apache", "kafka", "rabbitmq",
        "rest api", "restful", "restful api", "graphql", "grpc", "microservices",
        "websocket", "socket.io", "system design", "distributed systems",
        "oop", "design patterns", "solid", "clean architecture", "mvc",

        # Software Quality & Testing
        "pytest", "unittest", "jest", "mocha", "junit", "selenium", "cypress",
        "tdd", "bdd", "unit test", "integration test"
    ],
    "tools": [
        "jupyter", "colab", "mlflow", "dvc", "streamlit", "gradio",
        "aws", "amazon web services", "gcp", "google cloud", "azure", "firebase", "supabase",
        "git", "github", "gitlab", "bitbucket",
        "postman", "swagger", "jira", "confluence", "trello",
        "figma", "docker compose", "vscode", "pycharm", "intellij"
    ],
    "soft": [
        "teamwork", "communication", "problem solving", "leadership",
        "time management", "collaboration", "adaptability", "critical thinking",
        "presentation", "mentoring", "agile", "scrum", "kanban",
        "work under pressure", "attention to detail", "analytical thinking",
        "làm việc nhóm", "giao tiếp", "giải quyết vấn đề", "quản lý thời gian",
        "tư duy phản biện", "thích nghi", "lãnh đạo", "tinh thần trách nhiệm"
    ]
}

# Skill canonical mapping / aliases to normalize variations
SKILL_ALIASES = {
    "reactjs": "react",
    "react.js": "react",
    "nextjs": "next.js",
    "vuejs": "vue",
    "vue.js": "vue",
    "nuxtjs": "nuxt",
    "nodejs": "node.js",
    "node.js": "node.js",
    "expressjs": "express",
    "nestjs": "nest.js",
    "golang": "go",
    "k8s": "kubernetes",
    "postgres": "postgresql",
    "sklearn": "scikit-learn",
    "js": "javascript",
    "ts": "typescript",
    "ml": "machine learning",
    "dl": "deep learning",
    "ci-cd": "ci/cd",
    "cicd": "ci/cd",
    "restful api": "rest api",
    "restful": "rest api",
    ".net core": ".net",
    "asp.net core": "asp.net",
    "amazon web services": "aws",
    "google cloud": "gcp",
    "google cloud platform": "gcp"
}

SECTION_HEADINGS = [
    # Skills
    "skills", "technical skills", "tech skills", "programming skills",
    "core competencies", "competencies", "key skills", "professional skills",
    "skills & tools", "kỹ năng", "kỹ năng chuyên môn", "kỹ năng kỹ thuật",
    "kỹ năng chính", "các kỹ năng", "kỹ năng lập trình",

    # Experience
    "experience", "work experience", "professional experience", "employment",
    "work history", "employment history", "career history",
    "kinh nghiệm", "kinh nghiệm làm việc", "quá trình làm việc", "lịch sử làm việc",
    "kinh nghiệm chuyên môn", "kinh nghiệm thực tế",

    # Projects
    "projects", "personal projects", "selected projects", "academic projects",
    "key projects", "notable projects",
    "dự án", "dự án cá nhân", "dự án tiêu biểu", "các dự án", "dự án đã tham gia",

    # Education
    "education", "academic background", "academic history", "academic qualifications",
    "educational background",
    "học vấn", "trình độ học vấn", "quá trình học vấn", "bằng cấp", "học vấn & bằng cấp",
    "trình độ",

    # Summary & Objective
    "summary", "professional summary", "career summary", "profile", "personal profile",
    "objective", "career objective", "about me", "personal statement", "executive summary",
    "mục tiêu nghề nghiệp", "mục tiêu", "tổng quan", "giới thiệu", "giới thiệu bản thân",
    "thông tin bản thân", "tóm tắt bản thân",

    # Certifications & Licenses
    "certifications", "certificates", "licenses & certifications", "credentials",
    "chứng chỉ", "chứng chỉ chuyên môn", "chứng nhận",

    # Awards & Honors
    "awards", "awards & honors", "honors", "achievements", "key achievements",
    "giải thưởng", "thành tích", "thành tựu",

    # Publications & Research
    "publications", "research", "patents", "presentations", "nghiên cứu",

    # Contact & Personal info
    "contact", "contact information", "personal details", "thông tin liên hệ",
    "liên hệ", "thông tin cá nhân",

    # Activities & Interests
    "interests", "hobbies", "personal interests", "activities",
    "sở thích", "hoạt động", "hoạt động ngoại khóa"
]

JOB_TITLE_HINTS = [
    "engineer", "developer", "data scientist", "machine learning", "ml", "nlp", "ai",
    "analyst", "consultant", "architect", "manager", "lead", "specialist", "intern",
    "researcher", "devops", "backend", "frontend", "fullstack", "software", "android", "ios",
    "tester", "qa", "qc", "product owner", "scrum master", "tech lead", "cto",
    "kỹ sư", "lập trình viên", "chuyên viên", "thực tập sinh", "trưởng nhóm", "nhân viên"
]

# Ngân hàng câu hỏi hành vi (STAR method) kèm khái niệm song ngữ Anh - Việt
BEHAVIORAL_QUESTIONS = [
    {
        "type": "behavioral",
        "question": "Hãy mô tả một vấn đề kỹ thuật khó khăn mà bạn gần đây đã giải quyết.",
        "concepts": "problem solving STAR method situation task action result technical details debugging logic solution approach outcome giải quyết vấn đề khó khăn thách thức giải pháp kết quả công nghệ tư duy phân tích nguyên nhân"
    },
    {
        "type": "behavioral",
        "question": "Bạn cập nhật kiến thức công nghệ mới như thế nào?",
        "concepts": "continuous learning blogs articles conferences courses documentation pet projects online communities practice passion học hỏi liên tục tài liệu khóa học dự án cá nhân đam mê công nghệ cộng đồng đọc sách"
    },
    {
        "type": "behavioral",
        "question": "Kể về một lần bạn có bất đồng quan điểm với thành viên trong team và cách bạn xử lý.",
        "concepts": "teamwork collaboration communication conflict resolution empathy professional compromise understanding perspective listening làm việc nhóm giao tiếp giải quyết mâu thuẫn lắng nghe thấu hiểu đồng thuận hiệu quả"
    },
    {
        "type": "behavioral",
        "question": "Bạn đã từng làm việc dưới áp lực deadline gấp như thế nào?",
        "concepts": "time management stress management prioritization organization planning execution deadline delivery quality balance quản lý thời gian ưu tiên công việc chịu áp lực tiến độ chất lượng lập kế hoạch bàn giao"
    },
    {
        "type": "behavioral",
        "question": "Mô tả một dự án mà bạn đặc biệt tự hào và vai trò cụ thể của bạn trong đó.",
        "concepts": "achievement leadership contribution impact responsibility ownership technical decisions architecture results metrics success thành tựu đóng góp vai trò trách nhiệm kiến trúc kết quả sản phẩm tự hào"
    },
    {
        "type": "behavioral",
        "question": "Bạn đón nhận và xử lý feedback tiêu cực hoặc nhận xét mang tính xây dựng như thế nào?",
        "concepts": "growth mindset self improvement learning from mistakes resilience adaptability feedback criticism tiếp thu cải thiện phát triển bản thân học từ sai lầm tư duy cầu tiến phản hồi tích cực"
    },
    {
        "type": "behavioral",
        "question": "Kể về một lần bạn phải học một công nghệ mới trong thời gian rất ngắn để hoàn thành công việc.",
        "concepts": "learning ability adaptability quick study resources documentation tutorials practice hands-on persistence học nhanh thích nghi tài liệu thực hành kiên trì tự học giải quyết bài toán cấp bách"
    },
    {
        "type": "behavioral",
        "question": "Bạn đã từng hỗ trợ, chia sẻ kiến thức hoặc mentor cho đồng nghiệp khác như thế nào?",
        "concepts": "mentorship teaching knowledge sharing guidance support team development leadership communication chia sẻ kiến thức hướng dẫn giúp đỡ đồng nghiệp đào tạo gắn kết đội ngũ"
    }
]

# Ngân hàng câu hỏi kỹ thuật chuyên sâu theo từng mảng, kèm khái niệm song ngữ (concepts)
TECH_QUESTION_BANK = {
    "python": [
        {
            "question": "Sự khác biệt giữa list và tuple trong Python là gì? Khi nào nên sử dụng loại nào?",
            "concepts": "mutable immutable thay đổi bất biến performance hiệu năng hashable dictionary keys data integrity memory management bộ nhớ tốc độ tham chiếu an toàn dữ liệu"
        },
        {
            "question": "Giải thích về Python GIL (Global Interpreter Lock) và ảnh hưởng của nó tới xử lý đa luồng.",
            "concepts": "threading concurrency parallelism multiprocessing cpu-bound io-bound performance limitations multi-core khóa thông dịch đa luồng đa tiến trình nghẽn hiệu năng"
        },
        {
            "question": "Decorators trong Python hoạt động như thế nào và thường ứng dụng trong trường hợp nào?",
            "concepts": "higher-order functions closures wrapper function functools wraps syntax sugar metaprogramming logging auth timing đóng gói hàm lồng ghi log kiểm tra quyền đo thời gian"
        },
        {
            "question": "List comprehension và generator expression khác nhau như thế nào về mặt sử dụng bộ nhớ?",
            "concepts": "memory efficiency lazy evaluation iteration yield large datasets generator expression tối ưu bộ nhớ nạp lười duyệt từng phần tử dữ liệu lớn"
        }
    ],
    "fastapi": [
        {
            "question": "Ưu điểm chính của FastAPI so với Flask hoặc Django là gì?",
            "concepts": "performance async await asynchronous asgi pydantic data validation automatic docs swagger openapi type hints hiệu năng cao bất đồng bộ tự động tài liệu xác thực dữ liệu"
        },
        {
            "question": "Dependency Injection trong FastAPI hoạt động như thế nào và mang lại lợi ích gì?",
            "concepts": "dependency injection depends reusable components authentication database session testing clean code tái sử dụng quản lý phiên kết nối kiểm thử phân tách trách nhiệm"
        },
        {
            "question": "Làm thế nào để xử lý Background Tasks trong FastAPI khi cần gửi email hoặc tác vụ nặng?",
            "concepts": "background tasks async processing non-blocking email worker queue celery response time tác vụ nền chạy ngầm không chặn phản hồi gửi thư xử lý ngầm"
        }
    ],
    "react": [
        {
            "question": "Virtual DOM là gì và cơ chế reconciliation (diffing) hoạt động như thế nào trong React?",
            "concepts": "virtual dom reconciliation diffing algorithm dom manipulation state changes performance rendering batching cập nhật giao diện cây dom ảo so sánh hiệu năng tối ưu hiển thị"
        },
        {
            "question": "Sự khác biệt giữa useState và useRef trong React? Khi nào nên dùng useRef?",
            "concepts": "state management re-render mutable value dom reference persistence lifecycle trigger render không gây render lại tham chiếu dom lưu giá trị tạm thời"
        },
        {
            "question": "React Context API và Redux khác nhau như thế nào? Khi nào nên chọn Redux?",
            "concepts": "state management prop drilling global state middleware devtools scalability performance complexity luân chuyển dữ liệu trạng thái toàn cục ứng dụng lớn trung gian"
        },
        {
            "question": "Giải thích về React.memo, useMemo và useCallback trong việc tối ưu hóa hiệu năng render.",
            "concepts": "performance optimization re-render prevention memoization memo shallow compare dependencies cache calculation function reference chống render thừa lưu bộ nhớ đệm hàm tính toán"
        }
    ],
    "javascript": [
        {
            "question": "Closures trong JavaScript là gì và ứng dụng thực tế của nó?",
            "concepts": "lexical scope closures function scope variable access private variables encapsulation data privacy bao đóng phạm vi biến hàm lồng nhau biến riêng tư đóng gói"
        },
        {
            "question": "Event Loop trong JavaScript hoạt động như thế nào giữa Call Stack, Microtasks và Macrotasks?",
            "concepts": "event loop call stack callback queue microtasks macrotasks promise settimeout single-threaded non-blocking luồng đơn bất đồng bộ hàng đợi thứ tự thực thi"
        },
        {
            "question": "Sự khác biệt giữa var, let và const trong JavaScript?",
            "concepts": "variable declaration scope hoisting block scope function scope temporal dead zone immutability phạm vi khối biến tái khai báo hằng số"
        },
        {
            "question": "Promise và async/await khác nhau như thế nào trong việc quản lý mã bất đồng bộ?",
            "concepts": "asynchronous promise async await error handling try catch chaining readability non-blocking xử lý bất đồng bộ bắt lỗi chuỗi promise cú pháp rõ ràng"
        }
    ],
    "typescript": [
        {
            "question": "Sự khác biệt giữa Interface và Type trong TypeScript là gì? Khi nào nên dùng loại nào?",
            "concepts": "interface type alias declaration merging union intersection primitives extends implements mở rộng gộp khai báo kiểu dữ liệu hợp giao hướng đối tượng"
        },
        {
            "question": "Generics trong TypeScript là gì và tại sao chúng lại quan trọng đối với khả năng tái sử dụng mã nguồn?",
            "concepts": "generics type safety reusability flexible type parameter constraints an toàn kiểu tái sử dụng tham số kiểu ràng buộc dữ liệu đa hình"
        }
    ],
    "java": [
        {
            "question": "Giải thích các nguyên lý OOP (Hướng đối tượng) cơ bản và cách chúng được áp dụng trong Java.",
            "concepts": "encapsulation inheritance polymorphism abstraction oop solid đóng gói kế thừa đa hình trừu tượng hướng đối tượng tái sử dụng"
        },
        {
            "question": "Sự khác biệt giữa ArrayList và LinkedList trong Java về cấu trúc dữ liệu và độ phức tạp?",
            "concepts": "arraylist linkedlist dynamic array doubly linked list time complexity random access insertion deletion o(1) o(n) mảng động danh sách liên kết truy xuất chèn xóa"
        },
        {
            "question": "Cơ chế Garbage Collection (Thu gom rác) trong JVM hoạt động như thế nào?",
            "concepts": "jvm garbage collection memory management heap stack eden survivor young generation old generation stop the world dọn rác quản lý bộ nhớ phân vùng"
        }
    ],
    "spring": [
        {
            "question": "Inversion of Control (IoC) và Dependency Injection (DI) trong Spring Framework là gì?",
            "concepts": "ioc di inversion of control dependency injection spring bean application context loose coupling đảo ngược điều khiển tiêm phụ thuộc giảm liên kết quản lý bean"
        },
        {
            "question": "Spring Boot khác với Spring Framework truyền thống như thế nào?",
            "concepts": "auto configuration embedded server tomcat starter dependencies opinionated rapid development tự động cấu hình máy chủ nhúng khởi tạo nhanh tối giản xml"
        }
    ],
    "c#": [
        {
            "question": "Sự khác biệt giữa Value Types và Reference Types trong C# (.NET)?",
            "concepts": "value types reference types stack heap struct class memory allocation boxing unboxing kiểu giá trị kiểu tham chiếu vùng nhớ sao chép"
        },
        {
            "question": "Async và Await trong C# hoạt động như thế nào cùng với Task?",
            "concepts": "async await task thread pool non-blocking asynchronous i/o task completion bất đồng bộ hồ luồng giải phóng luồng xử lý io"
        }
    ],
    "nodejs": [
        {
            "question": "Event-driven, Non-blocking I/O trong Node.js hoạt động như thế nào để phục vụ hàng ngàn kết nối đồng thời?",
            "concepts": "event-driven non-blocking io libuv worker pool concurrency single-threaded scalability kiến trúc hướng sự kiện bất đồng bộ xử lý song song thông lượng cao"
        },
        {
            "question": "Sự khác biệt giữa process.nextTick() và setImmediate() trong Node.js?",
            "concepts": "event loop phases microtasks macrotasks execution order priority nexttick setimmediate thứ tự ưu tiên các pha vòng lặp sự kiện"
        },
        {
            "question": "Cách xử lý Exception và Unhandled Promise Rejections trong ứng dụng Node.js quy mô lớn?",
            "concepts": "error handling try-catch unhandled rejection uncaught exception centralized logging middleware graceful shutdown bắt lỗi tập trung nhật ký hạ cánh an toàn"
        }
    ],
    "sql": [
        {
            "question": "Sự khác biệt giữa INNER JOIN, LEFT JOIN, RIGHT JOIN và FULL JOIN trong SQL?",
            "concepts": "relational database inner join left join right join full join null records matching rows kết nối bảng bản ghi chung giá trị null tập hợp"
        },
        {
            "question": "Index (Chỉ mục) trong Database hoạt động như thế nào (B-Tree)? Khi nào không nên tạo Index?",
            "concepts": "indexing b-tree query performance execution plan write overhead cardinality full table scan tối ưu truy vấn cây tìm kiếm chi phí ghi giảm thời gian tìm kiếm"
        },
        {
            "question": "Giải thích các thuộc tính ACID trong quản lý giao dịch (Transaction) của Database.",
            "concepts": "acid atomicity consistency isolation durability transaction rollback commit tính nguyên tử nhất quán cô lập bền vững giao dịch an toàn dữ liệu"
        },
        {
            "question": "Sự khác biệt giữa SQL (Relational) và NoSQL (Document/Key-Value)? Khi nào nên chọn loại nào?",
            "concepts": "relational nosql mongodb postgresql schema consistency horizontal scaling unstructured data cơ sở dữ liệu quan hệ phi quan hệ mở rộng ngang dữ liệu phi cấu trúc"
        }
    ],
    "docker": [
        {
            "question": "Docker container khác biệt thế nào so với Virtual Machine (Máy ảo truyền thống)?",
            "concepts": "containerization virtualization lightweight isolation os-level kernel sharing hypervisor resource overhead máy ảo bộ chứa ảo hóa tầng hđh chia sẻ nhân nhẹ khởi động nhanh"
        },
        {
            "question": "Giải thích về Docker Image Layers và cơ chế caching khi build Dockerfile.",
            "concepts": "image layers build cache dockerfile optimization intermediate layers storage multi-stage build các lớp ảnh bộ nhớ đệm tối ưu dung lượng bước build"
        },
        {
            "question": "Docker Compose phục vụ mục đích gì trong môi trường phát triển và triển khai?",
            "concepts": "docker compose multi-container orchestration yaml environment variables networking volumes điều phối đa dịch vụ thiết lập môi trường biến môi trường liên kết container"
        }
    ],
    "git": [
        {
            "question": "Giải thích sự khác biệt giữa git merge và git rebase. Khi nào nên dùng git rebase?",
            "concepts": "version control git merge git rebase commit history linear history conflict resolution gộp nhánh viết lại lịch sử lịch sử thẳng xung đột mã nguồn"
        },
        {
            "question": "Git cherry-pick và git stash hoạt động như thế nào trong thực tế?",
            "concepts": "cherry-pick git stash temporary save commit hash context switching lưu tạm thay đổi chọn lọc commit chuyển nhánh khẩn cấp"
        }
    ],
    "machine learning": [
        {
            "question": "Sự khác biệt giữa Supervised Learning (Học có giám sát) và Unsupervised Learning (Học không giám sát)?",
            "concepts": "supervised unsupervised labeled data unlabeled classification regression clustering ground truth học có giám sát không giám sát phân loại hồi quy phân cụm nhãn"
        },
        {
            "question": "Hiện tượng Overfitting (Quá khớp) là gì và những phương pháp phổ biến để ngăn ngừa nó?",
            "concepts": "overfitting generalization validation loss regularization dropout cross-validation early stopping quá khớp suy diễn kém điều chuẩn kiểm định chéo dừng sớm tăng cường dữ liệu"
        },
        {
            "question": "Giải thích về Bias-Variance Tradeoff trong các mô hình Machine Learning.",
            "concepts": "bias variance tradeoff underfitting overfitting model complexity generalization error độ lệch độ phương sai cân bằng mô hình lỗi tổng quát"
        },
        {
            "question": "Feature Engineering là gì và tầm quan trọng của nó đối với hiệu năng mô hình?",
            "concepts": "feature engineering feature selection transformation domain knowledge data preprocessing kỹ thuật tạo đặc trưng tiền xử lý dữ liệu trích xuất thuộc tính"
        }
    ],
    "api": [
        {
            "question": "Những nguyên tắc cốt lõi trong thiết kế RESTful API chuẩn là gì?",
            "concepts": "restful api http methods get post put delete status codes stateless resource-oriented idempotency phương thức http mã trạng thái phi trạng thái định danh tài nguyên"
        },
        {
            "question": "Sự khác biệt giữa Authentication (Xác thực) và Authorization (Phân quyền)? JWT hoạt động như thế nào?",
            "concepts": "authentication authorization jwt tokens identity roles permissions security bearer token xác thực danh tính phân quyền truy cập chữ ký số bảo mật"
        },
        {
            "question": "Rate Limiting trong API là gì và giải pháp triển khai nó trong hệ thống backend?",
            "concepts": "rate limiting throttling token bucket leaky bucket redis ddos protection fair use giới hạn tần suất chống tấn công bảo vệ tài nguyên thuật toán thùng rò"
        }
    ],
    "system design": [
        {
            "question": "Làm thế nào để thiết kế một hệ thống backend có khả năng mở rộng (Scalable) đáp ứng hàng triệu người dùng?",
            "concepts": "scalability horizontal vertical load balancer caching cdn database sharding replication microservices mở rộng hệ thống cân bằng tải bộ nhớ đệm phân mảnh csdl bản sao"
        },
        {
            "question": "Định lý CAP (CAP Theorem) là gì và ứng dụng trong việc chọn lựa Database phân tán?",
            "concepts": "cap theorem consistency availability partition tolerance distributed systems nosql trade-offs tính nhất quán tính sẵn sàng chịu phân vùng hệ phân tán đánh đổi"
        },
        {
            "question": "Các chiến lược Caching phổ biến (Cache-Aside, Write-Through, Write-Behind) và cách chống Cache Invalidation?",
            "concepts": "caching strategies cache-aside write-through write-back redis ttl cache invalidation bộ nhớ đệm cập nhật dữ liệu hết hạn chiến lược lưu đệm"
        }
    ],
    "testing": [
        {
            "question": "Sự khác biệt giữa Unit Test, Integration Test và End-to-End (E2E) Test trong Test Pyramid?",
            "concepts": "unit test integration test e2e test pyramid mocking isolation test coverage kiểm thử đơn vị kiểm thử tích hợp kiểm thử đầu cuối tháp kiểm thử giả lập"
        },
        {
            "question": "TDD (Test-Driven Development) là gì? Quy trình Red-Green-Refactor hoạt động ra sao?",
            "concepts": "tdd test-driven development red green refactor code quality regression testing phát triển hướng kiểm thử chu kỳ viết test trước tái cấu trúc chất lượng mã"
        }
    ]
}

# Regex Patterns
JOB_TITLE_RX = re.compile(r"(?i)\b(" + "|".join(map(re.escape, JOB_TITLE_HINTS)) + r")\b")
ORG_HINT_RX = re.compile(
    r"(?i)\b(inc|ltd|llc|corp|co\.|company|group|studio|systems|solutions|technologies|university|bank|jsc|joint stock|"
    r"công ty|tnhh|cổ phần|tập đoàn|ngân hàng|viện|đại học|trường)\b"
)

# Date extraction regex patterns covering both English and Vietnamese formats
DATE_SPANS_RX = [
    # E.g., Jan 2021 - Dec 2023, Jan 2021 to Present
    re.compile(
        r"(?i)\b(?P<m1>jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\s+(?P<y1>\d{4})\s*[–\-to]+\s*(?:(?P<m2>jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\s+)?(?P<y2>\d{4}|present|current|now|hiện tại|nay)\b"
    ),
    # E.g., 2020 - 2024, 2021 - Present
    re.compile(r"(?i)\b(?P<y1>\d{4})\s*[–\-to]+\s*(?P<y2>\d{4}|present|current|now|hiện tại|nay)\b"),
    # E.g., 01/2021 - 12/2023, 1/2021 - hiện tại
    re.compile(r"(?i)\b(?P<m1>\d{1,2})[/\-](?P<y1>\d{4})\s*[–\-to]+\s*(?:(?P<m2>\d{1,2})[/\-])?(?P<y2>\d{4}|present|current|now|hiện tại|nay)\b"),
    # E.g., Tháng 01/2021 - Tháng 12/2023
    re.compile(r"(?i)\b(?:tháng\s+)?(?P<m1>\d{1,2})[/\.](?P<y1>\d{4})\s*[–\-tođến]+\s*(?:(?:tháng\s+)?(?P<m2>\d{1,2})[/\.])?(?P<y2>\d{4}|present|current|now|hiện tại|nay)\b"),
]

_MONTHS = {
    'jan': 1, 'january': 1, 'tháng 1': 1, 'tháng 01': 1, 't1': 1, 't01': 1,
    'feb': 2, 'february': 2, 'tháng 2': 2, 'tháng 02': 2, 't2': 2, 't02': 2,
    'mar': 3, 'march': 3, 'tháng 3': 3, 'tháng 03': 3, 't3': 3, 't03': 3,
    'apr': 4, 'april': 4, 'tháng 4': 4, 'tháng 04': 4, 't4': 4, 't04': 4,
    'may': 5, 'tháng 5': 5, 'tháng 05': 5, 't5': 5, 't05': 5,
    'jun': 6, 'june': 6, 'tháng 6': 6, 'tháng 06': 6, 't6': 6, 't06': 6,
    'jul': 7, 'july': 7, 'tháng 7': 7, 'tháng 07': 7, 't7': 7, 't07': 7,
    'aug': 8, 'august': 8, 'tháng 8': 8, 'tháng 08': 8, 't8': 8, 't08': 8,
    'sep': 9, 'sept': 9, 'september': 9, 'tháng 9': 9, 'tháng 09': 9, 't9': 9, 't09': 9,
    'oct': 10, 'october': 10, 'tháng 10': 10, 't10': 10,
    'nov': 11, 'november': 11, 'tháng 11': 11, 't11': 11,
    'dec': 12, 'december': 12, 'tháng 12': 12, 't12': 12
}

# Strict set of meaningless / skip responses (must match as full normalized utterance or regex)
EXACT_MEANINGLESS_RESPONSES = {
    # English skip / don't know
    "i dont know", "i don't know", "i do not know", "idk", "dk", "dunno", "i dunno",
    "no idea", "not sure", "i'm not sure", "im not sure", "no clue", "no answer",
    "no comment", "can't say", "cant say", "don't remember", "forgot", "pass", "skip",
    "next", "none", "n/a", "na", "null", "empty", "test", "testing", "asdf", "qwerty",
    "123", "1234", "ok", "okay", "yes", "no", "nah", "nope", "whatever", "who cares",

    # Vietnamese skip / don't know
    "không biết", "ko biết", "k biết", "hong biết", "hổng biết", "hông biết",
    "tôi không biết", "tui không biết", "mình không biết", "chịu", "chịu thua", "chịu luôn",
    "không nhớ", "ko nhớ", "k nhớ", "chưa biết", "chưa rõ", "chưa nghĩ ra",
    "không rõ", "ko rõ", "k rõ", "chưa hiểu", "bỏ qua", "qua câu khác", "sau đi",
    "kế tiếp", "ai mà biết", "ai biết", "chịu chết", "hỏi làm gì", "kệ đi"
}