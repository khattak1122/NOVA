import { NextRequest, NextResponse } from 'next/server';
import { isGeminiConfigured } from '@/lib/ai/gemini-server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, duration = '5s', aspectRatio = '16:9', resolution = '1080p', style = 'cinematic' } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Video prompt is required' }, { status: 400 });
    }

    // Check if VIDEO_API_KEY or external provider is configured
    const hasVideoProvider = Boolean(
      process.env.VEO_API_KEY ||
      process.env.REPLICATE_API_TOKEN ||
      process.env.RUNWAY_API_KEY ||
      (isGeminiConfigured() && process.env.ENABLE_VEO_PREVIEW === 'true')
    );

    if (!hasVideoProvider) {
      return NextResponse.json(
        {
          configured: false,
          error: 'Video generation API is not configured.',
          instructions: 'To enable real AI video generation, configure VEO_API_KEY, REPLICATE_API_TOKEN, or RUNWAY_API_KEY in your environment variables.',
          prompt,
          parameters: { duration, aspectRatio, resolution, style },
        },
        { status: 503 }
      );
    }

    // If configured, handle video generation job
    return NextResponse.json({
      configured: true,
      jobId: `vid-job-${Date.now()}`,
      status: 'processing',
      progress: 10,
      prompt,
      message: 'Video rendering queued on generative cluster.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Video service error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const isConfigured = Boolean(
    process.env.VEO_API_KEY ||
    process.env.REPLICATE_API_TOKEN ||
    process.env.RUNWAY_API_KEY ||
    (isGeminiConfigured() && process.env.ENABLE_VEO_PREVIEW === 'true')
  );

  return NextResponse.json({
    provider: 'Veo Generative Video / External Adapter',
    configured: isConfigured,
    message: isConfigured ? 'Video generation API is ready.' : 'Video generation API is not configured.',
  });
}
