import { AIModel, AIProvider } from '@/types/nova';

export const DEFAULT_PROVIDERS: AIProvider[] = [
  {
    id: 'google',
    name: 'Google Gemini',
    type: 'google',
    status: 'connected',
    hasEnvKey: true,
    modelsCount: 4,
  },
  {
    id: 'openai',
    name: 'OpenAI GPT Architecture',
    type: 'openai',
    status: 'unconfigured',
    hasEnvKey: false,
    baseUrl: 'https://api.openai.com/v1',
    modelsCount: 3,
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude Engine',
    type: 'anthropic',
    status: 'unconfigured',
    hasEnvKey: false,
    baseUrl: 'https://api.anthropic.com/v1',
    modelsCount: 2,
  },
  {
    id: 'xai',
    name: 'xAI Grok Adapter',
    type: 'xai',
    status: 'unconfigured',
    hasEnvKey: false,
    baseUrl: 'https://api.x.ai/v1',
    modelsCount: 2,
  },
  {
    id: 'local',
    name: 'Local Ollama / vLLM',
    type: 'local',
    status: 'unconfigured',
    baseUrl: 'http://localhost:11434',
    hasEnvKey: true,
    modelsCount: 1,
  },
];

export const DEFAULT_MODELS: AIModel[] = [
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash (Core Agent)',
    provider: 'google',
    modelId: 'gemini-3.8-flash',
    contextWindow: 1048576,
    capabilities: {
      toolCalling: true,
      streaming: true,
      vision: true,
      reasoning: true,
    },
    isActive: true,
    isDefault: true,
    description: 'High-speed multimodal agent model with native tool execution and code synthesis.',
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro (Deep Architect)',
    provider: 'google',
    modelId: 'gemini-3.1-pro-preview',
    contextWindow: 2097152,
    capabilities: {
      toolCalling: true,
      streaming: true,
      vision: true,
      reasoning: true,
    },
    isActive: true,
    isDefault: false,
    description: 'Advanced reasoning engine for complex fullstack architectures and refactoring.',
  },
  {
    id: 'gemini-3.1-flash-lite-image',
    name: 'Gemini Flash Image Generator',
    provider: 'google',
    modelId: 'gemini-3.1-flash-lite-image',
    contextWindow: 32768,
    capabilities: {
      toolCalling: false,
      streaming: false,
      vision: true,
      imageGeneration: true,
    },
    isActive: true,
    isDefault: false,
    description: 'High-fidelity AI asset generation for website heroes, UI mockups, and artwork.',
  },
  {
    id: 'veo-3.1-lite-generate-preview',
    name: 'Veo 3.1 Lite Video Engine',
    provider: 'google',
    modelId: 'veo-3.1-lite-generate-preview',
    contextWindow: 32768,
    capabilities: {
      toolCalling: false,
      streaming: false,
      vision: false,
      videoGeneration: true,
    },
    isActive: true,
    isDefault: false,
    description: 'Generative video engine for cinematic motion assets and UI concept reels.',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o Omnimodal (External)',
    provider: 'openai',
    modelId: 'gpt-4o',
    contextWindow: 128000,
    capabilities: {
      toolCalling: true,
      streaming: true,
      vision: true,
    },
    isActive: false,
    isDefault: false,
    description: 'OpenAI multi-modal flagship model (configured via OpenAI API key).',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet (External)',
    provider: 'anthropic',
    modelId: 'claude-3-5-sonnet-20241022',
    contextWindow: 200000,
    capabilities: {
      toolCalling: true,
      streaming: true,
      vision: true,
    },
    isActive: false,
    isDefault: false,
    description: 'Anthropic coding and analysis model (configured via Anthropic API key).',
  },
];

export class ModelRegistryService {
  private static instance: ModelRegistryService;
  private models: AIModel[] = [...DEFAULT_MODELS];
  private providers: AIProvider[] = [...DEFAULT_PROVIDERS];
  private activeModelId: string = 'gemini-3.8-flash';
  private fallbackChain: string[] = ['gemini-3.8-flash', 'gemini-3.1-pro-preview'];

  public static getInstance(): ModelRegistryService {
    if (!ModelRegistryService.instance) {
      ModelRegistryService.instance = new ModelRegistryService();
    }
    return ModelRegistryService.instance;
  }

  public getModels(): AIModel[] {
    return this.models;
  }

  public getProviders(): AIProvider[] {
    return this.providers;
  }

  public getActiveModel(): AIModel {
    return this.models.find((m) => m.id === this.activeModelId) || this.models[0];
  }

  public setActiveModel(id: string): boolean {
    const target = this.models.find((m) => m.id === id);
    if (!target) return false;
    this.models = this.models.map((m) => ({
      ...m,
      isDefault: m.id === id,
    }));
    this.activeModelId = id;
    return true;
  }

  public getFallbackChain(): string[] {
    return this.fallbackChain;
  }

  public registerModel(model: AIModel): void {
    const index = this.models.findIndex((m) => m.id === model.id);
    if (index >= 0) {
      this.models[index] = model;
    } else {
      this.models.push(model);
    }
  }

  public updateProviderStatus(providerId: string, status: 'connected' | 'unconfigured' | 'error', hasEnvKey: boolean): void {
    const p = this.providers.find((prov) => prov.id === providerId);
    if (p) {
      p.status = status;
      p.hasEnvKey = hasEnvKey;
    }
  }
}
