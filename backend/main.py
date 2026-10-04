import os
from typing import Optional

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from deepfake_detector import analyze_uploaded_image
from news_detector import analyze_news

app = FastAPI(title="TruthLens AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NewsRequest(BaseModel):
    text: str = Field(default="", description="Article or news text to analyze")
    url: Optional[str] = Field(default=None, description="Optional source URL")


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}


@app.post("/api/analyze-news")
def analyze_news_endpoint(payload: NewsRequest):
    try:
        result = analyze_news(payload.text, payload.url)
        return result
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/api/analyze-image")
async def analyze_image_endpoint(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Please select an image file.")

    if file.content_type and file.content_type.split("/")[0] != "image":
        raise HTTPException(status_code=400, detail="Unsupported file type. Please upload an image.")

    image_bytes = await file.read()
    if len(image_bytes) > 15 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Image is too large. Please upload an image under 15MB.")

    try:
        result = analyze_uploaded_image(image_bytes, file.filename)
        return result
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)), reload=True)
