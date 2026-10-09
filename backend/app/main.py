from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.quantum_routes import router as quantum_router

app = FastAPI(title="Ketrix API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(quantum_router, prefix="/api/v1/quantum", tags=["Quantum"])

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Backend is running successfully"}
