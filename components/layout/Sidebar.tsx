'use client';

import React from 'react';
import {
  MessageSquare,
  Globe,
  Smartphone,
  Code2,
  Image as ImageIcon,
  Video,
  FileSearch,
  Search,
  FileText,
  Briefcase,
  Presentation,
  Terminal,
  ShieldAlert,
  Settings,
  Plus,
  Trash2,
  FolderOpen,
  Sparkles,
  ChevronRight,
  Database,
} from 'lucide-react';
import { ViewMode, ChatSession, Project } from '@/types/nova';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  chatSessions: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  currentProject: Project;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  currentView,
  onSelectView,
  chatSessions,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  currentProject,
  isOpenMobile,
  onCloseMobile,
}: SidebarProps) {
  const [chatSearch, setChatSearch] = React.useState('');

  const filteredChats = chatSessions.filter((c) =>
    c.title.toLowerCase().includes(chatSearch.toLowerCase())
  );

  const mainTools: Array<{ id: ViewMode; label: string; icon: React.ElementType; badge?: string }> = [
    { id: 'chat', label: 'AI Agent & Chat', icon: MessageSquare },
    { id: 'website-builder', label: 'Website Builder', icon: Globe, badge: 'Interactive' },
    { id: 'app-builder', label: 'App Architecture', icon: Smartphone },
    { id: 'code-studio', label: 'Code Agent', icon: Code2 },
    { id: 'image-studio', label: 'Image Studio', icon: ImageIcon },
    { id: 'video-studio', label: 'Video Studio', icon: Video },
    { id: 'file-analyzer', label: 'File Analyzer', icon: FileSearch },
    { id: 'web-search', label: 'AI Web Search', icon: Search, badge: 'Live' },
    { id: 'document-ai', label: 'Document AI', icon: FileText },
    { id: 'cv-builder', label: 'CV Builder', icon: Briefcase },
    { id: 'presentation-builder', label: 'Presentation Studio', icon: Presentation },
    { id: 'sandbox-terminal', label: 'Secure Sandbox', icon: Terminal },
    { id: 'admin', label: 'Admin Dashboard', icon: ShieldAlert, badge: 'Models' },
    { id: 'settings', label: 'Settings & DB', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/30">
              N
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight text-foreground font-mono">
                NOVA <span className="text-indigo-400">STUDIO</span>
              </div>
              <div className="text-[10px] text-muted-foreground">Universal AI Engine</div>
            </div>
          </div>
          <button
            onClick={onNewChat}
            className="p-1.5 rounded-lg bg-secondary/80 hover:bg-indigo-600 hover:text-white border border-border text-foreground transition"
            title="Start New Agent Chat"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6">
          {/* Main AI Workspace Tools */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 mb-2 font-mono">
              Core Capabilities
            </div>
            <div className="space-y-0.5">
              {mainTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = currentView === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      onSelectView(tool.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                      <span className="truncate">{tool.label}</span>
                    </div>
                    {tool.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}
                      >
                        {tool.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conversation History */}
          <div>
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
                Recent Sessions
              </span>
              <span className="text-[10px] text-muted-foreground">{chatSessions.length}</span>
            </div>

            {chatSessions.length > 3 && (
              <div className="px-1 mb-2">
                <input
                  type="text"
                  placeholder="Filter chats..."
                  value={chatSearch}
                  onChange={(e) => setChatSearch(e.target.value)}
                  className="w-full px-2.5 py-1 text-xs rounded-md bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div className="space-y-0.5 max-h-48 overflow-y-auto">
              {filteredChats.length === 0 ? (
                <div className="px-2 py-3 text-center text-[11px] text-muted-foreground">
                  No active conversations yet
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                      activeChatId === chat.id && currentView === 'chat'
                        ? 'bg-indigo-500/15 text-indigo-400 font-medium border border-indigo-500/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                    }`}
                  >
                    <button
                      onClick={() => {
                        onSelectChat(chat.id);
                        onSelectView('chat');
                        onCloseMobile();
                      }}
                      className="flex-1 text-left truncate flex items-center gap-2"
                    >
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-70" />
                      <span className="truncate">{chat.title}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 hover:text-destructive transition"
                      title="Delete chat"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Workspace info & active status */}
        <div className="p-3 border-t border-border bg-card/40">
          <div className="p-2.5 rounded-xl bg-secondary/50 border border-border flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-ping" />
            <div className="flex-1 truncate">
              <div className="text-[11px] font-medium text-foreground truncate">{currentProject.name}</div>
              <div className="text-[10px] text-muted-foreground capitalize font-mono">
                {currentProject.type} • {currentProject.files.length} active files
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
