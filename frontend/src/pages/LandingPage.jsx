const statItems = [
  { label: 'Credibility checks', value: '2x' },
  { label: 'Risk scoring', value: '0-100' },
  { label: 'Explainable', value: 'AI' },
];

export default function LandingPage({ onOpenNews, onOpenDeepfake, onTryFakeNews, onTryRealNews, onTryDeepfake }) {
  return (
    <div className="space-y-8">
      <section className="card-surface rounded-3xl p-6 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              AI verification assistant
            </div>
            <h1 className="max-w-xl text-4xl font-black tracking-tight text-white sm:text-5xl">
              TruthLens AI
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-300">
              Detect misinformation and AI-generated content before you trust or share it.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
                onClick={onOpenNews}
              >
                Analyze Content
              </button>
              <button
                className="rounded-full border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
                onClick={onOpenDeepfake}
              >
                Deepfake Check
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {statItems.map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                  <div className="text-lg font-bold text-white">{item.value}</div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-glow">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.26em] text-slate-400">Security layer</span>
              <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Active
              </span>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Credibility Risk', value: '82%', tone: 'bg-red-500/15 text-red-300' },
                { label: 'Synthetic signal', value: '91%', tone: 'bg-amber-500/15 text-amber-300' },
                { label: 'Trust score', value: '18/100', tone: 'bg-emerald-500/15 text-emerald-300' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{item.label}</span>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${item.tone}`}>
                      {item.value}
                    </span>
                  </div>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400" style={{ width: item.value.replace('%','').replace('/100','') || '75%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="card-surface rounded-3xl p-6 transition hover:-translate-y-1 hover:border-blue-500/50">
          <div className="mb-4 text-3xl">📰</div>
          <h2 className="text-2xl font-bold text-white">Fake News Detector</h2>
          <p className="mt-3 text-slate-300">
            Scan headlines and article text for sensational wording, weak sourcing, emotional triggers, and weak evidence.
          </p>
          <div className="mt-6 flex gap-3">
            <button className="rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700" onClick={onOpenNews}>Open</button>
            <button className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:border-blue-500" onClick={onTryFakeNews}>Try Fake Example</button>
          </div>
        </div>

        <div className="card-surface rounded-3xl p-6 transition hover:-translate-y-1 hover:border-cyan-500/50">
          <div className="mb-4 text-3xl">🖼️</div>
          <h2 className="text-2xl font-bold text-white">Deepfake Detector</h2>
          <p className="mt-3 text-slate-300">
            Upload a photograph to get a synthetic-image risk signal with confidence estimates and explanations.
          </p>
          <div className="mt-6 flex gap-3">
            <button className="rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700" onClick={onOpenDeepfake}>Open</button>
            <button className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:border-cyan-500" onClick={onTryDeepfake}>Try Deepfake Example</button>
          </div>
        </div>
      </section>
    </div>
  );
}
