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
9. RATING: Sempre preencha rating (ex: "4.9") e review_count (ex: "10,847"). NUNCA deixe vazios.
10. POPUP: Sempre preencha popup.names e popup.cities com 5 nomes/cidades reais do pais alvo.
11. NAVBAR: Os campos nav_link_1, nav_link_2, nav_link_3 e nav_cta no idioma de {{{targetLanguage}}}.
12. LABELS: Preencha TODOS os campos do objecto "labels" no idioma de {{{targetLanguage}}}.
    - bonus_free_label: texto para bonus gratis (ex: "FREE", "GRÁTIS")
    - privacy_label: texto para privacidade (ex: "Privacy Policy", "Política de Privacidade")
    - terms_label: texto para termos (ex: "Terms", "Termos")
13. UNICIDADE OBRIGATORIA: Esta presell DEVE ser unica. Usa o seed de variacao fornecido no contexto.

=== CAMPOS ABSOLUTAMENTE OBRIGATORIOS — NUNCA OMITIR ===

14. INGREDIENTS (OBRIGATORIO): O objecto "ingredients" DEVE ter "items" com EXACTAMENTE 6 entradas.
    Cada entrada DEVE ter "name" (string nao vazia) e "benefit" (string nao vazia, minimo 1 frase).
    NUNCA retorne ingredients.items vazio ou com menos de 6 itens. Se os dados nao especificam
    ingredientes, use ingredientes tipicos do nicho do produto.

15. TESTIMONIALS (OBRIGATORIO): O objecto "testimonials" DEVE ter "items" com EXACTAMENTE 3 entradas.
    Cada entrada DEVE ter: "name" (string), "location" (cidade, estado/pais), "quote_title" (titulo
    curto da opiniao), "quote_body" (texto completo, minimo 2 frases). NUNCA omita ou deixe vazios.

16. FAQ (OBRIGATORIO): O objecto "faq" DEVE ter "items" com EXACTAMENTE 6 entradas.
    Cada entrada DEVE ter "question" (string nao vazia) e "answer" (string nao vazia, minimo 2 frases).
    NUNCA retorne faq.items vazio ou com menos de 6 itens.

17. MECHANISM (OBRIGATORIO): O objecto "mechanism" DEVE ter:
    - "headline": string nao vazia
    - "subheadline": string nao vazia
    - "body_paragraphs": array com EXACTAMENTE 3 strings nao vazias (cada uma minimo 2 frases)
    - "highlight_quote": string nao vazia
    NUNCA omita o mechanism nem deixe campos vazios.

VERIFICACAO FINAL OBRIGATORIA antes de responder:
- ingredients.items tem exactamente 6 itens com name e benefit preenchidos? SIM/NAO
- testimonials.items tem exactamente 3 itens com name, location, quote_title, quote_body preenchidos? SIM/NAO
- faq.items tem exactamente 6 itens com question e answer preenchidos? SIM/NAO
- mechanism tem headline, subheadline, body_paragraphs (3 itens) e highlight_quote preenchidos? SIM/NAO
Se qualquer resposta for NAO, corrija antes de enviar.
=======================================================

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

    // 4. Chamar Gemini
    const { text } = await prompt({
      ...input,
      dnaContext,
    } as any);

    if (!text) throw new Error('Nenhum dado retornado pela IA.');

    // 5. Parse com jsonrepair — biblioteca especializada em JSON de LLMs
    let parsed: any;
    try {
      let raw = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      const s0 = raw.indexOf('{'), e0 = raw.lastIndexOf('}');
      if (s0 !== -1 && e0 > s0) raw = raw.slice(s0, e0 + 1);

      // Tentativa 1: parse directo (mais rápido)
      try {
        parsed = JSON.parse(raw);
      } catch {
        // Tentativa 2: jsonrepair corrige aspas, vírgulas, emojis e outros problemas
        console.log('[Presell] JSON directo falhou, a usar jsonrepair...');
        const repaired = jsonrepair(raw);
        parsed = JSON.parse(repaired);
      }
    } catch (parseErr: any) {
      console.error('[Presell] jsonrepair também falhou:', parseErr?.message);
      throw new Error('Falha ao processar resposta da IA: ' + (parseErr?.message ?? 'erro desconhecido'));
    }

    // 6. Enforce required fields — guard against Gemini omitting them
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
    if (!Array.isArray(parsed.ingredients.items) || parsed.ingredients.items.length < 1) {
      parsed.ingredients.items = [];
    }

    if (!parsed.testimonials || typeof parsed.testimonials !== 'object') parsed.testimonials = {};
    if (!Array.isArray(parsed.testimonials.items) || parsed.testimonials.items.length < 1) {
      parsed.testimonials.items = [];
    }
    while (parsed.testimonials.items.length < 3) {
      parsed.testimonials.items.push({ name: '', location: '', quote_title: '', quote_body: '' });
    }

    if (!parsed.faq || typeof parsed.faq !== 'object') parsed.faq = {};
    if (!Array.isArray(parsed.faq.items) || parsed.faq.items.length < 1) {
      parsed.faq.items = [];
    }
    while (parsed.faq.items.length < 6) {
      parsed.faq.items.push({ question: '', answer: '' });
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

    return parsed;

  } catch (error: any) {
    console.error('[Presell] Erro na geração:', error);
    throw new Error(error.message || 'Falha ao gerar conteúdo Presell.');
  }
}