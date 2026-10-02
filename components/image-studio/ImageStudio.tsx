'use client';

import React from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  RotateCcw,
  Copy,
  Check,
  Sliders,
  AlertCircle,
} from 'lucide-react';

interface GeneratedImageItem {
  id: string;
  url: string;
  prompt: string;
  aspectRatio: string;
  style: string;
  timestamp: number;
}

export function ImageStudio() {
  const [prompt, setPrompt] = React.useState('');
  const [aspectRatio, setAspectRatio] = React.useState<'1:1' | '16:9' | '9:16' | '4:3' | '3:4'>('1:1');
  const [style, setStyle] = React.useState('photorealistic');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [gallery, setGallery] = React.useState<GeneratedImageItem[]>([]);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio, style }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      const newItem: GeneratedImageItem = {
        id: `img-${Date.now()}`,
        url: data.imageUrl,
        prompt: data.originalPrompt || prompt,
        aspectRatio: data.aspectRatio,
        style: data.style,
        timestamp: Date.now(),
      };

      setGallery((prev) => [newItem, ...prev]);
    } catch (err: unknown) {
      console.error('Image gen error:', err);
      setError(err instanceof Error ? err.message : 'Image generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (img: GeneratedImageItem) => {
    const a = document.createElement('a');
    a.href = img.url;
    a.download = `nova-generated-${img.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const samplePrompts = [
    'Artisanal Michelin star plated dessert with gold leaf and spun sugar in dark ambient lighting',
    'Futuristic glass skyscraper headquarters in neon cyberpunk night city with flying transit cars',
    '3D isometric SaaS technology command center with holographic cloud data servers, octane render',
    'Nordic coastal modern villa at twilight with floor-to-ceiling glass and soft warm interior illumination',
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono mb-2 border border-indigo-500/20">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Gemini Flash Native Image Generator</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Generative Visual Studio
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Generate authentic high-resolution imagery for web heroes, UI components, and brand assets.
          </p>
        </div>
      </div>

      {/* Control Panel */}
      <div className="p-4 sm:p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase text-muted-foreground mb-2">
            Image Prompt Description
          </label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image in detail (e.g., 'Modern minimalist restaurant dining room with wood hearth, Scandinavian design, cinematic depth of field')..."
              rows={3}
              className="w-full p-3 rounded-xl bg-secondary/70 border border-border text-xs sm:text-sm text-foreground outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-5 gap-1 text-xs">
              {(['1:1', '16:9', '9:16', '4:3', '3:4'] as const).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`py-1.5 rounded-lg border text-[11px] font-mono transition ${
                    aspectRatio === ratio
                      ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                      : 'bg-secondary border-border text-foreground hover:bg-muted'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">
              Artistic Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-secondary border border-border text-foreground outline-none focus:border-indigo-500"
            >
              <option value="photorealistic">Photorealistic & Cinematic</option>
              <option value="cyberpunk">Cyberpunk & Neon</option>
              <option value="3d-render">3D Isometric Blender Render</option>
              <option value="minimalist">Minimalist Modern Vector</option>
              <option value="watercolor">Artisanal Watercolor</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Rendering Asset...' : 'Generate Real Image'}</span>
            </button>
          </div>
        </div>

        {/* Prompt Suggestions */}
        <div className="pt-2">
          <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-1.5">
            Quick Inceptions:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((sp, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(sp)}
                className="px-2.5 py-1 rounded-full bg-secondary/80 hover:bg-secondary border border-border text-[11px] text-muted-foreground hover:text-foreground transition truncate max-w-xs"
              >
                {sp}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Generated Gallery */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3 font-mono uppercase tracking-wider">
          Generation Canvas ({gallery.length})
        </h2>

        {gallery.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-border text-center text-muted-foreground text-xs">
            No images generated in this session yet. Enter a prompt above to create high-resolution visuals.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((img) => (
              <div
                key={img.id}
                className="rounded-2xl bg-card border border-border overflow-hidden shadow-md flex flex-col justify-between group"
              >
                <div className="relative overflow-hidden bg-stone-950 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.prompt}
                    className="w-full object-contain max-h-[360px] group-hover:scale-102 transition duration-500"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono">
                    {img.aspectRatio}
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-xs text-foreground line-clamp-2 leading-relaxed mb-3">
                    {img.prompt}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-[10px] font-mono text-muted-foreground capitalize">
                      {img.style}
                    </span>
                    <button
                      onClick={() => handleDownload(img)}
                      className="px-2.5 py-1 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-xs flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
