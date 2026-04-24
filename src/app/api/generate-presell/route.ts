import { NextRequest, NextResponse } from 'next/server';
import { generatePresellContent } from '@/ai/flows/generate-presell-content';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = await generatePresellContent(body);
    return NextResponse.json({ ok: true, parsed });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
