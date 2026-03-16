export type PricingOption = {
  quantity: string;
  discount?: string;
  price: string;
  totalPrice?: string;
  savings?: string;
  isBestValue: boolean;
  isMostPopular?: boolean;
  unitName?: string;
};

export type Testimonial = {
  name: string;
  text: string;
  location: string;
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
  const defaultData: PresellData = {
    productName: "PrimeBiome",
    headline: "Análise Especial: O impacto da nova fórmula na saúde digestiva",
    editorialIntro: "Por: Redação Saúde & Vida | Atualizado Hoje",
    quickSummary: "Investigamos se este novo lançamento realmente cumpre o prometido no mercado internacional.",
    patternInterrupt: "Esqueça tudo o que você sabia sobre este tema até agora.",
    problemsSection: "Muitas pessoas sofrem com sintomas persistentes sem saber a real causa biológica.",
    whatIsSection: "Tecnologia patenteada que atua diretamente nos receptores celulares.",
    curiosityBridge: "Mas por que a grande mídia ainda não está falando sobre isso abertamente?",
    features: ["Absorção Rápida", "Origem Natural", "Sem Efeitos Colaterais"],
    benefits: ["Mais Energia", "Equilíbrio Digestivo", "Vitalidade"],
    callToAction: "VERIFICAR DISPONIBILIDADE NO SITE OFICIAL",
    buttonColor: "#2952A3",
    targetUrl: "#",
    templateType: "Robusta",
    copyStyle: "White Hat (Conservador)",
    productImageUrls: []
  };

  const finalData = data || defaultData;
  const { 
    productName, headline, subheadline, editorialIntro, quickSummary, patternInterrupt,
    problemsSection, whatIsSection, curiosityBridge, features = [], benefits = [], 
    callToAction, buttonColor, targetUrl, productImageUrls = [], pricing = [], testimonials = [],
    copyStyle, primaryColor: extractedColor
  } = finalData;
  
  const ctaColor = '#FF8C00'; // Vibrant Orange for CTAs
  const primaryBrandColor = extractedColor || buttonColor || '#2952A3';
  const isBlackHat = copyStyle === 'Black Hat (Agressivo)';

  const renderImage = (index: number, alt: string) => {
    if (productImageUrls && productImageUrls[index]) {
      return `<img src="${productImageUrls[index]}" alt="${alt}" style="max-width: 100%; height: auto; border-radius: 12px; display: block; margin: 0 auto;">`;
    }
    return `
      <div style="width: 100%; aspect-ratio: 1/1; background: #F3F4F6; border: 2px dashed #D1D5DB; border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #9CA3AF;">
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
    section { padding: 80px 0; border-bottom: 1px solid #f1f1f1; }
    .section-white { background: var(--white); }
    .section-gray { background: var(--light-gray); }
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
    .pricing-grid { display: grid; gap: 24px; margin-top: 40px; align-items: center; }
    @media (min-width: 768px) { .pricing-grid { grid-template-columns: repeat(3, 1fr); } }
    .price-card { background: #fff; border: 1px solid #E5E7EB; border-radius: 20px; padding: 40px 24px; text-align: center; position: relative; transition: all 0.3s; }
    .price-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.1); }
    .price-card.featured { border: 3px solid var(--primary); transform: scale(1.1); z-index: 10; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
    @media (max-width: 768px) { .price-card.featured { transform: scale(1); margin-bottom: 40px; } }
    .price-card .qty { font-size: 15px; font-weight: 800; color: var(--navy); text-transform: uppercase; margin-bottom: 10px; }
    .price-card .price { font-size: 38px; font-weight: 900; color: var(--navy); margin: 16px 0; }
    .price-card .savings { background: #DCFCE7; color: #166534; font-weight: 800; font-size: 12px; padding: 4px 12px; border-radius: 50px; display: inline-block; margin-bottom: 15px; }
    .price-card .badge { position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: var(--primary); color: #fff; font-size: 11px; font-weight: 900; padding: 8px 18px; border-radius: 50px; white-space: nowrap; }
    .testimonial-card { background: #fff; padding: 35px; border-radius: 20px; border: 1px solid #E5E7EB; margin-bottom: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
    .scarcity-bar { background: #111827; color: #fff; text-align: center; padding: 12px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .scarcity-bar span { color: #F87171; }
    .stars { color: #FFB400; font-size: 20px; margin-bottom: 10px; }
    .badge-verified { background: #F3F4F6; padding: 4px 10px; border-radius: 4px; font-size: 10px; font-weight: 800; color: #6B7280; vertical-align: middle; }
  `;

  const sortedPricing = [...pricing].sort((a, b) => {
    const qA = parseInt(a.quantity) || 0;
    const qB = parseInt(b.quantity) || 0;
    // Desktop: 1, 6, 3 logic
    if (a.isBestValue) return -1;
    if (b.isBestValue) return 1;
    if (a.isMostPopular) return 0;
    return qA - qB;
  });

  const pricingSection = pricing.length > 0 ? `
    <section id="pricing" class="section-gray">
      <div class="container">
        <h2>Pacotes Promocionais Exclusivos</h2>
        <div class="pricing-grid">
          ${sortedPricing.map((p, idx) => `
            <div class="price-card ${p.isBestValue ? 'featured' : ''}" style="order: ${p.isBestValue ? 2 : (p.isMostPopular ? 3 : 1)};">
              ${p.isBestValue ? '<div class="badge">O MELHOR VALOR</div>' : (p.isMostPopular ? '<div class="badge">O MAIS POPULAR</div>' : '')}
              <div class="qty">${p.quantity} ${p.unitName || 'Unidades'}</div>
              <div style="margin: 25px 0;">${renderImage(0, productName)}</div>
              ${p.savings ? `<div class="savings">ECONOMIZE ${p.savings}</div>` : ''}
              <div class="price">${p.price}</div>
              <a href="${targetUrl}" class="btn" style="padding: 15px; font-size: 15px; margin-top: 15px;">PEDIR AGORA</a>
              <div style="margin-top: 15px; font-size: 11px; font-weight: 700; color: #9CA3AF;">Garantia de 60 Dias</div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  ` : '';

  const testimonialSection = testimonials.length > 0 ? `
    <section class="section-white">
      <div class="container" style="max-width: 800px;">
        <h2>Depoimentos de Clientes Verificados</h2>
        ${testimonials.map(t => `
          <div class="testimonial-card">
            <div class="stars">★★★★★ <span class="badge-verified">VERIFICADO</span></div>
            <p style="font-style: italic; font-size: 18px; margin-bottom: 20px; color: var(--navy);">"${t.text}"</p>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 40px; height: 40px; background: #E5E7EB; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #9CA3AF; font-size: 14px;">${t.name.charAt(0)}</div>
              <div>
                <div style="font-weight: 800; font-size: 15px; color: var(--navy);">${t.name}</div>
                <div style="font-size: 12px; color: #9CA3AF;">${t.location}</div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  ` : '';

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
    <div class="scarcity-bar">ALERTA: Estoque limitado disponível para <span>${finalData.targetLanguage || 'Brasil'}</span></div>
    
    <header style="padding: 15px 0; background: #fff; border-bottom: 1px solid #E5E7EB; position: sticky; top: 0; z-index: 100;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="font-weight: 900; font-size: 22px; color: var(--navy); letter-spacing: -1px;">${productName}</div>
        <nav style="display: flex; gap: 20px; font-size: 12px; font-weight: 800; color: var(--gray);">
          <span style="cursor: pointer;">SOBRE</span>
          <span style="cursor: pointer;">INGREDIENTES</span>
          <span style="cursor: pointer; color: var(--primary);">PREÇOS</span>
        </nav>
      </div>
    </header>

    <section class="section-white" style="padding-top: 40px;">
      <div class="container hero">
        <div>
          <div class="stars">★★★★★ <span style="color: var(--gray); font-size: 12px; font-weight: 800; margin-left: 10px;">MAIS DE 16.892 AVALIAÇÕES</span></div>
          <h1>${headline}</h1>
          <p style="font-size: 22px; font-weight: 500; margin-bottom: 30px; color: var(--gray);">${subheadline || ''}</p>
          <a href="#pricing" class="btn" style="max-width: 420px;">VERIFICAR DISPONIBILIDADE</a>
        </div>
        <div>${renderImage(0, productName)}</div>
      </div>
    </section>

    <section class="section-gray">
      <div class="container" style="max-width: 850px; text-align: center;">
        <h2>A Ciência por trás do Bem-estar</h2>
        <div style="font-size: 18px; color: var(--gray); line-height: 1.8;">
          <p style="margin-bottom: 25px;">${whatIsSection}</p>
          <p style="margin-bottom: 25px;">${problemsSection}</p>
        </div>
      </div>
    </section>

    ${pricingSection}
    ${testimonialSection}

    <footer style="background: #111827; color: #fff; padding: 80px 0; text-align: center; font-size: 13px;">
      <div class="container">
        <div style="font-weight: 900; font-size: 30px; margin-bottom: 25px;">${productName}</div>
        <p style="opacity: 0.7;">© 2026 ${productName}. Todos os direitos reservados.</p>
        <div style="margin-top: 30px; display: flex; justify-content: center; gap: 20px; opacity: 0.5; font-weight: 700;">
          <span>TERMOS</span>
          <span>PRIVACIDADE</span>
          <span>CONTATO</span>
        </div>
        <p style="opacity: 0.3; margin-top: 40px; font-size: 11px;">ESTE SITE NÃO É AFILIADO AO GOOGLE OU FACEBOOK INC.</p>
      </div>
    </footer>
</body>
</html>`;
}
