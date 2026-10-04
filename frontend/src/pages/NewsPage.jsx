import { getRiskColor } from '../App';

export default function NewsPage({
  newsText,
  setNewsText,
  newsUrl,
  setNewsUrl,
  newsLoading,
  onAnalyze,
  newsResult,
  newsError,
  onTryFakeDemo,
  onTryRealDemo,
}) {
  return (
    <div className="space-y-6">
      <div className="card-surface rounded-3xl p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-blue-300">Risk checker</div>
            <h2 className="mt-2 text-3xl font-bold text-white">Fake News Detector</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-blue-500" onClick={onTryFakeDemo}>Try Fake News Example</button>
            <button className="rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-emerald-500" onClick={onTryRealDemo}>Try Real News Example</button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">News article text</label>
            <textarea
              value={newsText}
              onChange={(e) => setNewsText(e.target.value)}
              rows={12}
              placeholder="Paste the article text, headline, or summary here..."
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 p-4 text-slate-100 outline-none transition focus:border-blue-500"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Article URL (optional)</label>
              <input
                value={newsUrl}
                onChange={(e) => setNewsUrl(e.target.value)}
                placeholder="https://example.com/story"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 p-3 text-slate-100 outline-none transition focus:border-blue-500"
              />
            </div>

            <button
              className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-3 font-semibold text-slate-950 shadow-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={newsLoading}
              onClick={onAnalyze}
            >
              {newsLoading ? 'Analyzing…' : 'Analyze News'}
            </button>

            {newsError && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                {newsError}
              </div>
            )}

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Explainability</div>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>• Sensational language</li>
                <li>• Suspicious phrasing</li>
                <li>• Missing sources</li>
                <li>• Weak evidence</li>
                <li>• Extraordinary claims</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {newsResult && (
        <div className="card-surface rounded-3xl p-6">
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Result</div>
              <h3 className="mt-1 text-2xl font-bold text-white">Credibility Risk</h3>
            </div>
            <div className="risk-badge" style={{ background: `${getRiskColor(newsResult.risk_score)}20`, color: getRiskColor(newsResult.risk_score) }}>
              {newsResult.verdict || 'LOW RISK'}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Risk Score</div>
              <div className="mt-3 text-4xl font-black text-white">{newsResult.risk_score}/100</div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${newsResult.risk_score}%`, background: `linear-gradient(90deg, ${getRiskColor(newsResult.risk_score)}, #f8fafc)` }}
                />
              </div>
              <div className="mt-5 text-sm text-slate-300">Trust score: {newsResult.trust_score}/100</div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Detected warning signs</div>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-200">
                  {newsResult.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Recommendation</div>
                <p className="mt-3 text-sm text-slate-200">{newsResult.recommendation}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
