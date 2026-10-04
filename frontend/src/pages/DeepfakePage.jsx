import { getRiskColor } from '../App';

export default function DeepfakePage({
  imageResult,
  imageFileName,
  imageLoading,
  imageError,
  dragging,
  setDragging,
  onDrop,
  onSelectFile,
  fileInputRef,
  onDemoFake,
  onDemoReal,
}) {
  return (
    <div className="space-y-6">
      <div className="card-surface rounded-3xl p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-cyan-300">Image forensics</div>
            <h2 className="mt-2 text-3xl font-bold text-white">Deepfake Detector</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-cyan-500" onClick={onDemoFake}>Try Deepfake Example</button>
            <button className="rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-emerald-500" onClick={onDemoReal}>Try Real Example</button>
          </div>
        </div>

        <div
          className={`dropzone rounded-3xl p-8 text-center ${dragging ? 'dragging' : ''}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-3xl">
            🖼️
          </div>
          <p className="mt-4 text-lg font-medium text-white">Drop an image here</p>
          <p className="mt-2 text-sm text-slate-400">JPG, JPEG, PNG, or WEBP up to 15MB</p>
          <button
            className="mt-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-glow"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose Image
          </button>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onSelectFile} />
        </div>

        {imageError && (
          <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{imageError}</div>
        )}
      </div>

      {imageLoading && (
        <div className="card-surface rounded-3xl p-6">
          <div className="flex items-center gap-3 text-slate-200">
            <div className="flex gap-2">
              <span className="loading-dot h-3 w-3 rounded-full bg-blue-400" />
              <span className="loading-dot h-3 w-3 rounded-full bg-blue-400 [animation-delay:0.2s]" />
              <span className="loading-dot h-3 w-3 rounded-full bg-blue-400 [animation-delay:0.4s]" />
            </div>
            <span>Running image analysis…</span>
          </div>
        </div>
      )}

      {imageResult && (
        <div className="card-surface rounded-3xl p-6">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-400">AI detection</div>
              <h3 className="mt-1 text-2xl font-bold text-white">{imageResult.verdict}</h3>
            </div>
            <div className="risk-badge" style={{ background: `${getRiskColor(imageResult.deepfake_probability * 100)}20`, color: getRiskColor(imageResult.deepfake_probability * 100) }}>
              {imageResult.demo ? 'Demo Result' : 'AI inference'}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <div className="text-sm uppercase tracking-[0.18em] text-slate-400">AI detection confidence</div>
              <div className="mt-3 text-4xl font-black text-white">{Math.round((imageResult.confidence || imageResult.deepfake_probability || 0.5) * 100)}%</div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.round((imageResult.confidence || imageResult.deepfake_probability || 0.5) * 100)}%`, background: `linear-gradient(90deg, ${imageResult.verdict === 'LIKELY REAL' ? '#22c55e' : '#ef4444'}, #f8fafc)` }}
                />
              </div>
              <div className="mt-5 text-sm text-slate-300">Trust score: {imageResult.trust_score}/100</div>
              {imageFileName && <div className="mt-4 text-xs uppercase tracking-[0.18em] text-slate-500">File: {imageFileName}</div>}
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Why this result?</div>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-200">
                  {imageResult.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
