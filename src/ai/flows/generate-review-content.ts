'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { fetchProductDNA, formatDNAForPrompt } from '../../lib/fetch-product-dna';
import { jsonrepair } from 'jsonrepair';

const GenerateReviewContentInputSchema = z.object({
  productName: z.string().optional(),
  productInfo: z.string().optional(),           // ← NOVO: info manual do produto
  salesPageDescription: z.string().optional(),
  officialProductUrl: z.string().optional(),
  dnaContext: z.string().optional(),
  targetLanguage: z.string(),
  templateType: z.enum(['Lançamento', 'Robusta', 'Review', 'Cookie', 'Lista (Top 3/5)']),
  copyStyle: z.enum(['White Hat (Conservador)', 'Black Hat (Agressivo)']),
  popupEnabled: z.boolean().optional(),         // ← NOVO: toggle popup
});

export type GenerateReviewContentInput = z.infer<typeof GenerateReviewContentInputSchema>;
export type GenerateReviewContentOutput = any;

// ── 4 NÍVEIS DE VARIAÇÃO CONTROLADOS PELO SEED ──────────────────────────────

const HEADLINE_PATTERNS = [
  { id: 'question',      template: '{product} Review {year}: Does It Actually Work for {benefit}?' },
  { id: 'honest',        template: 'Honest {product} Review {year}: What Users Are Really Reporting' },
  { id: 'scam_or_legit', template: '{product} — Scam or Legit? An Independent {year} Review' },
  { id: 'investigation', template: 'We Tested {product} for 30 Days: Here\'s What We Found ({year})' },
  { id: 'truth',         template: 'The Truth About {product}: A Complete {year} Analysis' },
  { id: 'worth_it',      template: '{product} Review {year}: Is It Worth the Price?' },
];

const NARRATIVE_STYLES = [
  { id: 'investigative', desc: 'Estilo investigativo jornalístico. O autor "investigou" o produto como repórter. Tom neutro mas curioso.' },
  { id: 'story_lead',    desc: 'Começa com a história de uma pessoa real com o problema. Tom empático e pessoal.' },
  { id: 'problem_first', desc: 'Começa directo com o problema que o produto resolve. Tom educacional e factual.' },
  { id: 'expert_review', desc: 'Tom de especialista em saúde analisando o produto. Usa terminologia científica acessível.' },
];

const VOCABULARY_SETS = [
  { id: 'clinical',   verbs: ['may support', 'is studied for', 'has been shown to', 'researchers found'] },
  { id: 'editorial',  verbs: ['appears to help', 'users report', 'evidence suggests', 'data shows'] },
  { id: 'balanced',   verbs: ['may assist', 'could contribute to', 'is designed to', 'aims to promote'] },
  { id: 'scientific', verbs: ['is formulated to', 'contains compounds that', 'studies indicate', 'laboratory analysis shows'] },
];

const CURIOSITY_STYLES = [
  { id: 'why_based',    prefix: 'Why most people with {problem} never see results (and what actually makes the difference)' },
  { id: 'what_based',   prefix: 'What researchers discovered about {mechanism} that changes everything' },
  { id: 'secret_based', prefix: 'The overlooked {mechanism} factor behind most {problem} struggles' },
  { id: 'myth_based',   prefix: 'The common myth about {problem} that may actually be making things worse' },
];

const prompt = ai.definePrompt({
  name: 'generateReviewContentPrompt',
  model: 'googleai/gemini-2.5-flash',
  input: { schema: GenerateReviewContentInputSchema },
  output: { format: 'text' },
  config: {
    maxOutputTokens: 8192,
    temperature: 0.7,
  },
  prompt: `Voce e um Copywriter especializado em REVIEW EDITORIAL para afiliados nutra.
Sua tarefa e gerar conteudo para um template Review de 17 blocos, no estilo jornalistico independente.

=== FRAMEWORK RMBC ADAPTADO ===
Research: extrair dados reais do DNA da pagina oficial
Mechanism: identificar o MECANISMO UNICO do produto (o "porquê" funciona)
Big Idea: escolher angulo com base no seed de variacao
Copy: seguir as instrucoes de narrativa, vocabulario e curiosidade do seed

{{{dnaContext}}}

=== INFORMACOES DO PRODUTO (FORNECIDAS PELO AFILIADO — PRIORIDADE MAXIMA) ===
NOME: {{{productName}}}
DADOS: {{{productInfo}}}

INSTRUCAO CRITICA ANTI-ALUCINACAO:
- Use APENAS os dados acima + DNA da pagina para gerar conteudo.
- NUNCA invente nomes de produtos, precos, ingredientes ou garantias que nao estejam nos dados.
- Se um campo nao tiver informacao suficiente, gera conteudo plausivel baseado no nicho.
- Em caso de conflito entre productInfo e DNA, dar prioridade ao productInfo.

CONTEUDO ADICIONAL / ANGULO DO AFILIADO:
{{{salesPageDescription}}}

=== ANO ACTUAL ===
O ano actual e 2026. Use SEMPRE 2026 nas headlines, datas e titulos. NUNCA use 2024 ou 2025.

=== REGRAS DE OURO (ESTRITO) ===
1. TOM EDITORIAL: Parece review independente, nao publicidade. NUNCA use: "cura", "garante", "milagre". USE: "may support", "users report", "evidence suggests".
2. MECANISMO UNICO: Identifica o mecanismo principal do produto (ex: oral microbiome, mitochondrial decline, brown fat activation). Este mecanismo e o fio condutor de TODA a page.
3. HEADLINE BOF: A headline deve incluir o nome do produto + "Review" + ano 2026 + beneficio especifico. Segue o padrao do seed.
4. QUICK VERDICT: Aparece logo apos o hero. Resume em 5 pontos: rating, best for, main benefit, pros (3), cons (2).
5. MECANISMO ANTES DO PRODUTO: Explica o problema e o mecanismo ANTES de apresentar o produto.
6. FAQ BOF: Inclui obrigatoriamente: "is [product] legit", "is [product] a scam", "does [product] really work", "where to buy authentic [product]", "how long to see results".
7. VARIACAO (4 NIVEIS): Segue ESTRITAMENTE o seed — headline pattern, narrativa, vocabulario e bullets de curiosidade devem reflectir o seed.
8. E-E-A-T LEVE: Inclui "Reviewed by our editorial health team" ou similar. NAO inventar medicos ou especialistas falsos.
9. COMPLIANCE ADS: Sem urgencia falsa agressiva. CTA final deve ser "Check Official Website" ou similar. Nao mencionar precos especificos na intro.
10. IDIOMA: Todo conteudo em {{{targetLanguage}}}. Incluindo labels, SEO fields e todos os textos.
11. FALLBACKS: Se algum dado nao estiver disponivel no DNA, gera conteudo plausivel baseado no nicho e ingredientes. NAO deixar campos vazios.
12. SEO PIPELINE: Gera automaticamente title_tag, meta_description (3 variacoes), url_slug, schema_type.
13. INGREDIENTES: Gera minimo 6, maximo 9. Cada um com nome, beneficio curto E explicacao cientifica de 2-3 frases. Usar APENAS ingredientes confirmados nos dados.
14. DEPOIMENTOS: 3 depoimentos realistas, nomes americanos, localizacoes especificas, quote_title e quote_body distintos.
15. SCAM ALERT: Inclui bloco de alerta de falsificacao direcionando para site oficial.
16. RATING: Rating editorial entre 4.6 e 4.9. NUNCA 5.0 (parece falso). Review count entre 8.000 e 15.000.
17. COMPARISON: Tabela simples comparando produto vs "generic supplements" sem mencionar marcas especificas.
18. PRICING: Usa os precos exactos fornecidos em productInfo. Se nao houver, deixa os campos de preco como strings vazias.
19. POPUP: O campo popup.enabled deve ser {{{popupEnabled}}}. Se false, o popup nao deve aparecer na pagina.

INSTRUCAO CRITICA DE FORMATO — SEGUIR EXACTAMENTE:
1. Responda APENAS com JSON valido. ZERO texto antes ou depois. ZERO markdown. ZERO backticks.
2. O JSON deve ser COMPACTO numa unica linha. SEM quebras de linha. SEM identacao.
3. NUNCA use aspas duplas dentro de valores. Use apostrofes simples (') ou reformule.
4. NUNCA use \n, \t ou outros caracteres de controlo dentro de strings.
5. Em arrays, SEMPRE separe os elementos com virgula. Ex: ["a","b","c"] NUNCA ["a" "b" "c"].
6. VERIFICACAO FINAL antes de responder: o JSON e valido? todos os arrays tem virgulas?

Estrutura JSON esperada:
{
  "seo": {
    "title_tag": "",
    "meta_description_a": "",
    "meta_description_b": "",
    "meta_description_c": "",
    "url_slug": "",
    "schema_type": "Review",
    "primary_keyword": "",
    "secondary_keywords": ["", "", ""],
    "faq_schema_items": [{"question": "", "answer": ""}]
  },
  "meta": {
    "product_name": "",
    "product_tagline": "",
    "niche": "",
    "target_country": "",
    "target_language": "",
    "primary_color": "",
    "rating": "4.8",
    "review_count": "11,248",
    "publish_date": "",
    "publish_date_year": "2026",
    "author_label": "",
    "editorial_note": ""
  },
  "hero": {
    "headline": "",
    "subheadline": "",
    "product_image_url": "",
    "author_label": "",
    "date_label": "",
    "read_time": ""
  },
  "quick_verdict": {
    "rating": "4.8",
    "best_for": "",
    "main_benefit": "",
    "pros": ["", "", ""],
    "cons": ["", ""],
    "cta_text": "",
    "verdict_summary": ""
  },
  "intro": {
    "opening_hook": "",
    "problem_statement": "",
    "review_purpose": "",
    "read_notice": ""
  },
  "mechanism": {
    "tag": "",
    "headline": "",
    "unique_mechanism_name": "",
    "explanation": "",
    "body_paragraphs": ["", "", ""],
    "highlight_quote": "",
    "image_url": ""
  },
  "what_is": {
    "headline": "",
    "description": "",
    "product_image_url": "",
    "bullets": [{"icon": "", "text": ""}],
    "quality_tags": ["", "", ""]
  },
  "how_it_works": {
    "headline": "",
    "subheadline": "",
    "steps": [
      {"number": "01", "title": "", "description": ""},
      {"number": "02", "title": "", "description": ""},
      {"number": "03", "title": "", "description": ""}
    ]
  },
  "ingredients": {
    "headline": "",
    "subheadline": "",
    "items": [
      {
        "name": "",
        "image_url": "",
        "benefit_short": "",
        "scientific_explanation": ""
      }
    ]
  },
  "benefits": {
    "headline": "",
    "items": [{"icon": "", "text": "", "detail": ""}]
  },
  "pros_cons": {
    "headline": "",
    "pros": [{"text": ""}],
    "cons": [{"text": ""}]
  },
  "testimonials": {
    "headline": "",
    "subheadline": "",
    "items": [
      {
        "photo_url": "",
        "name": "",
        "location": "",
        "rating": "5",
        "verified_label": "",
        "quote_title": "",
        "quote_body": ""
      }
    ]
  },
  "comparison": {
    "headline": "",
    "subheadline": "",
    "product_name": "",
    "rows": [
      {
        "feature": "",
        "product": true,
        "generic": false
      }
    ]
  },
  "scam_alert": {
    "headline": "",
    "warning_text": "",
    "fake_signs": ["", "", ""],
    "cta_text": "",
    "official_note": ""
  },
  "pricing": {
    "section_headline": "",
    "section_subheadline": "",
    "editorial_note": "",
    "bundles": [
      {
        "id": "entry",
        "desktop_position": 1,
        "mobile_position": 3,
        "label": "",
        "bottles": "",
        "supply_days": "",
        "price_per_bottle": "",
        "price_total_original": "",
        "price_total_discount": "",
        "savings": "",
        "shipping": "",
        "bonuses_included": false,
        "free_shipping": false,
        "cta_text": "",
        "featured": false,
        "ribbon": null
      },
      {
        "id": "best_value",
        "desktop_position": 2,
        "mobile_position": 1,
        "label": "",
        "bottles": "",
        "supply_days": "",
        "price_per_bottle": "",
        "price_total_original": "",
        "price_total_discount": "",
        "savings": "",
        "shipping": "",
        "bonuses_included": true,
        "free_shipping": true,
        "cta_text": "",
        "featured": true,
        "ribbon": ""
      },
      {
        "id": "popular",
        "desktop_position": 3,
        "mobile_position": 2,
        "label": "",
        "bottles": "",
        "supply_days": "",
        "price_per_bottle": "",
        "price_total_original": "",
        "price_total_discount": "",
        "savings": "",
        "shipping": "",
        "bonuses_included": true,
        "free_shipping": true,
        "cta_text": "",
        "featured": false,
        "ribbon": ""
      }
    ],
    "payment_icons_url": "",
    "guarantee_note": ""
  },
  "guarantee": {
    "badge_url": "",
    "days": "",
    "headline": "",
    "text": "",
    "trust_pills": ["", "", ""]
  },
  "faq": {
    "headline": "",
    "subheadline": "",
    "items": [
      {"question": "", "answer": ""}
    ]
  },
  "final_cta": {
    "headline": "",
    "subheadline": "",
    "product_image_url": "",
    "bundle_label": "",
    "price_per_bottle": "",
    "price_original": "",
    "price_per_day": "",
    "cta_text": "",
    "trust_line": "",
    "availability_note": ""
  },
  "footer": {
    "disclaimer_advertising": "",
    "disclaimer_results": "",
    "disclaimer_medical": "",
    "editorial_disclosure": "",
    "privacy_url": "",
    "terms_url": "",
    "copyright_text": ""
  },
  "popup": {
    "enabled": true,
    "appear_after_seconds": 10,
    "visible_seconds": 5,
    "repeat_every_seconds": 60,
    "product_image_url": "",
    "names": ["", "", "", "", ""],
    "cities": ["", "", "", "", ""],
    "action_text": ""
  }
}`,
});

function selectVariations(seed: string) {
  const hash = seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const headline = HEADLINE_PATTERNS[hash % HEADLINE_PATTERNS.length];
  const narrative = NARRATIVE_STYLES[(hash >> 2) % NARRATIVE_STYLES.length];
  const vocabulary = VOCABULARY_SETS[(hash >> 4) % VOCABULARY_SETS.length];
  const curiosity = CURIOSITY_STYLES[(hash >> 6) % CURIOSITY_STYLES.length];
  return { headline, narrative, vocabulary, curiosity };
}

export async function generateReviewContent(
  input: GenerateReviewContentInput
): Promise<GenerateReviewContentOutput> {
  try {
    const rawSeed = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    const variations = selectVariations(rawSeed);

    let dnaContext = '';
    let dnaData = null;

    if (input.officialProductUrl && input.officialProductUrl.startsWith('http')) {
      console.log('[DNA] Review — a extrair DNA de:', input.officialProductUrl);
      dnaData = await fetchProductDNA(input.officialProductUrl);
      if (dnaData.success) {
        dnaContext = await formatDNAForPrompt(dnaData);
        console.log('[DNA] Review — extraído. Secções:', dnaData.sections_detected);
      } else {
        console.warn('[DNA] Review — falhou:', dnaData.error);
      }
    }

    const variationBlock = `
=== SEED DE VARIACAO CONSISTENTE (SEGUIR ESTRITAMENTE) ===
Seed: ${rawSeed}

NIVEL 1 — PADRAO DE HEADLINE:
Usa EXACTAMENTE este padrao: "${variations.headline.template}"
Substitui {product} pelo nome do produto, {year} por 2026, {benefit} pelo beneficio principal.

NIVEL 2 — ESTILO NARRATIVO:
${variations.narrative.desc}

NIVEL 3 — VOCABULARIO:
Usa PREFERENCIALMENTE estes verbos e expressoes: ${variations.vocabulary.verbs.join(', ')}

NIVEL 4 — ESTILO DE CURIOSIDADE:
O opening hook e bullets de curiosidade devem seguir este padrao:
"${variations.curiosity.prefix}"
Adapta para o produto especifico.

REGRA: Os 4 niveis devem ser COERENTES entre si. A narrativa, vocabulario e curiosidade devem reflectir o mesmo angulo que a headline.
======================================================
`;

    dnaContext = variationBlock + dnaContext;

    const { text } = await prompt({
      ...input,
      dnaContext,
      popupEnabled: input.popupEnabled !== false, // padrão true
    } as any);

    if (!text) throw new Error('Nenhum dado retornado pela IA.');

    // Extrai e faz parse com jsonrepair
    let rawR = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const startR = rawR.indexOf('{'), endR = rawR.lastIndexOf('}');
    if (startR !== -1 && endR > startR) rawR = rawR.slice(startR, endR + 1);

    let parsed: any;
    try {
      parsed = JSON.parse(rawR);
    } catch {
      console.log('[Review] JSON directo falhou, a usar jsonrepair...');
      const repairedR = jsonrepair(rawR);
      parsed = JSON.parse(repairedR);
    }

    // Forçar popup.enabled conforme escolha do utilizador
    if (parsed.popup) {
      parsed.popup.enabled = input.popupEnabled !== false;
    }

    // Forçar ano 2026 no copyright
    if (parsed.footer?.copyright_text) {
      parsed.footer.copyright_text = parsed.footer.copyright_text.replace(/\d{4}/, '2026');
    }

    if (dnaData?.success && parsed.meta) {
      if (dnaData.primary_color && dnaData.primary_color !== '#E85D26') {
        parsed.meta.primary_color = dnaData.primary_color;
      }
    }

    parsed._seed = rawSeed;
    parsed._variations = variations;
    parsed._dna = dnaData;

    return parsed;

  } catch (error: any) {
    console.error('[Review] Erro na geração:', error);
    throw new Error(error.message || 'Falha ao gerar conteúdo Review.');
  }
}