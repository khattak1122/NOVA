'use client';

import React from 'react';
import {
  Folder,
  FileCode,
  Play,
  RotateCcw,
  Terminal,
  ExternalLink,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Layers,
  Monitor,
  Tablet,
  Smartphone,
  Info,
  Sparkles,
} from 'lucide-react';
import { Project, ProjectFile, DevicePreviewMode, SandboxExecutionLog } from '@/types/nova';
import { buildProjectPreviewBundle } from '@/lib/sandbox/runner';

interface RightPanelProps {
  project: Project;
  onUpdateFile: (file: ProjectFile) => void;
  onAddFile: (path: string, content: string, language: string) => void;
  onDeleteFile: (id: string) => void;
  selectedFile: ProjectFile | null;
  onSelectFile: (file: ProjectFile) => void;
  deviceMode: DevicePreviewMode;
  onChangeDeviceMode: (mode: DevicePreviewMode) => void;
  terminalLogs: SandboxExecutionLog[];
  onClearTerminal: () => void;
  onAskAiToFixError: (errorText: string) => void;
  onRollback: (versionId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function RightPanel({
  project,
  onUpdateFile,
  onAddFile,
  onDeleteFile,
  selectedFile,
  onSelectFile,
  deviceMode,
  onChangeDeviceMode,
  terminalLogs,
  onClearTerminal,
  onAskAiToFixError,
  onRollback,
  isOpen,
  onClose,
}: RightPanelProps) {
  const [activeTab, setActiveTab] = React.useState<'preview' | 'files' | 'terminal' | 'versions' | 'info'>('preview');
  const [newFilePath, setNewFilePath] = React.useState('');
  const [isAddingFile, setIsAddingFile] = React.useState(false);
  const [previewKey, setPreviewKey] = React.useState(0);

  // Generate sandbox bundle
  const bundle = React.useMemo(() => {
    return buildProjectPreviewBundle(project);
  }, [project]);

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFilePath.trim()) return;

    const ext = newFilePath.split('.').pop() || 'txt';
    let lang = 'javascript';
    if (ext === 'html') lang = 'html';
    else if (ext === 'css') lang = 'css';
    else if (ext === 'json') lang = 'json';
    else if (ext === 'ts' || ext === 'tsx') lang = 'typescript';
    else if (ext === 'kt') lang = 'kotlin';
    else if (ext === 'py') lang = 'python';

    onAddFile(newFilePath.trim(), `// ${newFilePath.trim()}\n`, lang);
    setNewFilePath('');
    setIsAddingFile(false);
  };

  const getViewportWidth = () => {
    if (deviceMode === 'mobile') return 'max-w-[375px]';
    if (deviceMode === 'tablet') return 'max-w-[768px]';
    return 'w-full';
  };

  if (!isOpen) return null;

  return (
    <aside className="w-full xl:w-[480px] 2xl:w-[540px] border-l border-border bg-card flex flex-col shrink-0 h-full overflow-hidden">
      {/* Top Tab Bar */}
      <div className="h-11 border-b border-border px-2 flex items-center justify-between bg-secondary/40 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition ${
              activeTab === 'preview'
                ? 'bg-card text-foreground shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('files')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition ${
              activeTab === 'files'
                ? 'bg-card text-foreground shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Folder className="w-3.5 h-3.5 text-indigo-400" />
            <span>Files ({project.files.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition relative ${
              activeTab === 'terminal'
                ? 'bg-card text-foreground shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>Console</span>
            {terminalLogs.some((l) => l.type === 'error' || l.type === 'stderr') && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('versions')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition ${
              activeTab === 'versions'
                ? 'bg-card text-foreground shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>Versions</span>
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition ${
              activeTab === 'info'
                ? 'bg-card text-foreground shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-purple-400" />
            <span>Memory</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground p-1 rounded text-xs"
          title="Collapse Panel"
        >
          ✕
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-hidden flex flex-col bg-background">
        {/* TAB 1: LIVE PREVIEW */}
        {activeTab === 'preview' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Viewport bar */}
            <div className="h-9 border-b border-border bg-card px-3 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground font-mono truncate">
                  Entry: {bundle.entryPath || 'index.html'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex items-center rounded bg-secondary p-0.5 text-[10px]">
                  <button
                    onClick={() => onChangeDeviceMode('desktop')}
                    className={`p-1 rounded ${deviceMode === 'desktop' ? 'bg-card text-foreground' : 'text-muted-foreground'}`}
                    title="Desktop"
                  >
                    <Monitor className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onChangeDeviceMode('tablet')}
                    className={`p-1 rounded ${deviceMode === 'tablet' ? 'bg-card text-foreground' : 'text-muted-foreground'}`}
                    title="Tablet (768px)"
                  >
                    <Tablet className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onChangeDeviceMode('mobile')}
                    className={`p-1 rounded ${deviceMode === 'mobile' ? 'bg-card text-foreground' : 'text-muted-foreground'}`}
                    title="Mobile (375px)"
                  >
                    <Smartphone className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={() => setPreviewKey((k) => k + 1)}
                  className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition"
                  title="Reload Preview"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Frame Container */}
            <div className="flex-1 bg-stone-950/80 p-3 flex justify-center items-center overflow-auto">
              <div
                className={`h-full transition-all duration-300 rounded-xl overflow-hidden border border-border shadow-2xl bg-background ${getViewportWidth()}`}
              >
                <iframe
                  key={previewKey}
                  title="Live Preview Sandbox"
                  srcDoc={bundle.srcDoc}
                  sandbox="allow-scripts allow-forms allow-modals allow-same-origin"
                  className="w-full h-full border-0 bg-white dark:bg-stone-950"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROJECT FILES EXPLORER */}
        {activeTab === 'files' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden p-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Project Files
              </span>
              <button
                onClick={() => setIsAddingFile(!isAddingFile)}
                className="px-2 py-1 rounded-md bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white text-xs flex items-center gap-1 transition"
              >
                <Plus className="w-3 h-3" />
                <span>New File</span>
              </button>
            </div>

            {isAddingFile && (
              <form onSubmit={handleCreateFile} className="mb-3 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. login.html or components/Card.js"
                  value={newFilePath}
                  onChange={(e) => setNewFilePath(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-xs rounded-lg bg-secondary border border-border text-foreground outline-none focus:border-indigo-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                >
                  Add
                </button>
              </form>
            )}

            <div className="flex-1 overflow-y-auto space-y-1">
              {project.files.map((file) => (
                <div
                  key={file.id}
                  onClick={() => onSelectFile(file)}
                  className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition ${
                    selectedFile?.id === file.id
                      ? 'bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 font-medium'
                      : 'hover:bg-secondary/70 text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="font-mono truncate">{file.path}</span>
                    {file.isEntry && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono">
                        ENTRY
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground uppercase font-mono">
                      {file.language}
                    </span>
                    {project.files.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteFile(file.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 hover:text-destructive transition"
                        title="Delete file"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TERMINAL & CONSOLE */}
        {activeTab === 'terminal' && (
          <div className="flex-1 flex flex-col h-full bg-stone-950 font-mono text-xs overflow-hidden">
            <div className="p-2.5 border-b border-stone-800 bg-stone-900/60 flex items-center justify-between text-stone-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px]">Secure Sandbox Output & Logs</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClearTerminal}
                  className="hover:text-stone-200 transition text-[11px]"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2 select-text">
              {terminalLogs.length === 0 ? (
                <div className="text-stone-500 text-center py-8">
                  No execution logs yet. Click &quot;Run Project&quot; or interact with the preview.
                </div>
              ) : (
                terminalLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-stone-600 text-[10px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    {log.type === 'error' || log.type === 'stderr' ? (
                      <div className="flex-1">
                        <span className="text-rose-400 font-semibold">[ERROR] </span>
                        <span className="text-rose-300">{log.message}</span>
                        <div className="mt-1">
                          <button
                            onClick={() => onAskAiToFixError(log.message)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 text-[10px] transition"
                          >
                            <Sparkles className="w-2.5 h-2.5" />
                            Auto-Fix with AI Agent
                          </button>
                        </div>
                      </div>
                    ) : log.type === 'warn' ? (
                      <div className="flex-1 text-amber-300">
                        <span className="font-semibold">[WARN] </span>
                        {log.message}
                      </div>
                    ) : (
                      <div className="flex-1 text-emerald-300">
                        <span className="text-emerald-500">[STDOUT] </span>
                        {log.message}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: VERSION HISTORY & ROLLBACK */}
        {activeTab === 'versions' && (
          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
              Rollback Snapshots & Versions
            </div>
            <p className="text-xs text-muted-foreground">
              Automatic snapshots are saved before major AI modifications so you can roll back anytime without loss.
            </p>

            <div className="space-y-2 mt-3">
              {project.versions?.length ? (
                project.versions.map((ver) => (
                  <div
                    key={ver.id}
                    className="p-3 rounded-xl bg-card border border-border flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-foreground">
                          Version {ver.versionNumber}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {new Date(ver.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{ver.description}</p>
                      <span className="text-[10px] text-indigo-400 font-mono">
                        {ver.files.length} snapshot files
                      </span>
                    </div>

                    <button
                      onClick={() => onRollback(ver.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-600/15 hover:bg-indigo-600 text-indigo-400 hover:text-white text-xs font-medium transition"
                    >
                      Rollback
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  No previous snapshots created yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: PROJECT MEMORY */}
        {activeTab === 'info' && (
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            <div>
              <span className="font-mono uppercase text-[10px] tracking-wider text-muted-foreground">
                Project Architecture
              </span>
              <div className="mt-1 font-semibold text-foreground text-sm">{project.name}</div>
              <p className="text-muted-foreground mt-1 leading-relaxed">{project.description}</p>
            </div>

            <div className="p-3 rounded-xl bg-secondary/50 border border-border space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-mono capitalize text-foreground">{project.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Framework:</span>
                <span className="font-mono text-foreground">{project.settings.framework}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Entry File:</span>
                <span className="font-mono text-indigo-400">{project.settings.entryFile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Files:</span>
                <span className="font-mono text-foreground">{project.files.length}</span>
              </div>
            </div>

            <div>
              <span className="font-mono uppercase text-[10px] tracking-wider text-muted-foreground">
                Dependencies & Tags
              </span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[10px] font-mono border border-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
