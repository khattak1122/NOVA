'use client';

import React from 'react';
import {
  FileSearch,
  Upload,
  FileText,
  FileCode,
  Table,
  Sparkles,
  Search,
  MessageSquare,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

interface UploadedFileState {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string;
  previewType: 'csv' | 'json' | 'text' | 'image' | 'code';
}

export function FileAnalyzer() {
  const [activeFile, setActiveFile] = React.useState<UploadedFileState | null>(null);
  const [question, setQuestion] = React.useState('');
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    let previewType: UploadedFileState['previewType'] = 'text';
    if (ext === 'csv') previewType = 'csv';
    else if (ext === 'json') previewType = 'json';
    else if (['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(ext)) previewType = 'image';
    else if (['js', 'ts', 'tsx', 'jsx', 'py', 'html', 'css', 'kt'].includes(ext)) previewType = 'code';

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = (event.target?.result as string) || '';
      setActiveFile({
        id: `file-${Date.now()}`,
        name: file.name,
        type: file.type || ext,
        size: file.size,
        content,
        previewType,
      });
      setAnalysisResult(null);
    };

    if (previewType === 'image') {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async (customPrompt?: string) => {
    if (!activeFile) return;
    setIsAnalyzing(true);

    const query = customPrompt || question || 'Provide a structured summary, key metrics, and architectural breakdown of this file.';

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `FILE CONTENT FOR ANALYSIS:
Filename: ${activeFile.name} (${activeFile.type})
Size: ${activeFile.size} bytes

CONTENT:
${activeFile.content.slice(0, 10000)}

ANALYSIS TASK:
${query}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed.');
      setAnalysisResult(data.text);
    } catch (err: unknown) {
      setAnalysisResult(`Error: ${err instanceof Error ? err.message : 'Analysis request failed.'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Sample preload file if none uploaded
  const handleLoadSampleCsv = () => {
    const sampleCsv = `id,product_name,category,stock,unit_price,status
1,Artisanal Olive Sourdough,Bakery,42,12.50,In Stock
2,Black Cod Fillet,Seafood,18,34.00,Low Stock
3,Winter White Truffle (50g),Produce,6,95.00,Critical Stock
4,Valrhona Dark Chocolate 70%,Confectionery,50,22.00,In Stock
5,Aged Iberian Ham,Charcuterie,12,68.00,In Stock`;

    setActiveFile({
      id: 'sample-inventory-csv',
      name: 'restaurant_inventory_q4.csv',
      type: 'text/csv',
      size: sampleCsv.length,
      content: sampleCsv,
      previewType: 'csv',
    });
    setAnalysisResult(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono mb-2 border border-indigo-500/20">
            <FileSearch className="w-3.5 h-3.5" />
            <span>Universal File & Data Intelligence</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Document & File Analyzer
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Analyze CSV, JSON, TXT, PDF, Code, and Images. Extract tabular metrics, diagnose schemas, and ask deep questions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadSampleCsv}
            className="px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-xs text-foreground font-medium transition"
          >
            Load Sample CSV
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept=".csv,.json,.txt,.md,.pdf,.js,.ts,.tsx,.py,.html,.css"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {/* Main File Content / Preview */}
      {activeFile ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: File Data Preview */}
          <div className="p-4 rounded-2xl bg-card border border-border flex flex-col space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-xs text-foreground font-mono">{activeFile.name}</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">
                {activeFile.size} bytes • {activeFile.previewType.toUpperCase()}
              </span>
            </div>

            {/* CSV Table Rendering */}
            {activeFile.previewType === 'csv' ? (
              <div className="flex-1 overflow-auto max-h-96 rounded-xl border border-border text-xs">
                <table className="w-full text-left font-mono">
                  <thead className="bg-secondary text-muted-foreground sticky top-0">
                    <tr>
                      {activeFile.content.split('\n')[0]?.split(',').map((h, i) => (
                        <th key={i} className="p-2 border-b border-border font-bold">
                          {h.trim()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeFile.content
                      .split('\n')
                      .slice(1)
                      .filter((r) => r.trim())
                      .map((row, rIdx) => (
                        <tr key={rIdx} className="border-b border-border/50 hover:bg-secondary/40">
                          {row.split(',').map((cell, cIdx) => (
                            <td key={cIdx} className="p-2 truncate max-w-[140px]">
                              {cell.trim()}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex-1 overflow-auto max-h-96 font-mono text-xs p-3 rounded-xl bg-stone-950 text-stone-200">
                <pre className="whitespace-pre-wrap">{activeFile.content.slice(0, 5000)}</pre>
              </div>
            )}

            {/* Quick Prompts for this file */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              <button
                onClick={() => handleAnalyze('Extract executive summary and top 3 key takeaways.')}
                className="px-2.5 py-1 rounded-full bg-secondary hover:bg-muted text-[11px] text-foreground font-medium transition"
              >
                Summarize File
              </button>
              <button
                onClick={() => handleAnalyze('Calculate total stock quantities, identify critical items, and compute total inventory value.')}
                className="px-2.5 py-1 rounded-full bg-secondary hover:bg-muted text-[11px] text-foreground font-medium transition"
              >
                Calculate Metrics
              </button>
              <button
                onClick={() => handleAnalyze('Audit this dataset for anomalies, missing values, or potential security vulnerabilities.')}
                className="px-2.5 py-1 rounded-full bg-secondary hover:bg-muted text-[11px] text-foreground font-medium transition"
              >
                Audit for Anomalies
              </button>
            </div>
          </div>

          {/* Right: AI Q&A and Analysis */}
          <div className="p-4 rounded-2xl bg-card border border-border flex flex-col space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Analysis & Questions</span>
            </h2>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask anything about this document..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-secondary border border-border text-foreground outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => handleAnalyze()}
                disabled={isAnalyzing}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shrink-0 transition"
              >
                {isAnalyzing ? 'Analyzing...' : 'Ask AI'}
              </button>
            </div>

            <div className="flex-1 min-h-[240px] max-h-96 overflow-y-auto p-4 rounded-xl bg-secondary/50 border border-border text-xs leading-relaxed text-foreground select-text whitespace-pre-wrap">
              {analysisResult ? (
                analysisResult
              ) : (
                <div className="text-muted-foreground text-center py-12">
                  Click one of the prompt chips or ask a question above to generate deep insights.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-16 rounded-2xl border-2 border-dashed border-border text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-indigo-400">
            <FileSearch className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">No File Loaded</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Upload any document or click &quot;Load Sample CSV&quot; to immediately explore file analysis capabilities.
            </p>
          </div>
          <button
            onClick={handleLoadSampleCsv}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
          >
            Explore with Sample CSV
          </button>
        </div>
      )}
    </div>
  );
}
