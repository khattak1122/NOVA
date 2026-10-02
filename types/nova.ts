export type ViewMode =
  | 'chat'
  | 'website-builder'
  | 'app-builder'
  | 'code-studio'
  | 'image-studio'
  | 'video-studio'
  | 'file-analyzer'
  | 'web-search'
  | 'document-ai'
  | 'cv-builder'
  | 'presentation-builder'
  | 'sandbox-terminal'
  | 'admin'
  | 'settings';

export type DevicePreviewMode = 'desktop' | 'tablet' | 'mobile';

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isEntry?: boolean;
  updatedAt: number;
}

export interface ProjectVersion {
  id: string;
  versionNumber: number;
  timestamp: number;
  description: string;
  files: ProjectFile[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  type: 'website' | 'web-app' | 'pwa' | 'react-native' | 'android' | 'fullstack';
  tags: string[];
  createdAt: number;
  updatedAt: number;
  files: ProjectFile[];
  versions: ProjectVersion[];
  settings: {
    framework: string;
    entryFile: string;
    theme: 'dark' | 'light' | 'system';
    dependencies: Record<string, string>;
  };
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: 'image' | 'file' | 'code';
  size?: number;
  url?: string;
  base64?: string;
  content?: string;
  mimeType?: string;
}

export interface ToolCallStep {
  id: string;
  toolName: string;
  args: Record<string, unknown>;
  status: 'running' | 'success' | 'error';
  result?: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  attachments?: MessageAttachment[];
  toolCalls?: ToolCallStep[];
  modelUsed?: string;
  error?: string;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  projectId?: string;
  messages: ChatMessage[];
}

export interface AIModel {
  id: string;
  name: string;
  provider: 'google' | 'openai' | 'anthropic' | 'xai' | 'local';
  modelId: string;
  contextWindow: number;
  capabilities: {
    toolCalling: boolean;
    streaming: boolean;
    vision: boolean;
    imageGeneration?: boolean;
    videoGeneration?: boolean;
    reasoning?: boolean;
  };
  isActive: boolean;
  isDefault: boolean;
  description: string;
}

export interface AIProvider {
  id: string;
  name: string;
  type: 'google' | 'openai' | 'anthropic' | 'xai' | 'local';
  status: 'connected' | 'unconfigured' | 'error';
  baseUrl?: string;
  hasEnvKey: boolean;
  modelsCount: number;
}

export interface CVData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  photoUrl?: string;
  template: 'executive' | 'modern' | 'minimal';
  experiences: Array<{
    id: string;
    role: string;
    company: string;
    period: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    year: string;
  }>;
  skills: string[];
  languages: string[];
  certifications: string[];
}

export interface SlideData {
  id: string;
  title: string;
  subtitle?: string;
  bullets: string[];
  notes?: string;
  layout: 'title' | 'content' | 'split' | 'quote' | 'stats';
  stats?: Array<{ label: string; value: string }>;
}

export interface PresentationData {
  title: string;
  theme: 'neon-dark' | 'corporate-blue' | 'minimal-clean' | 'emerald';
  slides: SlideData[];
}

export interface SandboxExecutionLog {
  id: string;
  timestamp: number;
  type: 'info' | 'warn' | 'error' | 'stdout' | 'stderr';
  message: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'creator';
  avatar?: string;
}

export interface SystemHealthStatus {
  status: 'healthy' | 'degraded' | 'error';
  timestamp: number;
  uptime: number;
  geminiConnected: boolean;
  activeModel: string;
  databaseConnected: boolean;
  memoryUsage: {
    rss: number;
    heapUsed: number;
  };
}
