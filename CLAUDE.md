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

## Installed Skills

### [marketing-skills](https://github.com/syntax-syndicate/marketing-skills) — 25 skills
CRO, content, and growth marketing skills.
- `ab-test-setup`, `analytics-tracking`, `competitor-alternatives`, `content-strategy`
- `copy-editing`, `copywriting`, `email-sequence`, `form-cro`, `free-tool-strategy`
- `launch-strategy`, `marketing-ideas`, `marketing-psychology`, `onboarding-cro`
- `page-cro`, `paid-ads`, `paywall-upgrade-cro`, `popup-cro`, `pricing-strategy`
- `product-marketing-context`, `programmatic-seo`, `referral-program`, `schema-markup`
- `seo-audit`, `signup-flow-cro`, `social-content`

### [Deep-Research-skills](https://github.com/Weizhena/Deep-Research-skills) — 5 skills
Structured deep research and reporting skills.
- `research`, `research-add-fields`, `research-add-items`, `research-deep`, `research-report`

### [wondelai/skills](https://github.com/wondelai/skills) — 42 skills
Product, design, and engineering frameworks drawn from books and methodologies.
- `37signals-way`, `blue-ocean-strategy`, `clean-architecture`, `clean-code`, `contagious`
- `continuous-discovery`, `cro-methodology`, `crossing-the-chasm`, `ddia-systems`
- `design-everyday-things`, `design-sprint`, `domain-driven-design`, `drive-motivation`
- `high-perf-browser`, `hooked-ux`, `hundred-million-offers`, `improve-retention`
- `influence-psychology`, `inspired-product`, `ios-hig-design`, `jobs-to-be-done`
- `lean-startup`, `lean-ux`, `made-to-stick`, `microinteractions`, `mom-test`
- `negotiation`, `obviously-awesome`, `one-page-marketing`, `pragmatic-programmer`
- `predictable-revenue`, `refactoring-patterns`, `refactoring-ui`, `release-it`
- `scorecard-marketing`, `software-design-philosophy`, `storybrand-messaging`
- `system-design`, `top-design`, `traction-eos`, `ux-heuristics`, `web-typography`
