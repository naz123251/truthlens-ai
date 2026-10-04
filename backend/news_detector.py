import re
from urllib.parse import urlparse

SENSATIONAL_KEYWORDS = [
    "shocking", "urgent", "breaking", "miracle", "secret", "exposed", "unbelievable",
    "must see", "you won’t believe", "banned", "viral", "dramatic", "caught on camera",
    "revealed", "scandal", "bombshell", "crazy", "outrageous", "stunning"
]

SUSPICIOUS_PHRASES = [
    "everyone is talking about", "doctors hate this", "this will change everything",
    "click here now", "share now", "huge conspiracy", "hidden truth", "they don't want you to know",
    "it is proven", "guaranteed", "miracle cure", "zero calories", "instant results"
]

EXTRAORDINARY_CLAIMS = [
    "cure", "healed overnight", "reverses aging", "eliminates all", "impossible", "secret ingredient",
    "billionaires are hiding", "aliens", "government cover-up", "world ending", "no one can explain"
]

def _normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip()


def _is_suspicious_url(url: str) -> bool:
    if not url:
        return False
    parsed = urlparse(url)
    host = (parsed.netloc or "").lower()
    suspicious_tokens = ["bit.ly", "tinyurl", "goo.gl", "t.co", "ow.ly", "t.ly", "shorturl", "adf.ly"]
    return any(token in host for token in suspicious_tokens) or host.count(".") <= 1


def analyze_news(text: str, url: str | None = None) -> dict:
    if not text or not text.strip():
        raise ValueError("News text is required for analysis.")

    cleaned = _normalize_text(text)
    lower = cleaned.lower()
    reasons = []

    if any(keyword in lower for keyword in SENSATIONAL_KEYWORDS):
        reasons.append("Sensational language detected")
    if any(phrase in lower for phrase in SUSPICIOUS_PHRASES):
        reasons.append("Suspicious or emotionally charged phrasing")
    if any(claim in lower for claim in EXTRAORDINARY_CLAIMS):
        reasons.append("Extraordinary claim without balanced context")
    if re.search(r"!{2,}", text):
        reasons.append("Excessive emotional language")
    if not re.search(r"(according to|study|report|research|source|official|expert|analyst|said)", lower):
        reasons.append("No clear source or attribution mentioned")
    if not re.search(r"\d+\s*(%|percent|sources?|studies?|reports?|experts?)", lower):
        reasons.append("Insufficient supporting evidence")
    if url and _is_suspicious_url(url):
        reasons.append("Suspicious URL pattern detected")

    if not reasons:
        reasons = ["No obvious warning signs detected, but independent verification is still recommended."]

    risk_score = min(100, max(0, 18 + len(reasons) * 12 + (2 if url and _is_suspicious_url(url) else 0)))

    if risk_score < 30:
        verdict = "LOW RISK"
        recommendation = "This content appears relatively cautious. Verify the source and check for corroboration before sharing."
    elif risk_score < 60:
        verdict = "MEDIUM RISK"
        recommendation = "Cross-check this claim with multiple reliable sources before trusting or sharing it."
    else:
        verdict = "HIGH RISK"
        recommendation = "Verify this claim using multiple reliable sources before sharing."

    if url and not re.match(r"^https?://", url):
        raise ValueError("Please provide a valid HTTP or HTTPS URL.")

    return {
        "risk_score": int(risk_score),
        "verdict": verdict,
        "reasons": reasons,
        "recommendation": recommendation,
        "trust_score": 100 - int(risk_score)
    }
