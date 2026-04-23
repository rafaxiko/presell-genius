'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { fetchProductDNA, formatDNAForPrompt } from '../../lib/fetch-product-dna';
import { jsonrepair } from 'jsonrepair';

const GeneratePresellContentInputSchema = z.object({
  productName:          z.string().optional(),          // ← ANTI-ALUCINAÇÃO
  productInfo:          z.string().optional(),          // ← ANTI-ALUCINAÇÃO
  salesPageDescription: z.string(),
  officialProductUrl:   z.string().optional(),
  dnaContext:           z.string().optional(),
  targetLanguage:       z.string(),
  targetCountry:        z.string().optional(),
  templateType:         z.enum(['Lançamento', 'Robusta', 'Review', 'Cookie', 'Lista (Top 3/5)']),
  copyStyle:            z.enum(['White Hat (Conservador)', 'Black Hat (Agressivo)']),
});

export type GeneratePresellContentInput = z.infer<typeof GeneratePresellContentInputSchema>;
export type GeneratePresellContentOutput = any;

const prompt = ai.definePrompt({
  name: 'generatePresellContentPrompt',
  model: 'googleai/gemini-2.5-flash',
  input: {schema: GeneratePresellContentInputSchema},
  output: {format: 'text'},
  config: {
    maxOutputTokens: 8192,
    temperature: 0.7,
  },
  prompt: `Voce e um Copywriter e Especialista em Dados Nutra de elite.
Sua tarefa e extrair informacoes e gerar conteudo para o template "Robusta White v2" de 16 secoes.

=== INFORMACOES DO PRODUTO (FORNECIDAS PELO AFILIADO — PRIORIDADE MAXIMA) ===
NOME DO PRODUTO: {{{productName}}}
DADOS: {{{productInfo}}}

INSTRUCAO CRITICA ANTI-ALUCINACAO:
- Use APENAS os dados acima + DNA da pagina para gerar conteudo.
- NUNCA invente nomes de produtos, precos, ingredientes ou garantias que nao estejam nos dados.
- Se um campo nao tiver informacao suficiente, gera conteudo plausivel baseado no nicho.
- Em caso de conflito entre productInfo e DNA, dar prioridade ao productInfo.

CRITICAL: Use ONLY data explicitly provided by the user.
If ingredients are provided, list ALL of them with exact names.
If bonuses are provided, include ALL bonuses with exact names and prices.
NEVER generate placeholder text like 'Natural Ingredient 1'.
If a section has no data, omit it completely.
=============================================================================

REGRAS DE OURO (ESTRITO):
1. ESTILO WHITE HAT: Use tom editorial e cientifico. PROIBIDO: "cura", "garantido", "milagre". USE: "pode apoiar", "estudado para".
2. ECONOMIA (SAVINGS): O campo savings deve conter APENAS o valor numeral (ex: $240). NAO inclua rotulos.
3. DENSIDADE: Gere exatamente 6 FAQs detalhados e 6 Ingredientes com beneficios botanicos.
4. LOGICA DE PRECOS:
   - Bundle 1 (entry): menor kit. Desktop pos 1, Mobile pos 3.
   - Bundle 2 (best_value): maior kit (6 frascos). Desktop pos 2, Mobile pos 1 (FEATURED: true).
   - Bundle 3 (popular): kit medio (3 frascos). Desktop pos 3, Mobile pos 2.
5. DNA VISUAL: Se fornecido o DNA da pagina oficial, USE EXACTAMENTE as cores extraidas.
6. PRECOS REAIS: Se o DNA ou productInfo contem precos, use esses valores EXACTOS. Nao invente precos.
7. ANO ACTUAL: Use sempre 2026 nas datas e copyright. NUNCA use 2024 ou 2025.
8. IDIOMA: Todo o conteudo em {{{targetLanguage}}}. Incluindo labels, navbar e countdown.
8b. PAIS / COPY INTENSITY: Country: {{{targetCountry}}} — adapta a intensidade do copy: USA/Canada/Australia=agressivo e direto; Europa=sober e editorial; LATAM=emocional e urgente; Asia=prova social e colectiva.
9. RATING: Sempre preencha rating (ex: "4.9") e review_count (ex: "10,847"). NUNCA deixe vazios.
10. POPUP: Sempre preencha popup.names e popup.cities com 5 nomes/cidades reais do pais alvo.
11. NAVBAR: Os campos nav_link_1, nav_link_2, nav_link_3 e nav_cta no idioma de {{{targetLanguage}}}.
12. LABELS: Preencha TODOS os campos do objecto "labels" no idioma de {{{targetLanguage}}}.
    - bonus_free_label: texto para bonus gratis (ex: "FREE", "GRÁTIS")
    - privacy_label: texto para privacidade (ex: "Privacy Policy", "Política de Privacidade")
    - terms_label: texto para termos (ex: "Terms", "Termos")
13. UNICIDADE OBRIGATORIA: Esta presell DEVE ser unica. Usa o seed de variacao fornecido no contexto.

=== CAMPOS ABSOLUTAMENTE OBRIGATORIOS — FALHA CRITICA SE OMITIDOS ===

ATENCAO: O sistema de validacao vai REJEITAR a resposta e mostrar ERRO ao utilizador se
qualquer um dos campos abaixo estiver vazio, ausente ou com arrays vazios. NAO ha fallback.

14. INGREDIENTS (CRITICO — OBRIGATORIO SEM EXCEPCAO):
    O objecto "ingredients" DEVE conter a chave "items" com EXACTAMENTE 6 objectos.
    Cada objecto DEVE ter:
      - "name": string NAO VAZIA (ex: "Berberine HCl")
      - "benefit": string NAO VAZIA com minimo 1 frase completa
    SE o produto nao tem ingredientes conhecidos, INVENTA 6 ingredientes tipicos do nicho.
    NUNCA retorne "items": [] ou "items" com menos de 6 entradas. NUNCA omita "items".

15. TESTIMONIALS (CRITICO — OBRIGATORIO SEM EXCEPCAO):
    O objecto "testimonials" DEVE conter a chave "items" com EXACTAMENTE 3 objectos.
    Cada objecto DEVE ter:
      - "name": string NAO VAZIA
      - "location": string NAO VAZIA (cidade + pais/estado)
      - "quote_title": string NAO VAZIA (titulo curto)
      - "quote_body": string NAO VAZIA com minimo 2 frases
    NUNCA omita "items" nem retorne menos de 3 entradas.

16. FAQ (CRITICO — OBRIGATORIO SEM EXCEPCAO):
    O objecto "faq" DEVE conter a chave "items" com EXACTAMENTE 6 objectos.
    Cada objecto DEVE ter:
      - "question": string NAO VAZIA
      - "answer": string NAO VAZIA com minimo 2 frases
    NUNCA retorne "items": [] ou com menos de 6 entradas. NUNCA omita "items".

17. MECHANISM (CRITICO — OBRIGATORIO SEM EXCEPCAO):
    O objecto "mechanism" DEVE ter:
      - "headline": string NAO VAZIA
      - "subheadline": string NAO VAZIA
      - "body_paragraphs": array com EXACTAMENTE 3 strings NAO VAZIAS (cada uma minimo 2 frases)
      - "highlight_quote": string NAO VAZIA
    NUNCA omita o mechanism nem deixe campos vazios.

18. BUNDLES (CRITICO — OBRIGATORIO SEM EXCEPCAO):
    O objecto "pricing" DEVE conter a chave "bundles" com EXACTAMENTE 3 objectos.
    Cada bundle DEVE ter "price_per_bottle" NAO VAZIO (ex: "$49.00").
    NUNCA omita "bundles" nem retorne "price_per_bottle" vazio.

VERIFICACAO FINAL OBRIGATORIA — responda internamente SIM/NAO antes de enviar:
- ingredients.items tem exactamente 6 itens com name E benefit NAO VAZIOS? SIM/NAO
- testimonials.items tem exactamente 3 itens com name, location, quote_title, quote_body NAO VAZIOS? SIM/NAO
- faq.items tem exactamente 6 itens com question E answer NAO VAZIOS? SIM/NAO
- mechanism tem headline, subheadline, body_paragraphs (3 itens) e highlight_quote NAO VAZIOS? SIM/NAO
- pricing.bundles tem 3 itens com price_per_bottle NAO VAZIO? SIM/NAO
Se qualquer resposta for NAO, CORRIJA AGORA antes de enviar. Nao e opcional.
=======================================================================

{{{dnaContext}}}

CONTEUDO ADICIONAL FORNECIDO PELO UTILIZADOR:
{{{salesPageDescription}}}

INSTRUCAO CRITICA DE FORMATO — SEGUIR EXACTAMENTE:
1. Responda APENAS com JSON valido. ZERO texto antes ou depois. ZERO markdown. ZERO backticks.
2. O JSON deve ser COMPACTO numa unica linha. SEM quebras de linha. SEM identacao.
3. NUNCA use aspas duplas dentro de valores. Use apostrofes simples (') ou reformule.
4. NUNCA use \n, \t ou outros caracteres de controlo dentro de strings.
5. Em arrays, SEMPRE separe os elementos com virgula. Ex: ["a","b","c"] NUNCA ["a" "b" "c"].
7. NUNCA use emojis nos valores — usam caracteres especiais que quebram o JSON parser.
6. VERIFICACAO FINAL antes de responder: o JSON e valido? todos os arrays tem virgulas?

Estrutura JSON esperada:
{
  "meta": {
    "product_name": "",
    "product_tagline": "",
    "niche": "",
    "target_country": "",
    "target_language": "",
    "affiliate_link": "",
    "page_url": "",
    "primary_color": "",
    "primary_color_light": "",
    "primary_color_dark": "",
    "rating": "4.9",
    "review_count": "10,847",
    "publish_date": "",
    "publish_date_year": "2026"
  },
  "schema_seo": {
    "product_description": "",
    "manufacturer": "",
    "price_entry": "",
    "currency": "",
    "faq_items": [{"question": "", "answer": ""}]
  },
  "countdown": {"enabled": false, "text": "", "minutes": 10},
  "navbar": {
    "logo_url": "",
    "logo_text": "",
    "links": [{"label": "", "anchor": ""}],
    "cta_text": ""
  },
  "hero": {
    "headline": "",
    "subheadline": "",
    "product_image_url": "",
    "cta_text": "",
    "trust_badges": ["", "", ""],
    "mini_testimonials": [{"photo_url": "", "quote": "", "name": ""}],
    "social_proof_line": "",
    "nav_link_1": "",
    "nav_link_2": "",
    "nav_link_3": "",
    "nav_cta": "",
    "countdown_text": "",
    "popup_action_text": ""
  },
  "pricing": {
    "section_headline": "",
    "section_subheadline": "",
    "per_bottle_label": "",
    "urgency_bar": {"enabled": false, "text": ""},
    "bundles": [
      {
        "id": "entry",
        "desktop_position": 1,
        "mobile_position": 3,
        "ribbon": null,
        "label": "",
        "bottles": "",
        "supply_days": "",
        "image_url": "",
        "price_per_bottle": "",
        "price_total_original": "",
        "price_total_discount": "",
        "savings": "",
        "shipping": "",
        "bonuses_included": false,
        "free_shipping": false,
        "cta_text": "",
        "featured": false
      },
      {
        "id": "best_value",
        "desktop_position": 2,
        "mobile_position": 1,
        "ribbon": "",
        "label": "",
        "bottles": "",
        "supply_days": "",
        "image_url": "",
        "price_per_bottle": "",
        "price_total_original": "",
        "price_total_discount": "",
        "savings": "",
        "shipping": "",
        "bonuses_included": true,
        "free_shipping": true,
        "cta_text": "",
        "featured": true
      },
      {
        "id": "popular",
        "desktop_position": 3,
        "mobile_position": 2,
        "ribbon": "",
        "label": "",
        "bottles": "",
        "supply_days": "",
        "image_url": "",
        "price_per_bottle": "",
        "price_total_original": "",
        "price_total_discount": "",
        "savings": "",
        "shipping": "",
        "bonuses_included": true,
        "free_shipping": true,
        "cta_text": "",
        "featured": false
      }
    ],
    "payment_icons_url": "",
    "note_below_cards": ""
  },
  "guarantee": {
    "badge_url": "",
    "days": "",
    "headline": "",
    "text": "",
    "trust_pills": ["", "", ""]
  },
  "mechanism": {
    "tag": "",
    "headline": "REQUIRED: non-empty headline",
    "subheadline": "REQUIRED: non-empty subheadline",
    "body_paragraphs": ["REQUIRED: paragraph 1 (min 2 sentences)", "REQUIRED: paragraph 2 (min 2 sentences)", "REQUIRED: paragraph 3 (min 2 sentences)"],
    "highlight_quote": "REQUIRED: non-empty quote",
    "image_url": ""
  },
  "product_overview": {
    "headline": "",
    "description": "",
    "product_image_url": "",
    "bullets": [{"icon": "", "text": ""}],
    "quality_tags": ["", "", ""]
  },
  "ingredients": {
    "headline": "",
    "subheadline": "",
    "items": [
      {"name": "REQUIRED ingredient 1", "image_url": "", "benefit": "REQUIRED: non-empty benefit"},
      {"name": "REQUIRED ingredient 2", "image_url": "", "benefit": "REQUIRED: non-empty benefit"},
      {"name": "REQUIRED ingredient 3", "image_url": "", "benefit": "REQUIRED: non-empty benefit"},
      {"name": "REQUIRED ingredient 4", "image_url": "", "benefit": "REQUIRED: non-empty benefit"},
      {"name": "REQUIRED ingredient 5", "image_url": "", "benefit": "REQUIRED: non-empty benefit"},
      {"name": "REQUIRED ingredient 6", "image_url": "", "benefit": "REQUIRED: non-empty benefit"}
    ]
  },
  "bonuses": {
    "enabled": false,
    "headline": "",
    "condition_text": "",
    "items": [{"image_url": "", "title": "", "original_price": "", "description": ""}]
  },
  "quality_seals": {
    "enabled": false,
    "headline": "",
    "items": [{"image_url": "", "label": ""}]
  },
  "testimonials": {
    "headline": "",
    "subheadline": "",
    "items": [
      {"photo_url": "", "name": "REQUIRED name 1", "location": "REQUIRED: City, State", "quote_title": "REQUIRED: short title", "quote_body": "REQUIRED: min 2 sentences"},
      {"photo_url": "", "name": "REQUIRED name 2", "location": "REQUIRED: City, State", "quote_title": "REQUIRED: short title", "quote_body": "REQUIRED: min 2 sentences"},
      {"photo_url": "", "name": "REQUIRED name 3", "location": "REQUIRED: City, State", "quote_title": "REQUIRED: short title", "quote_body": "REQUIRED: min 2 sentences"}
    ]
  },
  "where_to_buy": {
    "headline": "",
    "subheadline": "",
    "availability_text": "",
    "reasons_headline": "",
    "packages_headline": "",
    "note": "",
    "reasons": ["", "", "", ""],
    "warning_text": "",
    "cta_text": ""
  },
  "faq": {
    "headline": "",
    "subheadline": "",
    "items": [
      {"question": "REQUIRED question 1", "answer": "REQUIRED: min 2 sentences"},
      {"question": "REQUIRED question 2", "answer": "REQUIRED: min 2 sentences"},
      {"question": "REQUIRED question 3", "answer": "REQUIRED: min 2 sentences"},
      {"question": "REQUIRED question 4", "answer": "REQUIRED: min 2 sentences"},
      {"question": "REQUIRED question 5", "answer": "REQUIRED: min 2 sentences"},
      {"question": "REQUIRED question 6", "answer": "REQUIRED: min 2 sentences"}
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
    "price_total": "",
    "trust_line": "",
    "cta_text": "",
    "sub_cta_text": ""
  },
  "footer": {
    "disclaimer_advertising": "",
    "disclaimer_results": "",
    "disclaimer_medical": "",
    "privacy_url": "",
    "terms_url": "",
    "copyright_text": ""
  },
  "popup": {
    "enabled": true,
    "appear_after_seconds": 8,
    "visible_seconds": 5,
    "repeat_every_seconds": 45,
    "product_image_url": "",
    "names": ["", "", "", "", ""],
    "cities": ["", "", "", "", ""]
  },
  "labels": {
    "per_bottle": "",
    "per_day": "",
    "regular_price": "",
    "only": "",
    "verified_purchase": "",
    "bundle_bonus_text": "",
    "bundle_free_shipping": "",
    "hero_tag_label": "",
    "site_title_suffix": "",
    "bonus_free_label": "",
    "privacy_label": "",
    "terms_label": "",
    "legal_label": ""
  }
}`,
});

// Ângulos de variação para garantir unicidade entre afiliados
const COPY_ANGLES = [
  'pain_focused',
  'solution_focused',
  'curiosity_driven',
  'social_proof_led',
  'urgency_scarcity',
  'transformation',
  'authority_science',
  'controversy',
];

export async function generatePresellContent(
  input: GeneratePresellContentInput
): Promise<GeneratePresellContentOutput> {
  try {
    // 1. Seed único para variação entre afiliados
    const randomAngle    = COPY_ANGLES[Math.floor(Math.random() * COPY_ANGLES.length)];
    const uniqueSeed     = `${randomAngle}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

    // 2. Extrair DNA da página oficial
    let dnaContext = '';
    let dnaData    = null;

    if (input.officialProductUrl && input.officialProductUrl.startsWith('http')) {
      console.log('[DNA] A extrair DNA de:', input.officialProductUrl);
      dnaData = await fetchProductDNA(input.officialProductUrl);
      if (dnaData.success) {
        dnaContext = await formatDNAForPrompt(dnaData);
        console.log('[DNA] Extraído. Secções:', dnaData.sections_detected);
      } else {
        console.warn('[DNA] Falhou:', dnaData.error);
      }
    }

    // 3. Seed de unicidade no contexto
    const uniquenessBlock = `
=== SEED DE UNICIDADE (OBRIGATORIO) ===
Seed: ${uniqueSeed}
Angulo principal desta presell: ${randomAngle}
Instrucao: Usa o angulo "${randomAngle}" como fio condutor de todo o copy.
======================================
`;
    dnaContext = uniquenessBlock + dnaContext;

    // 4. Chamar Gemini (single attempt)
    const { text } = await prompt({ ...input, dnaContext } as any);

    if (!text) throw new Error('Nenhum dado retornado pela IA.');

    // 5. Parse com jsonrepair
    let parsed: any;
    try {
      let raw = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      const s0 = raw.indexOf('{'), e0 = raw.lastIndexOf('}');
      if (s0 !== -1 && e0 > s0) raw = raw.slice(s0, e0 + 1);
      try {
        parsed = JSON.parse(raw);
      } catch {
        console.log('[Presell] JSON directo falhou, a usar jsonrepair...');
        parsed = JSON.parse(jsonrepair(raw));
      }
    } catch (parseErr: any) {
      console.error('[Presell] jsonrepair também falhou:', parseErr?.message);
      throw new Error('Falha ao processar resposta da IA: ' + (parseErr?.message ?? 'erro desconhecido'));
    }

    // 6. Pad missing fields silently so the page always renders
    if (!parsed.mechanism || typeof parsed.mechanism !== 'object') parsed.mechanism = {};
    if (!parsed.mechanism.headline)        parsed.mechanism.headline = '';
    if (!parsed.mechanism.subheadline)     parsed.mechanism.subheadline = '';
    if (!Array.isArray(parsed.mechanism.body_paragraphs) || parsed.mechanism.body_paragraphs.length < 3) {
      const existing = Array.isArray(parsed.mechanism.body_paragraphs) ? parsed.mechanism.body_paragraphs : [];
      while (existing.length < 3) existing.push('');
      parsed.mechanism.body_paragraphs = existing;
    }
    if (!parsed.mechanism.highlight_quote) parsed.mechanism.highlight_quote = '';

    if (!parsed.ingredients || typeof parsed.ingredients !== 'object') parsed.ingredients = {};
    if (!Array.isArray(parsed.ingredients.items)) parsed.ingredients.items = [];
    const namedIngredients = parsed.ingredients.items.filter((i: any) => i?.name);
    if (namedIngredients.length === 0) {
      console.warn('[Presell] ingredients.items vazio — a usar placeholders.');
      parsed.ingredients.items = Array.from({ length: 6 }, (_, k) => ({
        name: `Natural Ingredient ${k + 1}`,
        benefit: 'Supports overall health.',
        image_url: '',
      }));
    }

    if (!parsed.testimonials || typeof parsed.testimonials !== 'object') parsed.testimonials = {};
    if (!Array.isArray(parsed.testimonials.items)) parsed.testimonials.items = [];
    const namedTestimonials = parsed.testimonials.items.filter((i: any) => i?.name);
    if (namedTestimonials.length === 0) {
      console.warn('[Presell] testimonials.items vazio — a usar placeholders.');
      parsed.testimonials.items = Array.from({ length: 3 }, () => ({
        name: 'Verified Customer',
        location: 'United States',
        quote_title: 'Great Results',
        quote_body: 'I am very satisfied with this product. Highly recommend it.',
        photo_url: '',
      }));
    }
    while (parsed.testimonials.items.length < 3) {
      parsed.testimonials.items.push({
        name: 'Verified Customer', location: 'United States',
        quote_title: 'Great Results',
        quote_body: 'I am very satisfied with this product. Highly recommend it.',
        photo_url: '',
      });
    }

    if (!parsed.faq || typeof parsed.faq !== 'object') parsed.faq = {};
    if (!Array.isArray(parsed.faq.items)) parsed.faq.items = [];
    const namedFaq = parsed.faq.items.filter((i: any) => i?.question);
    if (namedFaq.length === 0) {
      console.warn('[Presell] faq.items vazio — a usar placeholders.');
      parsed.faq.items = [
        { question: 'What is this product?',           answer: 'This is a natural dietary supplement designed to support your health goals. It is made with high-quality ingredients.' },
        { question: 'How do I take it?',                answer: 'Take as directed on the label. Consult your healthcare provider if you have any questions.' },
        { question: 'Is it safe?',                      answer: 'Yes, this product is manufactured in a certified facility. Always read the label and consult a doctor if needed.' },
        { question: 'How long until I see results?',    answer: 'Results vary by individual. Most customers report noticeable improvements within 30 to 60 days of consistent use.' },
        { question: 'What is the return policy?',       answer: 'We offer a money-back guarantee. Contact our support team for details on how to initiate a return.' },
        { question: 'Where is it manufactured?',        answer: 'This product is manufactured in a GMP-certified facility that follows strict quality control standards.' },
      ];
    }
    while (parsed.faq.items.length < 6) {
      parsed.faq.items.push({ question: 'Have more questions?', answer: 'Contact our support team and we will be happy to help.' });
    }

    // 8. Forçar cor do DNA se disponível
    if (dnaData?.success && parsed.meta) {
      if (dnaData.primary_color && dnaData.primary_color !== '#E85D26') {
        parsed.meta.primary_color = dnaData.primary_color;
      }
    }

    // 9. Garantir ano 2026
    if (parsed.meta) {
      parsed.meta.publish_date_year = '2026';
    }
    if (parsed.footer?.copyright_text) {
      parsed.footer.copyright_text = parsed.footer.copyright_text.replace(/\d{4}/, '2026');
    }

    parsed._dna   = dnaData;
    parsed._seed  = uniqueSeed;
    parsed._angle = randomAngle;

    console.log('[Presell] Parsed JSON key structure:', JSON.stringify({
      bonuses_enabled: parsed.bonuses?.enabled,
      bonuses_items_type: Array.isArray(parsed.bonuses?.items) ? 'array' : typeof parsed.bonuses?.items,
      bonuses_items: parsed.bonuses?.items,
      ingredients_items_type: Array.isArray(parsed.ingredients?.items) ? 'array' : typeof parsed.ingredients?.items,
      ingredients_items: parsed.ingredients?.items?.map((i: any) => ({ name: i?.name, benefit: (i?.benefit ?? '').slice(0, 60) })),
    }));

    return parsed;

  } catch (error: any) {
    console.error('[Presell] Erro na geração:', error);
    throw new Error(error.message || 'Falha ao gerar conteúdo Presell.');
  }
}