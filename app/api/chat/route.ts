import { NextRequest, NextResponse } from 'next/server';
import { getGeminiServerClient, isGeminiConfigured } from '@/lib/ai/gemini-server';

export async function POST(req: NextRequest) {
  try {
    if (!isGeminiConfigured()) {
      return NextResponse.json(
        { error: 'Gemini API is not configured. Please set GEMINI_API_KEY.' },
        { status: 503 }
      );
    }

    const { message, history = [], systemInstruction, model = 'gemini-3.8-flash' } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
    }

    const ai = getGeminiServerClient();

    const formattedContents = [
      ...history.map((h: { role: string; content: string }) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      })),
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    const response = await ai.models.generateContent({
      model: model === 'gemini-3.1-pro-preview' ? 'gemini-3.1-pro-preview' : 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction:
          systemInstruction ||
          'You are NOVA AI, an elite software engineering and multiformat AI workspace. You provide direct, high-value, production-grade answers, code snippets, and architectural breakdowns. Format responses cleanly with Markdown and code blocks.',
      },
    });

    return NextResponse.json({
      text: response.text || '',
      modelUsed: model,
      timestamp: Date.now(),
    });
  } catch (error: unknown) {
    console.error('Chat API Error:', error);
    const message = error instanceof Error ? error.message : 'Chat request failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
