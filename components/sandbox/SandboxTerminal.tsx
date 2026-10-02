'use client';

import React from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  Sparkles,
  Bug,
  ShieldCheck,
  Cpu,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { executeCodeInBrowserSandbox } from '@/lib/sandbox/runner';

interface SandboxTerminalProps {
  onAskAiToFix: (errorMsg: string) => void;
}

export function SandboxTerminal({ onAskAiToFix }: SandboxTerminalProps) {
  const [language, setLanguage] = React.useState<'javascript' | 'python'>('javascript');
  const [code, setCode] = React.useState<string>(`// NOVA Sandboxed Execution Environment
// Runs isolated in client-side worker/evaluator with stdout/stderr capture

function simulateOrderPipeline() {
  const items = [
    { sku: 'NOVA-001', name: 'Artisanal Hearth Bread', qty: 2, price: 14.50 },
    { sku: 'NOVA-002', name: 'Winter Truffle Butter', qty: 1, price: 28.00 },
  ];

  const subtotal = items.reduce((acc, i) => acc + (i.qty * i.price), 0);
  const tax = Number((subtotal * 0.0825).toFixed(2));
  const total = subtotal + tax;

  console.log("=== INVENTORY DISPATCH RUN ===");
  console.log("Items count:", items.length);
  console.log("Subtotal: $" + subtotal.toFixed(2));
  console.log("Sales Tax (8.25%): $" + tax.toFixed(2));
  console.log("Calculated Total: $" + total.toFixed(2));
  console.log("Security clearance: SANDBOX_ISOLATED_OK");
  return { status: "SUCCESS", orderId: "ORD-" + Math.floor(Math.random() * 90000 + 10000) };
}

const result = simulateOrderPipeline();
console.log("Final dispatch result:", JSON.stringify(result));
`);

  const [stdout, setStdout] = React.useState<string>('');
  const [stderr, setStderr] = React.useState<string>('');
  const [execTime, setExecTime] = React.useState<number | null>(null);
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [isExecuting, setIsExecuting] = React.useState(false);

  const handleRun = async () => {
    setIsExecuting(true);
    try {
      const res = await executeCodeInBrowserSandbox(language, code);
      setStdout(res.stdout);
      setStderr(res.stderr);
      setExecTime(res.executionTime);
      setStatus(res.status);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleLoadPythonSample = () => {
    setLanguage('python');
    setCode(`# NOVA Python Sandbox Simulation
# Isolated client evaluation for syntax, calculations, and data processing

inventory = [
    {"name": "Glazed Black Cod", "stock": 14, "cost": 32.50},
    {"name": "Smoked Beet Tartare", "stock": 25, "cost": 16.00},
    {"name": "Iberian Pork Belly", "stock": 9, "cost": 28.00}
]

total_valuation = sum(item["stock"] * item["cost"] for item in inventory)

print("--- Inventory Valuation Report ---")
for item in inventory:
    print(f"Product: {item['name']} | Stock: {item['stock']} | Subtotal: $\${item['stock'] * item['cost']:.2f}")

print(f"Total Warehouse Valuation: $\${total_valuation:.2f}")
`);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Top Header */}
      <div className="h-12 border-b border-border bg-card px-4 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Isolated Sandbox</span>
          </div>

          <div className="flex items-center rounded-lg bg-secondary/80 p-0.5 text-xs">
            <button
              onClick={() => setLanguage('javascript')}
              className={`px-2.5 py-1 rounded-md transition ${language === 'javascript' ? 'bg-card text-foreground font-semibold shadow-sm' : 'text-muted-foreground'}`}
            >
              JavaScript / TS
            </button>
            <button
              onClick={handleLoadPythonSample}
              className={`px-2.5 py-1 rounded-md transition ${language === 'python' ? 'bg-card text-foreground font-semibold shadow-sm' : 'text-muted-foreground'}`}
            >
              Python Script
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={isExecuting}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isExecuting ? 'Executing...' : 'Run in Sandbox'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Output Split */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Code Input */}
        <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-border bg-stone-950 font-mono text-xs overflow-hidden">
          <div className="p-2 border-b border-stone-800 bg-stone-900/60 text-stone-400 flex items-center justify-between">
            <span className="text-[11px]">Sandbox Source Editor</span>
            <span className="text-[10px] text-emerald-400 font-mono">Isolated Container</span>
          </div>
          <div className="flex-1 p-3 overflow-auto">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-full bg-transparent text-stone-100 font-mono text-xs leading-relaxed outline-none resize-none selection:bg-emerald-500/30"
            />
          </div>
        </div>

        {/* Console / Terminal Output */}
        <div className="flex-1 flex flex-col bg-stone-950 font-mono text-xs overflow-hidden">
          <div className="p-2 border-b border-stone-800 bg-stone-900/60 text-stone-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px]">Captured Terminal & Process IO</span>
            </div>
            {execTime !== null && (
              <span className="text-[10px] text-stone-500 font-mono">
                {execTime}ms execution
              </span>
            )}
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 select-text">
            {status === 'idle' && (
              <div className="text-stone-500 text-center py-16">
                Press &quot;Run in Sandbox&quot; to execute the script in an isolated runtime and capture process output.
              </div>
            )}

            {stdout && (
              <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 text-emerald-300 whitespace-pre-wrap leading-relaxed">
                {stdout}
              </div>
            )}

            {stderr && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 space-y-2">
                <div className="font-semibold text-rose-400">[PROCESS ERROR]</div>
                <div className="whitespace-pre-wrap font-mono text-xs">{stderr}</div>
                <button
                  onClick={() => onAskAiToFix(stderr)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold border border-rose-500/40 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Ask NOVA Agent to Diagnose & Fix Error
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
