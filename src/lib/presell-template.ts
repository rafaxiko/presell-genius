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

  const renderImage = (index: number, alt: string, className: string = "") => {
    if (productImageUrls && productImageUrls[index]) {
      return `<img src="${productImageUrls[index]}" alt="${alt}" class="${className}" style="max-width: 100%; height: auto; border-radius: 12px; display: block; margin: 0 auto;">`;
    }
    return `
      <div style="width: 100%; aspect-ratio: 16/9; background: ${primaryColor}11; border: 2px dashed ${primaryColor}44; border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: ${primaryColor};" class="${className}">
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
      padding: 10px; 
      font-size: 12px; 
      font-weight: 800; 
      text-transform: uppercase; 
      ${isBlackHat ? 'background: #FF0000; animation: blink 1s infinite;' : ''}
    }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }

    .nav { background: #fff; border-bottom: 1px solid #E5E7EB; padding: 15px 0; position: sticky; top: 0; z-index: 1000; }
    .logo { font-weight: 900; font-size: 18px; color: #111827; display: flex; align-items: center; gap: 8px; }
    
    .card { background: var(--card); padding: 30px; border-radius: var(--radius); box-shadow: 0 4px 20px rgba(0,0,0,0.04); margin-top: 25px; border: 1px solid rgba(0,0,0,0.05); }
    h1 { font-size: 28px; font-weight: 900; line-height: 1.2; color: #111827; margin-bottom: 15px; }
    h2 { font-size: 24px; font-weight: 800; color: #111827; margin-top: 40px; margin-bottom: 20px; }
    p { margin-bottom: 15px; font-size: 18px; color: #374151; }
    
    .btn { 
      display: block; 
      width: 100%; 
      background: var(--primary); 
      color: #fff; 
      text-align: center; 
      padding: 22px; 
      border-radius: 12px; 
      font-weight: 900; 
      font-size: 18px; 
      text-decoration: none; 
      text-transform: uppercase; 
      margin: 25px 0; 
      transition: all 0.2s;
      box-shadow: 0 8px 20px ${primaryColor}44;
      border: none;
      cursor: pointer;
    }
    .btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
    .btn-pulse { animation: pulse 2s infinite; }
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 ${primaryColor}66; } 70% { box-shadow: 0 0 0 12px ${primaryColor}00; } 100% { box-shadow: 0 0 0 0 ${primaryColor}00; } }

    .stars { color: #FBBF24; display: flex; gap: 3px; margin: 15px 0; font-size: 14px; align-items: center; }
    .check-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; font-size: 16px; font-weight: 600; }
    .check-icon { color: var(--primary); flex-shrink: 0; margin-top: 4px; }

    .pricing-grid { display: grid; gap: 20px; margin: 40px 0; }
    @media (min-width: 600px) { .pricing-grid { grid-template-columns: repeat(3, 1fr); align-items: center; } }
    
    .price-card { border: 2px solid #E5E7EB; border-radius: 20px; padding: 25px; text-align: center; transition: all 0.3s; background: #fff; }
    .price-card.featured { border-color: var(--primary); background: #F0F7FF; transform: scale(1.05); box-shadow: 0 15px 35px rgba(0,0,0,0.08); z-index: 10; }
    .price-card .qty { font-size: 15px; font-weight: 900; text-transform: uppercase; color: #6B7280; }
    .price-card .price { font-size: 32px; font-weight: 900; color: var(--text); margin: 15px 0; }
    .price-card .savings { background: #10B981; color: #fff; font-size: 11px; font-weight: 900; padding: 4px 10px; border-radius: 20px; display: inline-block; margin-bottom: 15px; }

    .sticky-cta { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); padding: 15px 20px; border-top: 1px solid #E5E7EB; z-index: 2000; display: none; }
    body.scrolled .sticky-cta { display: block; }
  `;

  const pricingSection = pricing.length > 0 ? `
    <div class="pricing-grid">
      ${pricing.map(p => `
        <div class="price-card ${p.isBestValue ? 'featured' : ''}">
          <div class="qty">${p.quantity} ${p.unitName || 'Unidades'}</div>
          <div style="margin: 15px 0;">${renderImage(0, productName)}</div>
          <div class="price">${p.price}</div>
          ${p.savings ? `<div class="savings">ECONOMIZE ${p.savings}</div>` : ''}
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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    <style>${css}</style>
</head>
<body>
    <div class="countdown-bar">${isBlackHat ? '⚠️ ATENÇÃO: ÚLTIMAS UNIDADES EM ESTOQUE COM DESCONTO' : 'OFERTA ESPECIAL: FRETE GRÁTIS DISPONÍVEL HOJE'}</div>
    
    <div class="container" style="padding-top: 40px; text-align: center;">
      <div class="stars" style="justify-content: center;">
        ${Array(5).fill('★').join('')} <span style="font-weight: 700;">(16.892+ AVALIAÇÕES)</span>
      </div>
      <h1 style="font-size: 34px; margin-bottom: 10px;">${headline}</h1>
      <p style="font-size: 20px; font-weight: 600; color: #6B7280; margin-bottom: 30px;">${subheadline || ''}</p>
      
      <div style="max-width: 550px; margin: 0 auto;">
        ${renderImage(0, productName)}
      </div>

      <div style="text-align: left; margin-top: 40px; max-width: 600px; margin-left: auto; margin-right: auto;">
        ${benefits.map(b => `
          <div class="check-item">
            <svg class="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            ${b}
          </div>
        `).join('')}
      </div>

      <div class="card" style="text-align: left;">
        <h2>A Revolução de ${productName}</h2>
        <p>${whatIsSection}</p>
        <p>${problemsSection}</p>
      </div>

      <h2 style="font-size: 32px; margin-top: 60px;">Escolha Seu Pacote Abaixo</h2>
      <p>Aproveite os preços promocionais enquanto durar o estoque.</p>

      ${pricingSection}

      <div style="margin-top: 50px; padding: 30px; border: 2px solid #E5E7EB; border-radius: 20px; background: #fff;">
        <h3 style="font-weight: 900; margin-bottom: 10px;">Garantia de Satisfação Total</h3>
        <p style="font-size: 15px; margin-bottom: 0;">Se você não ficar 100% satisfeito com os resultados nos primeiros 60 dias, nós devolvemos seu dinheiro integralmente. Risco zero.</p>
      </div>

      <a href="${ctaLink}" class="btn btn-pulse" style="max-width: 500px; margin: 40px auto;">${callToAction}</a>
    </div>

    <div class="sticky-cta">
      <div class="container">
        <a href="${ctaLink}" class="btn" style="margin-top: 0; padding: 15px; font-size: 15px;">${callToAction}</a>
      </div>
    </div>

    <footer style="text-align: center; padding: 60px 0; background: #111827; color: #9CA3AF; margin-top: 80px; font-size: 12px;">
      <div class="container">
        <p>© 2026 ${productName} - Todos os direitos reservados.</p>
      </div>
    </footer>
    <script>
      window.addEventListener('scroll', function() {
        document.body.classList.toggle('scrolled', window.scrollY > 500);
      });
    </script>
</body>
</html>`;
  }

  // Fallback para Review (Editorial Nutra v6)
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
    <div class="countdown-bar">${isBlackHat ? '🔥 INVESTIGAÇÃO: O QUE AS GRANDES EMPRESAS ESTÃO ESCONDENDO' : 'PORTAL EDITORIAL: ANÁLISE ESPECIAL ATUALIZADA'}</div>
    <nav class="nav">
      <div class="container">
        <div class="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary)"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
          PORTAL SAÚDE
        </div>
      </div>
    </nav>

    <div class="container">
      <article class="card">
        <div style="color: #6B7280; font-size: 13px; margin-bottom: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">${editorialIntro}</div>
        <h1>${headline}</h1>
        
        <div style="margin: 25px 0;">
          ${renderImage(0, productName)}
        </div>

        <div style="background: #F3F4F6; border-left: 5px solid var(--primary); padding: 25px; margin: 30px 0; border-radius: 4px 12px 12px 4px;">
          <p style="margin: 0; font-style: italic; font-size: 17px; color: #111827;">"${quickSummary}"</p>
        </div>
        
        <p>${patternInterrupt}</p>
        
        <h2>O Desafio Silencioso</h2>
        <p>${problemsSection}</p>
        
        <h2>O que é ${productName}?</h2>
        <p>${whatIsSection}</p>

        <p>${curiosityBridge}</p>

        <div style="background: var(--primary); color: #fff; padding: 30px; border-radius: 20px; margin: 40px 0;">
          <h3 style="margin: 0 0 15px; font-size: 22px; font-weight: 900;">Destaques Principais:</h3>
          <ul style="padding-left: 20px; font-size: 17px; margin: 0;">
            ${features.map(f => `<li style="margin-bottom: 10px;">${f}</li>`).join('')}
          </ul>
        </div>

        ${pricingSection}

        <div style="text-align: center; margin-top: 50px;">
          <h2>Veredito Editorial</h2>
          <p>Após nossa análise rigorosa, o <strong>${productName}</strong> destaca-se como a melhor escolha custo-benefício para 2026.</p>
          <a href="${ctaLink}" class="btn btn-pulse">${callToAction}</a>
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
