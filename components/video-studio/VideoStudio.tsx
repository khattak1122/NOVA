'use client';

import React from 'react';
import {
  Video,
  Sparkles,
  AlertCircle,
  Clock,
  Sliders,
  Download,
  Info,
  Layers,
  Settings,
} from 'lucide-react';

export function VideoStudio() {
  const [prompt, setPrompt] = React.useState('Cinematic 10-second drone sweep through a futuristic neo-tokyo cityscape at dusk with neon reflections');
  const [duration, setDuration] = React.useState('10s');
  const [aspectRatio, setAspectRatio] = React.useState('16:9');
  const [resolution, setResolution] = React.useState('1080p');
  const [style, setStyle] = React.useState('cinematic');
  const [providerStatus, setProviderStatus] = React.useState<{ configured: boolean; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch('/api/video')
      .then((res) => res.json())
      .then((data) => setProviderStatus(data))
      .catch(() => setProviderStatus({ configured: false, message: 'Unable to check video API status.' }));
  }, []);

  const handleGenerate = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, duration, aspectRatio, resolution, style }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Video generation failed.');
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Video generation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono mb-2 border border-indigo-500/20">
          <Video className="w-3.5 h-3.5" />
          <span>Generative Motion & Veo Adapter</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          AI Video Generation Studio
        </h1>
        <p className="text-xs text-muted-foreground mt-1 max-w-xl">
          Generate realistic cinematic sequences, product motion reels, and UI concept teasers with configurable duration and aspect ratios.
        </p>
      </div>

      {/* Provider Status Diagnostic Banner */}
      <div
        className={`p-4 rounded-2xl border flex items-start gap-3 ${
          providerStatus?.configured
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
        }`}
      >
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <div className="font-semibold text-foreground">
            Provider Architecture: {providerStatus?.configured ? 'Active' : 'Unconfigured'}
          </div>
          <p className="mt-0.5">
            {providerStatus?.message || 'Video generation API is not configured.'}
          </p>
          {!providerStatus?.configured && (
            <p className="mt-1 text-[11px] opacity-80">
              In accordance with NOVA design principles, we never fake generated video. To enable generation, configure <code className="bg-black/30 px-1 py-0.5 rounded font-mono">VEO_API_KEY</code> or <code className="bg-black/30 px-1 py-0.5 rounded font-mono">REPLICATE_API_TOKEN</code> in your environment variables.
            </p>
          )}
        </div>
      </div>

      {/* Generation Form */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase text-muted-foreground mb-2">
            Video Scene Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="w-full p-3 rounded-xl bg-secondary/70 border border-border text-xs sm:text-sm text-foreground outline-none focus:border-indigo-500 resize-none"
            placeholder="Describe the camera movement, subject, atmosphere, and action..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">
              Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-secondary border border-border text-foreground outline-none"
            >
              <option value="5s">5 Seconds</option>
              <option value="10s">10 Seconds (Cinematic)</option>
              <option value="15s">15 Seconds</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">
              Aspect Ratio
            </label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-secondary border border-border text-foreground outline-none"
            >
              <option value="16:9">16:9 Widescreen (Desktop/TV)</option>
              <option value="9:16">9:16 Vertical (Stories/Reels)</option>
              <option value="1:1">1:1 Square</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">
              Resolution
            </label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-secondary border border-border text-foreground outline-none"
            >
              <option value="720p">720p HD</option>
              <option value="1080p">1080p Full HD</option>
              <option value="4K">4K Ultra HD</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">
              Motion Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-secondary border border-border text-foreground outline-none"
            >
              <option value="cinematic">Cinematic Drone</option>
              <option value="hyperlapse">Hyperlapse City</option>
              <option value="macro">Macro Slow Motion</option>
              <option value="anime">Anime 3D Shonen</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isSubmitting ? 'Verifying Provider Pipeline...' : 'Generate Motion Video'}</span>
        </button>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
