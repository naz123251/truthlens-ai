export default function Dashboard({ dashboard, currentTrustScore, currentVerdict }) {
  return (
    <div className="space-y-6">
      <div className="card-surface rounded-3xl p-6">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-[0.24em] text-indigo-300">Overview</div>
          <h2 className="mt-2 text-3xl font-bold text-white">Dashboard</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Total analyses</div>
            <div className="mt-3 text-3xl font-black text-white">{dashboard.total}</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">News analyzed</div>
            <div className="mt-3 text-3xl font-black text-white">{dashboard.news}</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Images analyzed</div>
            <div className="mt-3 text-3xl font-black text-white">{dashboard.image}</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">High-risk content</div>
            <div className="mt-3 text-3xl font-black text-white">{dashboard.highRisk}</div>
          </div>
        </div>
      </div>

      <div className="card-surface rounded-3xl p-6">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Trust score</div>
            <div className="mt-4 text-5xl font-black text-white">{currentTrustScore}/100</div>
            <div className="mt-2 text-sm text-slate-300">{currentVerdict}</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Operational notes</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-200">
              <li>Demo mode is available when model inference is slow or unavailable.</li>
              <li>News analysis is explainable and does not claim absolute truth.</li>
              <li>Deepfake scoring is probabilistic and should be reviewed alongside context.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
