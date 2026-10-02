'use client';

import React from 'react';
import {
  Sparkles,
  Globe,
  Smartphone,
  Layers,
  Database,
  X,
} from 'lucide-react';
import { Project } from '@/types/nova';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: Project) => void;
}

export function NewProjectModal({ isOpen, onClose, onCreateProject }: NewProjectModalProps) {
  const [name, setName] = React.useState('');
  const [type, setType] = React.useState<Project['type']>('website');
  const [description, setDescription] = React.useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let initialFile = {
      id: `file-${Date.now()}`,
      name: 'index.html',
      path: 'index.html',
      language: 'html',
      isEntry: true,
      updatedAt: Date.now(),
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-white min-h-screen flex items-center justify-center p-8 font-sans">
  <div class="max-w-xl text-center">
    <div class="inline-block p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 mb-4 font-mono text-xs">
      // NOVA AI WORKSPACE
    </div>
    <h1 class="text-4xl font-extrabold mb-3">${name}</h1>
    <p class="text-slate-400 text-sm mb-6">${description || 'Project created in NOVA AI Studio.'}</p>
    <button class="px-6 py-3 rounded-xl bg-indigo-600 font-bold text-sm hover:bg-indigo-500 transition">
      Explore Application
    </button>
  </div>
</body>
</html>`,
    };

    if (type === 'android') {
      initialFile = {
        id: `file-${Date.now()}`,
        name: 'MainActivity.kt',
        path: 'app/src/main/java/com/nova/app/MainActivity.kt',
        language: 'kotlin',
        isEntry: true,
        updatedAt: Date.now(),
        content: `package com.nova.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Greeting("${name}")
        }
    }
}

@Composable
fun Greeting(name: String) {
    Text(text = "Hello from $name!")
}`,
      };
    }

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: name.trim(),
      type,
      description: description.trim() || `Modular ${type} application created with NOVA AI Studio.`,
      tags: [type.toUpperCase(), 'NOVA', 'TypeScript'],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      settings: {
        framework: type === 'android' ? 'android-kotlin' : 'vanilla-html',
        entryFile: initialFile.path,
        theme: 'dark',
        dependencies: {},
      },
      versions: [],
      files: [initialFile],
    };

    onCreateProject(newProject);
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-indigo-600 text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">Scaffold New Project</h3>
            <p className="text-xs text-muted-foreground">Select an archetype to initialize in your workspace.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">Project Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Zenith Cloud Analytics or Horizon Travel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-secondary border border-border text-foreground outline-none focus:border-indigo-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">Archetype</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(
                [
                  { id: 'website', label: 'Website', icon: Globe },
                  { id: 'android', label: 'Android Native', icon: Smartphone },
                  { id: 'react-native', label: 'React Native', icon: Layers },
                  { id: 'fullstack', label: 'Fullstack App', icon: Database },
                ] as const
              ).map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id)}
                    className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition ${
                      type === item.id
                        ? 'bg-indigo-600/15 border-indigo-500/40 text-indigo-400 font-semibold'
                        : 'bg-secondary border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">Description (Optional)</label>
            <textarea
              rows={2}
              placeholder="What will this application do?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg bg-secondary border border-border text-foreground outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-secondary hover:bg-muted text-xs text-foreground transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
