'use client';

import React from 'react';
import {
  Settings,
  Database,
  User,
  Shield,
  Key,
  RotateCcw,
  CheckCircle2,
  Copy,
  Check,
  Server,
} from 'lucide-react';
import { UserProfile } from '@/types/nova';
import { NovaStorage } from '@/lib/storage/store';
import { STARTER_PROJECTS } from '@/lib/templates/initial-projects';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (u: UserProfile) => void;
  onResetProjects: () => void;
}

export function SettingsView({ user, onUpdateUser, onResetProjects }: SettingsViewProps) {
  const [profile, setProfile] = React.useState<UserProfile>(user);
  const [saved, setSaved] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'profile' | 'database' | 'security'>('profile');
  const [copiedSchema, setCopiedSchema] = React.useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(profile);
    NovaStorage.updateUserProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const supabaseSchema = `-- NOVA AI Studio Complete Production PostgreSQL / Supabase Schema
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'developer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  tags TEXT[],
  settings JSONB,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE project_files (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_sessions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id TEXT PRIMARY KEY,
  session_id TEXT REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  tool_calls JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);`;

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono mb-2 border border-indigo-500/20">
          <Settings className="w-3.5 h-3.5" />
          <span>System & Account Configuration</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Workspace Settings & Database Architecture
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage user profiles, inspect persistent database schemas (Supabase / PostgreSQL / Firebase), and configure platform preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center rounded-xl bg-card border border-border p-1 w-fit text-xs">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'profile' ? 'bg-indigo-600 text-white font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          User Profile & Auth
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'database' ? 'bg-indigo-600 text-white font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Database Architecture (SQL)
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'security' ? 'bg-indigo-600 text-white font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Security & Keys
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm max-w-2xl space-y-4">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center gap-4 border-b border-border pb-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-indigo-600/30">
                {profile.name[0] || 'N'}
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">{profile.name}</h3>
                <span className="text-xs font-mono uppercase text-indigo-400 font-semibold">{profile.role}</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-secondary border border-border text-foreground outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-secondary border border-border text-foreground outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">Workspace Role</label>
              <select
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg bg-secondary border border-border text-foreground outline-none"
              >
                <option value="admin">Chief Architect (Admin - Full Platform Control)</option>
                <option value="developer">Lead Developer (Workspace Read/Write/Exec)</option>
                <option value="creator">Creator / Designer (UI & Content Studio)</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition"
            >
              {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Settings className="w-4 h-4" />}
              <span>{saved ? 'Profile Saved' : 'Save Profile Changes'}</span>
            </button>
          </form>

          {/* Reset Projects */}
          <div className="pt-6 border-t border-border mt-6">
            <h4 className="font-semibold text-xs text-foreground mb-1">Reset Starter Workspace</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Restore the pre-configured starter projects (Bistro Nova Restaurant & Aura Android Native App).
            </p>
            <button
              onClick={onResetProjects}
              className="px-4 py-2 rounded-xl bg-secondary hover:bg-destructive/20 hover:text-destructive text-foreground text-xs font-medium border border-border transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Projects to Clean Factory State</span>
            </button>
          </div>
        </div>
      )}

      {/* Database Tab */}
      {activeTab === 'database' && (
        <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Production PostgreSQL / Supabase Migration Schema</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Ready-to-deploy SQL schema for production persistence across users, projects, chats, and versions.
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(supabaseSchema);
                setCopiedSchema(true);
                setTimeout(() => setCopiedSchema(false), 2000);
              }}
              className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-xs flex items-center gap-1.5 transition"
            >
              {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSchema ? 'Copied' : 'Copy SQL Schema'}</span>
            </button>
          </div>

          <div className="bg-stone-950 p-4 rounded-xl font-mono text-xs text-stone-200 overflow-x-auto max-h-[420px]">
            <pre>{supabaseSchema}</pre>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="p-6 rounded-2xl bg-card border border-border space-y-4 max-w-2xl">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
            <Shield className="w-5 h-5 shrink-0" />
            <div>
              <div className="font-bold text-foreground">Zero Frontend Key Leakage</div>
              <p className="text-muted-foreground mt-0.5 leading-relaxed">
                All Gemini API keys, provider credentials, and secret tokens are strictly secured in server-side Next.js route handlers.
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-semibold text-foreground">Required Environment Variables:</div>
            <div className="p-3 rounded-lg bg-secondary font-mono text-[11px] text-muted-foreground space-y-1">
              <div>• <span className="text-indigo-400 font-bold">GEMINI_API_KEY</span>: Active (Injected by AI Studio runtime)</div>
              <div>• <span className="text-muted-foreground">OPENAI_API_KEY</span>: Optional (for external model fallback)</div>
              <div>• <span className="text-muted-foreground">ANTHROPIC_API_KEY</span>: Optional (for external model fallback)</div>
              <div>• <span className="text-muted-foreground">VEO_API_KEY</span>: Optional (for real video rendering)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
