# Presell Genius — Project Context

## Stack
Next.js, Gemini via Genkit, Vercel, TypeScript, Cheerio

## Key Files
- src/ai/flows/generate-presell-content.ts — main generation flow
- src/lib/robusta-white-template.ts — Robusta White HTML template
- src/ai/flows/research-product.ts — Research Agent (scraping)
- src/ai/flows/debug-generation.ts — Debug Agent
- src/app/page.tsx — main UI

## Templates Status
- review-template.ts ✅ working
- robusta-white-template.ts 🔧 issues: FAQ duplicated, footer price missing, ingredients sometimes show as placeholders

## Known Issues
- Gemini returns bonuses.items as object {} instead of array []
- FAQ last 3 entries show "Have more questions?" instead of real text
- Footer CTA shows "/bottle" with no price amount
- $ in prices breaks .replace() — must use replacer function

## Rules
- Never call Gemini without checking cache first
- Always use Array.isArray() before .map() or .filter()
- Use replacer functions for .replace() when value contains $
- Log full Gemini JSON response in chunks before template rendering
