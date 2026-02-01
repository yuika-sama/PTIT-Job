# 🎓 PTIT Job - Nền tảng tuyển dụng việc làm IT

<div align="center">

![PTIT Job](https://img.shields.io/badge/PTIT-Job_Portal-0066CC?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)
![Bun](https://img.shields.io/badge/Bun-1.x-000000?style=for-the-badge&logo=bun)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python)

**Hệ thống tìm kiếm và quản lý việc làm toàn diện với trí tuệ nhân tạo**

[Tính năng](#-tính-năng) • [Công nghệ](#-công-nghệ) • [Cài đặt](#-cài-đặt-và-chạy-dự-án) • [API](#-api-documentation) • [Screenshots](#-screenshots)

</div>

---

## 📖 Giới thiệu

**PTIT Job** là một nền tảng tuyển dụng việc làm hiện đại được xây dựng cho sinh viên và doanh nghiệp IT, tích hợp các tính năng thông minh sử dụng AI để tối ưu hóa quá trình tìm kiếm việc làm và tuyển dụng.

Dự án này là **bài tập lớn môn Lập trình Web & App** tại Học viện Công nghệ Bưu chính Viễn thông (PTIT).

### 🎯 Mục tiêu dự án

- ✅ Xây dựng hệ thống tuyển dụng đa vai trò (Admin, Employer, Candidate)
- ✅ Tích hợp AI để phân tích CV và mô phỏng phỏng vấn
- ✅ Cung cấp các công cụ tính toán lương, thuế, bảo hiểm
- ✅ Thiết kế giao diện thân thiện, responsive
- ✅ Áp dụng kiến trúc Clean Architecture và best practices

## ✨ Tính năng

### 👨‍💼 Dành cho Ứng viên (Candidate)

#### Quản lý hồ sơ
- 📝 Đăng ký/Đăng nhập với JWT authentication
- 👤 Tạo và cập nhật hồ sơ cá nhân
- 📄 Upload và quản lý CV (PDF, DOCX)
- 🎯 Theo dõi lịch sử ứng tuyển

#### Tìm kiếm việc làm
- 🔍 Tìm kiếm công việc thông minh với filter nâng cao
- 🏢 Xem danh sách công ty và chi tiết công ty
- 💼 Danh sách công việc hấp dẫn, công việc tốt nhất
- 📌 Lưu công việc yêu thích
- 📊 Xem chi tiết công việc và yêu cầu

#### AI Features
- 🤖 **Đánh giá CV tự động** - Phân tích điểm mạnh/yếu của CV
- 💬 **Mô phỏng phỏng vấn** - Luyện tập phỏng vấn với AI
- 🎯 Gợi ý công việc phù hợp dựa trên kỹ năng

#### Công cụ tính toán
- 💰 **Máy tính lương thực lãnh**
- 📊 **Tính thuế thu nhập cá nhân**
- 🏥 **Tính bảo hiểm xã hội, y tế, thất nghiệp**
- 📈 **Máy tính lãi suất kép** cho đầu tư

### 🏢 Dành cho Nhà tuyển dụng (Employer)

- 📢 Đăng tin tuyển dụng
- 🎯 Quản lý danh sách ứng viên
- 📊 Dashboard thống kê tuyển dụng
- 👥 Xem và đánh giá hồ sơ ứng viên
- ✉️ Gửi thông báo cho ứng viên

### 🔧 Dành cho Quản trị viên (Admin)

#### Quản lý toàn hệ thống
- 👥 **Quản lý người dùng** - Duyệt, khóa/mở khóa tài khoản
- 🏢 **Quản lý công ty** - Phê duyệt công ty mới
- 💼 **Quản lý công việc** - Kiểm duyệt tin tuyển dụng
- 📁 **Quản lý danh mục** - Job categories, Locations
- 📄 **Quản lý đơn ứng tuyển** - Theo dõi toàn bộ applications

#### Thống kê & Báo cáo
- 📊 Dashboard với biểu đồ realtime
- 📈 Thống kê người dùng, công việc, ứng tuyển
- 🎯 Báo cáo hiệu suất hệ thống
- 📉 Phân tích xu hướng tuyển dụng

#### Hệ thống
- 🔐 Quản lý phân quyền
- ⚙️ Cấu hình hệ thống
- 📋 Xem logs hoạt động
- 🛡️ Bảo mật và backup

## 🛠 Công nghệ

### Frontend (Client)

```json
{
  "framework": "React 19.1.1",
  "language": "TypeScript 4.9.5",
  "ui": "Material-UI (MUI) 7.3",
  "routing": "React Router 7.9",
  "http": "Axios 1.12",
  "state": "React Context API",
  "styling": "Emotion (CSS-in-JS)"
}
```

**Dependencies chính:**
- `@mui/material` - Component library Material Design
- `@mui/icons-material` - Icon set
- `react-router-dom` - Client-side routing
- `axios` - HTTP client
- `@emotion/react` & `@emotion/styled` - Styling solution

### Backend (Server)

#### Node.js Server

```json
{
  "runtime": "Bun 1.x",
  "framework": "Elysia 1.4",
  "language": "TypeScript 5.9",
  "database": "PostgreSQL",
  "orm": "pg (node-postgres)",
  "storage": "Supabase Storage",
  "auth": "JWT"
}
```

**Dependencies chính:**
- `elysia` - Fast & lightweight web framework
- `@elysiajs/cors` - CORS middleware
- `@elysiajs/swagger` - API documentation
- `@supabase/supabase-js` - Supabase client
- `jsonwebtoken` - JWT authentication
- `bcrypt` - Password hashing
- `nodemailer` - Email service
- `pg` - PostgreSQL client

#### Python AI Service

```json
{
  "framework": "FastAPI",
  "language": "Python 3.10+",
  "nlp": "spaCy",
  "ai": "Google Generative AI (Gemini)"
}
```

**Dependencies chính:**
- `fastapi` - Modern web framework
- `uvicorn` - ASGI server
- `spacy` - Natural Language Processing
- `google-generativeai` - Google Gemini AI
- `pydantic` - Data validation
- `python-multipart` - File upload support

### Database & Storage

- **PostgreSQL** - Primary database via Supabase
- **Supabase Storage** - File storage cho CV, images
- **Supabase Auth** - Authentication helper

### DevOps & Tools

- **Bun** - Fast JavaScript runtime
- **Concurrently** - Run multiple commands
- **TypeScript** - Type safety
- **Git** - Version control

## 📁 Cấu trúc dự án

```
PTIT-Job/
├── 📄 README.md                    # Tài liệu này
├── 📄 package.json                 # Root package (concurrently)
│
├── 🌐 client/                      # React Frontend
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── AdminHeader.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── CandidateHeader.tsx
│   │   │   ├── CandidateLayout.tsx
│   │   │   ├── EmployerHeader.tsx
│   │   │   ├── EmployerLayout.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── ...
│   │   │
│   │   ├── pages/                  # Page components
│   │   │   ├── Admin/              # Admin pages
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── Users.tsx
│   │   │   │   ├── Companies.tsx
│   │   │   │   ├── Jobs.tsx
│   │   │   │   ├── Applications.tsx
│   │   │   │   ├── JobCategories.tsx
│   │   │   │   ├── Locations.tsx
│   │   │   │   └── System.tsx
│   │   │   │
│   │   │   ├── Candidate/          # Candidate pages
│   │   │   │   ├── CandidateDashboard.tsx
│   │   │   │   ├── JobSearchPage.tsx
│   │   │   │   ├── JobDetailsPage.tsx
│   │   │   │   ├── CompaniesPage.tsx
│   │   │   │   ├── CVEvaluationPage.tsx
│   │   │   │   ├── InterviewEmulate.tsx
│   │   │   │   ├── SalaryCalculatorPage.tsx
│   │   │   │   ├── PersonalIncomeTaxPage.tsx
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── Employer/           # Employer pages
│   │   │   │   └── EmployerDashboard.tsx
│   │   │   │
│   │   │   ├── Auth/               # Authentication pages
│   │   │   └── Shared/             # Shared pages
│   │   │
│   │   ├── contexts/               # React Contexts
│   │   │   ├── AuthContext.tsx     # Authentication state
│   │   │   ├── ThemeContext.tsx    # Theme management
│   │   │   └── SidebarContext.tsx  # Sidebar state
│   │   │
│   │   ├── services/               # API Services
│   │   │   ├── authService.ts
│   │   │   ├── jobService.ts
│   │   │   ├── companyService.ts
│   │   │   ├── resumeService.ts
│   │   │   ├── cvAIService.ts
│   │   │   └── ...
│   │   │
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── types/                  # TypeScript types
│   │   ├── utils/                  # Utility functions
│   │   ├── routes/                 # Route configuration
│   │   ├── App.tsx                 # Root component
│   │   └── index.tsx               # Entry point
│   │
│   ├── public/
│   ├── build/                      # Production build
│   ├── .env                        # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
└── 🖥️ server/                      # Backend Services
    │
    ├── nodeServer/                 # Node.js/Bun API
    │   ├── controllers/            # Request handlers
    │   │   ├── AuthController.ts
    │   │   ├── UserController.ts
    │   │   ├── CompanyController.ts
    │   │   ├── JobController.ts
    │   │   ├── JobApplicationController.ts
    │   │   ├── ResumeController.ts
    │   │   ├── JobCategoryController.ts
    │   │   ├── LocationController.ts
    │   │   └── StatsController.ts
    │   │
    │   ├── routes/                 # API routes
    │   │   ├── AuthRoutes.ts
    │   │   ├── UserRoutes.ts
    │   │   ├── CompanyRoutes.ts
    │   │   ├── JobRoutes.ts
    │   │   ├── JobApplicationRoutes.ts
    │   │   ├── ResumeRoutes.ts
    │   │   ├── JobCategoryRoutes.ts
    │   │   ├── LocationRoutes.ts
    │   │   ├── StatsRoutes.ts
    │   │   └── index.ts
    │   │
    │   ├── services/               # Business logic
    │   ├── models/                 # Data models
    │   ├── middlewares/            # Middlewares (auth, etc.)
    │   ├── utils/                  # Helper functions
    │   ├── config/                 # Configuration
    │   │   └── supabase.ts
    │   │
    │   ├── index.ts                # Server entry
    │   ├── .env                    # Environment variables
    │   ├── package.json
    │   └── tsconfig.json
    │
    └── pyAI/                       # Python AI Service
        ├── api/                    # FastAPI routes
        │   ├── cv.py              # CV analysis endpoints
        │   └── interview.py       # Interview simulation
        │
        ├── services/               # AI services
        ├── schemas/                # Pydantic schemas
        ├── utils/                  # Utilities
        ├── main.py                # FastAPI app
        └── requirements.txt
```

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống

- **Node.js** >= 18.x hoặc **Bun** >= 1.x (khuyến nghị Bun)
- **Python** >= 3.10
- **PostgreSQL** >= 14 (hoặc sử dụng Supabase)
- **npm** hoặc **yarn**

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd PTIT-Job
```

### Bước 2: Cài đặt Backend (Node.js Server)

```bash
cd server/nodeServer

# Cài đặt dependencies (với Bun - khuyến nghị)
bun install

# Hoặc với npm
npm install

# Tạo file .env từ template
cp .env.example .env
```

**Cấu hình `.env` cho Backend:**

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=postgresql://user:password@host:port/database
DB_SCHEMA=public

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Email (Mailtrap for development)
EMAIL_SERVICE=mailtrap
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_mailtrap_user
EMAIL_PASS=your_mailtrap_password

# CORS
CORS_ORIGIN=http://localhost:3000
```

**Chạy Backend:**

```bash
# Development mode với hot-reload
bun run dev

# Hoặc production mode
bun start
```

Server sẽ chạy tại: `http://localhost:5000`

### Bước 3: Cài đặt AI Service (Python)

```bash
cd server/pyAI

# Tạo virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt

# Download spaCy language model
python -m spacy download en_core_web_sm

# Tạo file .env
cp .env.example .env
```

**Cấu hình `.env` cho AI Service:**

```env
# Google Gemini AI
GOOGLE_API_KEY=your_google_gemini_api_key

# Server
PORT=8000
```

**Chạy AI Service:**

```bash
# Chạy với uvicorn
python -m uvicorn main:app --reload --port 8000

# Hoặc sử dụng script
python main.py
```

AI Service sẽ chạy tại: `http://localhost:8000`

### Bước 4: Cài đặt Frontend (React)

```bash
cd client

# Cài đặt dependencies
npm install

# Tạo file .env
cp .env.example .env
```

**Cấu hình `.env` cho Frontend:**

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_AI_API_URL=http://localhost:8000/api/v1
REACT_APP_DEVELOPMENT_MODE=true
```

**Chạy Frontend:**

```bash
# Development mode
npm start
```

Frontend sẽ chạy tại: `http://localhost:3000`

### Bước 5: Chạy toàn bộ hệ thống

Từ thư mục root `PTIT-Job/`:

```bash
# Chạy đồng thời Backend + Frontend
npm start
```

Lệnh này sử dụng `concurrently` để chạy:
- Backend server (port 5000)
- Frontend app (port 3000)

**Lưu ý:** Bạn cần chạy AI Service riêng trong terminal khác.

## 🔌 API Documentation

### Base URLs

- **Backend API**: `http://localhost:5000/api`
- **AI Service**: `http://localhost:8000/api/v1`
- **Swagger Docs**: `http://localhost:5000/swagger`

### Authentication Endpoints

```http
POST   /api/auth/register          # Đăng ký tài khoản mới
POST   /api/auth/login             # Đăng nhập
POST   /api/auth/logout            # Đăng xuất
GET    /api/auth/me                # Lấy thông tin user hiện tại
POST   /api/auth/refresh-token     # Refresh JWT token
POST   /api/auth/forgot-password   # Quên mật khẩu
POST   /api/auth/reset-password    # Đặt lại mật khẩu
POST   /api/auth/verify-email      # Xác thực email
```

### User Management

```http
GET    /api/users                  # Danh sách users (Admin)
GET    /api/users/:id              # Chi tiết user
PUT    /api/users/:id              # Cập nhật user
DELETE /api/users/:id              # Xóa user (Admin)
PATCH  /api/users/:id/role         # Thay đổi role (Admin)
PATCH  /api/users/:id/status       # Lock/Unlock user (Admin)
```

### Jobs

```http
GET    /api/jobs                   # Danh sách công việc
GET    /api/jobs/:id               # Chi tiết công việc
POST   /api/jobs                   # Tạo tin tuyển dụng (Employer)
PUT    /api/jobs/:id               # Cập nhật tin (Employer/Admin)
DELETE /api/jobs/:id               # Xóa tin (Employer/Admin)
GET    /api/jobs/search            # Tìm kiếm công việc
GET    /api/jobs/featured          # Công việc nổi bật
GET    /api/jobs/best              # Công việc tốt nhất
GET    /api/jobs/company/:id       # Công việc của công ty
```

### Companies

```http
GET    /api/companies              # Danh sách công ty
GET    /api/companies/:id          # Chi tiết công ty
POST   /api/companies              # Tạo công ty
PUT    /api/companies/:id          # Cập nhật công ty
DELETE /api/companies/:id          # Xóa công ty (Admin)
GET    /api/companies/top          # Top công ty
PATCH  /api/companies/:id/verify   # Xác thực công ty (Admin)
```

### Applications

```http
GET    /api/applications           # Danh sách đơn ứng tuyển
GET    /api/applications/:id       # Chi tiết đơn
POST   /api/applications           # Nộp đơn ứng tuyển
PUT    /api/applications/:id       # Cập nhật đơn
DELETE /api/applications/:id       # Hủy đơn
PATCH  /api/applications/:id/status # Cập nhật trạng thái (Employer)
GET    /api/applications/job/:id   # Đơn theo công việc
GET    /api/applications/user/:id  # Đơn theo user
```

### Resumes

```http
GET    /api/resumes                # Danh sách CV
GET    /api/resumes/:id            # Chi tiết CV
POST   /api/resumes/upload         # Upload CV (multipart/form-data)
DELETE /api/resumes/:id            # Xóa CV
GET    /api/resumes/download/:id   # Download CV
```

### Job Categories & Locations

```http
GET    /api/categories             # Danh sách danh mục
POST   /api/categories             # Tạo danh mục (Admin)
PUT    /api/categories/:id         # Cập nhật danh mục (Admin)
DELETE /api/categories/:id         # Xóa danh mục (Admin)

GET    /api/locations              # Danh sách địa điểm
POST   /api/locations              # Tạo địa điểm (Admin)
PUT    /api/locations/:id          # Cập nhật địa điểm (Admin)
DELETE /api/locations/:id          # Xóa địa điểm (Admin)
```

### Statistics (Admin)

```http
GET    /api/stats/dashboard        # Thống kê tổng quan
GET    /api/stats/users            # Thống kê người dùng
GET    /api/stats/jobs             # Thống kê công việc
GET    /api/stats/applications     # Thống kê ứng tuyển
GET    /api/stats/companies        # Thống kê công ty
GET    /api/stats/trends           # Xu hướng theo thời gian
```

### AI Endpoints

```http
POST   /api/v1/cv/analyze          # Phân tích CV
POST   /api/v1/cv/evaluate         # Đánh giá CV (scoring)
POST   /api/v1/cv/suggestions      # Gợi ý cải thiện CV

POST   /api/v1/interview/start     # Bắt đầu phỏng vấn
POST   /api/v1/interview/answer    # Trả lời câu hỏi
POST   /api/v1/interview/feedback  # Nhận feedback
```

### Request/Response Examples

**Đăng nhập:**

```json
// POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "Nguyễn Văn A",
      "role": "candidate"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Tạo công việc:**

```json
// POST /api/jobs
// Headers: Authorization: Bearer {token}
{
  "title": "Senior Frontend Developer",
  "company_id": 5,
  "category_id": 2,
  "location_id": 1,
  "description": "We are looking for...",
  "requirements": "- 3+ years experience\n- ReactJS...",
  "salary_min": 20000000,
  "salary_max": 30000000,
  "employment_type": "full-time",
  "experience_level": "senior"
}
```

## 🗄️ Database Schema

### Core Tables

#### `users`
```sql
- id (PK)
- email (unique)
- password_hash
- full_name
- role (admin/employer/candidate)
- phone
- avatar_url
- is_active
- email_verified
- created_at
- updated_at
```

#### `companies`
```sql
- id (PK)
- user_id (FK -> users)
- company_name
- description
- industry
- company_size
- website
- logo_url
- address
- is_verified
- created_at
```

#### `jobs`
```sql
- id (PK)
- company_id (FK -> companies)
- category_id (FK -> job_categories)
- location_id (FK -> locations)
- title
- description
- requirements
- salary_min
- salary_max
- employment_type
- experience_level
- deadline
- is_active
- created_at
- updated_at
```

#### `job_applications`
```sql
- id (PK)
- job_id (FK -> jobs)
- user_id (FK -> users)
- resume_id (FK -> resumes)
- cover_letter
- status (pending/reviewing/approved/rejected)
- applied_at
- reviewed_at
```

#### `resumes`
```sql
- id (PK)
- user_id (FK -> users)
- file_name
- file_url
- file_size
- file_type
- uploaded_at
```

#### `job_categories`
```sql
- id (PK)
- name
- description
- icon
```

#### `locations`
```sql
- id (PK)
- name (city/province)
- country
```

## 🔐 Authentication & Security

### JWT Authentication
- **Access Token**: Thời hạn 24 giờ, dùng cho các API request
- **Refresh Token**: Thời hạn 7 ngày, dùng để gia hạn access token
- Tokens được lưu trong localStorage (client-side)
- Middleware xác thực trên mọi protected routes

### Password Security
- Sử dụng **bcrypt** với salt rounds = 10
- Passwords không bao giờ được lưu dưới dạng plain text
- Có tính năng reset password qua email

### CORS Configuration
- Chỉ cho phép origin từ frontend (`http://localhost:3000`)
- Credentials được bật để gửi cookies

### Role-Based Access Control (RBAC)
- **Admin**: Full access to all resources
- **Employer**: Manage own company, jobs, view applications
- **Candidate**: View jobs, apply, manage own profile

## 🧪 Testing

### Backend Testing
```bash
cd server/nodeServer
bun test
```

### Frontend Testing
```bash
cd client
npm test
npm run test:coverage
```

### API Testing
Sử dụng Swagger UI tại `http://localhost:5000/swagger` hoặc Postman collection.

## 📦 Build & Deployment

### Build Frontend cho Production

```bash
cd client
npm run build
```

Build output nằm trong `client/build/`, có thể deploy lên:
- **Vercel**
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**

### Deploy Backend

Backend có thể deploy lên:

**Vercel** (đã có config):
```bash
cd server/nodeServer
vercel --prod
```

**Railway**:
```bash
railway up
```

**Docker**:
```dockerfile
# Dockerfile example
FROM oven/bun:1
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
COPY . .
CMD ["bun", "start"]
```

### Environment Variables cho Production

Nhớ cập nhật các biến môi trường:
- `NODE_ENV=production`
- `CORS_ORIGIN=https://yourdomain.com`
- `DATABASE_URL` (production database)
- `JWT_SECRET` (strong random string)

## 🎨 Screenshots

### Candidate Dashboard
*(Thêm ảnh chụp màn hình dashboard của candidate)*

### Job Search
*(Thêm ảnh chụp màn hình trang tìm kiếm)*

### AI CV Evaluation
*(Thêm ảnh chụp màn hình tính năng AI)*

### Admin Panel
*(Thêm ảnh chụp màn hình admin)*

## 📚 Tài liệu tham khảo

### Technologies Documentation
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Elysia Documentation](https://elysiajs.com)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Material-UI Documentation](https://mui.com)
- [Supabase Documentation](https://supabase.com/docs)

### Libraries & Tools
- [Bun Documentation](https://bun.sh/docs)
- [spaCy Documentation](https://spacy.io)
- [Google Gemini AI](https://ai.google.dev)

## 🐛 Known Issues & Limitations

- [ ] AI Service cần Google API key (có giới hạn free tier)
- [ ] Email service dùng Mailtrap (chỉ cho development)
- [ ] Chưa có real-time notifications (WebSocket)
- [ ] Chưa có chat giữa employer và candidate
- [ ] Upload file size limit: 10MB

## 🚀 Future Enhancements

- [ ] WebSocket cho real-time notifications
- [ ] Chat system giữa employer và candidate
- [ ] Video interview integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support (i18n)
- [ ] Dark mode toggle
- [ ] Social login (Google, Facebook)
- [ ] Company verification system
- [ ] Job recommendation engine improvement

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation when needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team & Contributors

**PTIT Job Development Team**

- **Backend Development**: Node.js/Bun API with Elysia
- **Frontend Development**: React + TypeScript + Material-UI
- **AI/ML Development**: Python FastAPI + spaCy + Google Gemini
- **Database Design**: PostgreSQL + Supabase

## 📧 Contact & Support

- **Project Repository**: [GitHub Repository URL]
- **Report Issues**: [GitHub Issues URL]
- **Email**: support@ptitjob.com
- **Documentation**: [Wiki/Docs URL]

## 🙏 Acknowledgments

- Học viện Công nghệ Bưu chính Viễn thông (PTIT)
- Giảng viên hướng dẫn môn Lập trình Web & App
- Open source community
- Material-UI team
- Supabase team
- All contributors

---

<div align="center">

**Made with ❤️ by PTIT Students**

⭐ Star this repo if you find it helpful!

[⬆ Back to top](#-ptit-job---nền-tảng-tuyển-dụng-việc-làm-it)

</div>
