# run command: python -m uvicorn main:app --reload --port 8000
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import các router từ thư mục api
from api import cv, interview

# --- Khởi tạo ứng dụng ---
app = FastAPI(
    title="AI Interview & CV Analysis API",
    description="An API that uses NLP to analyze CVs and simulate technical interviews.",
    version="1.0.0"
)

# --- Middleware ---
# Cấu hình CORS để cho phép frontend ReactJS gọi tới API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routers ---
# Gắn các router từ các file khác vào ứng dụng chính
app.include_router(cv.router, prefix="/api/v1", tags=["CV Analysis"])
app.include_router(interview.router, prefix="/api/v1", tags=["Interview Simulation"])

# --- Endpoint gốc ---
@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the AI Interview & CV Analysis API!"}