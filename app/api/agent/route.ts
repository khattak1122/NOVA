import { NextRequest, NextResponse } from 'next/server';
import { getGeminiServerClient, isGeminiConfigured } from '@/lib/ai/gemini-server';
import { Project, ProjectFile } from '@/types/nova';

interface AgentRequestBody {
  prompt: string;
  project: Project;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  attachments?: Array<{ name: string; type: string; content?: string; base64?: string }>;
  model?: string;
  selectedTool?: string;
}

export async function POST(req: NextRequest) {
  try {
    if (!isGeminiConfigured()) {
      return NextResponse.json(
        { error: 'Gemini API is not configured. Please set GEMINI_API_KEY.' },
        { status: 503 }
      );
    }

    const body: AgentRequestBody = await req.json();
    const { prompt, project, history = [], attachments = [], model = 'gemini-3.8-flash' } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'User prompt is required' }, { status: 400 });
    }

    const ai = getGeminiServerClient();

    // Summarize existing project files for agent context
    const fileSummaries = project.files
      .map((f) => `Path: "${f.path}" (${f.language}, ${f.content.length} chars)\nSnippet:\n${f.content.slice(0, 1500)}`)
      .join('\n\n---\n\n');

    const systemInstruction = `You are NOVA AI, the autonomous Lead Software Engineer & AI Workspace Agent.
You operate strictly within the context of the user's CURRENT PROJECT:
- Project Name: "${project.name}"
- Type: ${project.type}
- Framework: ${project.settings.framework}
- Entry File: ${project.settings.entryFile}

CORE OPERATIONAL PRINCIPLES:
1. WORKSPACE PERSISTENCE:
   - When the user asks to modify the project (e.g. "Add a login page", "Make it mobile responsive", "Add dark mode toggle", "Add an Android version", "Fix error"), you MUST inspect the existing files and make direct, consistent modifications or add the necessary new files to the existing project.
   - Do NOT build an unrelated project from scratch unless the user explicitly requests "Create a brand new project".
2. ACCURACY & COMPLETENESS:
   - Always output clean, complete, working production code without placeholders like "... rest of code here ...".
3. OUTPUT FORMAT:
   You must ALWAYS reply with a valid JSON object matching this exact structure:
{
  "thought": "Your step-by-step technical analysis of existing files and planned changes.",
  "toolCalls": [
    {
      "toolName": "fileWrite" | "fileEdit" | "fileRead" | "webSearch" | "codeExecute" | "projectCreate",
      "args": { "path": "filename", "description": "why" },
      "status": "success",
      "result": "summary of action"
    }
  ],
  "fileModifications": [
    {
      "action": "create" | "modify" | "delete",
      "path": "exact/relative/path.ext",
      "language": "html" | "css" | "javascript" | "typescript" | "kotlin" | "json",
      "content": "Full complete updated or created source code.",
      "explanation": "What was modified in this file."
    }
  ],
  "response": "Clear, professional markdown explanation for the user detailing the changes made, files modified, and guidance on how to test in Live Preview or export."
}`;

    let attachmentsContext = '';
    if (attachments.length > 0) {
      attachmentsContext = `\n\nATTACHED FILES & ASSETS:\n` +
        attachments.map((a) => `[File: ${a.name} (${a.type})]\n${a.content ? a.content.slice(0, 2000) : '(Binary/Image)'}`).join('\n\n');
    }

    const conversationContext = history.slice(-6).map((h) => `${h.role.toUpperCase()}: ${h.content}`).join('\n\n');

    const fullPrompt = `EXISTING PROJECT FILES IN WORKSPACE:
${fileSummaries || '(No files in project yet)'}
${attachmentsContext}

RECENT CONVERSATION HISTORY:
${conversationContext || '(New conversation)'}

USER INSTRUCTION:
${prompt}

Respond ONLY with the JSON object defined in your system prompt. Ensure valid JSON.`;

    const chosenModel = model === 'gemini-3.1-pro-preview' ? 'gemini-3.1-pro-preview' : 'gemini-3.8-flash';

    const response = await ai.models.generateContent({
      model: chosenModel,
      contents: fullPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      // Fallback extraction if JSON wrapped in markdown code fence
      const match = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) {
        parsedData = JSON.parse(match[1]);
      } else {
        throw new Error('Agent failed to generate structured JSON response.');
      }
    }

    return NextResponse.json({
      success: true,
      thought: parsedData.thought || 'Analyzed project structure.',
      toolCalls: parsedData.toolCalls || [],
      fileModifications: parsedData.fileModifications || [],
      response: parsedData.response || 'Changes applied to workspace.',
      modelUsed: chosenModel,
      timestamp: Date.now(),
    });
  } catch (error: unknown) {
    console.error('Agent API Error:', error);
    const message = error instanceof Error ? error.message : 'Agent execution failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
