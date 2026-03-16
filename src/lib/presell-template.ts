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
    trackingLink, clarityScript, copyStyle, templateType, pricing = []
  } = finalData;
  
  const ctaLink = trackingLink || targetUrl;
  const isBlackHat = copyStyle === 'Black Hat (Agressivo)';
  
  // Color Intelligence
  const primaryColor = buttonColor || '#2952A3';
  const ctaColor = '#FF8C00'; // Vibrant Orange for high contrast
  const ctaTextColor = '#FFFFFF';

  const renderImage = (index: number, alt: string, className: string = "") => {
    if (productImageUrls && productImageUrls[index]) {
      return `<img src="${productImageUrls[index]}" alt="${alt}" class="${className}" style="max-width: 100%; height: auto; border-radius: 12px; display: block; margin: 0 auto;">`;
    }
    return `
      <div style="width: 100%; aspect-ratio: 16/9; background: #F3F4F6; border: 2px dashed #D1D5DB; border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #9CA3AF;" class="${className}">
        <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="1.5" fill="none" style="opacity: 0.5; margin-bottom: 8px;">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Sua Foto do Produto Aqui</span>
      </div>
    `;
  };

  const css = `
    :root { 
      --primary: ${primaryColor}; 
      --cta: ${ctaColor};
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
    
    .countdown-bar { 
      background: #111827; 
      color: #fff; 
      text-align: center; 
      padding: 12px; 
      font-size: 12px; 
      font-weight: 800; 
      text-transform: uppercase; 
      letter-spacing: 1px;
      ${isBlackHat ? 'background: #FF0000; animation: blink 1s infinite;' : ''}
    }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }

    .nav { background: #fff; border-bottom: 1px solid #E5E7EB; padding: 15px 0; position: sticky; top: 0; z-index: 1000; }
    .logo { font-weight: 900; font-size: 18px; color: #111827; display: flex; align-items: center; gap: 8px; text-transform: uppercase; letter-spacing: -0.5px; }
    
    .card { background: var(--card); padding: 35px; border-radius: var(--radius); box-shadow: 0 4px 25px rgba(0,0,0,0.03); margin-top: 25px; border: 1px solid rgba(0,0,0,0.04); }
    h1 { font-size: 32px; font-weight: 900; line-height: 1.1; color: #111827; margin-bottom: 15px; }
    h2 { font-size: 26px; font-weight: 800; color: #111827; margin-top: 45px; margin-bottom: 25px; }
    p { margin-bottom: 18px; font-size: 18px; color: #374151; }
    
    .btn { 
      display: block; 
      width: 100%; 
      background: var(--cta); 
      color: ${ctaTextColor}; 
      text-align: center; 
      padding: 24px; 
      border-radius: 14px; 
      font-weight: 900; 
      font-size: 20px; 
      text-decoration: none; 
      text-transform: uppercase; 
      margin: 25px 0; 
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: 0 10px 25px ${ctaColor}44;
      border: none;
      cursor: pointer;
    }
    .btn:hover { transform: scale(1.05); filter: brightness(1.1); }
    .btn-pulse { animation: pulse 2s infinite; }
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 ${ctaColor}77; } 70% { box-shadow: 0 0 0 15px ${ctaColor}00; } 100% { box-shadow: 0 0 0 0 ${ctaColor}00; } }

    .stars { color: #FBBF24; display: flex; gap: 4px; margin: 15px 0; font-size: 16px; align-items: center; }
    .check-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 15px; font-size: 17px; font-weight: 600; color: #374151; }
    .check-icon { color: var(--primary); flex-shrink: 0; margin-top: 4px; }

    .pricing-grid { display: grid; gap: 20px; margin: 45px 0; }
    @media (min-width: 600px) { .pricing-grid { grid-template-columns: repeat(3, 1fr); align-items: center; } }
    
    .price-card { border: 2px solid #E5E7EB; border-radius: 20px; padding: 25px; text-align: center; transition: all 0.3s; background: #fff; position: relative; }
    .price-card.featured { border-color: var(--primary); background: #F0F7FF; transform: scale(1.05); box-shadow: 0 15px 40px rgba(0,0,0,0.1); z-index: 10; }
    .price-card .qty { font-size: 14px; font-weight: 900; text-transform: uppercase; color: #6B7280; letter-spacing: 0.5px; }
    .price-card .price { font-size: 34px; font-weight: 900; color: var(--text); margin: 15px 0; }
    .price-card .savings { background: #10B981; color: #fff; font-size: 11px; font-weight: 900; padding: 5px 12px; border-radius: 25px; display: inline-block; margin-bottom: 15px; position: absolute; top: -12px; left: 50%; transform: translateX(-50%); }

    .sticky-cta { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(255,255,255,0.97); backdrop-filter: blur(12px); padding: 15px 20px; border-top: 1px solid #E5E7EB; z-index: 2000; display: none; }
    body.scrolled .sticky-cta { display: block; }
  `;

  const pricingSection = pricing.length > 0 ? `
    <div class="pricing-grid">
      ${pricing.map(p => `
        <div class="price-card ${p.isBestValue ? 'featured' : ''}">
          ${p.savings ? `<div class="savings">ECONOMIZE ${p.savings}</div>` : ''}
          <div class="qty">${p.quantity} ${p.unitName || 'Unidades'}</div>
          <div style="margin: 20px 0;">${renderImage(0, productName)}</div>
          <div class="price">${p.price}</div>
          <a href="${ctaLink}" class="btn" style="padding: 15px; font-size: 14px; margin: 10px 0 0;">COMPRAR AGORA</a>
        </div>
      `).join('')}
    </div>
  ` : '';

  // TEMPLATE: ROBUSTA (Sales Page / AlphaFuel Style)
  if (templateType === 'Robusta') {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${productName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">
    <style>${css}</style>
</head>
<body>
    <div class="countdown-bar">${isBlackHat ? '⚠️ ATENÇÃO: ÚLTIMAS UNIDADES EM ESTOQUE COM DESCONTO' : 'OFERTA LIMITADA: FRETE GRÁTIS DISPONÍVEL HOJE'}</div>
    
    <nav class="nav">
      <div class="container">
        <div class="logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--primary)" style="margin-right: 2px;"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
          Portal <span style="color: var(--primary);">Vital</span>
        </div>
      </div>
    </nav>

    <div class="container" style="padding-top: 50px; text-align: center;">
      <h1 style="font-size: 38px;">${headline}</h1>
      <div class="stars" style="justify-content: center;">
        ${Array(5).fill('★').join('')} <span style="font-weight: 800; font-size: 13px; color: #4B5563; margin-left: 5px;">(16.892+ AVALIAÇÕES VERIFICADAS)</span>
      </div>
      <p style="font-size: 22px; font-weight: 600; color: #4B5563; margin-top: 15px;">${subheadline || ''}</p>
      
      <div style="max-width: 580px; margin: 35px auto;">
        ${renderImage(0, productName)}
      </div>

      <div style="text-align: left; margin-top: 45px; max-width: 620px; margin-left: auto; margin-right: auto;">
        ${benefits.map(b => `
          <div class="check-item">
            <svg class="check-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            ${b}
          </div>
        `).join('')}
      </div>

      <div class="card" style="text-align: left; margin-top: 50px;">
        <h2 style="margin-top: 0;">A Ciência por trás de ${productName}</h2>
        <p>${whatIsSection}</p>
        <p>${problemsSection}</p>
      </div>

      <h2 style="font-size: 34px; margin-top: 70px;">Selecione seu Pacote Promocional</h2>
      <p>Estoque limitado. Os preços abaixo são válidos apenas para hoje.</p>

      ${pricingSection}

      <div style="margin-top: 60px; padding: 40px; border: 2px solid #E5E7EB; border-radius: 24px; background: #fff; display: flex; align-items: center; gap: 30px; text-align: left;">
        <div style="background: #F3F4F6; border-radius: 100%; width: 100px; height: 100px; flex-shrink: 0; display: flex; items-center; justify-center; color: var(--primary);">
           <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin: auto;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        </div>
        <div>
          <h3 style="font-weight: 900; font-size: 22px; margin-bottom: 8px;">60 Dias de Satisfação Garantida</h3>
          <p style="font-size: 16px; margin-bottom: 0; color: #4B5563;">Assumimos todo o risco por você. Se você não notar resultados reais em até 60 dias, devolvemos seu dinheiro integralmente sem burocracia.</p>
        </div>
      </div>

      <a href="${ctaLink}" class="btn btn-pulse" style="max-width: 550px; margin: 50px auto;">${callToAction}</a>
    </div>

    <div class="sticky-cta">
      <div class="container">
        <a href="${ctaLink}" class="btn" style="margin-top: 0; padding: 18px; font-size: 16px;">${callToAction}</a>
      </div>
    </div>

    <footer style="text-align: center; padding: 80px 0; background: #111827; color: #9CA3AF; margin-top: 100px; font-size: 13px;">
      <div class="container">
        <p>© 2026 ${productName} Oficial. Todos os direitos reservados.</p>
        <p style="margin-top: 10px; opacity: 0.5;">Este site não é afiliado ao Google ou Facebook Inc.</p>
      </div>
    </footer>
    <script>
      window.addEventListener('scroll', function() {
        document.body.classList.toggle('scrolled', window.scrollY > 600);
      });
    </script>
</body>
</html>`;
  }

  // FALLBACK: REVIEW (Nutra System v6 Editorial)
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${headline}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">
    <style>${css}</style>
</head>
<body>
    <div class="countdown-bar">${isBlackHat ? '🔥 INVESTIGAÇÃO: O QUE AS GRANDES EMPRESAS ESTÃO ESCONDENDO' : 'PORTAL EDITORIAL: ANÁLISE ESPECIAL ATUALIZADA'}</div>
    <nav class="nav">
      <div class="container">
        <div class="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary)"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
          Portal <span style="color: var(--primary);">Saúde</span>
        </div>
      </div>
    </nav>

    <div class="container">
      <article class="card">
        <div style="color: #6B7280; font-size: 13px; margin-bottom: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">${editorialIntro}</div>
        <h1>${headline}</h1>
        
        <div style="margin: 30px 0;">
          ${renderImage(0, productName)}
        </div>

        <div style="background: #F3F4F6; border-left: 6px solid var(--primary); padding: 30px; margin: 35px 0; border-radius: 6px 20px 20px 6px;">
          <p style="margin: 0; font-style: italic; font-size: 19px; color: #111827; font-weight: 500;">"${quickSummary}"</p>
        </div>
        
        <p>${patternInterrupt}</p>
        
        <h2>O Desafio Biológico</h2>
        <p>${problemsSection}</p>
        
        <h2>O Veredito sobre ${productName}</h2>
        <p>${whatIsSection}</p>

        <p>${curiosityBridge}</p>

        <div style="background: var(--primary); color: #fff; padding: 35px; border-radius: 24px; margin: 45px 0; box-shadow: 0 15px 30px var(--primary)33;">
          <h3 style="margin: 0 0 20px; font-size: 24px; font-weight: 900;">Destaques da Investigação:</h3>
          <ul style="padding-left: 25px; font-size: 18px; margin: 0; font-weight: 500;">
            ${features.map(f => `<li style="margin-bottom: 12px;">${f}</li>`).join('')}
          </ul>
        </div>

        ${pricingSection}

        <div style="text-align: center; margin-top: 60px; border-top: 1px solid #E5E7EB; pt-50px">
          <h2 style="font-size: 30px;">Veredito Editorial</h2>
          <p>Após 30 dias de testes controlados, nossa equipe concluiu que o <strong>${productName}</strong> é a solução mais eficaz testada este ano.</p>
          <a href="${ctaLink}" class="btn btn-pulse" style="max-width: 500px; margin: 35px auto;">${callToAction}</a>
        </div>
      </article>
    </div>
    
    <script>
      window.addEventListener('scroll', function() {
        document.body.classList.toggle('scrolled', window.scrollY > 600);
      });
    </script>
</body>
</html>`;
}
