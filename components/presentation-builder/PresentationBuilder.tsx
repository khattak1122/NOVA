'use client';

import React from 'react';
import {
  Presentation,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FileDown,
  Plus,
  Trash2,
  MessageSquare,
  Layers,
} from 'lucide-react';
import { PresentationData, SlideData } from '@/types/nova';

export function PresentationBuilder() {
  const [topic, setTopic] = React.useState('Renewable Energy Grid Transformation 2030');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const [presentation, setPresentation] = React.useState<PresentationData>({
    title: 'Next-Generation Renewable Energy Architecture',
    theme: 'neon-dark',
    slides: [
      {
        id: 'slide-1',
        title: 'Renewable Energy Transformation 2030',
        subtitle: 'Decarbonizing Industrial Power Grids with AI & Solid-State Storage',
        bullets: [
          'Global clean energy parity reached in 84% of world markets',
          'Autonomous microgrids dynamically balance supply and peak demand',
          'Transition roadmaps for heavy industrial decarbonization',
        ],
        notes: 'Introduce the core thesis: clean power is no longer merely environmental, it is a superior economic engine.',
        layout: 'title',
      },
      {
        id: 'slide-2',
        title: 'Global Generation Capacity Breakdown',
        subtitle: 'Exponential Solar PV and Offshore Wind Growth',
        bullets: [
          'Solar PV: +450 GW annual additions worldwide',
          'Offshore Wind: Floating deep-water turbines unlock untapped oceanic corridors',
          'Green Hydrogen: Serving as seasonal chemical energy storage',
        ],
        stats: [
          { label: 'Solar Efficiency', value: '29.4%' },
          { label: 'LCOE Cost Reduction', value: '-68%' },
          { label: 'Battery Capacity', value: '4.2 TWh' },
        ],
        notes: 'Emphasize that levelized cost of energy (LCOE) has crossed the critical threshold against legacy fossil fuels.',
        layout: 'stats',
      },
      {
        id: 'slide-3',
        title: 'Autonomous Grid Balancing Systems',
        subtitle: 'Predictive Load Management via Edge Inference',
        bullets: [
          'Millisecond frequency regulation prevents blackouts during wind lulls',
          'Virtual Power Plants (VPP) aggregate millions of distributed EV batteries',
          'Decentralized cryptographic dispatch proofs ensure grid integrity',
        ],
        notes: 'Walk through how machine learning models forecast solar irradiance and cloud trajectories 6 hours in advance.',
        layout: 'content',
      },
      {
        id: 'slide-4',
        title: 'Strategic Roadmap & Deployment 2026-2030',
        subtitle: 'Phase-by-Phase Capital Allocation',
        bullets: [
          'Phase 1: Substation sensor retrofits & high-throughput telemetry',
          'Phase 2: Regional battery energy storage system (BESS) commissioning',
          'Phase 3: Cross-border high-voltage direct current (HVDC) interconnects',
        ],
        notes: 'Conclude with call to action: capital allocation timeline and investor returns metrics.',
        layout: 'split',
      },
    ],
  });

  const handleGenerateDeck = async () => {
    if (!topic.trim() || isGenerating) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Generate a structured 5-slide presentation on "${topic}".
Output valid JSON only with this schema:
{
  "title": "Presentation Title",
  "slides": [
    {
      "id": "s1",
      "title": "Slide Title",
      "subtitle": "Subtitle",
      "bullets": ["Point 1", "Point 2", "Point 3"],
      "notes": "Speaker notes for the presenter"
    }
  ]
}`,
        }),
      });

      const data = await res.json();
      const match = data.text.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, data.text];
      const parsed = JSON.parse(match[1].trim());

      setPresentation({
        title: parsed.title || topic,
        theme: 'neon-dark',
        slides: parsed.slides.map((s: any, idx: number) => ({
          id: `slide-${Date.now()}-${idx}`,
          title: s.title,
          subtitle: s.subtitle,
          bullets: s.bullets || [],
          notes: s.notes || 'Presenter notes',
          layout: idx === 0 ? 'title' : 'content',
        })),
      });
      setCurrentSlideIndex(0);
    } catch (err) {
      console.error('Slide generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentSlide = presentation.slides[currentSlideIndex] || presentation.slides[0];

  const handleExportMarkdown = () => {
    let md = `# ${presentation.title}\n\n`;
    presentation.slides.forEach((s, idx) => {
      md += `## Slide ${idx + 1}: ${s.title}\n`;
      if (s.subtitle) md += `*${s.subtitle}*\n\n`;
      s.bullets.forEach((b) => (md += `- ${b}\n`));
      if (s.notes) md += `\n> **Speaker Notes:** ${s.notes}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${presentation.title.toLowerCase().replace(/\s+/g, '-')}-slides.md`;
    a.click();
  };

  return (
    <div className={`flex-1 flex flex-col h-full bg-background overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
      {/* Top Header */}
      {!isFullscreen && (
        <div className="h-12 border-b border-border bg-card px-4 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
              <Presentation className="w-3.5 h-3.5" />
              <span>AI Presentation Studio</span>
            </div>
            <span className="text-xs font-semibold text-foreground truncate max-w-sm">
              {presentation.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-xs flex items-center gap-1 transition"
              title="Fullscreen Presenter Mode"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Present</span>
            </button>

            <button
              onClick={handleExportMarkdown}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export Deck</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Slide Carousel Workspace */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 overflow-y-auto relative">
        {/* Generator Prompt Bar (when not fullscreen) */}
        {!isFullscreen && (
          <div className="w-full max-w-3xl mb-4 flex gap-2">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. 'Create a 10-slide presentation about renewable energy'..."
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-card border border-border text-foreground outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleGenerateDeck}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/25 transition shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Building Deck...' : 'Generate Slides'}</span>
            </button>
          </div>
        )}

        {/* 16:9 Presentation Canvas Card */}
        <div className="w-full max-w-4xl aspect-[16/9] rounded-2xl bg-gradient-to-br from-stone-900 via-stone-950 to-indigo-950 border border-stone-800 shadow-2xl p-8 sm:p-12 flex flex-col justify-between text-white relative overflow-hidden select-none">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Slide Top Badge */}
          <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
            <span>NOVA SLIDE {currentSlideIndex + 1} OF {presentation.slides.length}</span>
            <span className="text-indigo-400 uppercase tracking-widest text-[10px]">Confidential Strategy</span>
          </div>

          {/* Slide Center Content */}
          <div className="my-auto space-y-4">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight font-sans">
              {currentSlide.title}
            </h1>

            {currentSlide.subtitle && (
              <p className="text-base sm:text-lg text-indigo-300 font-light max-w-2xl leading-relaxed">
                {currentSlide.subtitle}
              </p>
            )}

            {/* Bullets */}
            {currentSlide.bullets?.length > 0 && (
              <ul className="space-y-3 mt-6">
                {currentSlide.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-stone-300">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 shrink-0" />
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Stats row if available */}
            {currentSlide.stats && (
              <div className="grid grid-cols-3 gap-4 pt-6 mt-4 border-t border-stone-800">
                {currentSlide.stats.map((st, i) => (
                  <div key={i} className="p-4 rounded-xl bg-stone-900/60 border border-stone-800">
                    <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">
                      {st.value}
                    </div>
                    <div className="text-xs text-stone-400 mt-1 uppercase font-mono">{st.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Slide Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-800 text-[10px] text-stone-500 font-mono">
            <span>NOVA AI Studio Universal Presentation Engine</span>
            <span>{currentSlideIndex + 1}</span>
          </div>
        </div>

        {/* Carousel Navigation Controller */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentSlideIndex === 0}
            className="p-2 rounded-xl bg-card border border-border disabled:opacity-30 hover:bg-secondary text-foreground transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {presentation.slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlideIndex === idx ? 'w-6 bg-indigo-500' : 'w-2 bg-muted hover:bg-muted-foreground'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.min(presentation.slides.length - 1, prev + 1))}
            disabled={currentSlideIndex === presentation.slides.length - 1}
            className="p-2 rounded-xl bg-card border border-border disabled:opacity-30 hover:bg-secondary text-foreground transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="ml-4 px-3 py-1.5 rounded-lg bg-stone-800 text-white text-xs"
            >
              Exit Fullscreen
            </button>
          )}
        </div>

        {/* Speaker Notes Drawer (Non-fullscreen) */}
        {!isFullscreen && currentSlide.notes && (
          <div className="w-full max-w-4xl mt-4 p-3 rounded-xl bg-card border border-border text-xs flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground font-mono text-[11px] block">Presenter Notes:</span>
              <p className="text-muted-foreground mt-0.5 leading-relaxed">{currentSlide.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
