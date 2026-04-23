// Temporary debug store — holds the last raw Gemini response in memory.
// Shared between the server action and the debug API route within the same
// Node.js process instance (warm lambda). Not persisted across cold starts.
let _lastRawGeminiResponse: string | null = null;
let _lastCapturedAt: string | null = null;

export function setLastRawGeminiResponse(raw: string) {
  _lastRawGeminiResponse = raw;
  _lastCapturedAt = new Date().toISOString();
}

export function getLastRawGeminiResponse() {
  return { raw: _lastRawGeminiResponse, capturedAt: _lastCapturedAt };
}
