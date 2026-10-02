'use client';

import React from 'react';
import {
  Code2,
  FolderTree,
  Search,
  Sparkles,
  Bug,
  Save,
  CheckCircle2,
  FileCode,
  Plus,
  Trash2,
  Play,
  RotateCcw,
  Clock,
  Layers,
  FileText,
} from 'lucide-react';
import { Project, ProjectFile } from '@/types/nova';
import { executeCodeInBrowserSandbox } from '@/lib/sandbox/runner';

interface CodeStudioProps {
  project: Project;
  onUpdateProject: (updated: Project) => void;
  onAskAi: (prompt: string) => void;
}

export function CodeStudio({ project, onUpdateProject, onAskAi }: CodeStudioProps) {
  const [selectedFileId, setSelectedFileId] = React.useState<string>(project.files[0]?.id || '');
  const [fileContent, setFileContent] = React.useState<string>(project.files[0]?.content || '');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [savedSuccess, setSavedSuccess] = React.useState(false);
  const [isExecuting, setIsExecuting] = React.useState(false);
  const [executionOutput, setExecutionOutput] = React.useState<{ stdout: string; stderr: string; time: number } | null>(null);

  const selectedFile = project.files.find((f) => f.id === selectedFileId) || project.files[0];

  const handleSelectFile = (file: ProjectFile) => {
    setSelectedFileId(file.id);
    setFileContent(file.content);
    setExecutionOutput(null);
  };

  const handleSave = () => {
    if (!selectedFile) return;
    const updated = project.files.map((f) =>
      f.id === selectedFile.id ? { ...f, content: fileContent, updatedAt: Date.now() } : f
    );
    onUpdateProject({ ...project, files: updated, updatedAt: Date.now() });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleRunCode = async () => {
    if (!selectedFile) return;
    setIsExecuting(true);
    try {
      const result = await executeCodeInBrowserSandbox(selectedFile.language, fileContent);
      setExecutionOutput({
        stdout: result.stdout,
        stderr: result.stderr,
        time: result.executionTime,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleAskAiToRefactor = () => {
    if (!selectedFile) return;
    onAskAi(`Please refactor and optimize "${selectedFile.path}". Ensure clean code, error handling, and performance improvements.`);
  };

  const handleAskAiToDebug = () => {
    if (!selectedFile) return;
    onAskAi(`Inspect "${selectedFile.path}" for potential edge cases, syntax bugs, or security vulnerabilities, and propose complete fixes.`);
  };

  const filteredFiles = project.files.filter((f) =>
    f.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Top action toolbar */}
      <div className="h-12 border-b border-border bg-card px-4 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
            <Code2 className="w-3.5 h-3.5" />
            <span>NOVA Code Agent Workspace</span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {selectedFile?.path} ({selectedFile?.language})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAskAiToDebug}
            className="px-2.5 py-1.5 rounded-lg bg-secondary/80 hover:bg-secondary text-xs text-foreground flex items-center gap-1.5 border border-border transition"
            title="Diagnose & fix errors"
          >
            <Bug className="w-3.5 h-3.5 text-rose-400" />
            <span>AI Debug</span>
          </button>

          <button
            onClick={handleAskAiToRefactor}
            className="px-2.5 py-1.5 rounded-lg bg-secondary/80 hover:bg-secondary text-xs text-foreground flex items-center gap-1.5 border border-border transition"
            title="Refactor & optimize"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Refactor</span>
          </button>

          <button
            onClick={handleRunCode}
            disabled={isExecuting}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            title="Run code in isolated browser sandbox"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isExecuting ? 'Running...' : 'Run in Sandbox'}</span>
          </button>

          <button
            onClick={handleSave}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {savedSuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
            <span>{savedSuccess ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: File tree + Editor + Terminal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Mini File Tree */}
        <div className="w-56 border-r border-border bg-card/60 flex flex-col shrink-0">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="w-3 h-3 text-muted-foreground absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2 py-1 text-xs rounded-md bg-secondary/80 border border-border text-foreground outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
            {filteredFiles.map((file) => (
              <button
                key={file.id}
                onClick={() => handleSelectFile(file)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition text-left truncate ${
                  selectedFile?.id === file.id
                    ? 'bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode className="w-3 h-3 shrink-0" />
                  <span className="truncate">{file.path}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center Editor */}
        <div className="flex-1 flex flex-col bg-stone-950 font-mono text-xs overflow-hidden">
          {/* Editor Header line numbers */}
          <div className="flex-1 p-3 overflow-auto flex">
            <textarea
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              spellCheck={false}
              className="w-full h-full bg-transparent text-stone-100 font-mono text-xs leading-relaxed outline-none resize-none selection:bg-indigo-500/40"
            />
          </div>

          {/* Bottom Execution Sandbox Terminal Output */}
          {executionOutput && (
            <div className="h-44 border-t border-stone-800 bg-stone-900/90 p-3 overflow-y-auto font-mono text-xs shrink-0">
              <div className="flex items-center justify-between text-stone-400 mb-2 border-b border-stone-800 pb-1.5">
                <span className="text-[11px] font-semibold text-emerald-400">
                  Sandbox Execution Result ({executionOutput.time}ms)
                </span>
                <button
                  onClick={() => setExecutionOutput(null)}
                  className="text-stone-500 hover:text-stone-300"
                >
                  ✕
                </button>
              </div>

              {executionOutput.stdout && (
                <div className="text-emerald-300 whitespace-pre-wrap select-text mb-2">
                  <span className="text-emerald-500 font-semibold">[OUTPUT] </span>
                  {executionOutput.stdout}
                </div>
              )}

              {executionOutput.stderr && (
                <div className="text-rose-400 whitespace-pre-wrap select-text">
                  <span className="font-semibold">[ERROR] </span>
                  {executionOutput.stderr}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
