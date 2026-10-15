import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.quantum_routes import router as quantum_router

app = FastAPI(title="Ketrix API", version="1.0.0")

# Allowed origins for CORS
# Configurable via environment variable ALLOWED_ORIGINS (comma-separated)
# Defaults to the official production frontend and standard local development ports
env_origins = os.getenv("ALLOWED_ORIGINS") or os.getenv("CORS_ORIGINS")
if env_origins:
    origins = [origin.strip() for origin in env_origins.split(",") if origin.strip()]
else:
    origins = [
        "https://ketrix.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"^https://.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register quantum router on standard /api/v1/quantum and fallback /quantum
app.include_router(quantum_router, prefix="/api/v1/quantum", tags=["Quantum"])
app.include_router(quantum_router, prefix="/quantum", tags=["Quantum"])

@app.get("/")
def root():
    return {"status": "ok", "message": "Ketrix API is running"}

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Backend is running successfully"}

@app.get("/api/v1/health")
def health_check_v1():
    return {"status": "ok", "message": "Backend is running successfully"}

