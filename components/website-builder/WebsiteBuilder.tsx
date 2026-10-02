'use client';

import React from 'react';
import {
  Globe,
  Sparkles,
  Play,
  RotateCcw,
  Code2,
  Eye,
  Download,
  Terminal,
  Layers,
  Monitor,
  Tablet,
  Smartphone,
  Save,
  Wand2,
  Bug,
  FileCode,
  CheckCircle2,
} from 'lucide-react';
import { Project, ProjectFile, DevicePreviewMode } from '@/types/nova';
import { buildProjectPreviewBundle } from '@/lib/sandbox/runner';
import { exportProjectToZip, downloadBlob } from '@/lib/export/zip';

interface WebsiteBuilderProps {
  project: Project;
  onUpdateProject: (updated: Project) => void;
  activeModel: string;
  onAskAi: (prompt: string) => void;
}

export function WebsiteBuilder({
  project,
  onUpdateProject,
  activeModel,
  onAskAi,
}: WebsiteBuilderProps) {
  const [activeFileId, setActiveFileId] = React.useState<string>(() => {
    const entry = project.files.find((f) => f.path === project.settings.entryFile || f.isEntry);
    return entry?.id || project.files[0]?.id || '';
  });

  const activeFile = project.files.find((f) => f.id === activeFileId) || project.files[0];
  const [editorContent, setEditorContent] = React.useState<string>(() => activeFile?.content || '');
  const [activeTab, setActiveTab] = React.useState<'split' | 'code' | 'preview'>('split');
  const [deviceMode, setDeviceMode] = React.useState<DevicePreviewMode>('desktop');
  const [promptInput, setPromptInput] = React.useState('');
  const [isApplying, setIsApplying] = React.useState(false);
  const [savedSuccess, setSavedSuccess] = React.useState(false);
  const [previewKey, setPreviewKey] = React.useState(0);

  const handleSelectFile = (file: ProjectFile) => {
    setActiveFileId(file.id);
    setEditorContent(file.content);
  };

  const bundle = React.useMemo(() => {
    return buildProjectPreviewBundle(project);
  }, [project]);

  const handleSaveFile = () => {
    if (!activeFile) return;
    const updatedFiles = project.files.map((f) =>
      f.id === activeFile.id ? { ...f, content: editorContent, updatedAt: Date.now() } : f
    );
    const updatedProject = { ...project, files: updatedFiles, updatedAt: Date.now() };
    onUpdateProject(updatedProject);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAiAction = (actionPrompt: string) => {
    setIsApplying(true);
    onAskAi(actionPrompt);
    setTimeout(() => setIsApplying(false), 1200);
  };

  const quickFeatures = [
    { label: 'Add Reviews Section', prompt: 'Add an authentic customer reviews section with 5-star ratings, testimonials, and customer avatar cards.' },
    { label: 'Add Contact & Map', prompt: 'Add a responsive contact information section with working enquiry form and interactive location card.' },
    { label: 'Make Mobile Responsive', prompt: 'Audit all CSS and HTML elements to make this website 100% mobile-friendly with fluid typography and hamburger navigation.' },
    { label: 'Add Floating Reservation', prompt: 'Add an elegant floating booking widget with a quick table reservation button.' },
  ];

  const getViewportWidth = () => {
    if (deviceMode === 'mobile') return 'max-w-[375px]';
    if (deviceMode === 'tablet') return 'max-w-[768px]';
    return 'w-full';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Top Builder Control Header */}
      <div className="h-12 border-b border-border bg-card px-4 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
            <Globe className="w-3.5 h-3.5" />
            <span>AI Website Engine</span>
          </div>

          <div className="h-4 w-[1px] bg-border mx-1" />

          {/* View mode buttons */}
          <div className="flex items-center rounded-lg bg-secondary/80 p-0.5 text-xs">
            <button
              onClick={() => setActiveTab('split')}
              className={`px-2.5 py-1 rounded-md transition ${activeTab === 'split' ? 'bg-card text-foreground font-semibold shadow-sm' : 'text-muted-foreground'}`}
            >
              Split View
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-2.5 py-1 rounded-md transition ${activeTab === 'code' ? 'bg-card text-foreground font-semibold shadow-sm' : 'text-muted-foreground'}`}
            >
              Code Only
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 py-1 rounded-md transition ${activeTab === 'preview' ? 'bg-card text-foreground font-semibold shadow-sm' : 'text-muted-foreground'}`}
            >
              Preview Only
            </button>
          </div>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-secondary/80 p-0.5 text-xs">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded-md ${deviceMode === 'desktop' ? 'bg-card text-foreground font-semibold' : 'text-muted-foreground'}`}
              title="Desktop 100%"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded-md ${deviceMode === 'tablet' ? 'bg-card text-foreground font-semibold' : 'text-muted-foreground'}`}
              title="Tablet 768px"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded-md ${deviceMode === 'mobile' ? 'bg-card text-foreground font-semibold' : 'text-muted-foreground'}`}
              title="Mobile 375px"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setPreviewKey((k) => k + 1)}
            className="p-1.5 rounded-lg bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground transition"
            title="Refresh Preview"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleSaveFile}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {savedSuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
            <span>{savedSuccess ? 'Saved' : 'Save File'}</span>
          </button>
        </div>
      </div>

      {/* AI Quick Modifications Bar */}
      <div className="px-4 py-2 bg-secondary/40 border-b border-border flex items-center gap-2 overflow-x-auto shrink-0">
        <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          AI Actions:
        </span>
        {quickFeatures.map((f, i) => (
          <button
            key={i}
            onClick={() => handleAiAction(f.prompt)}
            className="px-2.5 py-1 rounded-full bg-card hover:bg-indigo-600/15 border border-border text-[11px] text-foreground font-medium shrink-0 hover:border-indigo-500/40 transition"
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Workspace Body: Split or Single */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor Column */}
        {(activeTab === 'split' || activeTab === 'code') && (
          <div className={`flex flex-col border-r border-border bg-stone-950 font-mono text-xs overflow-hidden ${activeTab === 'split' ? 'w-1/2' : 'w-full'}`}>
            {/* File Tabs */}
            <div className="h-9 border-b border-stone-800 bg-stone-900/70 px-2 flex items-center gap-1 overflow-x-auto shrink-0">
              {project.files.map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleSelectFile(f)}
                  className={`px-3 py-1 rounded-t text-xs flex items-center gap-1.5 transition ${
                    activeFile?.id === f.id
                      ? 'bg-stone-950 text-indigo-400 border-t-2 border-indigo-500 font-semibold'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <FileCode className="w-3 h-3" />
                  <span>{f.name}</span>
                </button>
              ))}
            </div>

            {/* Live Textarea Code Editor */}
            <div className="flex-1 p-3 overflow-auto">
              <textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                spellCheck={false}
                className="w-full h-full bg-transparent text-stone-100 font-mono text-xs leading-relaxed outline-none resize-none selection:bg-indigo-500/30"
              />
            </div>
          </div>
        )}

        {/* Live Multi-Device Preview Column */}
        {(activeTab === 'split' || activeTab === 'preview') && (
          <div className={`flex-1 flex flex-col bg-stone-900/60 overflow-hidden ${activeTab === 'split' ? 'w-1/2' : 'w-full'}`}>
            <div className="p-3 flex justify-center items-center h-full overflow-auto">
              <div
                className={`h-full transition-all duration-300 rounded-2xl overflow-hidden border border-border shadow-2xl bg-background ${getViewportWidth()}`}
              >
                <iframe
                  key={previewKey}
                  title="Website Builder Live Preview"
                  srcDoc={bundle.srcDoc}
                  sandbox="allow-scripts allow-forms allow-modals allow-same-origin"
                  className="w-full h-full border-0 bg-stone-950"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
