import { writeFileSync, readFileSync, existsSync } from 'fs';

// /tmp persists within a single warm Vercel lambda instance.
// Calling GET /api/debug-last-generation on the same warm instance
// that handled the generation will return the raw response.
const TMP_PATH = '/tmp/last-gemini-response.json';

export function setLastRawGeminiResponse(raw: string) {
  try {
    writeFileSync(TMP_PATH, JSON.stringify({ raw, capturedAt: new Date().toISOString() }));
  } catch (e) {
    console.error('[debug-store] Failed to write to /tmp:', e);
  }
}

export function getLastRawGeminiResponse(): { raw: string | null; capturedAt: string | null } {
  try {
    if (existsSync(TMP_PATH)) {
      const data = JSON.parse(readFileSync(TMP_PATH, 'utf8'));
      return { raw: data.raw ?? null, capturedAt: data.capturedAt ?? null };
    }
  } catch (e) {
    console.error('[debug-store] Failed to read from /tmp:', e);
  }
  return { raw: null, capturedAt: null };
}
