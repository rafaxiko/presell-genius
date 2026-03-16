export type PricingOption = {
  quantity: string;
  unitName?: string;
  price: string;
  totalPrice?: string;
  savings?: string;
  isBestValue: boolean;
  isMostPopular?: boolean;
};

export type Testimonial = {
  name: string;
  text: string;
  location: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type Ingredient = {
  name: string;
  description: string;
};

export type Bonus = {
  title: string;
  value: string;
  description: string;
  enabled: boolean;
};

export type PresellData = {
  productName: string;
  headline: string;
  subheadline?: string;
  editorialIntro: string;
  quickSummary: string;
  patternInterrupt: string;
  problemsSection: string;
  whatIsSection: string;
  curiosityBridge: string;
  features: string[];
  benefits: string[];
  pricing?: PricingOption[];
  testimonials?: Testimonial[];
  faq_items?: FAQItem[];
  ingredients?: Ingredient[];
  bonuses?: Bonus[];
  callToAction: string;
  buttonColor: string;
  primaryColor?: string;
  targetUrl: string;
  productImageUrls?: string[];
  trackingLink?: string;
  clarityScript?: string;
  templateType: 'Lançamento' | 'Robusta' | 'Review' | 'Cookie' | 'Lista (Top 3/5)';
  copyStyle: 'White Hat (Conservador)' | 'Black Hat (Agressivo)';
  targetLanguage?: string;
};

export function generatePresellHTML(data: PresellData | null): string {
  if (!data) return '';

  const { 
    productName, headline, subheadline, editorialIntro, quickSummary, 
    problemsSection, whatIsSection, pricing = [], testimonials = [],
    faq_items = [], ingredients = [], bonuses = [],
    callToAction, buttonColor, targetUrl, productImageUrls = [],
    primaryColor: brandColor, copyStyle
  } = data;
  
  const ctaColor = '#FF8C00'; // Vibrant Orange for CTAs
  const primaryBrandColor = brandColor || buttonColor || '#2952A3';
  const isBlackHat = copyStyle === 'Black Hat (Agressivo)';

  const renderImage = (index: number, alt: string) => {
    if (productImageUrls && productImageUrls[index]) {
      return `<img src="${productImageUrls[index]}" alt="${alt}" style="max-width: 100%; height: auto; border-radius: 12px; display: block; margin: 0 auto;">`;
    }
    return `
      <div style="width: 100%; aspect-ratio: 1/1; background: #F3F4F6; border: 1px dashed #D1D5DB; border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #9CA3AF;">
        <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="1.5" fill="none" style="opacity: 0.5; margin-bottom: 8px;">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <span style="font-size: 11px; font-weight: 800; text-transform: uppercase;">Mídia do Produto</span>
      </div>
    `;
  };

  const css = `
    :root { 
      --primary: ${primaryBrandColor}; 
      --cta: ${ctaColor};
      --navy: #111827;
      --gray: #4B5563;
      --light-gray: #F9FAFB;
      --white: #ffffff;
    }
    body { font-family: 'Inter', sans-serif; margin: 0; color: var(--gray); background: #fff; line-height: 1.6; }
    .container { max-width: 1000px; margin: 0 auto; padding: 0 20px; }
    section { padding: 80px 0; }
    .section-white { background: var(--white); border-bottom: 1px solid #f1f1f1; }
    .section-gray { background: var(--light-gray); border-bottom: 1px solid #f1f1f1; }
    h1, h2, h3 { color: var(--navy); font-weight: 800; }
    h1 { font-size: 42px; line-height: 1.1; margin-bottom: 24px; text-transform: uppercase; }
    h2 { font-size: 32px; text-align: center; margin-bottom: 40px; }
    .hero { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; padding: 60px 0; }
    @media (max-width: 768px) { .hero { grid-template-columns: 1fr; text-align: center; } h1 { font-size: 32px; } }
    .btn { 
      display: inline-block; width: 100%; padding: 22px; background: var(--cta); color: #fff; 
      text-align: center; text-decoration: none; font-weight: 900; font-size: 20px; 
      border-radius: 12px; box-shadow: 0 10px 25px rgba(255, 140, 0, 0.3); 
      transition: all 0.2s; animation: pulse 2s infinite; cursor: pointer; border: none;
    }
    .btn:hover { transform: scale(1.05); filter: brightness(1.1); }
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(255, 140, 0, 0.5); } 70% { box-shadow: 0 0 0 15px rgba(255, 140, 0, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 140, 0, 0); } }
    
    .pricing-grid { display: grid; gap: 24px; margin-top: 40px; align-items: flex-end; }
    @media (min-width: 768px) { .pricing-grid { grid-template-columns: repeat(3, 1fr); } }
    .price-card { background: #fff; border: 1px solid #E5E7EB; border-radius: 20px; padding: 40px 24px; text-align: center; position: relative; transition: all 0.3s; display: flex; flex-direction: column; }
    .price-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.1); }
    .price-card.featured { border: 3px solid var(--primary); transform: scale(1.05); z-index: 10; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
    @media (max-width: 768px) { 
      .price-card.featured { transform: scale(1); margin-bottom: 20px; order: 1 !important; } 
      .price-card.popular { order: 2 !important; }
      .price-card:not(.featured):not(.popular) { order: 3 !important; }
    }
    .price-card .qty { font-size: 15px; font-weight: 800; color: var(--navy); text-transform: uppercase; margin-bottom: 10px; }
    .price-card .price { font-size: 38px; font-weight: 900; color: var(--navy); margin: 16px 0; }
    .price-card .savings { background: #DCFCE7; color: #166534; font-weight: 800; font-size: 12px; padding: 4px 12px; border-radius: 50px; display: inline-block; margin-bottom: 15px; }
    .price-card .badge { position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: var(--primary); color: #fff; font-size: 11px; font-weight: 900; padding: 8px 18px; border-radius: 50px; white-space: nowrap; }

    .ingredient-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
    .ingredient-card { background: #fff; padding: 24px; border-radius: 16px; border: 1px solid #E5E7EB; }
    .ingredient-card h3 { margin-top: 0; color: var(--primary); font-size: 18px; }

    .faq-container { max-width: 800px; margin: 0 auto; }
    .faq-item { background: #fff; border: 1px solid #E5E7EB; border-radius: 12px; margin-bottom: 12px; overflow: hidden; }
    .faq-question { padding: 20px; font-weight: 700; color: var(--navy); cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
    .faq-answer { padding: 0 20px 20px; color: var(--gray); font-size: 14px; }

    .testimonial-card { background: #fff; padding: 30px; border-radius: 20px; border: 1px solid #E5E7EB; margin-bottom: 24px; }
    .stars { color: #FFB400; font-size: 18px; margin-bottom: 10px; }
    
    .scarcity-bar { background: #111827; color: #fff; text-align: center; padding: 12px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
    .scarcity-bar span { color: #F87171; }
  `;

  // Dynamic order for desktop
  const displayPricing = [...pricing].sort((a, b) => {
    if (a.isBestValue) return 0; // Central logic handled by CSS order or array position
    return 0;
  });
  
  // Logical ordering: 1, 6 (Best), 3 (Popular)
  const orderedPricing = [
    pricing.find(p => !p.isBestValue && !p.isMostPopular),
    pricing.find(p => p.isBestValue),
    pricing.find(p => p.isMostPopular)
  ].filter(Boolean) as PricingOption[];

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${productName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <style>${css}</style>
</head>
<body>
    <div class="scarcity-bar">ALERTA: ESTOQUE LIMITADO DISPONÍVEL NO <span>${data.targetLanguage || 'BRASIL'}</span></div>
    
    <header style="padding: 15px 0; background: #fff; border-bottom: 1px solid #E5E7EB; position: sticky; top: 0; z-index: 100;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="font-weight: 900; font-size: 22px; color: var(--navy);">${productName}</div>
        <nav style="display: flex; gap: 20px; font-size: 12px; font-weight: 800; color: var(--gray); display: none; md:flex;">
          <span>SOBRE</span>
          <span>INGREDIENTES</span>
          <span>PREÇOS</span>
        </nav>
      </div>
    </header>

    <section class="section-white">
      <div class="container hero">
        <div>
          <div class="stars">★★★★★ <span style="color: var(--gray); font-size: 12px; font-weight: 800; margin-left: 10px;">AVALIAÇÕES VERIFICADAS</span></div>
          <h1>${headline}</h1>
          <p style="font-size: 20px; margin-bottom: 30px;">${subheadline || editorialIntro}</p>
          <a href="#pricing" class="btn">VERIFICAR DISPONIBILIDADE</a>
        </div>
        <div>${renderImage(0, productName)}</div>
      </div>
    </section>

    <section class="section-gray">
      <div class="container" style="max-width: 800px; text-align: center;">
        <h2>${quickSummary || 'A Ciência do Equilíbrio'}</h2>
        <p style="font-size: 18px;">${whatIsSection}</p>
        <p style="font-size: 18px; margin-top: 20px;">${problemsSection}</p>
      </div>
    </section>

    <section class="section-white">
      <div class="container">
        <h2>Ingredientes de Alta Pureza</h2>
        <div class="ingredient-grid">
          ${ingredients.map(ing => `
            <div class="ingredient-card">
              <h3>${ing.name}</h3>
              <p style="font-size: 14px;">${ing.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <section id="pricing" class="section-gray">
      <div class="container">
        <h2>Selecione Seu Pacote Promocional</h2>
        <div class="pricing-grid">
          ${orderedPricing.map(p => `
            <div class="price-card ${p.isBestValue ? 'featured' : (p.isMostPopular ? 'popular' : '')}" style="order: ${p.isBestValue ? 2 : (p.isMostPopular ? 3 : 1)};">
              ${p.isBestValue ? '<div class="badge">MELHOR ESCOLHA</div>' : (p.isMostPopular ? '<div class="badge">MAIS POPULAR</div>' : '')}
              <div class="qty">${p.quantity} ${p.unitName || 'Unidades'}</div>
              <div style="margin: 20px 0;">${renderImage(0, productName)}</div>
              ${p.savings ? `<div class="savings">ECONOMIZE ${p.savings}</div>` : ''}
              <div class="price">${p.price}</div>
              <a href="${targetUrl}" class="btn" style="padding: 15px; font-size: 16px;">PEDIR AGORA</a>
              <p style="font-size: 11px; margin-top: 15px; opacity: 0.6;">Garantia de 60 Dias Inclusa</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="section-white">
      <div class="container">
        <h2>Depoimentos de Clientes</h2>
        <div style="column-count: ${testimonials.length > 2 ? 2 : 1}; column-gap: 24px;">
          ${testimonials.map(t => `
            <div class="testimonial-card" style="break-inside: avoid;">
              <div class="stars">★★★★★</div>
              <p style="font-style: italic;">"${t.text}"</p>
              <div style="margin-top: 15px; font-weight: 800; font-size: 14px;">- ${t.name}, ${t.location}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="section-gray">
      <div class="container faq-container">
        <h2>Perguntas Frequentes</h2>
        ${faq_items.map(faq => `
          <div class="faq-item">
            <div class="faq-question">${faq.question} <span>+</span></div>
            <div class="faq-answer">${faq.answer}</div>
          </div>
        `).join('')}
      </div>
    </section>

    <footer style="background: #111827; color: #fff; padding: 60px 0; text-align: center; font-size: 12px;">
      <div class="container">
        <div style="font-weight: 900; font-size: 24px; margin-bottom: 20px;">${productName}</div>
        <p>© 2026 ${productName}. Todos os direitos reservados.</p>
        <div style="margin-top: 20px; display: flex; justify-content: center; gap: 15px; opacity: 0.5;">
          <span>Termos</span>
          <span>Privacidade</span>
          <span>Contato</span>
        </div>
      </div>
    </footer>
</body>
</html>`;
}
