'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { fetchProductDNA, formatDNAForPrompt } from '../../lib/fetch-product-dna';
import { jsonrepair } from 'jsonrepair';

const GenerateReviewContentInputSchema = z.object({
  productName: z.string().optional(),
  productInfo: z.string().optional(),
  salesPageDescription: z.string().optional(),
  officialProductUrl: z.string().optional(),
  dnaContext: z.string().optional(),
  targetLanguage: z.string(),
  templateType: z.enum(['Lançamento', 'Robusta', 'Review', 'Cookie', 'Lista (Top 3/5)']),
  copyStyle: z.enum(['White Hat (Conservador)', 'Black Hat (Agressivo)']),
  popupEnabled: z.boolean().optional(),
});

export type GenerateReviewContentInput = z.infer<typeof GenerateReviewContentInputSchema>;
export type GenerateReviewContentOutput = any;

const HEADLINE_PATTERNS = [
  { id: 'question',      template: '{product} Review {year}: Does It Actually Work for {benefit}?' },
  { id: 'honest',        template: 'Honest {product} Review {year}: What Users Are Really Reporting' },
  { id: 'scam_or_legit', template: '{product} — Scam or Legit? An Independent {year} Review' },
  { id: 'investigation', template: 'We Tested {product} for 30 Days: Here\'s What We Found ({year})' },
  { id: 'truth',         template: 'The Truth About {product}: A Complete {year} Analysis' },
  { id: 'worth_it',      template: '{product} Review {year}: Is It Worth the Price?' },
];

const NARRATIVE_STYLES = [
  { id: 'investigative', desc: 'Estilo investigativo jornalistico. O autor investigou o produto como reporter. Tom neutro mas curioso.' },
  { id: 'story_lead',    desc: 'Comeca com a historia de uma pessoa real com o problema. Tom empatico e pessoal.' },
  { id: 'problem_first', desc: 'Comeca directo com o problema que o produto resolve. Tom educacional e factual.' },
  { id: 'expert_review', desc: 'Tom de especialista em saude analisando o produto. Usa terminologia cientifica acessivel.' },
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
  config: { maxOutputTokens: 65535, temperature: 0.7 },
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
2. MECANISMO UNICO: Identifica o mecanismo principal do produto. Este mecanismo e o fio condutor de TODA a page.
3. HEADLINE BOF: A headline deve incluir o nome do produto + "Review" + ano 2026 + beneficio especifico.
4. QUICK VERDICT: Aparece logo apos o hero. Resume em 5 pontos: rating, best for, main benefit, pros (3), cons (2).
5. MECANISMO ANTES DO PRODUTO: Explica o problema e o mecanismo ANTES de apresentar o produto.
6. FAQ BOF: Inclui obrigatoriamente: "is [product] legit", "is [product] a scam", "does [product] really work", "where to buy authentic [product]", "how long to see results".
7. VARIACAO (4 NIVEIS): Segue ESTRITAMENTE o seed.
8. E-E-A-T LEVE: Inclui "Reviewed by our editorial health team" ou similar.
9. COMPLIANCE ADS: Sem urgencia falsa agressiva. CTA final deve ser "Check Official Website" ou similar.
10. IDIOMA: Todo conteudo em {{{targetLanguage}}}.
11. FALLBACKS: Se algum dado nao estiver disponivel, gera conteudo plausivel. NAO deixar campos vazios.
12. SEO PIPELINE: Gera automaticamente title_tag, meta_description, url_slug, schema_type.
13. INGREDIENTES: Gera EXACTAMENTE 9 ingredientes. Cada um com name, benefit_short E scientific_explanation de 2-3 frases.
14. DEPOIMENTOS: 3 depoimentos realistas com name, location, quote_title e quote_body. NUNCA mencionar anos específicos nos depoimentos. NUNCA copiar depoimentos reais da página oficial. Cria depoimentos FICTÍCIOS plausíveis.
15. SCAM ALERT: Inclui bloco de alerta de falsificacao direcionando para site oficial.
16. RATING: Rating editorial entre 4.6 e 4.9. Review count entre 8.000 e 15.000.
17. COMPARISON: Tabela simples comparando produto vs "generic supplements".
18. PRICING: Usa os precos exactos fornecidos em productInfo. Se nao houver, deixa os campos de preco como strings vazias. O campo supply_days deve SEMPRE incluir "Day Supply" (ex: "30 Day Supply", "90 Day Supply"). O campo bottles deve SEMPRE incluir "Bottle" ou "Bottles" (ex: "1 Bottle", "6 Bottles").
20. BONUSES: REGRA CRÍTICA — Se o productInfo NAO mencionar explicitamente "bonus", "brinde", "free gift" ou similar, o campo bonuses NAO EXISTE no JSON. Simplesmente omite o campo bonuses completamente do JSON.
21. NICHE: O campo meta.niche deve ser gerado SEMPRE EM INGLÊS, independente do idioma do conteúdo. Ex: "Cardiovascular Health", "Weight Loss", "Joint Support".
22. INGREDIENTES SEM IMAGEM: O campo image_url dos ingredientes deve ser SEMPRE string vazia "". As imagens sao fornecidas pelo afiliado separadamente.
19. POPUP: O campo popup.enabled deve ser {{{popupEnabled}}}.

INSTRUCAO CRITICA DE FORMATO:
1. Responda APENAS com JSON valido. ZERO texto antes ou depois. ZERO markdown. ZERO backticks.
2. O JSON deve ser COMPACTO numa unica linha. SEM quebras de linha. SEM identacao.
3. NUNCA use aspas duplas dentro de valores. Use apostrofes simples ou reformule.
4. Em arrays, SEMPRE separe os elementos com virgula.

Estrutura JSON esperada (preenche TODOS os campos com conteudo real):
{"seo":{"title_tag":"","meta_description_a":"","meta_description_b":"","meta_description_c":"","url_slug":"","schema_type":"Review","primary_keyword":"","secondary_keywords":["","",""],"faq_schema_items":[{"question":"","answer":""}]},"meta":{"product_name":"","product_tagline":"","niche":"","target_country":"","target_language":"","primary_color":"","rating":"4.8","review_count":"11,248","publish_date":"","publish_date_year":"2026","author_label":"","editorial_note":""},"hero":{"headline":"","subheadline":"","product_image_url":"","author_label":"","date_label":"","read_time":""},"quick_verdict":{"rating":"4.8","best_for":"","main_benefit":"","pros":["","",""],"cons":["",""],"cta_text":"","verdict_summary":""},"intro":{"opening_hook":"","problem_statement":"","review_purpose":"","read_notice":""},"mechanism":{"tag":"","headline":"","unique_mechanism_name":"","explanation":"","body_paragraphs":["","",""],"highlight_quote":"","image_url":""},"what_is":{"headline":"","description":"","product_image_url":"","bullets":[{"icon":"✓","text":""}],"quality_tags":["","",""]},"how_it_works":{"headline":"","subheadline":"","steps":[{"number":"01","title":"","description":""},{"number":"02","title":"","description":""},{"number":"03","title":"","description":""}]},"ingredients":{"headline":"","subheadline":"","items":[{"name":"","image_url":"","benefit_short":"","scientific_explanation":""}]},"benefits":{"headline":"","items":[{"icon":"✓","text":"","detail":""}]},"pros_cons":{"headline":"","pros":[{"text":""}],"cons":[{"text":""}]},"testimonials":{"headline":"","subheadline":"","items":[{"photo_url":"","name":"","location":"","rating":"5","verified_label":"Verified Purchase","quote_title":"","quote_body":""}]},"comparison":{"headline":"","subheadline":"","product_name":"","rows":[{"feature":"","product":true,"generic":false}]},"scam_alert":{"headline":"","warning_text":"","fake_signs":["","",""],"cta_text":"","official_note":""},"pricing":{"section_headline":"","section_subheadline":"","editorial_note":"","bundles":[{"id":"entry","desktop_position":1,"mobile_position":3,"label":"","bottles":"","supply_days":"","price_per_bottle":"","price_total_original":"","price_total_discount":"","savings":"","shipping":"","bonuses_included":false,"free_shipping":false,"cta_text":"","featured":false,"ribbon":null},{"id":"best_value","desktop_position":2,"mobile_position":1,"label":"","bottles":"","supply_days":"","price_per_bottle":"","price_total_original":"","price_total_discount":"","savings":"","shipping":"","bonuses_included":true,"free_shipping":true,"cta_text":"","featured":true,"ribbon":"BEST VALUE!"},{"id":"popular","desktop_position":3,"mobile_position":2,"label":"","bottles":"","supply_days":"","price_per_bottle":"","price_total_original":"","price_total_discount":"","savings":"","shipping":"","bonuses_included":true,"free_shipping":true,"cta_text":"","featured":false,"ribbon":"MOST POPULAR"}],"payment_icons_url":"","guarantee_note":""},"guarantee":{"badge_url":"","days":"60","headline":"","text":"","trust_pills":["","",""]},"faq":{"headline":"","subheadline":"","items":[{"question":"","answer":""},{"question":"","answer":""},{"question":"","answer":""},{"question":"","answer":""},{"question":"","answer":""},{"question":"","answer":""}]},"final_cta":{"headline":"","subheadline":"","product_image_url":"","bundle_label":"","price_per_bottle":"","price_original":"","price_per_day":"","cta_text":"","trust_line":"","availability_note":""},"footer":{"disclaimer_advertising":"","disclaimer_results":"","disclaimer_medical":"","editorial_disclosure":"","privacy_url":"","terms_url":"","copyright_text":""},"popup":{"enabled":true,"appear_after_seconds":10,"visible_seconds":5,"repeat_every_seconds":60,"product_image_url":"","names":["","","","",""],"cities":["","","","",""],"action_text":""}}`,
});

function selectVariations(seed: string) {
  const hash = seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return {
    headline: HEADLINE_PATTERNS[hash % HEADLINE_PATTERNS.length],
    narrative: NARRATIVE_STYLES[(hash >> 2) % NARRATIVE_STYLES.length],
    vocabulary: VOCABULARY_SETS[(hash >> 4) % VOCABULARY_SETS.length],
    curiosity: CURIOSITY_STYLES[(hash >> 6) % CURIOSITY_STYLES.length],
  };
}

function parseGeminiJSON(raw: string): any {
  let text = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end > start) text = text.slice(start, end + 1);
  try { return JSON.parse(text); } catch {}
  try { return JSON.parse(jsonrepair(text)); } catch {}
  try {
    const sanitized = text.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
    return JSON.parse(jsonrepair(sanitized));
  } catch (e) {
    throw new Error('JSON invalido apos 3 tentativas: ' + (e as any).message);
  }
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
      dnaData = await fetchProductDNA(input.officialProductUrl);
      if (dnaData.success) {
        dnaContext = await formatDNAForPrompt(dnaData);
      }
    }

    const variationBlock = `
=== SEED DE VARIACAO CONSISTENTE ===
Seed: ${rawSeed}
NIVEL 1 — PADRAO DE HEADLINE: Usa EXACTAMENTE este padrao: "${variations.headline.template}"
NIVEL 2 — ESTILO NARRATIVO: ${variations.narrative.desc}
NIVEL 3 — VOCABULARIO: ${variations.vocabulary.verbs.join(', ')}
NIVEL 4 — CURIOSIDADE: "${variations.curiosity.prefix}"
======================================
`;

    dnaContext = variationBlock + dnaContext;

    const { text } = await prompt({
      ...input,
      dnaContext,
      popupEnabled: input.popupEnabled !== false,
    } as any);

    if (!text) throw new Error('Nenhum dado retornado pela IA.');

    const parsed = parseGeminiJSON(text);

    // ============================================
    // PATCHES FORÇADOS PÓS-GEMINI (ANTI-OVERRIDE)
    // ============================================

    // 1. DATA REAL
    const today = new Date();
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const realDateLabel = `${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
    const realIsoDate = today.toISOString().split('T')[0];
    if (parsed.hero) {
      parsed.hero.date_label = realDateLabel;
    }
    if (parsed.meta) {
      parsed.meta.publish_date = realIsoDate;
      parsed.meta.publish_date_year = '2026';
      parsed.meta.author_label = parsed.meta.author_label || 'Health Editorial Team';
    }

    // 2. POPUP
    const popupEnabled = input.popupEnabled !== false;
    parsed.popup = {
      enabled: popupEnabled,
      appear_after_seconds: parsed.popup?.appear_after_seconds ?? 10,
      visible_seconds: parsed.popup?.visible_seconds ?? 5,
      repeat_every_seconds: parsed.popup?.repeat_every_seconds ?? 60,
      product_image_url: parsed.popup?.product_image_url || '',
      names: parsed.popup?.names?.length ? parsed.popup.names : ['Sarah','Michael','Jessica','Robert','Emily'],
      cities: parsed.popup?.cities?.length ? parsed.popup.cities : ['Austin, TX','Seattle, WA','Denver, CO','Boston, MA','Portland, OR'],
      action_text: parsed.popup?.action_text || 'just visited the official website'
    };

    // 3. BONUSES - validar contra productInfo
    const productInfoLower = (input.productInfo || '').toLowerCase();
    const hasRealBonuses = productInfoLower.includes('bonus') || productInfoLower.includes('brinde') || productInfoLower.includes('free gift') || productInfoLower.includes('extra');
    if (parsed.pricing?.bundles) {
      parsed.pricing.bundles = parsed.pricing.bundles.map((bundle: any) => ({
        ...bundle,
        bonuses_included: hasRealBonuses ? (bundle.bonuses_included ?? false) : false,
        supply_days: bundle.supply_days?.toString().includes('Day') ? bundle.supply_days : `${bundle.supply_days || 30} Day Supply`,
        bottles: bundle.bottles?.toString().includes('Bottle') ? bundle.bottles : `${bundle.bottles || 1} Bottle${Number(bundle.bottles) > 1 ? 's' : ''}`
      }));
    }

    // 4. FINAL CTA - sincronizar com bundle best_value
    const bundles = parsed.pricing?.bundles || [];
    const bestValueBundle = bundles.find((b: any) => b.featured) || bundles[1] || bundles[0] || {};
    if (parsed.final_cta) {
      parsed.final_cta.bundle_label = bestValueBundle.label || 'Best Value Package';
      parsed.final_cta.price_per_bottle = bestValueBundle.price_per_bottle || parsed.final_cta.price_per_bottle || '';
      parsed.final_cta.price_original = bestValueBundle.price_total_original || parsed.final_cta.price_original || '';
    }

    // 5. COPYRIGHT
    if (parsed.footer) {
      parsed.footer.copyright_text = `© ${today.getFullYear()} HealthReviewHub. All rights reserved.`;
    }

    // 6. PRIMARY COLOR DO DNA
    if (dnaData?.success && dnaData.primary_color && dnaData.primary_color !== '#E85D26') {
      if (parsed.meta) parsed.meta.primary_color = dnaData.primary_color;
    }

    parsed._seed = rawSeed;
    parsed._variations = variations;
    parsed._dna = dnaData;
    parsed._patched_at = new Date().toISOString();

    return parsed;

  } catch (error: any) {
    console.error('[Review] Erro:', error);
    throw new Error(error.message || 'Falha ao gerar conteudo Review.');
  }
}