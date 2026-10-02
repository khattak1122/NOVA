export interface ToolDeclaration {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
    }>;
    required?: string[];
  };
}

export const NOVA_AGENT_TOOLS: ToolDeclaration[] = [
  {
    name: 'webSearch',
    description: 'Searches the live web for up-to-date documentation, APIs, UI patterns, or real-world information.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query to execute on the web.',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'fileRead',
    description: 'Reads the complete contents of an existing file in the project workspace by path.',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'The exact path of the file to read (e.g., "index.html", "styles.css", "app.js").',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'fileWrite',
    description: 'Creates a new file or completely overwrites an existing file in the project workspace.',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'The path of the file (e.g., "login.html", "components/Header.jsx").',
        },
        content: {
          type: 'string',
          description: 'The complete source code or text content to write into the file.',
        },
        language: {
          type: 'string',
          description: 'Programming language or format (e.g. "html", "css", "javascript", "typescript", "json").',
        },
      },
      required: ['path', 'content'],
    },
  },
  {
    name: 'fileEdit',
    description: 'Modifies an existing project file by replacing a specific target text with replacement text, preserving the rest.',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'The file path to edit.',
        },
        targetText: {
          type: 'string',
          description: 'The exact text block to find and replace.',
        },
        replacementText: {
          type: 'string',
          description: 'The new text that will replace the target block.',
        },
      },
      required: ['path', 'targetText', 'replacementText'],
    },
  },
  {
    name: 'fileSearch',
    description: 'Searches across all files in the current project for matching text, imports, or variable names.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The string or symbol to search for.',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'codeExecute',
    description: 'Executes JavaScript/TypeScript or Python code in the sandbox environment and returns stdout, stderr, and status.',
    parameters: {
      type: 'object',
      properties: {
        language: {
          type: 'string',
          enum: ['javascript', 'typescript', 'python', 'html'],
          description: 'The execution language.',
        },
        code: {
          type: 'string',
          description: 'The snippet or script to execute in the secure sandbox.',
        },
      },
      required: ['language', 'code'],
    },
  },
  {
    name: 'projectCreate',
    description: 'Scaffolds a new project with structured files (e.g. restaurant website, SaaS dashboard, Android task app).',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the project.',
        },
        type: {
          type: 'string',
          enum: ['website', 'web-app', 'pwa', 'react-native', 'android', 'fullstack'],
          description: 'Project archetype.',
        },
        description: {
          type: 'string',
          description: 'High-level architectural summary of the project.',
        },
      },
      required: ['name', 'type', 'description'],
    },
  },
  {
    name: 'projectPreview',
    description: 'Triggers a live multi-device preview refresh in the sandbox frame (desktop, tablet, or mobile).',
    parameters: {
      type: 'object',
      properties: {
        deviceMode: {
          type: 'string',
          enum: ['desktop', 'tablet', 'mobile'],
          description: 'Target preview viewport.',
        },
      },
    },
  },
  {
    name: 'projectExport',
    description: 'Prepares the entire project workspace into a production-ready downloadable ZIP archive.',
    parameters: {
      type: 'object',
      properties: {
        format: {
          type: 'string',
          enum: ['zip', 'json'],
          description: 'Export format.',
        },
      },
      required: ['format'],
    },
  },
  {
    name: 'imageGenerate',
    description: 'Generates a visual asset or hero mockup using Gemini image generation model.',
    parameters: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'Visual description of the image to generate.',
        },
        aspectRatio: {
          type: 'string',
          enum: ['1:1', '16:9', '9:16', '4:3', '3:4'],
          description: 'Aspect ratio.',
        },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'videoGenerate',
    description: 'Generates a video concept using Veo / video generation provider.',
    parameters: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'Prompt describing the video sequence.',
        },
        duration: {
          type: 'string',
          description: 'Duration in seconds (e.g., "5s", "10s").',
        },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'documentGenerate',
    description: 'Generates structured documentation, CV, business plan, presentation, or technical design doc.',
    parameters: {
      type: 'object',
      properties: {
        docType: {
          type: 'string',
          enum: ['cv', 'presentation', 'business-plan', 'spec', 'report'],
          description: 'Type of document to generate.',
        },
        topic: {
          type: 'string',
          description: 'Core topic or user brief.',
        },
      },
      required: ['docType', 'topic'],
    },
  },
];
