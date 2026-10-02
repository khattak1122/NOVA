'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightPanel } from '@/components/layout/RightPanel';
import { AgentChat } from '@/components/chat/AgentChat';
import { WebsiteBuilder } from '@/components/website-builder/WebsiteBuilder';
import { AppBuilder } from '@/components/app-builder/AppBuilder';
import { CodeStudio } from '@/components/code-studio/CodeStudio';
import { ImageStudio } from '@/components/image-studio/ImageStudio';
import { VideoStudio } from '@/components/video-studio/VideoStudio';
import { FileAnalyzer } from '@/components/file-analyzer/FileAnalyzer';
import { WebSearchTool } from '@/components/web-search/WebSearchTool';
import { DocumentAI } from '@/components/document-ai/DocumentAI';
import { CVBuilder } from '@/components/cv-builder/CVBuilder';
import { PresentationBuilder } from '@/components/presentation-builder/PresentationBuilder';
import { SandboxTerminal } from '@/components/sandbox/SandboxTerminal';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { SettingsView } from '@/components/settings/SettingsView';
import { NewProjectModal } from '@/components/projects/NewProjectModal';
import { ModelSelectModal } from '@/components/models/ModelSelectModal';

import {
  ViewMode,
  Project,
  ProjectFile,
  DevicePreviewMode,
  ChatSession,
  SandboxExecutionLog,
  UserProfile,
  SystemHealthStatus,
} from '@/types/nova';
import { NovaStorage } from '@/lib/storage/store';
import { STARTER_PROJECTS } from '@/lib/templates/initial-projects';
import { ModelRegistryService } from '@/lib/ai/providers';

export default function NovaWorkspacePage() {
  // Theme state
  const [theme, setTheme] = React.useState<'dark' | 'light'>(() => NovaStorage.getTheme());

  // View state
  const [currentView, setCurrentView] = React.useState<ViewMode>('chat');

  // Projects state
  const [projects, setProjects] = React.useState<Project[]>(() => NovaStorage.getProjects());
  const [currentProjectId, setCurrentProjectId] = React.useState<string>(() => NovaStorage.getActiveProjectId());

  // Active project
  const currentProject = React.useMemo(() => {
    return projects.find((p) => p.id === currentProjectId) || projects[0] || STARTER_PROJECTS[0];
  }, [projects, currentProjectId]);

  // Selected file in active project
  const [selectedFile, setSelectedFile] = React.useState<ProjectFile | null>(() => {
    return currentProject.files[0] || null;
  });

  // Chat sessions state
  const [chatSessions, setChatSessions] = React.useState<ChatSession[]>(() => {
    const existing = NovaStorage.getChatSessions();
    if (existing.length > 0) return existing;
    const initialSession: ChatSession = {
      id: `chat-${Date.now()}`,
      title: 'Workspace Initial Session',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };
    return [initialSession];
  });
  const [activeChatId, setActiveChatId] = React.useState<string>(() => chatSessions[0]?.id || `chat-1`);

  const activeChat = React.useMemo(() => {
    return chatSessions.find((c) => c.id === activeChatId) || chatSessions[0];
  }, [chatSessions, activeChatId]);

  // UI state
  const [rightPanelOpen, setRightPanelOpen] = React.useState(true);
  const [deviceMode, setDeviceMode] = React.useState<DevicePreviewMode>('desktop');
  const [sidebarMobileOpen, setSidebarMobileOpen] = React.useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = React.useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = React.useState(false);

  // Active Model
  const modelRegistry = ModelRegistryService.getInstance();
  const [activeModel, setActiveModel] = React.useState<string>(modelRegistry.getActiveModel().id);

  // User Profile
  const [userProfile, setUserProfile] = React.useState<UserProfile>(() => NovaStorage.getUserProfile());

  // Terminal & Sandbox execution logs
  const [terminalLogs, setTerminalLogs] = React.useState<SandboxExecutionLog[]>([]);

  // Health status
  const [healthStatus, setHealthStatus] = React.useState<SystemHealthStatus | null>(null);

  // Sync theme to document element
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync theme changes
  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    NovaStorage.setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Listen for iframe sandbox postMessage logs
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.source === 'nova-sandbox') {
        const newLog: SandboxExecutionLog = {
          id: `log-${Date.now()}-${Math.random()}`,
          timestamp: event.data.timestamp || Date.now(),
          type: event.data.type || 'stdout',
          message: event.data.message || '',
        };
        setTerminalLogs((prev) => [...prev.slice(-100), newLog]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Fetch health check
  const fetchHealth = () => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setHealthStatus(data))
      .catch(() => {});
  };

  React.useEffect(() => {
    fetchHealth();
  }, []);

  // Project update handler
  const handleUpdateProject = (updated: Project) => {
    setProjects((prev) => {
      const next = prev.map((p) => (p.id === updated.id ? updated : p));
      NovaStorage.saveProjects(next);
      return next;
    });
  };

  const handleSelectProject = (id: string) => {
    setCurrentProjectId(id);
    NovaStorage.setActiveProjectId(id);
    const target = projects.find((p) => p.id === id);
    if (target && target.files.length > 0) {
      setSelectedFile(target.files[0]);
    }
  };

  const handleCreateNewProject = (newProj: Project) => {
    const next = [newProj, ...projects];
    setProjects(next);
    setCurrentProjectId(newProj.id);
    NovaStorage.saveProjects(next);
    NovaStorage.setActiveProjectId(newProj.id);
    setSelectedFile(newProj.files[0]);
  };

  // File mutations
  const handleAddFile = (path: string, content: string, language: string) => {
    const newFile: ProjectFile = {
      id: `file-${Date.now()}-${Math.random()}`,
      name: path.split('/').pop() || path,
      path,
      content,
      language,
      updatedAt: Date.now(),
    };

    const updatedProject = {
      ...currentProject,
      files: [...currentProject.files, newFile],
      updatedAt: Date.now(),
    };

    handleUpdateProject(updatedProject);
    setSelectedFile(newFile);
  };

  const handleDeleteFile = (fileId: string) => {
    const updatedProject = {
      ...currentProject,
      files: currentProject.files.filter((f) => f.id !== fileId),
      updatedAt: Date.now(),
    };
    handleUpdateProject(updatedProject);
    if (selectedFile?.id === fileId) {
      setSelectedFile(updatedProject.files[0] || null);
    }
  };

  const handleUpdateFile = (file: ProjectFile) => {
    const updatedProject = {
      ...currentProject,
      files: currentProject.files.map((f) => (f.id === file.id ? file : f)),
      updatedAt: Date.now(),
    };
    handleUpdateProject(updatedProject);
    setSelectedFile(file);
  };

  // Rollback version
  const handleRollback = (versionId: string) => {
    const success = NovaStorage.rollbackToVersion(currentProject.id, versionId);
    if (success) {
      setProjects(NovaStorage.getProjects());
      setSelectedFile(currentProject.files[0] || null);
    }
  };

  // Chat session management
  const handleUpdateChatSession = (updated: ChatSession) => {
    setChatSessions((prev) => {
      const next = prev.map((c) => (c.id === updated.id ? updated : c));
      NovaStorage.saveChatSessions(next);
      return next;
    });
  };

  const handleNewChat = () => {
    const newChat: ChatSession = {
      id: `chat-${Date.now()}`,
      title: 'New Agent Session',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };
    const next = [newChat, ...chatSessions];
    setChatSessions(next);
    setActiveChatId(newChat.id);
    NovaStorage.saveChatSessions(next);
    setCurrentView('chat');
  };

  const handleDeleteChat = (id: string) => {
    const next = chatSessions.filter((c) => c.id !== id);
    if (next.length === 0) {
      const fresh: ChatSession = {
        id: `chat-${Date.now()}`,
        title: 'New Agent Session',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [],
      };
      setChatSessions([fresh]);
      setActiveChatId(fresh.id);
      NovaStorage.saveChatSessions([fresh]);
    } else {
      setChatSessions(next);
      if (activeChatId === id) {
        setActiveChatId(next[0].id);
      }
      NovaStorage.saveChatSessions(next);
    }
  };

  // Ask AI handler
  const handleAskAiToFixError = (errorText: string) => {
    setCurrentView('chat');
    // Prepend instructions to fix error
  };

  const handleScaffoldArchitecture = (
    type: 'pwa' | 'react-native' | 'android' | 'fullstack',
    name: string,
    description: string
  ) => {
    const targetProject = STARTER_PROJECTS.find((p) => p.type === type) || {
      id: `proj-${Date.now()}`,
      name,
      description,
      type,
      tags: [type.toUpperCase(), 'NOVA', 'TypeScript'],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      settings: {
        framework: type === 'android' ? 'android-kotlin' : 'react',
        entryFile: type === 'android' ? 'app/src/main/java/com/nova/aura/MainActivity.kt' : 'index.html',
        theme: 'dark' as const,
        dependencies: {},
      },
      versions: [],
      files: currentProject.files,
    };

    handleCreateNewProject(targetProject);
    setCurrentView('code-studio');
  };

  const handleResetStarterProjects = () => {
    NovaStorage.saveProjects(STARTER_PROJECTS);
    setProjects(STARTER_PROJECTS);
    setCurrentProjectId(STARTER_PROJECTS[0].id);
    setSelectedFile(STARTER_PROJECTS[0].files[0]);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground antialiased font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        chatSessions={chatSessions}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        currentProject={currentProject}
        isOpenMobile={sidebarMobileOpen}
        onCloseMobile={() => setSidebarMobileOpen(false)}
      />

      {/* Main Center + Right Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          currentProject={currentProject}
          allProjects={projects}
          onSelectProject={handleSelectProject}
          onNewProjectModal={() => setIsNewProjectModalOpen(true)}
          activeModel={activeModel}
          onOpenModelSelect={() => setIsModelModalOpen(true)}
          deviceMode={deviceMode}
          onChangeDeviceMode={setDeviceMode}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onRunSandbox={() => {
            setRightPanelOpen(true);
            setTerminalLogs((prev) => [
              ...prev,
              {
                id: `log-${Date.now()}`,
                timestamp: Date.now(),
                type: 'info',
                message: `Initializing preview build for "${currentProject.name}"...`,
              },
            ]);
          }}
          rightPanelOpen={rightPanelOpen}
          onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
        />

        {/* View Content & Right Panel Split */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Selected View */}
          <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-background">
            {currentView === 'chat' && (
              <AgentChat
                currentProject={currentProject}
                onProjectUpdated={handleUpdateProject}
                chatSession={activeChat}
                onUpdateChatSession={handleUpdateChatSession}
                activeModel={activeModel}
                onSwitchView={setCurrentView}
                onTriggerPreview={() => setRightPanelOpen(true)}
              />
            )}

            {currentView === 'website-builder' && (
              <WebsiteBuilder
                project={currentProject}
                onUpdateProject={handleUpdateProject}
                activeModel={activeModel}
                onAskAi={(prompt) => {
                  setCurrentView('chat');
                }}
              />
            )}

            {currentView === 'app-builder' && (
              <AppBuilder
                currentProject={currentProject}
                onScaffoldArchitecture={handleScaffoldArchitecture}
                onAskAi={() => setCurrentView('chat')}
              />
            )}

            {currentView === 'code-studio' && (
              <CodeStudio
                project={currentProject}
                onUpdateProject={handleUpdateProject}
                onAskAi={() => setCurrentView('chat')}
              />
            )}

            {currentView === 'image-studio' && <ImageStudio />}

            {currentView === 'video-studio' && <VideoStudio />}

            {currentView === 'file-analyzer' && <FileAnalyzer />}

            {currentView === 'web-search' && <WebSearchTool />}

            {currentView === 'document-ai' && <DocumentAI />}

            {currentView === 'cv-builder' && <CVBuilder />}

            {currentView === 'presentation-builder' && <PresentationBuilder />}

            {currentView === 'sandbox-terminal' && (
              <SandboxTerminal onAskAiToFix={handleAskAiToFixError} />
            )}

            {currentView === 'admin' && (
              <AdminDashboard onRefreshHealth={fetchHealth} health={healthStatus} />
            )}

            {currentView === 'settings' && (
              <SettingsView
                user={userProfile}
                onUpdateUser={setUserProfile}
                onResetProjects={handleResetStarterProjects}
              />
            )}
          </main>

          {/* Right Inspector & Live Preview Panel */}
          {rightPanelOpen && (
            <RightPanel
              project={currentProject}
              onUpdateFile={handleUpdateFile}
              onAddFile={handleAddFile}
              onDeleteFile={handleDeleteFile}
              selectedFile={selectedFile}
              onSelectFile={setSelectedFile}
              deviceMode={deviceMode}
              onChangeDeviceMode={setDeviceMode}
              terminalLogs={terminalLogs}
              onClearTerminal={() => setTerminalLogs([])}
              onAskAiToFixError={handleAskAiToFixError}
              onRollback={handleRollback}
              isOpen={rightPanelOpen}
              onClose={() => setRightPanelOpen(false)}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onCreateProject={handleCreateNewProject}
      />

      <ModelSelectModal
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        activeModelId={activeModel}
        onSelectModel={(id) => {
          setActiveModel(id);
          modelRegistry.setActiveModel(id);
        }}
      />
    </div>
  );
}
