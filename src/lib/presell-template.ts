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
  templateType: 'Cookie' | 'Robust' | 'Review' | 'BlackHat';
  copyStyle?: 'Conservador' | 'Agressivo';
  targetLanguage?: string;
};

/**
 * Generates the full HTML for the presell page using the Nutra Presell System v6 logic.
 */
export function generatePresellHTML(data: PresellData | null, wrapForElementor = false): string {
  const defaultData: PresellData = {
    productName: "Produto Exemplo",
    headline: "Investigação Especial: A verdade sobre o novo composto que está mudando rotinas",
    editorialIntro: "Por: Redação Saúde & Bem-Estar | Atualizado em 2026",
    quickSummary: "Analisamos os dados científicos por trás deste lançamento para entender se ele realmente cumpre o que promete.",
    patternInterrupt: "Você provavelmente já ouviu falar de várias soluções, mas esta abordagem é fundamentalmente diferente.",
    problemsSection: "Muitas pessoas enfrentam dificuldades diárias que parecem não ter solução, gerando frustração constante.",
    whatIsSection: "Trata-se de uma tecnologia patenteada que atua diretamente na raiz do problema, sem métodos invasivos.",
    curiosityBridge: "Mas o que realmente chamou nossa atenção foi o resultado dos testes em grupos de controle.",
    features: ["Tecnologia de Absorção Rápida", "Ingredientes 100% Naturais", "Certificação de Pureza"],
    benefits: ["Energia Renovada", "Foco Aprimorado", "Bem-Estar Geral"],
    callToAction: "VERIFICAR DISPONIBILIDADE NO SITE OFICIAL",
    buttonColor: "#2952A3",
    targetUrl: "#",
    templateType: "Robust",
    copyStyle: "Conservador",
    productImageUrls: []
  };

  const finalData = data || defaultData;
  const { 
    productName, headline, subheadline, editorialIntro, quickSummary, patternInterrupt,
    problemsSection, whatIsSection, curiosityBridge, features = [], benefits = [], 
    comparisonTable = [], pros = [], cons = [], testimonials = [], pricing = [], 
    faqs = [], callToAction, buttonColor, targetUrl, productImageUrls = [], 
    trackingLink, clarityScript, copyStyle = "Conservador", templateType
  } = finalData;
  
  const ctaLink = trackingLink || targetUrl;
  const isBlackHat = templateType === 'BlackHat';
  const isCookie = templateType === 'Cookie';
  const primaryColor = isBlackHat ? '#FF0000' : (buttonColor || '#2952A3');

  // Real Image Rendering logic
  const getMedia = (index: number, slotLabel: string, styleOverride = "") => {
    if (productImageUrls && productImageUrls[index]) {
      return `<img src="${productImageUrls[index]}" class="n-slot-img" alt="${slotLabel}" style="width: 100%; border-radius: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.05); ${styleOverride}">`;
    }
    return `
      <div class="n-slot-placeholder" style="width: 100%; aspect-ratio: 16/9; background: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #9ca3af; ${styleOverride}">
        <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.4; margin-bottom: 8px;">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">${slotLabel}</span>
      </div>
    `;
  };

  const commonStyles = `
    :root { 
      --primary: ${primaryColor}; 
      --text: #111827; 
      --text-muted: #6B7280;
      --bg: #F9FAFB; 
      --card-bg: #FFFFFF;
      --radius: 20px;
    }
    * { box-sizing: border-box; }
    body { font-family: 'Inter', -apple-system, sans-serif; background: var(--bg); color: var(--text); margin: 0; line-height: 1.6; padding-bottom: 80px; }
    .n-container { max-width: 720px; margin: 0 auto; padding: 0 20px; }
    
    .n-header-bar { 
      background: ${isBlackHat ? '#FF0000' : '#111827'}; 
      color: #fff; 
      text-align: center; 
      padding: 12px; 
      font-size: 13px; 
      font-weight: 800; 
      text-transform: uppercase; 
      letter-spacing: 1px;
      ${isBlackHat ? 'animation: blink 0.8s infinite;' : ''}
    }
    @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

    .n-navbar { 
      background: #fff; 
      border-bottom: 1px solid #E5E7EB; 
      padding: 14px 0; 
      position: sticky; 
      top: 0; 
      z-index: 1000; 
      box-shadow: 0 2px 10px rgba(0,0,0,0.02); 
    }
    .n-logo { font-weight: 900; font-size: 18px; color: #111827; text-decoration: none; display: flex; align-items: center; gap: 8px; }
    
    .n-editorial-card { background: #fff; padding: 40px; border-radius: var(--radius); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04); margin-top: 20px; border: 1px solid rgba(0,0,0,0.02); }
    h1 { font-size: 32px; font-weight: 900; line-height: 1.2; color: #111827; margin: 0 0 24px; letter-spacing: -0.03em; }
    h2 { font-size: 26px; font-weight: 800; color: #111827; margin: 48px 0 24px; letter-spacing: -0.01em; }
    p { margin-bottom: 24px; font-size: 18px; color: #374151; }
    
    .n-btn { 
      display: inline-block; 
      width: 100%; 
      background: var(--primary); 
      color: #fff; 
      text-align: center; 
      padding: 24px; 
      border-radius: 16px; 
      font-weight: 900; 
      font-size: 20px; 
      text-decoration: none; 
      text-transform: uppercase; 
      margin-top: 24px; 
      transition: transform 0.2s; 
      box-shadow: 0 10px 20px ${primaryColor}44;
      border: none;
    }
    .n-btn:active { transform: scale(0.98); }
    
    .n-sticky-cta {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(10px);
      padding: 15px 20px;
      border-top: 1px solid #eee;
      z-index: 2000;
      display: none;
    }
    @media (max-width: 768px) {
      .n-sticky-cta { display: block; }
      h1 { font-size: 26px; }
      .n-editorial-card { padding: 24px; }
    }
  `;

  // --- Cookie Template ---
  if (isCookie) {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    <style>${commonStyles} body { background: #fff; padding: 0; }</style>
</head>
<body>
    <div class="n-container" style="text-align: center; padding-top: 60px;">
        <h1 style="margin-bottom: 40px;">${headline}</h1>
        ${getMedia(0, 'FOTO PRINCIPAL', 'max-width: 500px; margin: 0 auto;')}
        <div style="margin-top: 40px;">
            <a href="${ctaLink}" class="n-btn" style="max-width: 400px; font-size: 24px;">CONTINUAR</a>
        </div>
        <p style="font-size: 14px; color: #999; margin-top: 60px;">© 2026 ${productName} - Todos os direitos reservados.</p>
    </div>
</body>
</html>`;
  }

  // --- Robust & BlackHat Templates ---
  const finalHTML = `
    <div class="n-header-bar">${isBlackHat ? '🔥 ÚLTIMAS UNIDADES NO ESTOQUE - OFERTA POR TEMPO LIMITADO' : 'INVESTIGAÇÃO ESPECIAL: ATUALIZADO EM JANEIRO DE 2026'}</div>
    <nav class="n-navbar">
      <div class="n-container">
        <div class="n-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary)" style="border-radius: 6px;"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
          PORTAL SAÚDE
        </div>
      </div>
    </nav>

    <div class="n-container">
      <article class="n-editorial-card">
        <div style="color: #6B7280; font-size: 14px; margin-bottom: 24px;">${editorialIntro}</div>
        <h1>${headline}</h1>
        ${subheadline ? `<p style="font-weight: 500; color: #4B5563;">${subheadline}</p>` : ''}
        
        ${getMedia(0, 'HERO IMAGE')}

        <div style="background: #F3F4F6; border-left: 6px solid var(--primary); padding: 30px; margin: 40px 0; font-style: italic; border-radius: 0 16px 16px 0;">
          ${quickSummary}
        </div>
        
        <p>${patternInterrupt}</p>
        
        <h2>A Raiz do Problema</h2>
        <p>${problemsSection}</p>
        
        <h2>O que é ${productName}?</h2>
        <p>${whatIsSection}</p>

        <p>${curiosityBridge}</p>

        <div style="background: var(--primary); color: #fff; padding: 40px; border-radius: 20px; margin: 50px 0;">
          <h3 style="margin-top: 0; font-size: 24px; font-weight: 900;">Destaques Principais:</h3>
          <ul style="padding-left: 20px; font-size: 18px;">
            ${features.map(f => `<li style="margin-bottom: 12px;">${f}</li>`).join('')}
          </ul>
        </div>

        <div style="text-align: center; margin-top: 80px;">
          <h2 style="font-size: 32px;">Veredito da Redação</h2>
          <p>Após nossa análise rigorosa, o <strong>${productName}</strong> demonstrou ser a escolha número #1 para 2026.</p>
          <a href="${ctaLink}" class="n-btn" style="${isBlackHat ? 'background: #FF0000; box-shadow: 0 0 30px rgba(255,0,0,0.4);' : ''}">${callToAction}</a>
        </div>
      </article>
    </div>

    <div class="n-sticky-cta">
      <a href="${ctaLink}" class="n-btn" style="margin-top: 0; padding: 18px; font-size: 16px;">${callToAction}</a>
    </div>

    <footer style="text-align: center; padding: 60px 0; color: #9CA3AF; font-size: 12px; border-top: 1px solid #E5E7EB; margin-top: 80px; background: #fff;">
      <div class="n-container">
        <p style="font-weight: 700; color: #111827;">Copyright 2026 ${productName}</p>
        <p style="max-width: 500px; margin: 20px auto; line-height: 1.5;">AVISO: Este site é um publieditorial. Os resultados variam de pessoa para pessoa.</p>
      </div>
    </footer>
    ${clarityScript || ''}
  `;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${headline}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    <style>${commonStyles}</style>
</head>
<body>
    ${finalHTML}
</body>
</html>`;
}
