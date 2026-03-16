export type PricingOption = {
  quantity: string;
  discount?: string;
  price: string;
  totalPrice?: string;
  savings?: string;
  isBestValue: boolean;
  unitName?: string;
};

export type Testimonial = {
  name: string;
  text: string;
  location: string;
};

export type FAQItem = {
  q: string;
  a: string;
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
    callToAction, buttonColor, targetUrl, productImageUrls = [], pricing = [], testimonials = []
  } = finalData;
  
  const ctaColor = '#FF8C00'; // Vibrant Orange for CTAs
  const primaryColor = buttonColor || '#2952A3';

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
      --primary: ${primaryColor}; 
      --cta: ${ctaColor};
      --navy: #111827;
      --gray: #4B5563;
      --light-gray: #F9FAFB;
    }
    body { font-family: 'Inter', sans-serif; margin: 0; color: var(--gray); background: #fff; line-height: 1.6; }
    .container { max-width: 1000px; margin: 0 auto; padding: 0 20px; }
    section { padding: 80px 0; }
    .section-gray { background: var(--light-gray); }
    h1, h2, h3 { color: var(--navy); font-weight: 800; }
    h1 { font-size: 48px; line-height: 1.1; margin-bottom: 24px; }
    h2 { font-size: 32px; text-align: center; margin-bottom: 40px; }
    .hero { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; padding: 60px 0; }
    @media (max-width: 768px) { .hero { grid-template-columns: 1fr; text-align: center; } }
    .btn { 
      display: inline-block; width: 100%; padding: 20px; background: var(--cta); color: #fff; 
      text-align: center; text-decoration: none; font-weight: 900; font-size: 18px; 
      border-radius: 12px; box-shadow: 0 10px 20px rgba(255, 140, 0, 0.2); 
      transition: transform 0.2s; animation: pulse 2s infinite;
    }
    .btn:hover { transform: scale(1.05); }
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(255, 140, 0, 0.4); } 70% { box-shadow: 0 0 0 15px rgba(255, 140, 0, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 140, 0, 0); } }
    .pricing-grid { display: grid; gap: 24px; margin-top: 40px; }
    @media (min-width: 768px) { .pricing-grid { grid-template-columns: repeat(3, 1fr); } }
    .price-card { background: #fff; border: 1px solid #E5E7EB; border-radius: 20px; padding: 40px 24px; text-align: center; position: relative; transition: all 0.3s; }
    .price-card.featured { border: 2px solid var(--primary); transform: scale(1.05); box-shadow: 0 20px 40px rgba(0,0,0,0.05); z-index: 10; }
    @media (max-width: 768px) { .price-card.featured { transform: scale(1); } }
    .price-card .qty { font-size: 14px; font-weight: 800; color: var(--gray); text-transform: uppercase; }
    .price-card .price { font-size: 36px; font-weight: 900; color: var(--navy); margin: 16px 0; }
    .price-card .savings { color: #10B981; font-weight: 800; font-size: 14px; }
    .price-card .badge { position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: var(--primary); color: #fff; font-size: 11px; font-weight: 900; padding: 6px 16px; border-radius: 50px; }
    .testimonial-card { background: #fff; padding: 30px; border-radius: 20px; border: 1px solid #E5E7EB; margin-bottom: 24px; }
  `;

  const pricingSection = pricing.length > 0 ? `
    <section id="pricing" class="section-gray">
      <div class="container">
        <h2>Escolha seu Pacote Promocional</h2>
        <div class="pricing-grid">
          ${pricing.sort((a, b) => {
            const qA = parseInt(a.quantity);
            const qB = parseInt(b.quantity);
            // Desktop: 1, 6 (featured), 3. Simple hack: featured is center.
            return a.isBestValue ? 0 : (qA === 1 ? -1 : 1);
          }).map(p => `
            <div class="price-card ${p.isBestValue ? 'featured' : ''}">
              ${p.isBestValue ? '<div class="badge">MAIS POPULAR</div>' : ''}
              <div class="qty">${p.quantity} ${p.unitName}</div>
              <div style="margin: 20px 0;">${renderImage(0, productName)}</div>
              <div class="price">${p.price}</div>
              ${p.savings ? `<div class="savings">ECONOMIZE ${p.savings}</div>` : ''}
              <a href="${targetUrl}" class="btn" style="padding: 12px; font-size: 14px; margin-top: 20px;">PEDIR AGORA</a>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  ` : '';

  const testimonialSection = testimonials.length > 0 ? `
    <section class="section-white">
      <div class="container" style="max-width: 800px;">
        <h2>Depoimentos de Clientes</h2>
        ${testimonials.map(t => `
          <div class="testimonial-card">
            <div style="color: #FFB400; margin-bottom: 12px;">★★★★★</div>
            <p style="font-style: italic; font-size: 17px; margin-bottom: 16px;">"${t.text}"</p>
            <div style="font-weight: 800; font-size: 14px; color: var(--navy);">${t.name}</div>
            <div style="font-size: 12px;">${t.location}</div>
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
    <header style="border-bottom: 1px solid #E5E7EB; padding: 20px 0; background: #fff;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="font-weight: 900; font-size: 20px; color: var(--navy);">${productName}</div>
        <div style="font-size: 13px; font-weight: 700; color: var(--gray);">Portal Oficial</div>
      </div>
    </header>

    <section class="section-white">
      <div class="container hero">
        <div>
          <div style="color: #FFB400; margin-bottom: 16px;">★★★★★ <span style="color: var(--gray); font-size: 13px; font-weight: 700; margin-left: 8px;">(REVIEWS VERIFICADOS)</span></div>
          <h1>${headline}</h1>
          <p style="font-size: 20px; font-weight: 500;">${subheadline || ''}</p>
          <a href="#pricing" class="btn" style="max-width: 400px;">VERIFICAR DISPONIBILIDADE</a>
        </div>
        <div>${renderImage(0, productName)}</div>
      </div>
    </section>

    <section class="section-gray">
      <div class="container" style="max-width: 800px; text-align: center;">
        <h2>A Ciência do Bem-Estar</h2>
        <p>${whatIsSection}</p>
        <p>${problemsSection}</p>
      </div>
    </section>

    ${pricingSection}
    ${testimonialSection}

    <footer style="background: var(--navy); color: #fff; padding: 60px 0; text-align: center; font-size: 12px;">
      <div class="container">
        <div style="font-weight: 900; font-size: 24px; margin-bottom: 20px;">${productName}</div>
        <p>© 2026 ${productName}. Todos os direitos reservados.</p>
        <p style="opacity: 0.5; margin-top: 20px;">ESTE SITE NÃO É AFILIADO AO GOOGLE OU FACEBOOK INC.</p>
      </div>
    </footer>
</body>
</html>`;
}
