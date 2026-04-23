import { NextRequest, NextResponse } from 'next/server';
import { debugGeneration } from '@/ai/flows/debug-generation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { html, inputData } = body;

    if (!html || typeof html !== 'string') {
      return NextResponse.json({ error: 'Missing "html" field (string)' }, { status: 400 });
    }
    if (!inputData || typeof inputData !== 'object') {
      return NextResponse.json({ error: 'Missing "inputData" field (object)' }, { status: 400 });
    }

    const report = await debugGeneration(html, inputData);
    return NextResponse.json(report);

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
