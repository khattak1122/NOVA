'use client';

import React from 'react';
import {
  Send,
  Sparkles,
  Paperclip,
  Image as ImageIcon,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  FileCode,
  Globe,
  Terminal,
  Layers,
  Code2,
} from 'lucide-react';
import { ChatMessage, ChatSession, Project, MessageAttachment, ToolCallStep } from '@/types/nova';
import { NovaStorage } from '@/lib/storage/store';

function getNow(): number {
  return Date.now();
}

function generateUniqueId(prefix: string = 'msg'): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

interface AgentChatProps {
  currentProject: Project;
  onProjectUpdated: (updated: Project) => void;
  chatSession: ChatSession;
  onUpdateChatSession: (updated: ChatSession) => void;
  activeModel: string;
  onSwitchView: (view: any) => void;
  onTriggerPreview: () => void;
}

export function AgentChat({
  currentProject,
  onProjectUpdated,
  chatSession,
  onUpdateChatSession,
  activeModel,
  onSwitchView,
  onTriggerPreview,
}: AgentChatProps) {
  const [input, setInput] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [attachments, setAttachments] = React.useState<MessageAttachment[]>([]);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Voice state
  const [isListening, setIsListening] = React.useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [chatSession.messages]);

  // Voice Speech-To-Text
  const handleToggleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser environment.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const windowObj = window as unknown as Record<string, unknown>;
      const SpeechRecognition = (windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition) as any;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: { results: Array<Array<{ transcript: string }>> }) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  // Text-To-Speech
  const handleSpeakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    // Strip code fences for speech
    const cleanText = text.replace(/```[\s\S]*?```/g, 'Code block omitted.');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const isImg = file.type.startsWith('image/');
      const reader = new FileReader();

      if (isImg) {
        reader.onload = (event) => {
          setAttachments((prev) => [
            ...prev,
            {
              id: generateUniqueId('att'),
              name: file.name,
              type: 'image',
              size: file.size,
              base64: event.target?.result as string,
              mimeType: file.type,
            },
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        reader.onload = (event) => {
          setAttachments((prev) => [
            ...prev,
            {
              id: generateUniqueId('att'),
              name: file.name,
              type: 'file',
              size: file.size,
              content: event.target?.result as string,
              mimeType: file.type,
            },
          ]);
        };
        reader.readAsText(file);
      }
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Central Agent submission
  const handleSubmit = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input;
    if (!promptToSend.trim() || isProcessing) return;

    setErrorMessage(null);
    const nowTimestamp = getNow();
    const userMessage: ChatMessage = {
      id: generateUniqueId('msg'),
      role: 'user',
      content: promptToSend,
      timestamp: nowTimestamp,
      attachments: [...attachments],
    };

    const updatedMessages = [...chatSession.messages, userMessage];
    const newSession: ChatSession = {
      ...chatSession,
      messages: updatedMessages,
      updatedAt: nowTimestamp,
      title: chatSession.messages.length === 0 ? promptToSend.slice(0, 32) : chatSession.title,
    };

    onUpdateChatSession(newSession);
    setInput('');
    const currentAttachments = [...attachments];
    setAttachments([]);
    setIsProcessing(true);

    try {
      // 1. Create a version snapshot of project before agent modifies files
      NovaStorage.createVersionSnapshot(
        currentProject.id,
        `Automatic backup before applying: "${promptToSend.slice(0, 40)}..."`
      );

      // 2. Call server-side /api/agent
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          project: currentProject,
          history: updatedMessages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
          attachments: currentAttachments,
          model: activeModel,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Agent API failed with status ${res.status}`);
      }

      const data = await res.json();

      // 3. Apply file modifications to the current project
      if (data.fileModifications && data.fileModifications.length > 0) {
        const updatedFiles = [...currentProject.files];
        const editTimestamp = getNow();

        for (const mod of data.fileModifications) {
          const index = updatedFiles.findIndex((f) => f.path === mod.path);
          if (mod.action === 'delete') {
            if (index >= 0) updatedFiles.splice(index, 1);
          } else if (index >= 0) {
            // Modify existing file
            updatedFiles[index] = {
              ...updatedFiles[index],
              content: mod.content,
              updatedAt: editTimestamp,
            };
          } else {
            // Create new file
            updatedFiles.push({
              id: generateUniqueId('file'),
              name: mod.path.split('/').pop() || mod.path,
              path: mod.path,
              content: mod.content,
              language: mod.language || 'javascript',
              updatedAt: editTimestamp,
            });
          }
        }

        const modifiedProject: Project = {
          ...currentProject,
          files: updatedFiles,
          updatedAt: editTimestamp,
        };

        onProjectUpdated(modifiedProject);
        NovaStorage.updateProject(modifiedProject);
        onTriggerPreview();
      }

      // 4. Append assistant response
      const assistantMessage: ChatMessage = {
        id: generateUniqueId('msg'),
        role: 'assistant',
        content: data.response,
        timestamp: getNow(),
        toolCalls: data.toolCalls,
        modelUsed: data.modelUsed,
      };

      onUpdateChatSession({
        ...newSession,
        messages: [...updatedMessages, assistantMessage],
      });
    } catch (err: unknown) {
      console.error('Agent error:', err);
      const errMsg = err instanceof Error ? err.message : 'Agent execution failed.';
      setErrorMessage(errMsg);

      const errorMessageObj: ChatMessage = {
        id: generateUniqueId('msg'),
        role: 'assistant',
        content: `⚠️ **Agent Error**: ${errMsg}\n\nPlease check your server configuration, API credentials, or network connection.`,
        timestamp: getNow(),
        error: errMsg,
      };

      onUpdateChatSession({
        ...newSession,
        messages: [...updatedMessages, errorMessageObj],
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    { label: 'Add Login Modal', prompt: 'Add an elegant login and authentication modal to this project with form validation and remember me checkbox.' },
    { label: 'Make Mobile Responsive', prompt: 'Audit all files and make the application completely mobile responsive with a clean hamburger navigation drawer.' },
    { label: 'Add Dark/Light Mode', prompt: 'Implement a persistent dark and light theme toggle with smooth CSS transitions.' },
    { label: 'Create Android Version', prompt: 'Generate an Android / Kotlin project architecture based on this application with Jetpack Compose UI and Room database.' },
    { label: 'Search 2026 UI Trends', prompt: 'Search the web for the latest 2026 design trends and implement modern micro-interactions.' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden relative">
      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {chatSession.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center py-12 px-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-[1px] mb-6 shadow-xl shadow-indigo-500/20">
              <div className="w-full h-full bg-card rounded-[15px] flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-indigo-400" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-2">
              NOVA AI Agent Workspace
            </h1>
            <p className="text-muted-foreground text-sm max-w-lg mb-8 leading-relaxed">
              Autonomous engineering agent connected to your project workspace. Ask it to build pages, write code, search the web, generate images, or debug errors.
            </p>

            {/* Quick Action Chips */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSubmit(qp.prompt)}
                  className="p-3 rounded-xl bg-card hover:bg-secondary/70 border border-border text-xs text-foreground transition flex items-center justify-between group shadow-sm"
                >
                  <div>
                    <div className="font-semibold text-indigo-400 group-hover:text-indigo-300">
                      {qp.label}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate max-w-[240px]">
                      {qp.prompt}
                    </div>
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-muted-foreground group-hover:text-indigo-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          chatSession.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1.5 px-1">
                <span className="text-[11px] font-mono font-semibold uppercase text-muted-foreground">
                  {msg.role === 'user' ? 'You' : `NOVA Agent (${msg.modelUsed || activeModel})`}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Attachments Display */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 max-w-lg">
                  {msg.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="px-2.5 py-1.5 rounded-lg bg-secondary border border-border text-xs flex items-center gap-1.5"
                    >
                      {att.type === 'image' ? (
                        <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                      ) : (
                        <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      <span className="truncate max-w-[150px] font-mono text-[11px]">{att.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Message Box */}
              <div
                className={`rounded-2xl p-4 max-w-3xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-card border border-border text-foreground rounded-bl-sm'
                }`}
              >
                {/* Tool Calls Pill Indicators */}
                {msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="mb-3 space-y-1.5 border-b border-border pb-2.5">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider block">
                      Agent Actions Executed:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.toolCalls.map((tc, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary/80 border border-border text-[11px] font-mono text-indigo-400"
                        >
                          <Terminal className="w-3 h-3 text-emerald-400" />
                          <span>{tc.toolName}()</span>
                          <span className="text-emerald-400">✓</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content Renderer */}
                <div className="whitespace-pre-wrap select-text font-sans">
                  {msg.content}
                </div>

                {/* Actions Footer */}
                {msg.role === 'assistant' && (
                  <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="hover:text-foreground flex items-center gap-1 transition"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 text-[11px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[11px]">Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleSpeakText(msg.content)}
                        className="hover:text-foreground flex items-center gap-1 transition ml-2"
                        title="Read aloud"
                      >
                        {isPlayingAudio ? (
                          <>
                            <VolumeX className="w-3 h-3 text-amber-400" />
                            <span className="text-[11px] text-amber-400">Stop Voice</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span className="text-[11px]">Listen</span>
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => onSwitchView('website-builder')}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                    >
                      <Layers className="w-3 h-3" />
                      View in Live Workspace →
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {isProcessing && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border max-w-md animate-pulse">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
            <div className="text-xs text-muted-foreground font-mono">
              NOVA Agent is inspecting project files & generating solutions...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Tray */}
      <div className="p-3 sm:p-4 border-t border-border bg-card/60 backdrop-blur-md">
        {/* Attachment Badges */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="px-2.5 py-1 rounded-md bg-secondary text-xs flex items-center gap-2 border border-border"
              >
                <span className="truncate max-w-[200px] text-[11px] font-mono">{att.name}</span>
                <button
                  onClick={() => setAttachments((prev) => prev.filter((a) => a.id !== att.id))}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="relative rounded-2xl bg-secondary/70 border border-border focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/50 p-2 transition shadow-inner">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Instruct the AI Agent (e.g. 'Add a customer review carousel', 'Make it mobile responsive', 'Add a login page')..."
            rows={2}
            className="w-full bg-transparent px-2 text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none"
          />

          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <div className="flex items-center gap-1">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="agent-file-upload"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
                title="Attach code or document files"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <button
                onClick={handleToggleVoice}
                className={`p-1.5 rounded-lg transition ${
                  isListening
                    ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
                title="Voice input"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <span className="text-[10px] text-muted-foreground font-mono hidden sm:inline ml-2">
                Project: {currentProject.name.slice(0, 18)}...
              </span>
            </div>

            <button
              onClick={() => handleSubmit()}
              disabled={isProcessing || !input.trim()}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition"
            >
              <span>Execute</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
