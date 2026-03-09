"""
AI Microservice for Smart Medicine Reminder
Provides simulated pill verification via camera image analysis.

In production, this would use a trained ML model (e.g., TensorFlow/PyTorch)
to identify pills from images. For this demo, it returns simulated results.
"""

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI(title="MedReminder AI Service", version="1.0.0")

# Allow cross-origin requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "OK", "message": "AI Microservice is running"}


@app.post("/verify-pill")
async def verify_pill(image: UploadFile = File(...)):
    """
    Accepts an image file of a pill and returns a simulated
    verification result. In production, replace this with
    actual ML inference.
    """
    # Read image data (not used in simulation)
    contents = await image.read()
    file_size = len(contents)

    # Simulated verification — 90% success rate
    is_verified = random.random() > 0.1
    confidence = round(random.uniform(0.85, 0.99), 2) if is_verified else round(random.uniform(0.3, 0.5), 2)

    return {
        "verified": is_verified,
        "confidence": confidence,
        "pill_name": "Aspirin 500mg" if is_verified else "Unknown",
        "message": "Pill verified successfully" if is_verified else "Could not verify pill",
        "image_size_bytes": file_size,
    }
