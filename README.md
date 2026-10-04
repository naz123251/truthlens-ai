# TruthLens AI

TruthLens AI is a hackathon-ready MVP that helps users estimate the risk of misinformation and AI-generated content before they trust or share it.

## Problem Statement

The internet is flooded with sensational headlines, manipulated media, and AI-generated visuals that can mislead users and spread false information rapidly. Many people share content without checking its source, evidence, or visual authenticity.

## Solution

TruthLens AI combines two lightweight risk checks:

- A text-based misinformation risk analyzer that reviews sensational wording, weak sources, lack of support, and suspicious patterns.
- An image-based deepfake detector that estimates whether a given image looks synthetic, using a pretrained Hugging Face model when available and a safe demo fallback when model downloads are blocked.

## Features

- Fake News Detector with explainable Credibility Risk scoring
- Deepfake Detector for JPG, JPEG, PNG, and WEBP uploads
- Trust Score with green/yellow/red risk calibration
- Demo mode with fake and real example buttons
- Responsive dark AI-themed UI
- FastAPI API endpoints
- Local in-memory dashboard counters

## Architecture

```text
truthlens/
├── backend/
│   ├── main.py
│   ├── news_detector.py
│   ├── deepfake_detector.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── .env.example
├── README.md
├── .gitignore
└── ...
```

## Technologies

- React + Vite + Tailwind CSS
- Python + FastAPI
- Hugging Face Transformers
- PyTorch
- Pillow

## AI/ML Approach

The backend applies a rule-based misinformation analyzer for explainability and uses a pretrained Hugging Face image-classification model when available for deepfake detection. The project is intentionally transparent about what the app can and cannot verify.

## Installation

From the root project folder:

```bash
cd truthlens/backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

```bash
cd ../frontend
npm install
```

## Run the App

Start the backend:

```bash
cd truthlens/backend
source .venv/bin/activate   # Windows: .venv\Scripts\activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Start the frontend:

```bash
cd truthlens/frontend
npm run dev -- --host 0.0.0.0
```

Open the frontend in the browser:

- http://localhost:5173

API health check:

```bash
curl http://localhost:8000/api/health
```

## API Endpoints

### GET /api/health

Returns:

```json
{"status": "healthy"}
```

### POST /api/analyze-news

Request:

```json
{
  "text": "Breaking: doctors reveal miracle cure...",
  "url": "https://example.com/story"
}
```

Response:

```json
{
  "risk_score": 82,
  "verdict": "HIGH RISK",
  "reasons": ["Sensational language detected", "No clear source mentioned"],
  "recommendation": "Verify this claim using multiple reliable sources before sharing.",
  "trust_score": 18
}
```

### POST /api/analyze-image

Upload a file using multipart form data with the field name `file`.

Example response:

```json
{
  "label": "FAKE",
  "confidence": 0.91,
  "deepfake_probability": 0.91,
  "trust_score": 9,
  "verdict": "POTENTIAL DEEPFAKE",
  "reasons": [
    "Model detected patterns associated with synthetic or manipulated imagery."
  ],
  "demo": false
}
```

## Limitations

- This tool does not determine absolute truth.
- News scoring is heuristic and explainable rather than definitive.
- Deepfake detection is probabilistic and can vary by model and image quality.
- Model availability can depend on environment and internet access.

## Future Improvements

- Video deepfake detection
- Browser extension
- Real-time fact checking
- Source reputation database
- Multilingual detection
- Audio deepfake detection
- Blockchain-based provenance
- Social media integration

## Hackathon Notes

This project was designed to be fast to build and easy to demo. It emphasizes working functionality, transparent risk communication, and a polished front-end over over-engineered ML pipelines.
