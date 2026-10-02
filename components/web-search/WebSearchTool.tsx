'use client';

import React from 'react';
import {
  Search,
  Globe,
  ExternalLink,
  Sparkles,
  AlertCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface SearchResult {
  query: string;
  summary: string;
  sources: Array<{ title: string; url: string }>;
  searchQueries: string[];
}

export function WebSearchTool() {
  const [query, setQuery] = React.useState('Next.js 15 App Router architecture best practices 2026');
  const [isSearching, setIsSearching] = React.useState(false);
  const [result, setResult] = React.useState<SearchResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSearch = async (overrideQuery?: string) => {
    const q = overrideQuery || query;
    if (!q.trim() || isSearching) return;

    setIsSearching(true);
    setError(null);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Web search query failed');
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Web search failed.');
    } finally {
      setIsSearching(false);
    }
  };

  const sampleQueries = [
    'Tailwind CSS v4 breaking changes and configuration',
    'Jetpack Compose Material 3 theme migration Kotlin',
    'PostgreSQL Row Level Security best practices for multitenant SaaS',
    'Michelin star fine dining culinary techniques 2026',
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono mb-2 border border-indigo-500/20">
          <Globe className="w-3.5 h-3.5" />
          <span>Gemini Google Search Grounding Engine</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          AI Live Web Search
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Search the live internet in real time. Model answers are grounded with verified source URLs and factual citations.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="p-4 sm:p-6 rounded-2xl bg-card border border-border shadow-sm space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search live web documentation, APIs, facts, and benchmarks..."
              className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-secondary border border-border text-foreground outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={() => handleSearch()}
            disabled={isSearching || !query.trim()}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSearching ? 'Searching...' : 'Search'}</span>
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {sampleQueries.map((sq, i) => (
            <button
              key={i}
              onClick={() => {
                setQuery(sq);
                handleSearch(sq);
              }}
              className="px-2.5 py-1 rounded-full bg-secondary hover:bg-muted text-[11px] text-muted-foreground hover:text-foreground transition"
            >
              {sq}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-6">
          {/* Grounded Summary */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Grounded Factual Synthesis
              </h2>
            </div>
            <div className="text-xs sm:text-sm leading-relaxed text-foreground select-text whitespace-pre-wrap font-sans">
              {result.summary}
            </div>
          </div>

          {/* Genuine Verified Sources */}
          {result.sources.length > 0 && (
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>Verified Web Sources ({result.sources.length})</span>
              </h3>

              <div className="grid sm:grid-cols-2 gap-2">
                {result.sources.map((src, idx) => (
                  <a
                    key={idx}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-border flex items-center justify-between text-xs text-foreground group transition"
                  >
                    <div className="truncate mr-2">
                      <div className="font-semibold truncate group-hover:text-indigo-400 transition">
                        {src.title || 'Web Resource'}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono truncate">{src.url}</div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-indigo-400 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
