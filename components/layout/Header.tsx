'use client';

import React from 'react';
import {
  Sparkles,
  Play,
  RotateCcw,
  Sun,
  Moon,
  FolderOpen,
  ChevronDown,
  Layers,
  Cpu,
  Monitor,
  Tablet,
  Smartphone,
  Download,
  ShieldCheck,
} from 'lucide-react';
import { Project, DevicePreviewMode } from '@/types/nova';
import { exportProjectToZip, downloadBlob } from '@/lib/export/zip';

interface HeaderProps {
  currentProject: Project;
  allProjects: Project[];
  onSelectProject: (id: string) => void;
  onNewProjectModal: () => void;
  activeModel: string;
  onOpenModelSelect: () => void;
  deviceMode: DevicePreviewMode;
  onChangeDeviceMode: (mode: DevicePreviewMode) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onRunSandbox: () => void;
  rightPanelOpen: boolean;
  onToggleRightPanel: () => void;
}

export function Header({
  currentProject,
  allProjects,
  onSelectProject,
  onNewProjectModal,
  activeModel,
  onOpenModelSelect,
  deviceMode,
  onChangeDeviceMode,
  theme,
  onToggleTheme,
  onRunSandbox,
  rightPanelOpen,
  onToggleRightPanel,
}: HeaderProps) {
  const [projectDropdown, setProjectDropdown] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);

  const handleExportZip = async () => {
    try {
      setExporting(true);
      const blob = await exportProjectToZip(currentProject);
      downloadBlob(blob, `${currentProject.name.toLowerCase().replace(/\s+/g, '-')}-project.zip`);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card/60 backdrop-blur-md px-4 flex items-center justify-between gap-4 sticky top-0 z-30 select-none">
      {/* Brand & Project Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-foreground text-sm font-mono">
                NOVA<span className="text-indigo-400">.AI</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                STUDIO v2.5
              </span>
            </div>
          </div>
        </div>

        <div className="h-5 w-[1px] bg-border mx-1 hidden sm:block" />

        {/* Project Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProjectDropdown(!projectDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/60 hover:bg-secondary border border-border text-xs font-medium text-foreground transition"
          >
            <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span className="max-w-[140px] md:max-w-[200px] truncate">{currentProject.name}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>

          {projectDropdown && (
            <div className="absolute left-0 top-full mt-1.5 w-72 bg-popover border border-border rounded-xl shadow-2xl p-2 z-50">
              <div className="text-[11px] font-semibold uppercase text-muted-foreground px-2 py-1 flex items-center justify-between">
                <span>Active Projects</span>
                <span className="text-[10px] text-indigo-400">{allProjects.length} total</span>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1 my-1">
                {allProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectProject(p.id);
                      setProjectDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                      p.id === currentProject.id
                        ? 'bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/30'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <div className="truncate">
                      <div className="truncate">{p.name}</div>
                      <div className="text-[10px] text-muted-foreground capitalize">{p.type} • {p.files.length} files</div>
                    </div>
                    {p.id === currentProject.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-border">
                <button
                  onClick={() => {
                    setProjectDropdown(false);
                    onNewProjectModal();
                  }}
                  className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Create New Project
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center Device Mode & Model Indicator */}
      <div className="hidden lg:flex items-center gap-2">
        {/* Device Switcher */}
        <div className="flex items-center p-1 rounded-lg bg-secondary/60 border border-border text-xs">
          <button
            onClick={() => onChangeDeviceMode('desktop')}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition ${
              deviceMode === 'desktop'
                ? 'bg-card text-foreground shadow-sm font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Desktop 100%"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">Desktop</span>
          </button>
          <button
            onClick={() => onChangeDeviceMode('tablet')}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition ${
              deviceMode === 'tablet'
                ? 'bg-card text-foreground shadow-sm font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Tablet 768px"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">Tablet</span>
          </button>
          <button
            onClick={() => onChangeDeviceMode('mobile')}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition ${
              deviceMode === 'mobile'
                ? 'bg-card text-foreground shadow-sm font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Mobile 375px"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">Mobile</span>
          </button>
        </div>

        {/* Model Badge */}
        <button
          onClick={onOpenModelSelect}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/60 hover:bg-secondary border border-border text-xs text-foreground transition"
        >
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[11px]">{activeModel}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRunSandbox}
          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
          title="Run project & live preview"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">Run Project</span>
        </button>

        <button
          onClick={handleExportZip}
          disabled={exporting}
          className="px-2.5 py-1.5 rounded-lg bg-secondary/60 hover:bg-secondary border border-border text-xs font-medium text-foreground flex items-center gap-1.5 transition"
          title="Download Project as ZIP"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden md:inline">{exporting ? 'Exporting...' : 'Export ZIP'}</span>
        </button>

        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg bg-secondary/60 hover:bg-secondary border border-border text-muted-foreground hover:text-foreground transition"
          title="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
        </button>

        <button
          onClick={onToggleRightPanel}
          className={`p-2 rounded-lg border text-xs transition ${
            rightPanelOpen
              ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400'
              : 'bg-secondary/60 border-border text-muted-foreground hover:text-foreground'
          }`}
          title="Toggle Inspector & Preview Panel"
        >
          <Layers className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
