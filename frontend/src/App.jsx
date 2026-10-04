import { useMemo, useRef, useState } from 'react';
import LandingPage from './pages/LandingPage';
import NewsPage from './pages/NewsPage';
import DeepfakePage from './pages/DeepfakePage';
import Dashboard from './pages/Dashboard';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const fakeNewsExample = {
  text:
    'SHOCKING! Doctor reveals secret miracle cure that instantly stops all symptoms—share now before they hide the truth. No official studies, no doctors, no clear source, just a viral claim everyone is sharing online.',
  url: 'https://example-viral-story-short.link/secret-cure',
};

const realNewsExample = {
  text:
    'The local health authority released a statement confirming that a public safety review identified several monitoring gaps but no evidence of a citywide emergency. Officials said the findings were based on a written assessment and follow-up inspections.',
  url: 'https://example.org/health-review-public-statement',
};

const deepfakeDemoResult = {
  label: 'FAKE',
  confidence: 0.91,
  deepfake_probability: 0.91,
  trust_score: 9,
  verdict: 'POTENTIAL DEEPFAKE',
  reasons: [
    'Model detected patterns associated with synthetic or manipulated imagery.',
    'Detection confidence exceeds the configured threshold.',
    'Demo Result: this is a simulation to test the demo flow when model inference is unavailable.',
  ],
  demo: true,
};

const realImageDemoResult = {
  label: 'REAL',
  confidence: 0.92,
  deepfake_probability: 0.08,
  trust_score: 92,
  verdict: 'LIKELY REAL',
  reasons: [
    'The image does not strongly match synthetic manipulation patterns in this model.',
    'Confidence remains probabilistic, so manual review is still encouraged.',
    'Demo Result: this is a simulated fallback to keep the demo working without a model download.',
  ],
  demo: true,
};

const getRiskColor = (score) => {
  if (score < 30) return '#22c55e';
  if (score < 60) return '#f59e0b';
  return '#ef4444';
};

function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [newsText, setNewsText] = useState(fakeNewsExample.text);
  const [newsUrl, setNewsUrl] = useState(fakeNewsExample.url);
  const [newsResult, setNewsResult] = useState(null);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState('');
  const [imageResult, setImageResult] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [dashboard, setDashboard] = useState({ total: 0, news: 0, image: 0, highRisk: 0 });
  const fileInputRef = useRef(null);

  const currentTrustScore = useMemo(() => {
    if (newsResult) return Number(newsResult.trust_score ?? 100 - (newsResult.risk_score ?? 0));
    if (imageResult) return Number(imageResult.trust_score ?? 100);
    return 0;
  }, [newsResult, imageResult]);

  const currentVerdict = useMemo(() => {
    if (newsResult) return newsResult.verdict || 'LOW RISK';
    if (imageResult) return imageResult.verdict || 'LIKELY REAL';
    return 'READY';
  }, [newsResult, imageResult]);

  const incrementDashboard = (type, riskLevel) => {
    setDashboard((prev) => ({
      total: prev.total + 1,
      news: type === 'news' ? prev.news + 1 : prev.news,
      image: type === 'image' ? prev.image + 1 : prev.image,
      highRisk: riskLevel === 'HIGH RISK' || riskLevel === 'POTENTIAL DEEPFAKE' ? prev.highRisk + 1 : prev.highRisk,
    }));
  };

  const handleNewsDemo = (mode) => {
    const example = mode === 'real' ? realNewsExample : fakeNewsExample;
    setNewsText(example.text);
    setNewsUrl(example.url);
    setActiveTab('news');
    setNewsError('');

    const result = {
      risk_score: mode === 'real' ? 24 : 82,
      verdict: mode === 'real' ? 'LOW RISK' : 'HIGH RISK',
      reasons: mode === 'real'
        ? ['No obvious sensational language detected', 'Source context and evidence are present', 'Independent verification remains helpful']
        : ['Sensational language detected', 'No clear source mentioned', 'Extraordinary claim', 'Insufficient supporting evidence'],
      recommendation:
        mode === 'real'
          ? 'This content appears relatively cautious, but continue to check independent reports.'
          : 'Verify this claim using multiple reliable sources before sharing.',
      trust_score: mode === 'real' ? 76 : 18,
      demo: true,
    };
    setNewsResult(result);
    incrementDashboard('news', result.verdict);
  };

  const handleAnalyzeNews = async () => {
    if (!newsText.trim()) {
      setNewsError('Please paste some article text before analyzing.');
      return;
    }

    setNewsLoading(true);
    setNewsError('');

    try {
      const response = await fetch(`${API_BASE}/api/analyze-news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newsText, url: newsUrl || '' }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unable to analyze the article right now.' }));
        throw new Error(errorData.detail || 'Unable to analyze the article right now.');
      }

      const data = await response.json();
      setNewsResult(data);
      incrementDashboard('news', data.verdict);
      setActiveTab('news');
    } catch (err) {
      setNewsError(err.message || 'The news analysis backend is unavailable. Please try again in a moment.');
      setNewsResult({
        risk_score: 78,
        verdict: 'HIGH RISK',
        reasons: ['Backend unavailable: showing a demo fallback so the flow remains demonstrable.'],
        recommendation: 'Verify this claim using multiple reliable sources before sharing.',
        trust_score: 22,
        demo: true,
      });
    } finally {
      setNewsLoading(false);
    }
  };

  const handleImageDemo = (mode) => {
    const result = mode === 'real' ? realImageDemoResult : deepfakeDemoResult;
    setImageResult(result);
    setImageFileName(mode === 'real' ? 'sample-real-scene.jpg' : 'sample-synthetic-face.jpg');
    setActiveTab('deepfake');
    setImageError('');
    incrementDashboard('image', result.verdict);
  };

  const processImageFile = async (file) => {
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      setImageError('Unsupported file type. Please upload JPG, JPEG, PNG, or WEBP.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setImageError('Image is too large. Please upload a file smaller than 15MB.');
      return;
    }

    setImageLoading(true);
    setImageError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE}/api/analyze-image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Image analysis failed.' }));
        throw new Error(errorData.detail || 'Image analysis failed.');
      }

      const data = await response.json();
      setImageResult(data);
      setImageFileName(file.name);
      incrementDashboard('image', data.verdict);
      setActiveTab('deepfake');
    } catch (err) {
      setImageError(err.message || 'The deepfake model is unavailable, so a demo fallback is being shown.');
      setImageResult(file.name.toLowerCase().includes('real') ? realImageDemoResult : deepfakeDemoResult);
      setImageFileName(file.name);
      incrementDashboard('image', file.name.toLowerCase().includes('real') ? 'LIKELY REAL' : 'POTENTIAL DEEPFAKE');
    } finally {
      setImageLoading(false);
    }
  };

  const handleFileSelection = (event) => {
    const file = event.target.files?.[0];
    processImageFile(file);
    event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    processImageFile(file);
  };

  return (
    <div className="min-h-screen text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-glow">
              <span className="text-lg font-black text-slate-950">T</span>
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight">TruthLens AI</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-slate-400">Trust inspection</div>
            </div>
          </div>

          <nav className="hidden items-center gap-3 md:flex">
            <button className="rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-blue-500 hover:text-white" onClick={() => setActiveTab('landing')}>
              Home
            </button>
            <button className="rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-blue-500 hover:text-white" onClick={() => setActiveTab('news')}>
              Fake News
            </button>
            <button className="rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-blue-500 hover:text-white" onClick={() => setActiveTab('deepfake')}>
              Deepfake
            </button>
            <button className="rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-blue-500 hover:text-white" onClick={() => setActiveTab('dashboard')}>
              Dashboard
            </button>
          </nav>

          <button
            className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-glow transition hover:scale-[1.02]"
            onClick={() => setActiveTab('landing')}
          >
            Analyze Content
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === 'landing' && (
          <LandingPage 
            onOpenNews={() => setActiveTab('news')} 
            onOpenDeepfake={() => setActiveTab('deepfake')} 
            onTryFakeNews={() => handleNewsDemo('fake')} 
            onTryRealNews={() => handleNewsDemo('real')} 
            onTryDeepfake={() => handleImageDemo('fake')}
          />
        )}

        {activeTab === 'news' && (
          <NewsPage
            newsText={newsText}
            setNewsText={setNewsText}
            newsUrl={newsUrl}
            setNewsUrl={setNewsUrl}
            newsLoading={newsLoading}
            onAnalyze={handleAnalyzeNews}
            newsResult={newsResult}
            newsError={newsError}
            onTryFakeDemo={() => handleNewsDemo('fake')}
            onTryRealDemo={() => handleNewsDemo('real')}
          />
        )}

        {activeTab === 'deepfake' && (
          <DeepfakePage
            imageResult={imageResult}
            imageFileName={imageFileName}
            imageLoading={imageLoading}
            imageError={imageError}
            dragging={dragging}
            setDragging={setDragging}
            onDrop={handleDrop}
            onSelectFile={handleFileSelection}
            fileInputRef={fileInputRef}
            onDemoFake={() => handleImageDemo('fake')}
            onDemoReal={() => handleImageDemo('real')}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard dashboard={dashboard} currentTrustScore={currentTrustScore} currentVerdict={currentVerdict} />
        )}
      </main>
    </div>
  );
}

export default App;
export { getRiskColor };
