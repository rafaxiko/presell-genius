'use server';

export interface ProductDNA {
  primary_color: string;
  secondary_color: string;
  background_color: string;
  text_color: string;
  font_heading: string;
  font_body: string;
  product_name: string;
  logo_text: string;
  tagline: string;
  price_1_bottles: string;
  price_1_per_bottle: string;
  price_1_total: string;
  price_3_bottles: string;
  price_3_per_bottle: string;
  price_3_total: string;
  price_6_bottles: string;
  price_6_per_bottle: string;
  price_6_total: string;
  guarantee_days: string;
  free_shipping: boolean;
  hero_headline: string;
  hero_subheadline: string;
  cta_text: string;
  trust_badges: string[];
  quality_seals: string[];
  sections_detected: string[];
  html_context: string;
  source_url: string;
  // Imagens extraídas (URLs originais)
  image_hero: string;
  image_bundle_1: string;
  image_bundle_3: string;
  image_bundle_6: string;
  images_ingredients: string[];
  images_bonuses: string[];
  image_guarantee: string;
  image_payment: string;
  success: boolean;
  error?: string;
}

// ── Proxy helper ─────────────────────────────────────────────────────────────
function proxyUrl(originalUrl: string, baseOrigin: string): string {
  if (!originalUrl || originalUrl.startsWith('data:')) return originalUrl;
  
  // Converter URLs relativas para absolutas
  let absolute = originalUrl;
  if (originalUrl.startsWith('//')) {
    absolute = 'https:' + originalUrl;
  } else if (originalUrl.startsWith('/')) {
    absolute = baseOrigin + originalUrl;
  } else if (!originalUrl.startsWith('http')) {
    absolute = baseOrigin + '/' + originalUrl;
  }
  
  return `/api/imgproxy?url=${encodeURIComponent(absolute)}`;
}

// ── Extracção de cor melhorada ────────────────────────────────────────────────
function extractPrimaryColor(html: string, css: string): string {
  const allContent = html + css;

  // 1. CSS Variables — mais fiável
  const varPatterns = [
    /--(?:primary|brand|main|accent|color-primary)[^:]*:\s*(#[0-9a-fA-F]{6})/gi,
    /--(?:btn|button|cta)[^:]*color[^:]*:\s*(#[0-9a-fA-F]{6})/gi,
  ];
  for (const pattern of varPatterns) {
    const match = allContent.match(pattern);
    if (match) {
      const colorMatch = match[0].match(/#[0-9a-fA-F]{6}/);
      if (colorMatch && !isNeutralColor(colorMatch[0])) return colorMatch[0];
    }
  }

  // 2. Cor de fundo do hero/header
  const heroPatterns = [
    /(?:hero|header|banner|section)[^{]*\{[^}]*background(?:-color)?:\s*(#[0-9a-fA-F]{6})/gi,
  ];
  for (const pattern of heroPatterns) {
    const matches = [...allContent.matchAll(pattern)];
    for (const match of matches) {
      if (match[1] && !isNeutralColor(match[1])) return match[1];
    }
  }

  // 3. Cor dos botões CTA
  const btnMatches = [...allContent.matchAll(/(?:\.btn|\.button|\.cta|btn-primary)[^{]*\{[^}]*background(?:-color)?:\s*(#[0-9a-fA-F]{6})/gi)];
  for (const match of btnMatches) {
    if (match[1] && !isNeutralColor(match[1])) return match[1];
  }

  // 4. Qualquer cor com alta saturação (não branco/preto/cinza)
  const allColors = [...allContent.matchAll(/#([0-9a-fA-F]{6})\b/g)]
    .map(m => '#' + m[1])
    .filter(c => !isNeutralColor(c));
  
  // Conta frequência de cada cor
  const colorFreq: Record<string, number> = {};
  for (const color of allColors) {
    colorFreq[color] = (colorFreq[color] || 0) + 1;
  }
  
  // Retorna a cor mais frequente que não é neutra
  const sorted = Object.entries(colorFreq).sort((a, b) => b[1] - a[1]);
  if (sorted.length > 0) return sorted[0][0];

  return '#E85D26'; // Fallback laranja nutra
}

// Verifica se a cor é neutra (branco, preto, cinza)
function isNeutralColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // Branco/quase branco
  if (r > 220 && g > 220 && b > 220) return true;
  // Preto/quase preto
  if (r < 30 && g < 30 && b < 30) return true;
  // Cinza (r≈g≈b)
  const avg = (r + g + b) / 3;
  const variance = Math.max(Math.abs(r - avg), Math.abs(g - avg), Math.abs(b - avg));
  if (variance < 20) return true;
  
  return false;
}

// ── Extracção de imagens ──────────────────────────────────────────────────────
function extractImages(html: string, baseOrigin: string): {
  hero: string;
  bundle1: string;
  bundle3: string;
  bundle6: string;
  ingredients: string[];
  bonuses: string[];
  guarantee: string;
  payment: string;
} {
  const result = {
    hero: '', bundle1: '', bundle3: '', bundle6: '',
    ingredients: [] as string[], bonuses: [] as string[],
    guarantee: '', payment: '',
  };

  // Extrai todos os img src
  const imgMatches = [...html.matchAll(/<img[^>]+src=['"']([^'"']+)['"'][^>]*(?:alt=['"']([^'"']*)['"'])?[^>]*>/gi)];
  
  for (const match of imgMatches) {
    const src = match[1] || '';
    const alt = (match[2] || '').toLowerCase();
    const srcLower = src.toLowerCase();
    
    if (!src || src.startsWith('data:') || src.includes('pixel') || src.includes('tracking')) continue;

    // Identificar por alt text e nome do ficheiro
    if (!result.hero && (alt.includes('hero') || srcLower.includes('hero') || alt.includes('main') || srcLower.includes('main-product'))) {
      result.hero = proxyUrl(src, baseOrigin);
    }
    
    if (!result.bundle6 && (alt.includes('6') || srcLower.includes('-6') || alt.includes('six'))) {
      result.bundle6 = proxyUrl(src, baseOrigin);
    }
    
    if (!result.bundle3 && (alt.includes('3') || srcLower.includes('-3') || alt.includes('three'))) {
      result.bundle3 = proxyUrl(src, baseOrigin);
    }
    
    if (!result.bundle1 && (alt.includes('1') || srcLower.includes('-1') || alt.includes('one bottle') || srcLower.includes('single'))) {
      result.bundle1 = proxyUrl(src, baseOrigin);
    }

    if (alt.includes('ingredient') || srcLower.includes('ingredient') || 
        alt.includes('herb') || alt.includes('extract')) {
      result.ingredients.push(proxyUrl(src, baseOrigin));
    }

    if (alt.includes('bonus') || srcLower.includes('bonus') || 
        alt.includes('ebook') || alt.includes('guide')) {
      result.bonuses.push(proxyUrl(src, baseOrigin));
    }

    if (!result.guarantee && (alt.includes('guarantee') || alt.includes('money') || 
        srcLower.includes('guarantee') || srcLower.includes('seal'))) {
      result.guarantee = proxyUrl(src, baseOrigin);
    }

    if (!result.payment && (alt.includes('payment') || alt.includes('visa') || 
        alt.includes('mastercard') || srcLower.includes('payment') || srcLower.includes('secure'))) {
      result.payment = proxyUrl(src, baseOrigin);
    }
  }

  // Se não encontrou hero, tenta a primeira imagem grande do produto
  if (!result.hero) {
    const productName = extractProductNameSimple(html);
    for (const match of imgMatches) {
      const src = match[1] || '';
      const alt = (match[2] || '').toLowerCase();
      if (alt.includes(productName.toLowerCase()) || src.toLowerCase().includes('product')) {
        result.hero = proxyUrl(src, baseOrigin);
        break;
      }
    }
  }

  return result;
}

function extractProductNameSimple(html: string): string {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    return titleMatch[1].replace(/\s*[-|–]\s*.+$/, '').replace(/™|®/g, '').trim().substring(0, 30);
  }
  return 'product';
}

// ── Extracção de fontes ───────────────────────────────────────────────────────
function extractFonts(html: string): { heading: string; body: string } {
  const fonts = { heading: 'Poppins', body: 'Inter' };
  const gfMatch = html.match(/fonts\.googleapis\.com\/css2?\?family=([^"&\s]+)/i);
  if (gfMatch) {
    const families = decodeURIComponent(gfMatch[1]).split('|').map(f => f.split(':')[0].replace(/\+/g, ' '));
    if (families[0]) fonts.heading = families[0];
    if (families[1]) fonts.body = families[1];
  }
  return fonts;
}

// ── Extracção de preços ───────────────────────────────────────────────────────
function extractPricing(html: string): Partial<ProductDNA> {
  const pricing: Partial<ProductDNA> = {
    price_1_bottles: '1', price_3_bottles: '3', price_6_bottles: '6',
    guarantee_days: '180', free_shipping: false,
  };

  const priceMatches = [...html.matchAll(/\$\s*(\d{1,3}(?:\.\d{2})?)/g)];
  const prices = priceMatches
    .map(m => parseFloat(m[1]))
    .filter(p => p > 10 && p < 500)
    .sort((a, b) => a - b);

  // Remove duplicados
  const uniquePrices = [...new Set(prices)];

  if (uniquePrices.length >= 3) {
    pricing.price_6_per_bottle = `$${uniquePrices[0].toFixed(2)}`;
    pricing.price_3_per_bottle = `$${uniquePrices[1].toFixed(2)}`;
    pricing.price_1_per_bottle = `$${uniquePrices[2].toFixed(2)}`;
  } else if (uniquePrices.length === 2) {
    pricing.price_6_per_bottle = `$${uniquePrices[0].toFixed(2)}`;
    pricing.price_1_per_bottle = `$${uniquePrices[1].toFixed(2)}`;
  } else if (uniquePrices.length === 1) {
    pricing.price_6_per_bottle = `$${uniquePrices[0].toFixed(2)}`;
  }

  const guaranteeMatch = html.match(/(\d+)[- ](?:day|dias?)[- ](?:money[- ]back|guarantee|garantia)/i);
  if (guaranteeMatch) pricing.guarantee_days = guaranteeMatch[1];

  if (/free\s+(?:usa\s+)?shipping|frete\s+gr[aá]tis/i.test(html)) {
    pricing.free_shipping = true;
  }

  return pricing;
}

// ── Extracção de copy ─────────────────────────────────────────────────────────
function extractCopy(html: string): { headline: string; subheadline: string; cta: string; tagline: string } {
  const copy = { headline: '', subheadline: '', cta: '', tagline: '' };
  const clean = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  const h1Match = clean.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) copy.headline = h1Match[1].replace(/<[^>]+>/g, '').trim().substring(0, 200);

  const h2Match = clean.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  if (h2Match) copy.subheadline = h2Match[1].replace(/<[^>]+>/g, '').trim().substring(0, 300);

  const ctaMatch = clean.match(/<(?:button|a)[^>]*(?:btn|cta|order|buy|claim|get)[^>]*>([\s\S]*?)<\/(?:button|a)>/i);
  if (ctaMatch) copy.cta = ctaMatch[1].replace(/<[^>]+>/g, '').trim().substring(0, 100);

  const metaMatch = html.match(/<meta[^>]*name=['"']description['"'][^>]*content=['"']([^'"']+)['"']/i);
  if (metaMatch) copy.tagline = metaMatch[1].substring(0, 200);

  return copy;
}

// ── Secções detectadas ────────────────────────────────────────────────────────
function detectSections(html: string): string[] {
  const sections: string[] = [];
  const checks = [
    { pattern: /ingredient|formula|blend/i, name: 'ingredients' },
    { pattern: /bonus|b[oô]nus|free gift/i, name: 'bonuses' },
    { pattern: /testimonial|review|customer/i, name: 'testimonials' },
    { pattern: /guarantee|money.back|garantia/i, name: 'guarantee' },
    { pattern: /faq|frequently asked/i, name: 'faq' },
    { pattern: /how it works|mechanism/i, name: 'mechanism' },
    { pattern: /doctor|scientist|md\b/i, name: 'authority' },
    { pattern: /video|vsl/i, name: 'vsl' },
  ];
  for (const check of checks) {
    if (check.pattern.test(html)) sections.push(check.name);
  }
  return sections;
}

// ── Trust elements ────────────────────────────────────────────────────────────
function extractTrustElements(html: string): string[] {
  const badges: string[] = [];
  const patterns = [
    /100%\s+natural/i, /gmp\s+certified/i, /fda\s+(?:approved|registered)/i,
    /non[- ]gmo/i, /gluten[- ]free/i, /made\s+in\s+(?:the\s+)?usa/i,
    /third[- ]party\s+tested/i, /all[- ]natural/i, /vegan/i,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) badges.push(match[0].trim());
  }
  return badges;
}

// ── HTML simplificado para contexto da IA ────────────────────────────────────
function simplifyHTML(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '')
    .replace(/<img[^>]*>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s{3,}/g, '\n')
    .trim()
    .substring(0, 8000);
}

// ── Função principal ──────────────────────────────────────────────────────────
export async function fetchProductDNA(url: string): Promise<ProductDNA> {
  const defaultDNA: ProductDNA = {
    primary_color: '#E85D26', secondary_color: '#1A1A2E',
    background_color: '#FFFFFF', text_color: '#1F2937',
    font_heading: 'Poppins', font_body: 'Inter',
    product_name: '', logo_text: '', tagline: '',
    price_1_bottles: '1', price_1_per_bottle: '', price_1_total: '',
    price_3_bottles: '3', price_3_per_bottle: '', price_3_total: '',
    price_6_bottles: '6', price_6_per_bottle: '', price_6_total: '',
    guarantee_days: '180', free_shipping: false,
    hero_headline: '', hero_subheadline: '', cta_text: '',
    trust_badges: [], quality_seals: [], sections_detected: [],
    html_context: '', source_url: url,
    image_hero: '', image_bundle_1: '', image_bundle_3: '', image_bundle_6: '',
    images_ingredients: [], images_bonuses: [],
    image_guarantee: '', image_payment: '',
    success: false,
  };

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const html = await response.text();
    const baseOrigin = new URL(url).origin;

    // Extrai CSS inline para análise de cor
    const inlineCSS = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
      .map(m => m[1]).join('\n');

    const primaryColor = extractPrimaryColor(html, inlineCSS);
    const fonts = extractFonts(html);
    const pricing = extractPricing(html);
    const copy = extractCopy(html);
    const sections = detectSections(html);
    const trust = extractTrustElements(html);
    const images = extractImages(html, baseOrigin);
    const productName = extractProductNameSimple(html);
    const htmlContext = simplifyHTML(html);

    return {
      ...defaultDNA,
      ...pricing,
      primary_color: primaryColor,
      font_heading: fonts.heading,
      font_body: fonts.body,
      product_name: productName,
      logo_text: productName,
      tagline: copy.tagline,
      hero_headline: copy.headline,
      hero_subheadline: copy.subheadline,
      cta_text: copy.cta,
      trust_badges: trust,
      sections_detected: sections,
      html_context: htmlContext,
      image_hero: images.hero,
      image_bundle_1: images.bundle1,
      image_bundle_3: images.bundle3,
      image_bundle_6: images.bundle6,
      images_ingredients: images.ingredients,
      images_bonuses: images.bonuses,
      image_guarantee: images.guarantee,
      image_payment: images.payment,
      source_url: url,
      success: true,
    };

  } catch (error: any) {
    console.error('[fetchProductDNA] Erro:', error.message);
    return { ...defaultDNA, success: false, error: error.message };
  }
}

// ── Formata DNA para o prompt da IA ──────────────────────────────────────────
export async function formatDNAForPrompt(dna: ProductDNA): Promise<string> {
  if (!dna.success) return '';

  return `
=== DNA VISUAL DA PÁGINA OFICIAL ===
URL: ${dna.source_url}
Produto: ${dna.product_name}
Cor Principal: ${dna.primary_color}
Fonte Títulos: ${dna.font_heading}
Fonte Corpo: ${dna.font_body}

=== PREÇOS EXTRAÍDOS (usar EXACTAMENTE estes valores) ===
1 Frasco: ${dna.price_1_per_bottle} por frasco
3 Frascos: ${dna.price_3_per_bottle} por frasco  
6 Frascos: ${dna.price_6_per_bottle} por frasco
Garantia: ${dna.guarantee_days} dias
Frete Grátis: ${dna.free_shipping ? 'Sim' : 'Não'}

=== COPY ORIGINAL (manter tom e estilo) ===
Headline: ${dna.hero_headline}
Subheadline: ${dna.hero_subheadline}
CTA: ${dna.cta_text}
Tagline: ${dna.tagline}

=== IMAGENS EXTRAÍDAS (usar estes URLs directamente) ===
Hero/Produto Principal: ${dna.image_hero || '(não encontrada)'}
Kit 1 Frasco: ${dna.image_bundle_1 || '(não encontrada)'}
Kit 3 Frascos: ${dna.image_bundle_3 || '(não encontrada)'}
Kit 6 Frascos: ${dna.image_bundle_6 || '(não encontrada)'}
Garantia: ${dna.image_guarantee || '(não encontrada)'}
Pagamento: ${dna.image_payment || '(não encontrada)'}
Ingredientes: ${dna.images_ingredients.slice(0, 6).join(', ') || '(não encontradas)'}
Bónus: ${dna.images_bonuses.slice(0, 5).join(', ') || '(não encontrados)'}

=== TRUST ELEMENTS ===
${dna.trust_badges.join(', ') || 'não detectados'}

=== SECÇÕES DETECTADAS ===
${dna.sections_detected.join(', ')}

=== CONTEÚDO DA PÁGINA ===
${dna.html_context}
===================================
`;
}