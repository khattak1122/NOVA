'use client';

import React from 'react';
import {
  FileText,
  Mail,
  FileCheck,
  TrendingUp,
  Sparkles,
  Copy,
  Check,
  Download,
  BookOpen,
  Briefcase,
} from 'lucide-react';

export function DocumentAI() {
  const [docType, setDocType] = React.useState<'business-plan' | 'email' | 'technical-spec' | 'article' | 'report'>('business-plan');
  const [topic, setTopic] = React.useState('Autonomous AI Software Engineering Agency');
  const [tone, setTone] = React.useState<'professional' | 'executive' | 'persuasive' | 'technical'>('executive');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [documentContent, setDocumentContent] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const documentTypes = [
    { id: 'business-plan', label: 'Business Plan', icon: TrendingUp },
    { id: 'technical-spec', label: 'Technical Spec / RFC', icon: FileCheck },
    { id: 'email', label: 'Executive Email', icon: Mail },
    { id: 'report', label: 'Quarterly Audit Report', icon: BookOpen },
    { id: 'article', label: 'Tech Thought Leadership Article', icon: FileText },
  ];

  const handleGenerate = async () => {
    if (!topic.trim() || isGenerating) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Generate a comprehensive, production-grade ${docType.replace('-', ' ')} on: "${topic}".
Tone: ${tone}.
Use complete structured markdown with executive summaries, numbered analysis, actionable roadmaps, and financial/technical estimates where relevant. Do NOT use placeholder text.`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate document');
      setDocumentContent(data.text);
    } catch (err: unknown) {
      setDocumentContent(`Failed: ${err instanceof Error ? err.message : 'Generation failed.'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!documentContent) return;
    navigator.clipboard.writeText(documentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!documentContent) return;
    const blob = new Blob([documentContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docType}-${Date.now()}.md`;
    a.click();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono mb-2 border border-indigo-500/20">
          <FileText className="w-3.5 h-3.5" />
          <span>Generative Document Engine</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Document AI & Technical Writer
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Generate comprehensive business plans, architectural RFC specifications, executive briefs, and articles with deep domain rigor.
        </p>
      </div>

      {/* Doc Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {documentTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = docType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => setDocType(type.id as any)}
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 transition ${
                isSelected
                  ? 'bg-indigo-600/15 border-indigo-500/40 text-indigo-400 font-semibold'
                  : 'bg-card border-border text-foreground hover:bg-secondary/60'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Inputs */}
      <div className="p-4 sm:p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">
              Subject & Strategic Focus
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Next-Generation Autonomous Coding Platform with Sandboxing..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-secondary border border-border text-foreground outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">
              Tone & Audience
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-secondary border border-border text-foreground outline-none"
            >
              <option value="executive">Executive & C-Suite</option>
              <option value="technical">Technical & Architectural</option>
              <option value="persuasive">Persuasive & Investor Pitch</option>
              <option value="professional">Professional & Direct</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !topic.trim()}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGenerating ? 'Synthesizing Document...' : 'Generate Full Document'}</span>
        </button>
      </div>

      {/* Rendered Document View */}
      {documentContent && (
        <div className="rounded-2xl bg-card border border-border p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="text-xs font-mono uppercase text-muted-foreground">
              Document Preview ({docType.toUpperCase()})
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-xs flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-xs flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .md</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-secondary/30 font-sans text-xs sm:text-sm leading-relaxed text-foreground select-text whitespace-pre-wrap">
            {documentContent}
          </div>
        </div>
      )}
    </div>
  );
}
