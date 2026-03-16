export type PricingOption = {
  quantity: string;
  discount: string;
  price: string;
  totalPrice?: string;
  savings?: string;
  isBestValue: boolean;
  unitName?: string; // e.g., "Potes", "Garrafas", "Licenças"
};

export type FAQItem = {
  q: string;
  a: string;
};

export type ComparisonRow = {
  feature: string;
  product: string;
  competitor: string;
};

export type Testimonial = {
  name: string;
  text: string;
  rating: number;
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
  comparisonTable?: ComparisonRow[];
  pros?: string[];
  cons?: string[];
  testimonials?: Testimonial[];
  pricing?: PricingOption[];
  faqs?: FAQItem[];
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
    whatIsSection: "Uma nova tecnologia patenteada que atua diretamente nos receptores celulares.",
    curiosityBridge: "Mas por que a grande mídia ainda não está falando sobre isso abertamente?",
    features: ["Absorção Rápida", "Origem Natural", "Sem Efeitos Colaterais"],
    benefits: ["Mais Energia", "Foco Aprimorado", "Longevidade"],
    callToAction: "VERIFICAR DISPONIBILIDADE NO SITE OFICIAL",
    buttonColor: "#2952A3",
    targetUrl: "#",
    templateType: "Review",
    copyStyle: "White Hat (Conservador)",
    productImageUrls: []
  };

  const finalData = data || defaultData;
  const { 
    productName, headline, subheadline, editorialIntro, quickSummary, patternInterrupt,
    problemsSection, whatIsSection, curiosityBridge, features = [], benefits = [], 
    callToAction, buttonColor, targetUrl, productImageUrls = [], 
    trackingLink, clarityScript, copyStyle, templateType, pricing = []
  } = finalData;
  
  const ctaLink = trackingLink || targetUrl;
  const isBlackHat = copyStyle === 'Black Hat (Agressivo)';
  const primaryColor = isBlackHat ? '#FF0000' : (buttonColor || '#2952A3');
  const secondaryColor = '#F3F4F6';

  const renderImage = (index: number, alt: string, className: string = "") => {
    if (productImageUrls && productImageUrls[index]) {
      return `<img src="${productImageUrls[index]}" alt="${alt}" class="${className}" style="max-width: 100%; border-radius: 12px; display: block; margin: 0 auto; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">`;
    }
    return `
      <div style="width: 100%; aspect-ratio: 16/9; background: #f3f4f6; border: 1px dashed #d1d5db; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #9ca3af;" class="${className}">
        <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.5" fill="none" style="opacity: 0.3; margin-bottom: 8px;">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <span style="font-size: 10px; font-weight: 700; text-transform: uppercase;">[IMAGEM DO PRODUTO]</span>
      </div>
    `;
  };

  const css = `
    :root { 
      --primary: ${primaryColor}; 
      --text: #111827; 
      --bg: #F9FAFB; 
      --card: #FFFFFF;
      --radius: 16px;
    }
    * { box-sizing: border-box; }
    body { 
      font-family: 'Inter', -apple-system, sans-serif; 
      background: var(--bg); 
      color: var(--text); 
      margin: 0; 
      line-height: 1.6; 
      padding-bottom: 100px;
      overflow-x: hidden;
    }
    .container { max-width: 720px; margin: 0 auto; padding: 0 20px; }
    
    .top-bar { 
      background: ${isBlackHat ? '#FF0000' : '#111827'}; 
      color: #fff; 
      text-align: center; 
      padding: 8px; 
      font-size: 11px; 
      font-weight: 800; 
      text-transform: uppercase; 
      ${isBlackHat ? 'animation: blink 1s infinite;' : ''}
    }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }

    .nav { 
      background: #fff; 
      border-bottom: 1px solid #E5E7EB; 
      padding: 12px 0; 
      position: sticky; 
      top: 0; 
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.02);
    }
    .logo { font-weight: 900; font-size: 16px; color: #111827; display: flex; align-items: center; gap: 6px; }
    
    .card { 
      background: var(--card); 
      padding: 25px; 
      border-radius: var(--radius); 
      box-shadow: 0 4px 20px rgba(0,0,0,0.04); 
      margin-top: 20px; 
      border: 1px solid rgba(0,0,0,0.05);
    }
    h1 { font-size: 26px; font-weight: 900; line-height: 1.2; color: #111827; margin-bottom: 15px; }
    h2 { font-size: 22px; font-weight: 800; color: #111827; margin-top: 30px; margin-bottom: 15px; }
    p { margin-bottom: 15px; font-size: 17px; color: #374151; }
    
    .btn { 
      display: block; 
      width: 100%; 
      background: var(--primary); 
      color: #fff; 
      text-align: center; 
      padding: 20px; 
      border-radius: 12px; 
      font-weight: 900; 
      font-size: 17px; 
      text-decoration: none; 
      text-transform: uppercase; 
      margin: 20px 0; 
      transition: all 0.2s;
      box-shadow: 0 8px 15px ${primaryColor}44;
      border: none;
      cursor: pointer;
    }
    .btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
    .btn:active { transform: scale(0.98); }
    
    .btn-pulse { animation: pulse 2s infinite; }
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 ${primaryColor}66; } 70% { box-shadow: 0 0 0 10px ${primaryColor}00; } 100% { box-shadow: 0 0 0 0 ${primaryColor}00; } }

    .sticky-cta {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(10px);
      padding: 12px 20px;
      border-top: 1px solid #E5E7EB;
      z-index: 2000;
      display: none;
    }
    body.scrolled .sticky-cta { display: block; }

    /* Review Stars for Black Hat */
    .stars { color: #FBBF24; display: flex; gap: 2px; margin: 10px 0; }
    .review-count { font-size: 12px; color: #6B7280; font-weight: 600; }

    /* Pricing Cards Layout */
    .pricing-grid { display: grid; gap: 15px; margin: 30px 0; }
    @media (min-width: 600px) { .pricing-grid { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); } }
    
    .price-card {
      border: 2px solid #E5E7EB;
      border-radius: 16px;
      padding: 20px;
      text-align: center;
      transition: all 0.3s;
      position: relative;
    }
    .price-card.featured {
      border-color: var(--primary);
      background: #F0F7FF;
      transform: scale(1.03);
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
      z-index: 10;
    }
    .price-card.featured::after {
      content: 'MAIS VENDIDO';
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary);
      color: #fff;
      font-size: 10px;
      font-weight: 900;
      padding: 4px 12px;
      border-radius: 20px;
    }
    .price-card .qty { font-size: 14px; font-weight: 800; text-transform: uppercase; color: #6B7280; }
    .price-card .price { font-size: 28px; font-weight: 900; color: var(--text); margin: 10px 0; }
    .price-card .savings { font-size: 12px; font-weight: 700; color: #10B981; }

    @media (max-width: 600px) {
      h1 { font-size: 22px; }
      .card { padding: 20px; }
    }
  `;

  const script = `
    window.addEventListener('scroll', function() {
      if (window.scrollY > 400) {
        document.body.classList.add('scrolled');
      } else {
        document.body.classList.remove('scrolled');
      }
    });
  `;

  const pricingSection = pricing.length > 0 ? `
    <div class="pricing-grid">
      ${pricing.map(p => `
        <div class="price-card ${p.isBestValue ? 'featured' : ''}">
          <div class="qty">${p.quantity} ${p.unitName || 'Unidades'}</div>
          ${renderImage(0, productName, "img-small")}
          <div class="price">${p.price}</div>
          ${p.savings ? `<div class="savings">ECONOMIZE ${p.savings}</div>` : ''}
          <a href="${ctaLink}" class="btn" style="padding: 12px; font-size: 14px; margin: 15px 0 0;">PEDIR AGORA</a>
        </div>
      `).join('')}
    </div>
  ` : '';

  // TEMPLATE: COOKIE
  if (templateType === 'Cookie') {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    <style>${css} body { background: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; padding: 0; }</style>
</head>
<body>
    <div class="container" style="text-align: center; max-width: 450px;">
        <h1>${headline}</h1>
        <div style="margin: 30px 0;">
          ${renderImage(0, productName)}
        </div>
        <a href="${ctaLink}" class="btn btn-pulse" style="font-size: 24px;">CONTINUAR</a>
        <p style="font-size: 12px; color: #999; margin-top: 40px;">© 2026 ${productName}</p>
    </div>
</body>
</html>`;
  }

  // TEMPLATE: REVIEW (Editorial v6)
  if (templateType === 'Review') {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${headline}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    <style>${css}</style>
</head>
<body>
    <div class="top-bar">${isBlackHat ? '🔥 ATENÇÃO: ÚLTIMAS UNIDADES EM ESTOQUE COM DESCONTO' : 'PORTAL EDITORIAL: INVESTIGAÇÃO ESPECIAL ATUALIZADA'}</div>
    <nav class="nav">
      <div class="container">
        <div class="logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--primary)"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
          PORTAL SAÚDE
        </div>
      </div>
    </nav>

    <div class="container">
      <article class="card">
        <div style="color: #6B7280; font-size: 12px; margin-bottom: 12px; font-weight: 700;">${editorialIntro}</div>
        <h1>${headline}</h1>
        
        ${isBlackHat ? `
          <div class="stars">
            ${Array(5).fill('★').join('')}
            <span class="review-count">(16.892+ Avaliações Verificadas)</span>
          </div>
        ` : ''}

        <div style="margin: 20px 0;">
          ${renderImage(0, productName)}
        </div>

        <div style="background: #F3F4F6; border-left: 4px solid var(--primary); padding: 20px; margin: 25px 0; border-radius: 4px 12px 12px 4px;">
          <p style="margin: 0; font-style: italic; font-size: 16px;">"${quickSummary}"</p>
        </div>
        
        <p>${patternInterrupt}</p>
        
        <h2>O Desafio Silencioso</h2>
        <p>${problemsSection}</p>
        
        <h2>O que é ${productName}?</h2>
        <p>${whatIsSection}</p>

        <p>${curiosityBridge}</p>

        <div style="background: var(--primary); color: #fff; padding: 25px; border-radius: 16px; margin: 30px 0;">
          <h3 style="margin: 0 0 12px; font-size: 20px; font-weight: 900;">Destaques Principais:</h3>
          <ul style="padding-left: 18px; font-size: 16px; margin: 0;">
            ${features.map(f => `<li style="margin-bottom: 6px;">${f}</li>`).join('')}
          </ul>
        </div>

        ${pricingSection}

        <div style="text-align: center; margin-top: 40px;">
          <h2>Veredito Editorial</h2>
          <p>Após nossa análise, o <strong>${productName}</strong> destaca-se como a solução mais confiável de 2026 para quem busca resultados reais.</p>
          <a href="${ctaLink}" class="btn btn-pulse">${callToAction}</a>
        </div>
      </article>
    </div>

    <div class="sticky-cta">
      <div class="container">
        <a href="${ctaLink}" class="btn" style="margin-top: 0; padding: 15px; font-size: 15px;">${callToAction}</a>
      </div>
    </div>

    <footer style="text-align: center; padding: 40px 0; color: #9CA3AF; font-size: 11px;">
      <div class="container">
        <p>© 2026 ${productName} - Todos os direitos reservados.</p>
      </div>
    </footer>
    <script>${script}</script>
    ${clarityScript || ''}
</body>
</html>`;
  }

  // TEMPLATE: ROBUSTA (Sales Page Style)
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${productName} - Site Oficial</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    <style>${css} body { background: #fff; }</style>
</head>
<body>
    <div class="top-bar">${isBlackHat ? '🔥 OFERTA POR TEMPO LIMITADO: ÚLTIMAS UNIDADES' : 'FRETE GRÁTIS PARA TODO O PAÍS HOJE'}</div>
    
    <div class="container" style="padding-top: 40px; text-align: center;">
      <h1 style="font-size: 32px; color: var(--primary);">${headline}</h1>
      <p style="font-size: 20px; font-weight: 600;">${subheadline || ''}</p>
      
      <div style="max-width: 500px; margin: 30px auto;">
        ${renderImage(0, productName)}
      </div>

      <div class="card" style="text-align: left; background: #f8fafc;">
        <h2 style="margin-top: 0;">Por que escolher ${productName}?</h2>
        <p>${whatIsSection}</p>
        <ul style="padding-left: 20px;">
          ${benefits.map(b => `<li style="margin-bottom: 8px; font-weight: 500;">${b}</li>`).join('')}
        </ul>
      </div>

      <h2 style="font-size: 28px; margin-top: 60px;">Escolha seu Pacote Abaixo</h2>
      <p>Aproveite nossos descontos exclusivos de lançamento.</p>

      ${pricingSection}

      <div style="margin-top: 60px; padding: 40px; background: #fff; border: 2px solid var(--primary); border-radius: 20px;">
        <h2 style="margin-top: 0;">Garantia de Satisfação Total</h2>
        <p>Se você não ficar 100% satisfeito com os resultados nos primeiros 60 dias, devolvemos seu dinheiro integralmente.</p>
        <img src="https://picsum.photos/seed/secure/200/50" alt="Seguro" style="margin-top: 10px; opacity: 0.7;">
      </div>

      <a href="${ctaLink}" class="btn btn-pulse" style="font-size: 22px; max-width: 500px; margin: 40px auto;">${callToAction}</a>
    </div>

    <div class="sticky-cta">
      <div class="container">
        <a href="${ctaLink}" class="btn" style="margin-top: 0; padding: 15px; font-size: 15px;">${callToAction}</a>
      </div>
    </div>

    <footer style="text-align: center; padding: 50px 0; background: #111827; color: #fff; margin-top: 80px;">
      <div class="container">
        <p>© 2026 ${productName} - Site Oficial Autorizado.</p>
      </div>
    </footer>
    <script>${script}</script>
</body>
</html>`;
}
