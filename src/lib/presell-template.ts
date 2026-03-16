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
  templateType: 'Launch' | 'Robust' | 'Review' | 'List';
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
    trackingLink, clarityScript, copyStyle = "Conservador"
  } = finalData;
  
  const ctaLink = trackingLink || targetUrl;

  // Real Image Rendering logic
  const getMedia = (index: number, slotLabel: string) => {
    if (productImageUrls && productImageUrls[index]) {
      return `<img src="${productImageUrls[index]}" class="n-slot-img" alt="${slotLabel}" style="width: 100%; border-radius: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.05);">`;
    }
    // Professional gray placeholder with icon
    return `
      <div class="n-slot-placeholder" style="width: 100%; aspect-ratio: 1/1; max-width: 300px; margin: 0 auto 30px; background: #f3f4f6; border: 2px dashed #e5e7eb; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #9ca3af;">
        <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5; margin-bottom: 12px;">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <span style="font-size: 0.75rem; font-weight: 700; opacity: 0.8;">FOTO DO PRODUTO</span>
        <span style="font-size: 0.6rem; opacity: 0.5; margin-top: 4px;">${slotLabel}</span>
      </div>
    `;
  };

  const isAgressive = copyStyle === 'Agressivo';

  const commonStyles = `
    :root { 
      --primary: ${buttonColor || '#2952A3'}; 
      --text: #111827; 
      --text-muted: #6B7280;
      --bg: #F9FAFB; 
      --card-bg: #FFFFFF;
      --radius: 20px;
      --shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
      --shadow-agressive: 0 0 40px ${buttonColor}44;
    }
    * { box-sizing: border-box; }
    body { font-family: 'Inter', -apple-system, sans-serif; background: var(--bg); color: var(--text); margin: 0; line-height: 1.6; }
    .n-container { max-width: 720px; margin: 0 auto; padding: 0 20px; }
    
    .n-header-bar { 
      background: ${isAgressive ? '#EF4444' : '#111827'}; 
      color: #fff; 
      text-align: center; 
      padding: 10px; 
      font-size: 0.75rem; 
      font-weight: 800; 
      text-transform: uppercase; 
      letter-spacing: 1px;
    }
    .n-navbar { 
      background: #fff; 
      border-bottom: 1px solid #E5E7EB; 
      padding: 12px 0; 
      position: sticky; 
      top: 0; 
      z-index: 1000; 
      box-shadow: 0 2px 10px rgba(0,0,0,0.02); 
    }
    .n-navbar-inner { display: flex; justify-content: space-between; align-items: center; }
    .n-logo { font-weight: 900; font-size: 1.1rem; color: #111827; text-decoration: none; display: flex; align-items: center; gap: 8px; }
    
    .n-editorial-card { background: #fff; padding: 40px; border-radius: var(--radius); box-shadow: var(--shadow); margin-top: 20px; border: 1px solid rgba(0,0,0,0.02); }
    .n-meta { color: #6B7280; font-size: 0.85rem; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #F3F4F6; display: flex; align-items: center; gap: 10px; }
    
    h1 { font-size: 2.25rem; font-weight: 900; line-height: 1.15; color: #111827; margin: 0 0 24px; letter-spacing: -0.03em; }
    h2 { font-size: 1.75rem; font-weight: 800; color: #111827; margin: 48px 0 24px; letter-spacing: -0.01em; }
    p { margin-bottom: 28px; font-size: 1.125rem; color: #374151; }
    
    .n-summary { background: #F3F4F6; border-left: 6px solid var(--primary); padding: 32px; margin-bottom: 48px; font-style: italic; border-radius: 0 16px 16px 0; }
    
    .n-btn { 
      display: inline-block; 
      width: 100%; 
      background: var(--primary); 
      color: #fff; 
      text-align: center; 
      padding: 24px; 
      border-radius: 16px; 
      font-weight: 900; 
      font-size: 1.35rem; 
      text-decoration: none; 
      text-transform: uppercase; 
      margin-top: 24px; 
      transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
      box-shadow: 0 12px 24px -6px ${buttonColor}44; 
      border: none; 
      cursor: pointer; 
    }
    .n-btn:active { transform: scale(0.97); }
    
    .n-price-grid { display: grid; gap: 24px; margin: 60px 0; }
    .n-price-card { 
      background: #fff; 
      border: 1px solid #E5E7EB; 
      border-radius: var(--radius); 
      padding: 40px 32px; 
      text-align: center; 
      position: relative; 
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
    }
    .n-price-card.featured { 
      border: 2px solid var(--primary); 
      transform: scale(1.04); 
      z-index: 5; 
      box-shadow: ${isAgressive ? 'var(--shadow-agressive)' : '0 20px 50px -10px rgba(0,0,0,0.1)'}; 
    }
    
    .n-badge { 
      background: var(--primary); 
      color: #fff; 
      font-size: 0.8rem; 
      font-weight: 900; 
      padding: 8px 20px; 
      border-radius: 50px; 
      position: absolute; 
      top: -18px; 
      left: 50%; 
      transform: translateX(-50%); 
      white-space: nowrap; 
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    
    .n-table { width: 100%; border-collapse: collapse; margin: 40px 0; font-size: 0.95rem; border-radius: 16px; overflow: hidden; border: 1px solid #E5E7EB; box-shadow: var(--shadow); }
    .n-table th { background: #F9FAFB; padding: 20px; text-align: left; border-bottom: 2px solid #E5E7EB; color: #111827; }
    .n-table td { padding: 20px; border-bottom: 1px solid #F3F4F6; }
    
    .n-footer { text-align: center; padding: 100px 0; color: #9CA3AF; font-size: 0.85rem; border-top: 1px solid #E5E7EB; margin-top: 100px; background: #fff; }
    
    @keyframes pulse { 0% { transform: scale(1); box-shadow: 0 0 0 0 ${buttonColor}66; } 70% { transform: scale(1.02); box-shadow: 0 0 0 20px ${buttonColor}00; } 100% { transform: scale(1); box-shadow: 0 0 0 0 ${buttonColor}00; } }
    .n-pulse { animation: pulse 3s infinite; }

    @media (max-width: 640px) {
      h1 { font-size: 1.85rem; line-height: 1.2; }
      .n-editorial-card { padding: 24px; border-radius: 16px; }
      .n-btn { padding: 22px; font-size: 1.2rem; }
      .n-price-card.featured { transform: scale(1.02); margin-bottom: 20px; }
    }
  `;

  const finalHTML = `
    <div class="n-header-bar">${isAgressive ? 'ALERTA: ÚLTIMAS UNIDADES COM DESCONTO DE LANÇAMENTO' : 'Investigação Especial: Atualizado em Janeiro de 2026'}</div>
    <nav class="n-navbar">
      <div class="n-container n-navbar-inner">
        <a href="#" class="n-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary)" style="border-radius: 6px;"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
          PORTAL SAÚDE
        </a>
        <div style="font-size: 0.75rem; color: #EF4444; font-weight: 800; display: flex; align-items: center; gap: 6px;">
          <span style="width: 10px; height: 10px; background: #EF4444; border-radius: 50%; display: inline-block; animation: pulse 1s infinite;"></span>
          INVESTIGAÇÃO AO VIVO
        </div>
      </div>
    </nav>

    <div class="n-container">
      <article class="n-editorial-card">
        <div class="n-meta">
          <div style="width: 32px; height: 32px; background: #E5E7EB; border-radius: 50%; flex-shrink: 0;"></div>
          ${editorialIntro}
        </div>
        <h1>${headline}</h1>
        ${subheadline ? `<p style="font-weight: 500; color: #4B5563; font-size: 1.3rem; margin-bottom: 32px; line-height: 1.4;">${subheadline}</p>` : ''}
        
        ${getMedia(0, 'HERO BUNDLE')}

        <div class="n-summary">${quickSummary}</div>
        
        <p>${patternInterrupt}</p>
        
        <h2 style="color: ${isAgressive ? '#EF4444' : '#111827'};">A Raiz do Problema</h2>
        <p>${problemsSection}</p>
        
        ${getMedia(1, 'BODY IMAGE A')}

        <h2>O que é ${productName}?</h2>
        <p>${whatIsSection}</p>
        
        <div style="background: var(--primary); color: #fff; padding: 40px; border-radius: 20px; margin: 50px 0; box-shadow: 0 15px 40px -10px ${buttonColor}66;">
          <h3 style="margin-top: 0; font-size: 1.6rem; font-weight: 900;">Destaques Principais:</h3>
          <ul style="padding-left: 20px; font-size: 1.15rem; line-height: 2;">
            ${features.map(f => `<li style="margin-bottom: 8px;">${f}</li>`).join('')}
          </ul>
        </div>

        <p>${curiosityBridge}</p>

        <h2>Benefícios e Resultados</h2>
        <div style="display: grid; gap: 20px; margin-bottom: 48px; background: #F9FAFB; padding: 40px; border-radius: 20px; border: 1px solid #E5E7EB;">
          ${benefits.map(b => `<div style="display:flex; gap:16px; align-items:center;">
            <div style="background: var(--primary); width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <strong style="font-size: 1.15rem; font-weight: 700;">${b}</strong>
          </div>`).join('')}
        </div>

        ${getMedia(2, 'BODY IMAGE B')}

        ${comparisonTable.length ? `
          <h2>Análise Técnica</h2>
          <table class="n-table">
            <thead>
              <tr><th>Recurso</th><th>${productName}</th><th>Concorrentes</th></tr>
            </thead>
            <tbody>
              ${comparisonTable.map(r => `<tr><td>${r.feature}</td><td style="color: #059669; font-weight: 800;">${r.product}</td><td style="color: #EF4444;">${r.competitor}</td></tr>`).join('')}
            </tbody>
          </table>
        ` : ''}

        <div style="margin: 100px 0; text-align: center;">
          <h2 style="margin-bottom: 20px; font-size: 2.2rem;">Veredito da Redação</h2>
          <p style="font-size: 1.25rem;">Após 30 dias de análise, o ${productName} demonstrou ser a solução mais consistente do mercado.</p>
          <a href="${ctaLink}" class="n-btn n-pulse">${callToAction}</a>
          <div style="margin-top: 20px; display: flex; justify-content: center; gap: 15px; opacity: 0.6;">
            <svg width="60" height="24" viewBox="0 0 38 24"><rect width="38" height="24" rx="4" fill="#1434CB"/><circle cx="7" cy="12" r="4" fill="white"/><circle cx="31" cy="12" r="4" fill="white"/></svg>
            <svg width="60" height="24" viewBox="0 0 38 24"><rect width="38" height="24" rx="4" fill="#EB001B"/><circle cx="14" cy="12" r="8" fill="#FF5F00" opacity="0.8"/><circle cx="14" cy="12" r="8" fill="#EB001B"/><circle cx="24" cy="12" r="8" fill="#F79E1B"/></svg>
          </div>
        </div>

        ${pricing.length ? `
          <h2 style="text-align: center; margin-bottom: 40px;">Kits com Desconto Direto da Fábrica</h2>
          <div class="n-price-grid">
            ${pricing.map((p, idx) => `
              <div class="n-price-card ${p.isBestValue ? 'featured' : ''}">
                ${p.isBestValue ? '<div class="n-badge">RECOMENDADO</div>' : ''}
                <div style="font-weight: 900; font-size: 1.25rem; margin-bottom: 12px; color: #111827;">${p.quantity}</div>
                <div style="color: #059669; font-size: 0.9rem; font-weight: 800; background: #ECFDF5; display: inline-block; padding: 4px 12px; border-radius: 6px;">${p.discount}</div>
                <div style="font-size: 2.5rem; font-weight: 900; color: var(--primary); margin: 24px 0;">${p.price}</div>
                ${getMedia(idx + 1, 'KIT IMAGE')}
                <a href="${ctaLink}" style="background: var(--primary); color: #fff; padding: 20px; display: block; text-decoration: none; border-radius: 12px; font-weight: 900; font-size: 1.1rem; margin-top: 24px; box-shadow: 0 4px 10px ${buttonColor}33;">COMPRAR AGORA</a>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${faqs.length ? `
          <h2>Dúvidas Frequentes</h2>
          <div style="display: grid; gap: 16px;">
            ${faqs.map(f => `
              <details style="border: 1px solid #E5E7EB; border-radius: 16px; padding: 24px; cursor: pointer; transition: background 0.2s;">
                <summary style="font-weight: 700; font-size: 1.15rem; list-style: none; display: flex; justify-content: space-between; align-items: center;">
                  ${f.q}
                  <span style="font-size: 1.5rem; color: var(--primary); line-height: 1;">+</span>
                </summary>
                <p style="margin: 20px 0 0; font-size: 1.1rem; color: #4B5563; line-height: 1.6;">${f.a}</p>
              </details>
            `).join('')}
          </div>
        ` : ''}
      </article>
    </div>

    <footer class="n-footer">
      <div class="n-container">
        <p style="font-weight: 700; color: #111827;">Copyright 2026 ${productName}</p>
        <p style="font-size: 0.75rem; opacity: 0.6; margin-top: 20px; max-width: 500px; margin-left: auto; margin-right: auto; line-height: 1.5;">AVISO: Este site é um publieditorial. Os resultados podem variar. As informações não substituem consulta médica.</p>
      </div>
    </footer>
    ${clarityScript || ''}
  `;

  if (wrapForElementor) {
    return `<div id="nutra-v6-wrapper" class="nutra-v6-e">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800;900&display=swap" rel="stylesheet">
  <style>${commonStyles.replace(/body/g, '.nutra-v6-e')}</style>
  ${finalHTML}
</div>`.trim();
  }

  return `<!DOCTYPE html>
<html lang="${data?.targetLanguage === 'Brasil' ? 'pt-BR' : 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${headline}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800;900&display=swap" rel="stylesheet">
    <style>${commonStyles}</style>
</head>
<body>
    ${finalHTML}
</body>
</html>`;
}
