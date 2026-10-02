import { NextResponse } from 'next/server';
import { isGeminiConfigured } from '@/lib/ai/gemini-server';

export async function GET() {
  const geminiReady = isGeminiConfigured();
  const memory = process.memoryUsage ? process.memoryUsage() : { rss: 0, heapUsed: 0 };

  return NextResponse.json({
    status: geminiReady ? 'healthy' : 'degraded',
    service: 'NOVA AI Studio Core Engine',
    version: '2.5.0-production',
    timestamp: Date.now(),
    uptime: process.uptime ? Math.round(process.uptime()) : 0,
    providers: {
      googleGemini: {
        configured: geminiReady,
        primaryModel: 'gemini-3.8-flash',
        codingModel: 'gemini-3.1-pro-preview',
        imageModel: 'gemini-3.1-flash-lite-image',
        videoModel: 'veo-3.1-lite-generate-preview',
      },
      openai: {
        configured: Boolean(process.env.OPENAI_API_KEY),
      },
      anthropic: {
        configured: Boolean(process.env.ANTHROPIC_API_KEY),
      },
    },
    memory: {
      rssMb: Math.round((memory.rss || 0) / 1024 / 1024),
      heapUsedMb: Math.round((memory.heapUsed || 0) / 1024 / 1024),
    },
  });
}
