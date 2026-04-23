'use server';

import * as cheerio from 'cheerio';

export interface ResearchedProduct {
  product_name: string;
  tagline: string;
  ingredients: Array<{ name: string; description: string }>;
  bonuses: Array<{ title: string; original_price: string; description: string }>;
  testimonials: Array<{ name: string; location: string; quote: string }>;
  guarantee_days: string;
  faq: Array<{ question: string; answer: string }>;
  prices: { bottle1: string; bottle3: string; bottle6: string };
  trust_badges: string[];
  source_url: string;
  success: boolean;
  error?: string;
}

// Build a prompt-ready block of verified data for merging into Gemini input
export function formatResearchForPrompt(data: ResearchedProduct): string {
  if (!data.success) return '';

  const lines: string[] = [
    '=== DADOS VERIFICADOS DO PRODUTO (PRIORIDADE MÁXIMA — NÃO ALTERAR) ===',
    `Produto: ${data.product_name}`,
    `Tagline: ${data.tagline}`,
    `Garantia: ${data.guarantee_days} dias`,
    '',
  ];

  if (data.ingredients.length > 0) {
    lines.push('INGREDIENTES (usar EXACTAMENTE estes nomes e descrições):');
    data.ingredients.forEach((ing, i) => {
      lines.push(`  ${i + 1}. ${ing.name}: ${ing.description}`);
    });
    lines.push('');
  }

  if (data.bonuses.length > 0) {
    lines.push('BÓNUS (usar EXACTAMENTE estes títulos e preços):');
    data.bonuses.forEach((b, i) => {
      lines.push(`  ${i + 1}. ${b.title} — Valor: ${b.original_price} — ${b.description}`);
    });
    lines.push('');
  }

  if (data.testimonials.length > 0) {
    lines.push('TESTEMUNHOS REAIS (usar estes nomes e localidades):');
    data.testimonials.forEach((t, i) => {
      lines.push(`  ${i + 1}. ${t.name} (${t.location}): "${t.quote}"`);
    });
    lines.push('');
  }

  if (data.faq.length > 0) {
    lines.push('FAQ EXTRAÍDO DA PÁGINA OFICIAL:');
    data.faq.forEach((f, i) => {
      lines.push(`  Q${i + 1}: ${f.question}`);
      lines.push(`  A${i + 1}: ${f.answer}`);
    });
    lines.push('');
  }

  if (data.prices.bottle1 || data.prices.bottle3 || data.prices.bottle6) {
    lines.push('PREÇOS REAIS (usar EXACTAMENTE):');
    if (data.prices.bottle1) lines.push(`  1 frasco: ${data.prices.bottle1}/frasco`);
    if (data.prices.bottle3) lines.push(`  3 frascos: ${data.prices.bottle3}/frasco`);
    if (data.prices.bottle6) lines.push(`  6 frascos: ${data.prices.bottle6}/frasco`);
    lines.push('');
  }

  lines.push('=======================================================================');
  return lines.join('\n');
}

// ── Extraction helpers ────────────────────────────────────────────────────────

function extractIngredients($: cheerio.CheerioAPI): Array<{ name: string; description: string }> {
  const results: Array<{ name: string; description: string }> = [];
  const seen = new Set<string>();

  // Strategy 1: sections with class/id containing "ingredient"
  $('[class*="ingredient" i], [id*="ingredient" i]').each((_, el) => {
    const $el = $(el);
    const name = $el.find('h3, h4, strong, .name, .title').first().text().trim();
    const desc = $el.find('p, .description, .benefit').first().text().trim();
    if (name && name.length > 2 && !seen.has(name.toLowerCase())) {
      seen.add(name.toLowerCase());
      results.push({ name, description: desc.slice(0, 300) });
    }
  });

  // Strategy 2: list items near "ingredient" heading
  if (results.length === 0) {
    $('h2, h3, h4').each((_, heading) => {
      if (/ingredient|formula|blend/i.test($(heading).text())) {
        $(heading).nextAll('ul, ol').first().find('li').each((_, li) => {
          const text = $(li).text().trim();
          const colonIdx = text.indexOf(':');
          if (colonIdx > 0) {
            const name = text.slice(0, colonIdx).trim();
            const desc = text.slice(colonIdx + 1).trim();
            if (name && !seen.has(name.toLowerCase())) {
              seen.add(name.toLowerCase());
              results.push({ name, description: desc.slice(0, 300) });
            }
          }
        });
      }
    });
  }

  return results.slice(0, 12);
}

function extractBonuses($: cheerio.CheerioAPI): Array<{ title: string; original_price: string; description: string }> {
  const results: Array<{ title: string; original_price: string; description: string }> = [];
  const seen = new Set<string>();

  $('[class*="bonus" i], [id*="bonus" i]').each((_, el) => {
    const $el = $(el);
    const title = $el.find('h3, h4, strong, .title, .name').first().text().trim();
    const desc = $el.find('p, .description').first().text().trim();
    const priceText = $el.text();
    const priceMatch = priceText.match(/\$\s*(\d+(?:\.\d{2})?)/);
    const price = priceMatch ? `$${priceMatch[1]}` : '';
    if (title && title.length > 2 && !seen.has(title.toLowerCase())) {
      seen.add(title.toLowerCase());
      results.push({ title, original_price: price, description: desc.slice(0, 200) });
    }
  });

  // Fallback: headings near "bonus" keyword
  if (results.length === 0) {
    $('h2, h3, h4').each((_, heading) => {
      if (/bonus|b[oô]nus|free gift/i.test($(heading).text())) {
        const $section = $(heading).nextAll().slice(0, 6);
        $section.find('h3, h4, strong').each((_, el) => {
          const title = $(el).text().trim();
          if (title && !seen.has(title.toLowerCase())) {
            seen.add(title.toLowerCase());
            results.push({ title, original_price: '', description: '' });
          }
        });
      }
    });
  }

  return results.slice(0, 6);
}

function extractTestimonials($: cheerio.CheerioAPI): Array<{ name: string; location: string; quote: string }> {
  const results: Array<{ name: string; location: string; quote: string }> = [];
  const seen = new Set<string>();

  $('[class*="testimonial" i], [class*="review" i], [id*="testimonial" i]').each((_, el) => {
    const $el = $(el);
    const name = $el.find('.name, .author, strong, [class*="name"]').first().text().trim();
    const location = $el.find('.location, .city, [class*="location"]').first().text().trim();
    const quote = $el.find('p, blockquote, .quote, [class*="quote"]').first().text().trim();
    if (name && name.length > 1 && !seen.has(name.toLowerCase())) {
      seen.add(name.toLowerCase());
      results.push({ name, location, quote: quote.slice(0, 400) });
    }
  });

  return results.slice(0, 6);
}

function extractFAQ($: cheerio.CheerioAPI): Array<{ question: string; answer: string }> {
  const results: Array<{ question: string; answer: string }> = [];

  // Accordion pattern
  $('[class*="faq" i], [class*="accordion" i]').each((_, el) => {
    const $el = $(el);
    const question = $el.find('h3, h4, button, .question, [class*="question"]').first().text().trim();
    const answer = $el.find('p, .answer, [class*="answer"]').first().text().trim();
    if (question && question.includes('?')) {
      results.push({ question, answer: answer.slice(0, 500) });
    }
  });

  // dt/dd pairs
  if (results.length === 0) {
    $('dl').each((_, dl) => {
      const $dl = $(dl);
      const dts = $dl.find('dt').toArray();
      const dds = $dl.find('dd').toArray();
      dts.forEach((dt, i) => {
        const question = $(dt).text().trim();
        const answer = dds[i] ? $(dds[i]).text().trim() : '';
        if (question) results.push({ question, answer: answer.slice(0, 500) });
      });
    });
  }

  return results.slice(0, 10);
}

function extractPrices(html: string): { bottle1: string; bottle3: string; bottle6: string } {
  const prices = { bottle1: '', bottle3: '', bottle6: '' };
  const matches = [...html.matchAll(/\$\s*(\d{1,3}(?:\.\d{2})?)/g)]
    .map(m => parseFloat(m[1]))
    .filter(p => p > 10 && p < 500);

  const unique = [...new Set(matches)].sort((a, b) => a - b);
  if (unique.length >= 3) {
    prices.bottle6 = `$${unique[0].toFixed(2)}`;
    prices.bottle3 = `$${unique[1].toFixed(2)}`;
    prices.bottle1 = `$${unique[2].toFixed(2)}`;
  } else if (unique.length === 2) {
    prices.bottle6 = `$${unique[0].toFixed(2)}`;
    prices.bottle1 = `$${unique[1].toFixed(2)}`;
  } else if (unique.length === 1) {
    prices.bottle6 = `$${unique[0].toFixed(2)}`;
  }
  return prices;
}

function extractGuarantee(html: string): string {
  const match = html.match(/(\d+)[- ](?:day|dias?)[- ](?:money[- ]back|guarantee|garantia)/i);
  return match ? match[1] : '180';
}

function extractTrustBadges($: cheerio.CheerioAPI): string[] {
  const badges: string[] = [];
  const patterns = [
    /100%\s+natural/i, /gmp\s+certified/i, /fda\s+(?:approved|registered)/i,
    /non[- ]gmo/i, /gluten[- ]free/i, /made\s+in\s+(?:the\s+)?usa/i,
    /third[- ]party\s+tested/i, /vegan/i,
  ];
  const text = $.root().text();
  for (const p of patterns) {
    const m = text.match(p);
    if (m) badges.push(m[0].trim());
  }
  return badges;
}

// ── Main exported function ────────────────────────────────────────────────────

export async function researchProduct(url: string): Promise<ResearchedProduct> {
  const empty: ResearchedProduct = {
    product_name: '', tagline: '', ingredients: [], bonuses: [],
    testimonials: [], guarantee_days: '180', faq: [],
    prices: { bottle1: '', bottle3: '', bottle6: '' },
    trust_badges: [], source_url: url, success: false,
  };

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove noise
    $('script, style, noscript, iframe, svg').remove();

    const titleEl = $('title').text().replace(/\s*[-|–]\s*.+$/, '').replace(/™|®/g, '').trim();
    const h1El = $('h1').first().text().trim();
    const product_name = titleEl || h1El || '';

    const metaDesc = $('meta[name="description"]').attr('content') || '';

    const ingredients = extractIngredients($);
    const bonuses = extractBonuses($);
    const testimonials = extractTestimonials($);
    const faq = extractFAQ($);
    const prices = extractPrices(html);
    const guarantee_days = extractGuarantee(html);
    const trust_badges = extractTrustBadges($);

    console.log('[ResearchProduct] Scraped:', {
      url, product_name,
      ingredients: ingredients.length,
      bonuses: bonuses.length,
      testimonials: testimonials.length,
      faq: faq.length,
    });

    return {
      ...empty,
      product_name,
      tagline: metaDesc.slice(0, 200),
      ingredients,
      bonuses,
      testimonials,
      guarantee_days,
      faq,
      prices,
      trust_badges,
      success: true,
    };

  } catch (err: any) {
    console.error('[ResearchProduct] Error:', err.message);
    return { ...empty, success: false, error: err.message };
  }
}
