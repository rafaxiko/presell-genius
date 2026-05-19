# Presell Genius — Full Project Context

## Stack

- **Framework:** Next.js (App Router)
- **AI:** Google Gemini via Genkit
- **Hosting:** Vercel / Firebase App Hosting (`apphosting.yaml`)
- **Language:** TypeScript
- **Scraping:** Cheerio
- **Styling:** Tailwind CSS + shadcn/ui (`components.json`)

---

## Key Files

| File | Purpose |
|---|---|
| `src/ai/flows/generate-presell-content.ts` | Main generation flow (Gemini orchestration) |
| `src/lib/robusta-white-template.ts` | Robusta White HTML template |
| `src/lib/review-template.ts` | Review-style HTML template |
| `src/ai/flows/research-product.ts` | Research Agent (web scraping via Cheerio) |
| `src/ai/flows/debug-generation.ts` | Debug Agent (logs full Gemini JSON response) |
| `src/app/page.tsx` | Main UI (PresellForm + preview) |

---

## Templates Status

| Template | Status | Notes |
|---|---|---|
| `review-template.ts` | ✅ Working | Stable, in production use |
| `robusta-white-template.ts` | 🔧 Issues | See known bugs below |

---

## Known Bugs

### robusta-white-template.ts

1. **FAQ duplicated** — Last 3 FAQ entries render as "Have more questions?" instead of real content. Root cause: Gemini returns `bonuses.items` as an object `{}` instead of an array `[]`. Fix: always guard with `Array.isArray()` before `.map()` or `.filter()`.

2. **Footer price missing** — CTA in footer renders as `/bottle` with no price amount. The price field is not being injected into the footer section of the template.

3. **Ingredients placeholder** — Ingredients sometimes render as placeholder text instead of real product data. Likely caused by missing or malformed field in Gemini response.

---

## Critical Rules (from CLAUDE.md)

- **Never call Gemini without checking cache first** — cost control is mandatory.
- **Always use `Array.isArray()`** before any `.map()` or `.filter()` on Gemini response fields.
- **Use replacer functions for `.replace()`** when the replacement value contains `$` — string `.replace()` interprets `$` as a special pattern and silently corrupts prices.
- **Log full Gemini JSON response in chunks** before template rendering to aid debugging.

---

## Agents Built

| Agent | File | Purpose |
|---|---|---|
| Research Agent | `src/ai/flows/research-product.ts` | Scrapes product pages (Hotmart, Amazon, etc.) using Cheerio to extract name, price, ingredients, claims |
| Debug Agent | `src/ai/flows/debug-generation.ts` | Logs complete raw Gemini JSON response in chunks before any template rendering |

---

## Skills Installed

### Global (`~/.claude/`)

| Pack | Source | Count |
|---|---|---|
| **marketing-skills** | syntax-syndicate/marketing-skills | 25 skills |
| **Deep-Research-skills** | Weizhena/Deep-Research-skills | 5 skills |
| **wondelai/skills** | wondelai/skills | 42 skills |
| **everything-claude-code (ECC)** | anthropics-claude-code plugin | 150+ sub-agents |
| **frontend-design** | custom/global | UI/UX and design system skills |
| **impeccable** | custom/global | Code quality and review skills |

**marketing-skills** (25): `ab-test-setup`, `analytics-tracking`, `competitor-alternatives`, `content-strategy`, `copy-editing`, `copywriting`, `email-sequence`, `form-cro`, `free-tool-strategy`, `launch-strategy`, `marketing-ideas`, `marketing-psychology`, `onboarding-cro`, `page-cro`, `paid-ads`, `paywall-upgrade-cro`, `popup-cro`, `pricing-strategy`, `product-marketing-context`, `programmatic-seo`, `referral-program`, `schema-markup`, `seo-audit`, `signup-flow-cro`, `social-content`

**wondelai/skills** (42): `37signals-way`, `blue-ocean-strategy`, `clean-architecture`, `clean-code`, `contagious`, `continuous-discovery`, `cro-methodology`, `crossing-the-chasm`, `ddia-systems`, `design-everyday-things`, `design-sprint`, `domain-driven-design`, `drive-motivation`, `high-perf-browser`, `hooked-ux`, `hundred-million-offers`, `improve-retention`, `influence-psychology`, `inspired-product`, `ios-hig-design`, `jobs-to-be-done`, `lean-startup`, `lean-ux`, `made-to-stick`, `microinteractions`, `mom-test`, `negotiation`, `obviously-awesome`, `one-page-marketing`, `pragmatic-programmer`, `predictable-revenue`, `refactoring-patterns`, `refactoring-ui`, `release-it`, `scorecard-marketing`, `software-design-philosophy`, `storybrand-messaging`, `system-design`, `top-design`, `traction-eos`, `ux-heuristics`, `web-typography`

---

## Cost Control

- **Gemini API billing alert set at R$30** — triggers notification to avoid runaway costs.
- **Caching implemented** — responses are cached before template rendering; Gemini is never called if a cached result exists for the same input hash.
- Model selection strategy:
  - Haiku 4.5 → lightweight/frequent agents
  - Sonnet 4.6 → main dev work and orchestration
  - Opus 4.5 → deep architectural decisions

---

## Roadmap

### Templates (next to build)

| Template | Status | Notes |
|---|---|---|
| Robusta Black | Planned | Dark-themed variant of Robusta White |
| Top 5 | Planned | "Top 5 products" comparison presell format |
| Cookie | Planned | Cookie/consent-aware template |
| COD (Cash on Delivery) | Planned | Template optimized for COD offers |
| Quiz | Planned | Interactive quiz-style presell funnel |

### Features

- **Meta Pixel integration** — fire `PageView` + `ViewContent` + `Lead` events from generated presell pages.
- **Copy por país** — localized copy variants per country (BR, MX, CO, AR, US-LATAM), adjusting idioms, prices, and CTAs.

---

## 3D Animation Prompts

Saved prompts for generating premium 3D product animations, used on high-ticket presell pages. These prompts produce:
- Rotating supplement bottles with light reflections
- Ingredient particle explosion effects
- Before/after transformation sequences

Stored separately for use with Remotion or external video generation tools.

---

## Business Context

### Davy Proposal

- **Client:** Davy (Águias do Digital community)
- **Proposal:** Full presell site build for one of his digital products
- **Package price quoted:** R$3.997
- **Status:** No deal made — proposal presented but not closed.

---

## Integrations Planned

### NotebookLM MCP

- **Goal:** Integrate NotebookLM as an MCP server into the Research Agent (`src/ai/flows/research-product.ts`).
- **Use case:** Feed scraped product data + competitor research into a NotebookLM notebook, then query it for deeper synthesis before passing context to Gemini for copy generation.
- **Status:** Planned — MCP server wrapper not yet built.
