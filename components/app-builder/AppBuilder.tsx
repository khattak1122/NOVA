'use client';

import React from 'react';
import {
  Smartphone,
  Layers,
  Database,
  Lock,
  GitFork,
  Cpu,
  Sparkles,
  ArrowRight,
  Code2,
  FolderTree,
  CheckCircle2,
  Download,
  Copy,
} from 'lucide-react';
import { Project } from '@/types/nova';

interface AppBuilderProps {
  currentProject: Project;
  onScaffoldArchitecture: (type: 'pwa' | 'react-native' | 'android' | 'fullstack', name: string, description: string) => void;
  onAskAi: (prompt: string) => void;
}

export function AppBuilder({
  currentProject,
  onScaffoldArchitecture,
  onAskAi,
}: AppBuilderProps) {
  const [targetType, setTargetType] = React.useState<'pwa' | 'react-native' | 'android' | 'fullstack'>('android');
  const [appName, setAppName] = React.useState('Aura Cloud Inventory');
  const [appDescription, setAppDescription] = React.useState(
    'Real-time inventory management application with barcode scanner, stock sync, offline SQLite storage, and multi-tenant authentication.'
  );
  const [activeTab, setActiveTab] = React.useState<'blueprint' | 'schema' | 'navigation' | 'state' | 'auth'>('blueprint');

  const architectures = [
    {
      id: 'android',
      title: 'Android Native (Kotlin)',
      subtitle: 'Jetpack Compose • Room DB • Coroutines',
      icon: Smartphone,
      color: 'emerald',
    },
    {
      id: 'react-native',
      title: 'React Native / Expo',
      subtitle: 'Cross-platform iOS/Android • Zustand • SQLite',
      icon: Layers,
      color: 'indigo',
    },
    {
      id: 'pwa',
      title: 'Progressive Web App (PWA)',
      subtitle: 'Service Workers • Offline Cache • Web App Manifest',
      icon: Cpu,
      color: 'sky',
    },
    {
      id: 'fullstack',
      title: 'Fullstack Next.js & Supabase',
      subtitle: 'App Router • PostgreSQL • Edge Functions',
      icon: Database,
      color: 'purple',
    },
  ];

  const handleGenerate = () => {
    onScaffoldArchitecture(targetType, appName, appDescription);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono mb-2 border border-indigo-500/20">
            <Smartphone className="w-3.5 h-3.5" />
            <span>AI Full-Stack Architecture Generator</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Modular Application Architecture
          </h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-xl">
            Design complete, production-grade applications with UI, navigation graphs, database schemas, state management, and authentication pipelines.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Scaffold into Workspace</span>
        </button>
      </div>

      {/* Target Archetype Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {architectures.map((arch) => {
          const Icon = arch.icon;
          const isSelected = targetType === arch.id;
          return (
            <button
              key={arch.id}
              onClick={() => setTargetType(arch.id as any)}
              className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-600/10 border-indigo-500/40 shadow-sm'
                  : 'bg-card border-border hover:bg-secondary/60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-secondary text-indigo-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-400" />}
              </div>
              <div>
                <div className="font-semibold text-xs text-foreground">{arch.title}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{arch.subtitle}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Configuration Inputs */}
      <div className="p-4 rounded-xl bg-card border border-border grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">
            Application Title
          </label>
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg bg-secondary border border-border text-foreground outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">
            System Purpose & Capabilities
          </label>
          <input
            type="text"
            value={appDescription}
            onChange={(e) => setAppDescription(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg bg-secondary border border-border text-foreground outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Architectural Pillars Tabs */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="h-11 border-b border-border bg-secondary/50 px-3 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition ${
              activeTab === 'blueprint' ? 'bg-card text-foreground font-semibold shadow-sm' : 'text-muted-foreground'
            }`}
          >
            <GitFork className="w-3.5 h-3.5 text-indigo-400" />
            <span>Architecture Blueprint</span>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition ${
              activeTab === 'schema' ? 'bg-card text-foreground font-semibold shadow-sm' : 'text-muted-foreground'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Database Architecture</span>
          </button>
          <button
            onClick={() => setActiveTab('navigation')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition ${
              activeTab === 'navigation' ? 'bg-card text-foreground font-semibold shadow-sm' : 'text-muted-foreground'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5 text-sky-400" />
            <span>Navigation Graph</span>
          </button>
          <button
            onClick={() => setActiveTab('state')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition ${
              activeTab === 'state' ? 'bg-card text-foreground font-semibold shadow-sm' : 'text-muted-foreground'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>State Management</span>
          </button>
          <button
            onClick={() => setActiveTab('auth')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition ${
              activeTab === 'auth' ? 'bg-card text-foreground font-semibold shadow-sm' : 'text-muted-foreground'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span>Auth & Security</span>
          </button>
        </div>

        <div className="p-4 sm:p-6 text-xs">
          {activeTab === 'blueprint' && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-secondary/40 border border-border">
                  <div className="font-semibold text-foreground mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Presentation Layer
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    {targetType === 'android'
                      ? 'Jetpack Compose declarative UI with Material 3 theming, responsive screen layouts, and rememberSaveable state.'
                      : 'React 19 Server & Client components with Tailwind CSS micro-animations.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-secondary/40 border border-border">
                  <div className="font-semibold text-foreground mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    Domain & Business Logic
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    {targetType === 'android'
                      ? 'Kotlin Coroutines, StateFlow repositories, offline cache synchronization, and Clean Architecture use cases.'
                      : 'Typed service actions, optimistic mutations, and resilient network retry interceptors.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-secondary/40 border border-border">
                  <div className="font-semibold text-foreground mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    Persistence & Cloud
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    {targetType === 'android'
                      ? 'Room SQLite local persistence with biometric encryption and bidirectional REST sync.'
                      : 'PostgreSQL relational schemas with Row Level Security (RLS) policies.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="font-mono bg-stone-950 p-4 rounded-xl text-stone-200 text-xs overflow-x-auto">
              <pre>{`-- NOVA Architecture Generated Database Schema
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity INTEGER DEFAULT 0 CHECK (quantity >= 0),
    warehouse_id UUID,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row-Level Security
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view warehouse inventory" ON inventory_items
    FOR SELECT USING (auth.uid() IS NOT NULL);`}</pre>
            </div>
          )}

          {activeTab === 'navigation' && (
            <div className="space-y-3 font-mono">
              <div className="p-3 rounded-lg bg-secondary border border-border flex items-center justify-between text-xs">
                <span>/auth/login</span>
                <span className="text-muted-foreground">Public • Biometric or Email</span>
              </div>
              <div className="p-3 rounded-lg bg-secondary border border-border flex items-center justify-between text-xs">
                <span>/dashboard</span>
                <span className="text-emerald-400">Protected • Role: ANY</span>
              </div>
              <div className="p-3 rounded-lg bg-secondary border border-border flex items-center justify-between text-xs">
                <span>/inventory/scan</span>
                <span className="text-emerald-400">Protected • Camera Barcode Scanner</span>
              </div>
              <div className="p-3 rounded-lg bg-secondary border border-border flex items-center justify-between text-xs">
                <span>/admin/audit-logs</span>
                <span className="text-purple-400">Guarded • Role: ADMIN</span>
              </div>
            </div>
          )}

          {activeTab === 'state' && (
            <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-2">
              <div className="font-semibold text-foreground">Reactive State Store</div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Atomic state updates with optimistic offline mutations. Updates reflect instantly in UI before reconciling with the server sync queue.
              </p>
            </div>
          )}

          {activeTab === 'auth' && (
            <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-2">
              <div className="font-semibold text-foreground">Zero-Trust Authentication Engine</div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Stateless JWT tokens stored in encrypted secure storage / HTTP-only cookies with automatic refresh token rotation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
