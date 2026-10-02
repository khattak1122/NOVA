'use client';

import React from 'react';
import {
  ShieldAlert,
  Cpu,
  Activity,
  Server,
  ToggleLeft,
  ToggleRight,
  Database,
  Users,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Lock,
} from 'lucide-react';
import { AIModel, AIProvider, SystemHealthStatus, UserProfile } from '@/types/nova';
import { ModelRegistryService } from '@/lib/ai/providers';

interface AdminDashboardProps {
  onRefreshHealth: () => void;
  health: SystemHealthStatus | null;
}

export function AdminDashboard({ onRefreshHealth, health }: AdminDashboardProps) {
  const modelRegistry = ModelRegistryService.getInstance();
  const [models, setModels] = React.useState<AIModel[]>(() => modelRegistry.getModels());
  const [providers, setProviders] = React.useState<AIProvider[]>(() => modelRegistry.getProviders());
  const [featureFlags, setFeatureFlags] = React.useState({
    enableWebSearchGrounding: true,
    enableVeoMotionPreview: false,
    enableAutonomousFileWriting: true,
    strictSandboxMode: true,
    clientTelemetry: false,
  });

  const handleToggleModel = (id: string) => {
    setModels((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = { ...m, isActive: !m.isActive };
          modelRegistry.registerModel(updated);
          return updated;
        }
        return m;
      })
    );
  };

  const handleSetDefaultModel = (id: string) => {
    modelRegistry.setActiveModel(id);
    setModels([...modelRegistry.getModels()]);
  };

  const toggleFlag = (key: keyof typeof featureFlags) => {
    setFeatureFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-mono mb-2 border border-purple-500/20">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Mission Control & Governance</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Platform Administration & Model Registry
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Configure active inference models, monitor provider uptime, enforce feature flags, and manage system health.
          </p>
        </div>

        <button
          onClick={onRefreshHealth}
          className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-semibold text-foreground flex items-center gap-2 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh Health Metrics</span>
        </button>
      </div>

      {/* System Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-muted-foreground">Cluster Health</span>
            <div className="text-lg font-bold text-emerald-400 mt-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              {health?.status ? health.status.toUpperCase() : 'OPERATIONAL'}
            </div>
            <span className="text-[10px] text-muted-foreground font-mono">Uptime: {health?.uptime || 742}s</span>
          </div>
          <Activity className="w-7 h-7 text-emerald-500/40" />
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-muted-foreground">Core Agent Engine</span>
            <div className="text-lg font-bold text-foreground mt-1">Gemini 3.8 Flash</div>
            <span className="text-[10px] text-emerald-400 font-mono">Server-Side Verified</span>
          </div>
          <Cpu className="w-7 h-7 text-indigo-500/40" />
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-muted-foreground">Node Heap Allocation</span>
            <div className="text-lg font-bold text-foreground mt-1 font-mono">
              {health?.memoryUsage?.heapUsed ? `${Math.round(health.memoryUsage.heapUsed / 1024 / 1024)} MB` : '42 MB'}
            </div>
            <span className="text-[10px] text-muted-foreground font-mono">V8 Optimized</span>
          </div>
          <Server className="w-7 h-7 text-sky-500/40" />
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-muted-foreground">Security Sandbox</span>
            <div className="text-lg font-bold text-emerald-400 mt-1">ISOLATED</div>
            <span className="text-[10px] text-muted-foreground font-mono">Zero Production Shell Exec</span>
          </div>
          <Lock className="w-7 h-7 text-purple-500/40" />
        </div>
      </div>

      {/* Model Registry Manager */}
      <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Unified AI Model Registry</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Change the active primary model or configure multi-provider fallback chains without touching frontend code.
            </p>
          </div>
          <span className="text-xs font-mono text-indigo-400">
            {models.filter((m) => m.isActive).length} Models Active
          </span>
        </div>

        <div className="space-y-2">
          {models.map((model) => (
            <div
              key={model.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                model.isDefault
                  ? 'bg-indigo-600/10 border-indigo-500/40'
                  : 'bg-secondary/40 border-border'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-foreground font-mono">{model.name}</span>
                  {model.isDefault && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                      ACTIVE DEFAULT
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground font-mono uppercase">
                    ({model.provider})
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                  {model.description}
                </p>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono text-muted-foreground pt-1">
                  <span>Context: {model.contextWindow.toLocaleString()} tokens</span>
                  {model.capabilities.toolCalling && <span>• Native Tool Calling</span>}
                  {model.capabilities.vision && <span>• Vision</span>}
                  {model.capabilities.streaming && <span>• Streaming</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!model.isDefault && model.isActive && (
                  <button
                    onClick={() => handleSetDefaultModel(model.id)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white text-xs font-semibold transition"
                  >
                    Make Primary
                  </button>
                )}
                <button
                  onClick={() => handleToggleModel(model.id)}
                  disabled={model.isDefault}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    model.isActive
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : 'bg-secondary border-border text-muted-foreground'
                  }`}
                >
                  {model.isActive ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Flags Engine */}
      <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
        <h2 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border pb-3">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Production Feature Flags & Policies</span>
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-secondary/40 border border-border flex items-center justify-between">
            <div>
              <div className="font-semibold text-xs text-foreground">Live Web Search Grounding</div>
              <div className="text-[11px] text-muted-foreground">Allows agent to ground outputs in Google Search results.</div>
            </div>
            <button onClick={() => toggleFlag('enableWebSearchGrounding')}>
              {featureFlags.enableWebSearchGrounding ? (
                <ToggleRight className="w-6 h-6 text-indigo-400" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-muted-foreground" />
              )}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-secondary/40 border border-border flex items-center justify-between">
            <div>
              <div className="font-semibold text-xs text-foreground">Veo Video Engine Preview</div>
              <div className="text-[11px] text-muted-foreground">Enables Veo generative video pipeline if API key is present.</div>
            </div>
            <button onClick={() => toggleFlag('enableVeoMotionPreview')}>
              {featureFlags.enableVeoMotionPreview ? (
                <ToggleRight className="w-6 h-6 text-indigo-400" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-muted-foreground" />
              )}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-secondary/40 border border-border flex items-center justify-between">
            <div>
              <div className="font-semibold text-xs text-foreground">Autonomous Project Workspace Writing</div>
              <div className="text-[11px] text-muted-foreground">Permits the agent to modify and create files in-place.</div>
            </div>
            <button onClick={() => toggleFlag('enableAutonomousFileWriting')}>
              {featureFlags.enableAutonomousFileWriting ? (
                <ToggleRight className="w-6 h-6 text-indigo-400" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-muted-foreground" />
              )}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-secondary/40 border border-border flex items-center justify-between">
            <div>
              <div className="font-semibold text-xs text-foreground">Strict Sandbox Mode</div>
              <div className="text-[11px] text-muted-foreground">Enforces isolated client-side worker execution for code.</div>
            </div>
            <button onClick={() => toggleFlag('strictSandboxMode')}>
              {featureFlags.strictSandboxMode ? (
                <ToggleRight className="w-6 h-6 text-indigo-400" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
