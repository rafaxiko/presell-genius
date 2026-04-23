'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export interface DebugReport {
  missing_sections: string[];
  empty_fields: Array<{ field: string; section: string }>;
  placeholder_text: Array<{ field: string; value: string }>;
  hallucinated_content: Array<{ field: string; issue: string }>;
  data_mismatches: Array<{ field: string; input_value: string; rendered_value: string }>;
  overall_score: number; // 0-100
  summary: string;
  raw_analysis: string;
}

// Known placeholder patterns to detect without Gemini
const PLACEHOLDER_PATTERNS = [
  /natural ingredient \d+/i,
  /REQUIRED[\s:]/i,
  /supports overall health/i,
  /verified customer/i,
  /great results/i,
  /\[.*\]/,       // [placeholder]
  /lorem ipsum/i,
];

function scanHTMLForPlaceholders(html: string): Array<{ pattern: string; count: number }> {
  return PLACEHOLDER_PATTERNS
    .map(p => ({ pattern: p.source, count: (html.match(new RegExp(p.source, 'gi')) || []).length }))
    .filter(r => r.count > 0);
}

const debugPrompt = ai.definePrompt({
  name: 'debugGenerationPrompt',
  model: 'googleai/gemini-2.5-flash',
  input: {
    schema: z.object({
      htmlSnippet: z.string(),
      inputData: z.string(),
    }),
  },
  output: { format: 'text' },
  config: { maxOutputTokens: 4096, temperature: 0.1 },
  prompt: `You are a quality assurance agent for presell landing pages.

Compare the rendered HTML with the original input data and return a JSON report.

=== ORIGINAL INPUT DATA ===
{{{inputData}}}

=== RENDERED HTML (text-only excerpt, max 6000 chars) ===
{{{htmlSnippet}}}

Analyze the above and return ONLY valid JSON (no markdown, no backticks):
{
  "missing_sections": ["list of sections entirely absent from HTML, e.g. 'ingredients', 'bonuses', 'faq'"],
  "empty_fields": [{"field": "field_name", "section": "section_name"}],
  "placeholder_text": [{"field": "field_name", "value": "the placeholder text found"}],
  "hallucinated_content": [{"field": "field_name", "issue": "description of hallucination"}],
  "data_mismatches": [{"field": "field_name", "input_value": "what was in input", "rendered_value": "what appeared in HTML"}],
  "overall_score": 85,
  "summary": "one paragraph summary of quality issues found"
}

Rules:
- "Natural Ingredient N" is ALWAYS a placeholder — flag it.
- Empty strings, "Verified Customer", "Great Results" are placeholders.
- Score 100 = perfect fidelity; deduct 10 per missing section, 5 per placeholder, 3 per empty field.
- Only report real issues found, not hypothetical ones.`,
});

export async function debugGeneration(
  html: string,
  inputData: Record<string, unknown>
): Promise<DebugReport> {
  const emptyReport: DebugReport = {
    missing_sections: [],
    empty_fields: [],
    placeholder_text: [],
    hallucinated_content: [],
    data_mismatches: [],
    overall_score: 0,
    summary: 'Analysis failed.',
    raw_analysis: '',
  };

  try {
    // Strip scripts/styles, keep visible text
    const htmlText = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s{3,}/g, '\n')
      .trim()
      .slice(0, 6000);

    // Fast local scan first
    const localPlaceholders = scanHTMLForPlaceholders(html);

    const { text } = await debugPrompt({
      htmlSnippet: htmlText,
      inputData: JSON.stringify(inputData, null, 2).slice(0, 4000),
    });

    if (!text) return emptyReport;

    let report: DebugReport;
    try {
      const raw = text.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
      const s = raw.indexOf('{'), e = raw.lastIndexOf('}');
      report = JSON.parse(raw.slice(s, e + 1));
    } catch {
      return { ...emptyReport, raw_analysis: text };
    }

    // Merge local placeholder scan into Gemini report
    for (const p of localPlaceholders) {
      report.placeholder_text.push({ field: 'html-scan', value: `pattern "${p.pattern}" found ${p.count}x` });
    }

    report.raw_analysis = text;
    return report;

  } catch (err: any) {
    console.error('[DebugGeneration] Error:', err.message);
    return { ...emptyReport, summary: err.message };
  }
}
