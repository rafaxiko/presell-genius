import { NextResponse } from 'next/server';
import { getLastRawGeminiResponse } from '@/lib/debug-store';

export async function GET() {
  const { raw, capturedAt } = getLastRawGeminiResponse();

  if (!raw) {
    return NextResponse.json(
      { error: 'No generation captured yet. Generate a page first.' },
      { status: 404 }
    );
  }

  // Try to parse to show structure alongside raw text
  let parsed: unknown = null;
  let parseError: string | null = null;
  try {
    parsed = JSON.parse(raw);
  } catch (e: any) {
    parseError = e.message;
  }

  return NextResponse.json({
    capturedAt,
    rawLength: raw.length,
    raw,
    parsed,
    parseError,
  });
}
