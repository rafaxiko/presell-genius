export type PricingOption = {
  quantity: string;
  discount: string;
  price: string;
  isBestValue: boolean;
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
    headline: "Investigação Especial: O impacto do novo composto na saúde moderna",
    editorialIntro: "Por: Redação Saúde & Vida | Atualizado em 2026",
    quickSummary: "Analisamos se este novo lançamento realmente cumpre o prometido no mercado internacional.",
    patternInterrupt: "Esqueça tudo o que você sabia sobre este tema até agora.",
    problemsSection: "A maioria das pessoas sofre com sintomas persistentes sem saber a real causa biológica.",
    whatIsSection: "Uma nova tecnologia patenteada que atua diretamente nos receptores celulares.",
    curiosityBridge: "Mas por que a grande mídia ainda não está falando sobre isso abertamente?",
    features: ["Absorção em 3 minutos", "Origem 100% Orgânica", "Sem efeitos colaterais"],
    benefits: ["Energia Vital", "Foco Cognitivo", "Longevidade"],
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
    trackingLink, clarityScript, copyStyle, templateType
  } = finalData;
  
  const ctaLink = trackingLink || targetUrl;
  const isBlackHat = copyStyle === 'Black Hat (Agressivo)';
  const isCookie = templateType === 'Cookie';
  const primaryColor = isBlackHat ? '#FF0000' : (buttonColor || '#2952A3');

  const renderImage = (index: number, alt: string) => {
    if (productImageUrls && productImageUrls[index]) {
      return `<img src="${productImageUrls[index]}" alt="${alt}" style="width: 100%; border-radius: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.1); display: block; margin: 0 auto;">`;
    }
    return `
      <div style="width: 100%; aspect-ratio: 1/1; background: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #9ca3af;">
        <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="1.5" fill="none" style="opacity: 0.3; margin-bottom: 12px;">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <span style="font-size: 11px; font-weight: 700; text-transform: uppercase;">Aguardando Foto do Produto</span>
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
    }
    .container { max-width: 680px; margin: 0 auto; padding: 0 20px; }
    
    .top-bar { 
      background: ${isBlackHat ? '#FF0000' : '#111827'}; 
      color: #fff; 
      text-align: center; 
      padding: 10px; 
      font-size: 12px; 
      font-weight: 800; 
      text-transform: uppercase; 
      ${isBlackHat ? 'animation: blink 0.8s infinite;' : ''}
    }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }

    .nav { 
      background: #fff; 
      border-bottom: 1px solid #E5E7EB; 
      padding: 15px 0; 
      position: sticky; 
      top: 0; 
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.03);
    }
    .logo { font-weight: 900; font-size: 18px; color: #111827; display: flex; align-items: center; gap: 8px; }
    
    .card { 
      background: var(--card); 
      padding: 30px; 
      border-radius: var(--radius); 
      box-shadow: 0 4px 12px rgba(0,0,0,0.03); 
      margin-top: 25px; 
    }
    h1 { font-size: 28px; font-weight: 900; line-height: 1.2; color: #111827; margin-bottom: 20px; }
    h2 { font-size: 24px; font-weight: 800; color: #111827; margin-top: 40px; margin-bottom: 20px; }
    p { margin-bottom: 20px; font-size: 18px; color: #374151; }
    
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
      margin-top: 30px; 
      transition: all 0.2s;
      box-shadow: 0 8px 20px ${primaryColor}33;
    }
    .btn:active { transform: scale(0.97); }
    
    .sticky-cta {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(255,255,255,0.9);
      backdrop-filter: blur(10px);
      padding: 15px 20px;
      border-top: 1px solid #eee;
      z-index: 2000;
    }

    @media (max-width: 600px) {
      h1 { font-size: 24px; }
      .card { padding: 20px; }
    }
  `;

  if (isCookie) {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    <style>${css} body { background: #fff; }</style>
</head>
<body>
    <div class="container" style="text-align: center; padding-top: 60px;">
        <h1>${headline}</h1>
        <div style="max-width: 400px; margin: 40px auto;">
          ${renderImage(0, productName)}
        </div>
        <a href="${ctaLink}" class="btn" style="max-width: 400px; margin: 40px auto; font-size: 24px;">CONTINUAR</a>
        <p style="font-size: 14px; color: #999; margin-top: 60px;">© 2026 ${productName}</p>
    </div>
</body>
</html>`;
  }

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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary)"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
          PORTAL SAÚDE
        </div>
      </div>
    </nav>

    <div class="container">
      <article class="card">
        <div style="color: #6B7280; font-size: 13px; margin-bottom: 15px; font-weight: 600;">${editorialIntro}</div>
        <h1>${headline}</h1>
        ${subheadline ? `<p style="font-weight: 500; font-size: 20px;">${subheadline}</p>` : ''}
        
        <div style="margin: 30px 0;">
          ${renderImage(0, productName)}
        </div>

        <div style="background: #F3F4F6; border-left: 5px solid var(--primary); padding: 25px; margin: 35px 0; border-radius: 4px 16px 16px 4px;">
          <p style="margin: 0; font-style: italic; font-size: 17px;">"${quickSummary}"</p>
        </div>
        
        <p>${patternInterrupt}</p>
        
        <h2>A Verdade Revelada</h2>
        <p>${problemsSection}</p>
        
        <h2>O que é ${productName}?</h2>
        <p>${whatIsSection}</p>

        <p>${curiosityBridge}</p>

        <div style="background: var(--primary); color: #fff; padding: 30px; border-radius: 20px; margin: 40px 0;">
          <h3 style="margin: 0 0 15px; font-size: 22px; font-weight: 900;">Destaques:</h3>
          <ul style="padding-left: 20px; font-size: 17px;">
            ${features.map(f => `<li style="margin-bottom: 8px;">${f}</li>`).join('')}
          </ul>
        </div>

        <div style="text-align: center; margin-top: 60px;">
          <h2 style="font-size: 30px;">Veredito Final</h2>
          <p>Se você busca uma solução baseada em ciência, o <strong>${productName}</strong> é a recomendação oficial de 2026.</p>
          <a href="${ctaLink}" class="btn">${callToAction}</a>
        </div>
      </article>
    </div>

    <div class="sticky-cta">
      <div class="container">
        <a href="${ctaLink}" class="btn" style="margin-top: 0; padding: 18px; font-size: 16px;">${callToAction}</a>
      </div>
    </div>

    <footer style="text-align: center; padding: 50px 0; color: #9CA3AF; font-size: 12px;">
      <div class="container">
        <p>© 2026 ${productName} - Todos os direitos reservados.</p>
        <p style="margin-top: 15px;">AVISO: Os resultados variam de acordo com o metabolismo individual.</p>
      </div>
    </footer>
    ${clarityScript || ''}
</body>
</html>`;
}
