'use client';

import React from 'react';
import {
  Cpu,
  Check,
  X,
  Sparkles,
  Zap,
} from 'lucide-react';
import { ModelRegistryService } from '@/lib/ai/providers';
import { AIModel } from '@/types/nova';

interface ModelSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModelId: string;
  onSelectModel: (id: string) => void;
}

export function ModelSelectModal({
  isOpen,
  onClose,
  activeModelId,
  onSelectModel,
}: ModelSelectModalProps) {
  const modelRegistry = ModelRegistryService.getInstance();
  const models = modelRegistry.getModels();

  if (!isOpen) return null;

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
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">Select Active AI Model</h3>
            <p className="text-xs text-muted-foreground">Unified provider model routing architecture</p>
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto my-2">
          {models.map((model) => {
            const isSelected = model.id === activeModelId;
            return (
              <button
                key={model.id}
                onClick={() => {
                  onSelectModel(model.id);
                  onClose();
                }}
                className={`w-full p-3 rounded-xl border text-left flex items-start justify-between gap-3 transition ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500/40 shadow-sm'
                    : 'bg-secondary/40 border-border hover:bg-secondary/80'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-foreground font-mono">{model.name}</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-secondary text-muted-foreground">
                      {model.provider}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    {model.description}
                  </p>
                  <div className="flex gap-2 text-[10px] font-mono text-indigo-400 mt-2">
                    <span>{model.contextWindow.toLocaleString()} tokens</span>
                    {model.capabilities.toolCalling && <span>• Tool Calling</span>}
                    {model.capabilities.vision && <span>• Vision</span>}
                  </div>
                </div>

                {isSelected && (
                  <div className="p-1 rounded-full bg-indigo-600 text-white shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
