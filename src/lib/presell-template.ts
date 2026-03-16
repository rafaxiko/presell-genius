export type PricingOption = {
  quantity: string;
  discount?: string;
  price: string;
  totalPrice?: string;
  savings?: string;
  isBestValue: boolean;
  unitName?: string;
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
    productName: "Produto Exemplo",
    headline: "Análise Especial: O impacto da nova fórmula na saúde moderna",
    editorialIntro: "Por: Redação Saúde & Vida | Atualizado Hoje",
    quickSummary: "Investigamos se este novo lançamento realmente cumpre o prometido no mercado internacional.",
    patternInterrupt: "Esqueça tudo o que você sabia sobre este tema até agora.",
    problemsSection: "Muitas pessoas sofrem com sintomas persistentes sem saber a real causa biológica.",
    whatIsSection: "Tecnologia patenteada que atua diretamente nos receptores celulares.",
    curiosityBridge: "Mas por que a grande mídia ainda não está falando sobre isso abertamente?",
    features: ["Absorção Rápida", "Origem Natural", "Sem Efeitos Colaterais"],
    benefits: ["Mais Energia", "Foco Aprimorado", "Longevidade"],
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
    callToAction, buttonColor, targetUrl, productImageUrls = [], 
    trackingLink, copyStyle, templateType, pricing = []
  } = finalData;
  
  const ctaLink = trackingLink || targetUrl;
  const isBlackHat = copyStyle === 'Black Hat (Agressivo)';
  
  // Color Intelligence - CardioGenix Standards
  const primaryColor = buttonColor || '#2952A3';
  const ctaColor = '#FFD056'; // Vibrant Yellow for Elite Contrast
  const ctaTextColor = '#111827'; // Dark text on yellow button

  const renderImage = (index: number, alt: string, className: string = "") => {
    if (productImageUrls && productImageUrls[index]) {
      return `<img src="${productImageUrls[index]}" alt="${alt}" class="${className}" style="max-width: 100%; height: auto; border-radius: 12px; display: block; margin: 0 auto;">`;
    }
    return `
      <div style="width: 100%; aspect-ratio: 1/1; background: #F3F4F6; border: 2px dashed #D1D5DB; border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #9CA3AF;" class="${className}">
        <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="1.5" fill="none" style="opacity: 0.5; margin-bottom: 8px;">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Sua Foto aqui</span>
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
      --radius: 12px;
    }
    * { box-sizing: border-box; }
    body { 
      font-family: 'Poppins', 'Inter', -apple-system, sans-serif; 
      background: #FFFFFF; 
      color: var(--gray); 
      margin: 0; 
      line-height: 1.6; 
      padding-bottom: 80px;
      overflow-x: hidden;
    }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
    .section-white { background: #FFFFFF; padding: 80px 0; }
    .section-gray { background: var(--light-gray); padding: 80px 0; }
    
    .countdown-bar { 
      background: var(--navy); 
      color: #fff; 
      text-align: center; 
      padding: 14px; 
      font-size: 13px; 
      font-weight: 700; 
      text-transform: uppercase; 
      letter-spacing: 1px;
      position: sticky;
      top: 0;
      z-index: 2000;
      ${isBlackHat ? 'background: #D0021B; animation: blink 1.5s infinite;' : ''}
    }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }

    .nav { background: #fff; border-bottom: 1px solid #E5E7EB; padding: 18px 0; }
    .nav-inner { display: flex; justify-content: space-between; align-items: center; }
    .logo { font-weight: 800; font-size: 20px; color: var(--navy); text-transform: uppercase; letter-spacing: -0.5px; }
    .nav-menu { display: none; gap: 24px; font-size: 14px; font-weight: 600; color: var(--gray); text-transform: uppercase; }
    @media (min-width: 768px) { .nav-menu { display: flex; } }
    
    h1 { font-size: 42px; font-weight: 900; line-height: 1.15; color: var(--navy); margin-bottom: 20px; }
    h2 { font-size: 32px; font-weight: 800; color: var(--navy); margin-bottom: 30px; text-align: center; }
    p { font-size: 18px; color: var(--gray); margin-bottom: 20px; }
    
    .hero-split { display: grid; gap: 40px; align-items: center; text-align: left; }
    @media (min-width: 1024px) { .hero-split { grid-template-columns: 1.2fr 0.8fr; } }
    @media (max-width: 1023px) { .hero-split { text-align: center; } }

    .stars { color: #FFB400; display: flex; gap: 4px; margin: 12px 0; font-size: 18px; align-items: center; }
    @media (max-width: 1023px) { .stars { justify-content: center; } }
    
    .btn { 
      display: inline-block; 
      width: 100%; 
      background: var(--cta); 
      color: ${ctaTextColor}; 
      text-align: center; 
      padding: 22px 40px; 
      border-radius: var(--radius); 
      font-weight: 800; 
      font-size: 18px; 
      text-decoration: none; 
      text-transform: uppercase; 
      transition: all 0.3s;
      box-shadow: 0 12px 30px rgba(255, 208, 86, 0.3);
      border: none;
      cursor: pointer;
      animation: pulse 2.5s infinite;
    }
    .btn:hover { transform: scale(1.05); filter: brightness(1.05); }
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(255, 208, 86, 0.6); } 70% { box-shadow: 0 0 0 15px rgba(255, 208, 86, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 208, 86, 0); } }

    .check-list { display: grid; gap: 16px; margin: 30px 0; }
    .check-item { display: flex; align-items: flex-start; gap: 14px; font-size: 17px; font-weight: 600; color: var(--navy); }
    .check-icon { color: var(--primary); flex-shrink: 0; margin-top: 2px; }

    .pricing-grid { 
      display: grid; 
      gap: 30px; 
      margin: 60px 0; 
      align-items: stretch;
    }
    @media (min-width: 900px) { 
      .pricing-grid { 
        grid-template-columns: repeat(${pricing.length || 1}, 1fr); 
      } 
      .pricing-grid .card-order-6 { order: 2; }
      .pricing-grid .card-order-1 { order: 1; }
      .pricing-grid .card-order-3 { order: 3; }
    }
    @media (max-width: 899px) {
      .pricing-grid .card-order-6 { order: 1; }
      .pricing-grid .card-order-3 { order: 2; }
      .pricing-grid .card-order-1 { order: 3; }
    }
    
    .price-card { 
      background: #fff; 
      border: 1px solid #E5E7EB; 
      border-radius: 20px; 
      padding: 40px 30px; 
      text-align: center; 
      transition: all 0.4s; 
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .price-card:hover { transform: translateY(-8px); border-color: var(--primary); box-shadow: 0 20px 40px rgba(0,0,0,0.06); }
    .price-card.featured { 
      border-color: var(--primary); 
      border-width: 2px; 
      transform: scale(1.08); 
      box-shadow: 0 25px 50px rgba(0,0,0,0.1); 
      z-index: 10;
    }
    @media (max-width: 899px) { .price-card.featured { transform: scale(1); } }

    .price-card .qty { font-size: 14px; font-weight: 800; text-transform: uppercase; color: var(--gray); letter-spacing: 1px; }
    .price-card .price { font-size: 40px; font-weight: 900; color: var(--navy); margin: 15px 0; }
    .price-card .old-price { font-size: 16px; text-decoration: line-through; color: #9CA3AF; margin-bottom: 5px; }
    .price-card .savings-badge { background: #10B981; color: #fff; font-size: 12px; font-weight: 900; padding: 6px 16px; border-radius: 50px; position: absolute; top: -15px; left: 50%; transform: translateX(-50%); white-space: nowrap; }
    .price-card .best-badge { position: absolute; top: -45px; left: 50%; transform: translateX(-50%); background: var(--primary); color: #fff; font-size: 11px; font-weight: 900; padding: 8px 20px; border-radius: 6px; letter-spacing: 1.5px; }

    .sticky-cta { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; padding: 12px 20px; border-top: 1px solid #E5E7EB; z-index: 2000; display: none; box-shadow: 0 -10px 30px rgba(0,0,0,0.05); }
    body.scrolled .sticky-cta { display: block; }
  `;

  // Reorder pricing logic for CardioGenix standards
  const sortedPricing = [...pricing].sort((a, b) => {
    const qA = parseInt(a.quantity) || 0;
    const qB = parseInt(b.quantity) || 0;
    return qA - qB; // 1, 3, 6
  });

  const pricingSection = pricing.length > 0 ? `
    <div class="pricing-grid">
      ${sortedPricing.map((p, idx) => {
        const qty = parseInt(p.quantity) || 1;
        const isFeatured = p.isBestValue || qty >= 6;
        const orderClass = qty >= 6 ? 'card-order-6' : (qty >= 3 ? 'card-order-3' : 'card-order-1');
        return `
        <div class="price-card ${isFeatured ? 'featured' : ''} ${orderClass}">
          ${isFeatured ? `<div class="best-badge">MAIS POPULAR</div>` : ''}
          ${p.savings ? `<div class="savings-badge">ECONOMIZE ${p.savings}</div>` : ''}
          <div class="qty">${p.quantity} ${p.unitName || 'Unidades'}</div>
          <div style="margin: 25px 0; min-height: 120px; display: flex; align-items: center; justify-content: center;">
            ${renderImage(0, productName)}
          </div>
          <div class="old-price">De R$ 597,00</div>
          <div class="price">${p.price}</div>
          <a href="${ctaLink}" class="btn" style="padding: 16px; font-size: 15px; margin-top: 10px;">PEDIR AGORA</a>
          <div style="font-size: 11px; font-weight: 700; margin-top: 15px; color: #9CA3AF; display: flex; align-items: center; justify-content: center; gap: 4px;">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
             60 DIAS DE GARANTIA
          </div>
        </div>
      `}).join('')}
    </div>
  ` : '';

  if (templateType === 'Robusta') {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${productName} - Site Oficial</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <style>${css}</style>
</head>
<body>
    <div class="countdown-bar">${isBlackHat ? '⚠️ ESTOQUE CRÍTICO: SEU DESCONTO EXPIRA EM INSTANTES' : 'OFERTA POR TEMPO LIMITADO: FRETE GRÁTIS PARA TODO O PAÍS'}</div>
    
    <nav class="nav">
      <div class="container nav-inner">
        <div class="logo">${productName}</div>
        <div class="nav-menu">
          <a href="#about" style="text-decoration:none; color:inherit;">Sobre</a>
          <a href="#ingredients" style="text-decoration:none; color:inherit;">Ingredientes</a>
          <a href="#pricing" style="text-decoration:none; color:inherit;">Preços</a>
        </div>
      </div>
    </nav>

    <header class="section-white">
      <div class="container hero-split">
        <div>
          <div class="stars">
            ${Array(5).fill('★').join('')} <span style="font-weight: 700; font-size: 14px; color: var(--gray); margin-left: 8px;">(REVIEWS VERIFICADOS)</span>
          </div>
          <h1>${headline}</h1>
          <p style="font-size: 20px; font-weight: 500;">${subheadline || ''}</p>
          <div class="check-list">
            ${benefits.map(b => `
              <div class="check-item">
                <svg class="check-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ${b}
              </div>
            `).join('')}
          </div>
          <a href="#pricing" class="btn" style="max-width: 450px;">GARANTIR MEU DESCONTO</a>
        </div>
        <div>
          ${renderImage(0, productName)}
        </div>
      </div>
    </header>

    <section id="about" class="section-gray">
      <div class="container" style="max-width: 800px; text-align: center;">
        <h2>A Ciência por trás de ${productName}</h2>
        <p>${whatIsSection}</p>
        <p>${problemsSection}</p>
      </div>
    </section>

    <section id="pricing" class="section-white">
      <div class="container">
        <h2>Escolha o seu Pacote Promocional</h2>
        <p style="text-align: center; margin-top: -20px; font-weight: 600;">Selecione uma opção abaixo e receba o site oficial</p>
        ${pricingSection}
      </div>
    </section>

    <section id="guarantee" class="section-gray">
      <div class="container" style="display: grid; grid-template-columns: auto 1fr; gap: 40px; align-items: center; background: #fff; padding: 60px; border-radius: 30px; box-shadow: 0 30px 60px rgba(0,0,0,0.05);">
        <div style="background: var(--light-gray); width: 120px; height: 120px; border-radius: 100%; display: flex; align-items: center; justify-content: center;">
           <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        </div>
        <div>
          <h3 style="font-weight: 900; font-size: 26px; color: var(--navy); margin-top:0;">Garantia Incondicional de 60 Dias</h3>
          <p style="margin-bottom:0;">Assumimos todo o risco. Teste ${productName} por 60 dias. Se não estiver 100% satisfeito com os resultados, devolvemos cada centavo do seu investimento.</p>
        </div>
      </div>
    </section>

    <div class="sticky-cta">
      <div class="container">
        <a href="#pricing" class="btn" style="padding: 16px; font-size: 16px;">PEDIR COM DESCONTO AGORA</a>
      </div>
    </div>

    <footer style="background: var(--navy); padding: 80px 0; color: #9CA3AF; text-align: center; font-size: 13px;">
      <div class="container">
        <div style="font-weight: 800; font-size: 24px; color: #fff; margin-bottom: 20px;">${productName}</div>
        <p style="max-width: 600px; margin: 0 auto 30px;">ESTE SITE NÃO É AFILIADO AO GOOGLE OU FACEBOOK INC. TODAS AS INFORMAÇÕES SÃO PARA FINS EDUCACIONAIS.</p>
        <p>© 2026 ${productName} - Todos os direitos reservados.</p>
      </div>
    </footer>

    <script>
      window.addEventListener('scroll', function() {
        document.body.classList.toggle('scrolled', window.scrollY > 800);
      });
    </script>
</body>
</html>`;
  }

  // FALLBACK: REVIEW / EDITORIAL
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${headline}</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&display=swap" rel="stylesheet">
    <style>${css}</style>
</head>
<body class="section-gray">
    <nav class="nav">
      <div class="container nav-inner">
        <div class="logo">Portal Investigação</div>
      </div>
    </nav>

    <div class="container" style="padding-top: 40px;">
      <article style="background: #fff; padding: 60px; border-radius: 30px; box-shadow: 0 20px 50px rgba(0,0,0,0.03);">
        <div style="color: var(--primary); font-weight: 800; font-size: 14px; margin-bottom: 20px; text-transform: uppercase;">${editorialIntro}</div>
        <h1 style="font-size: 36px;">${headline}</h1>
        
        <div style="margin: 40px 0;">
          ${renderImage(0, productName)}
        </div>

        <div style="border-left: 6px solid var(--primary); background: var(--light-gray); padding: 30px; border-radius: 8px 24px 24px 8px; margin: 40px 0;">
          <p style="margin: 0; font-weight: 600; font-size: 19px; color: var(--navy);">"${quickSummary}"</p>
        </div>
        
        <p>${patternInterrupt}</p>
        <p>${problemsSection}</p>
        
        <h2 style="text-align: left;">O que descobrimos sobre o ${productName}</h2>
        <p>${whatIsSection}</p>
        <p>${curiosityBridge}</p>

        <div style="background: var(--navy); color: #fff; padding: 40px; border-radius: 24px; margin: 50px 0;">
          <h3 style="color: #fff; margin-top:0;">Destaques Principais:</h3>
          <ul style="padding-left: 20px; font-weight: 500;">
            ${features.map(f => `<li style="margin-bottom: 12px;">${f}</li>`).join('')}
          </ul>
        </div>

        <div id="pricing">
          <h2 style="margin-top: 60px;">Veredito: Pacotes Disponíveis</h2>
          ${pricingSection}
        </div>

        <div style="text-align: center; margin-top: 60px; border-top: 1px solid #E5E7EB; padding-top: 40px;">
           <a href="${ctaLink}" class="btn" style="max-width: 500px;">${callToAction}</a>
        </div>
      </article>
    </div>
</body>
</html>`;
}
