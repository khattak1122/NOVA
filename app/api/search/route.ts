import { NextRequest, NextResponse } from 'next/server';
import { getGeminiServerClient, isGeminiConfigured } from '@/lib/ai/gemini-server';

export async function POST(req: NextRequest) {
  try {
    if (!isGeminiConfigured()) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured. Please set GEMINI_API_KEY.' },
        { status: 503 }
      );
    }

    const { query } = await req.json();
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const ai = getGeminiServerClient();
    const prompt = `Search the live web for the following topic: "${query}".
Provide a concise, factual summary of the key findings, including verifiable facts, dates, technical details or documentation.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || 'No summary could be synthesized for this query.';
    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;

    // Extract genuine web sources from grounding metadata
    interface SourceChunk {
      title?: string;
      uri?: string;
    }
    const chunks = (groundingMetadata?.groundingChunks || []) as Array<{ web?: SourceChunk }>;
    const sources = chunks
      .map((c) => ({
        title: c.web?.title || 'Web Resource',
        url: c.web?.uri || '',
      }))
      .filter((s) => Boolean(s.url));

    // Deduplicate sources by URL
    const uniqueSources: Array<{ title: string; url: string }> = [];
    const seenUrls = new Set<string>();
    for (const src of sources) {
      if (!seenUrls.has(src.url)) {
        seenUrls.add(src.url);
        uniqueSources.push(src);
      }
    }

    return NextResponse.json({
      query,
      summary: text,
      sources: uniqueSources,
      searchQueries: groundingMetadata?.webSearchQueries || [query],
    });
  } catch (error: unknown) {
    console.error('Search API error:', error);
    const message = error instanceof Error ? error.message : 'Search request failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
