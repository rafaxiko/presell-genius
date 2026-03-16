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

  // Media Slot Mapping - Injection of real images or SVG placeholders
  const getMedia = (index: number, slotCode: string) => {
    if (productImageUrls && productImageUrls[index]) {
      return `<img src="${productImageUrls[index]}" class="n-slot-img" alt="${slotCode}">`;
    }
    return `
      <div class="n-slot-placeholder">
        <svg viewBox="0 0 24 24" width="48" height="48" stroke="${buttonColor}" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5;">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <span style="margin-top: 10px; font-size: 0.7rem; opacity: 0.6;">${slotCode} - IMAGEM DO PRODUTO</span>
      </div>
    `;
  };

  const commonStyles = `
    :root { 
      --primary: ${buttonColor || '#2952A3'}; 
      --text: #1F2937; 
      --text-muted: #6B7280;
      --bg: #F3F4F6; 
      --card-bg: #FFFFFF;
      --radius: 20px;
      --shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      --shadow-agressive: 0 0 30px ${buttonColor}33;
    }
    * { box-sizing: border-box; }
    body { font-family: 'Inter', -apple-system, sans-serif; background: var(--bg); color: var(--text); margin: 0; line-height: 1.6; }
    .n-container { max-width: 720px; margin: 0 auto; padding: 0 20px; }
    
    .n-header-bar { background: #111827; color: #fff; text-align: center; padding: 12px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .n-navbar { background: #fff; border-bottom: 1px solid #E5E7EB; padding: 15px 0; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
    .n-navbar-inner { display: flex; justify-content: space-between; align-items: center; }
    .n-logo { font-weight: 900; font-size: 1.2rem; color: #111827; text-decoration: none; }
    
    .n-editorial-card { background: #fff; padding: 40px; border-radius: var(--radius); box-shadow: var(--shadow); margin-top: 20px; border: 1px solid rgba(0,0,0,0.03); }
    .n-meta { color: #6B7280; font-size: 0.85rem; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #F3F4F6; }
    
    h1 { font-size: 2.2rem; font-weight: 800; line-height: 1.2; color: #111827; margin: 0 0 20px; letter-spacing: -0.02em; }
    h2 { font-size: 1.75rem; font-weight: 800; color: #111827; margin: 40px 0 20px; letter-spacing: -0.01em; }
    p { margin-bottom: 24px; font-size: 1.125rem; color: #374151; }
    
    .n-slot-img { width: 100%; border-radius: var(--radius); margin-bottom: 30px; display: block; box-shadow: var(--shadow); border: 1px solid rgba(0,0,0,0.05); }
    .n-slot-placeholder { min-height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #F9FAFB; border: 2px dashed #E5E7EB; margin-bottom: 30px; border-radius: var(--radius); }
    
    .n-summary { background: #F9FAFB; border-left: 5px solid var(--primary); padding: 30px; margin-bottom: 40px; font-style: italic; border-radius: 0 12px 12px 0; }
    .n-btn { display: inline-block; width: 100%; background: var(--primary); color: #fff; text-align: center; padding: 22px; border-radius: 12px; font-weight: 800; font-size: 1.3rem; text-decoration: none; text-transform: uppercase; margin-top: 20px; transition: all 0.2s; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); border: none; cursor: pointer; }
    .n-btn:active { transform: scale(0.98); }
    
    .n-price-grid { display: grid; gap: 24px; margin: 48px 0; }
    .n-price-card { background: #fff; border: 1px solid #E5E7EB; border-radius: var(--radius); padding: 32px; text-align: center; position: relative; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .n-price-card.featured { border: 2px solid var(--primary); transform: scale(1.05); z-index: 5; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); }
    ${copyStyle === 'Agressivo' ? '.n-price-card.featured { box-shadow: var(--shadow-agressive); }' : ''}
    
    .n-badge { background: var(--primary); color: #fff; font-size: 0.75rem; font-weight: 900; padding: 6px 16px; border-radius: 30px; position: absolute; top: -14px; left: 50%; transform: translateX(-50%); white-space: nowrap; }
    
    .n-table { width: 100%; border-collapse: collapse; margin: 40px 0; font-size: 0.95rem; border-radius: 12px; overflow: hidden; border: 1px solid #E5E7EB; }
    .n-table th { background: #F9FAFB; padding: 18px; text-align: left; border-bottom: 2px solid #E5E7EB; color: #111827; }
    .n-table td { padding: 18px; border-bottom: 1px solid #F3F4F6; }
    
    .n-footer { text-align: center; padding: 80px 0; color: #9CA3AF; font-size: 0.85rem; border-top: 1px solid #E5E7EB; margin-top: 80px; background: #fff; }
    
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 ${buttonColor}66; transform: scale(1); } 70% { box-shadow: 0 0 0 20px ${buttonColor}00; transform: scale(1.02); } 100% { box-shadow: 0 0 0 0 ${buttonColor}00; transform: scale(1); } }
    .n-pulse { animation: pulse 2.5s infinite; }

    @media (max-width: 640px) {
      h1 { font-size: 1.85rem; line-height: 1.25; }
      .n-editorial-card { padding: 24px; border-radius: 16px; }
      .n-btn { padding: 20px; font-size: 1.15rem; }
      .n-price-card.featured { transform: scale(1.02); }
      .n-navbar-inner { padding: 0 10px; }
    }
  `;

  const finalHTML = `
    <div class="n-header-bar">${copyStyle === 'Agressivo' ? 'ÚLTIMAS UNIDADES: Oferta Expira em breve' : 'Atenção: Oferta Especial por Tempo Limitado'}</div>
    <nav class="n-navbar">
      <div class="n-container n-navbar-inner">
        <a href="#" class="n-logo">PORTAL SAÚDE</a>
        <div style="font-size: 0.7rem; color: #EF4444; font-weight: 800; display: flex; align-items: center; gap: 4px;">
          <span style="width: 8px; height: 8px; background: #EF4444; border-radius: 50%; display: inline-block;"></span>
          INVESTIGAÇÃO AO VIVO
        </div>
      </div>
    </nav>

    <div class="n-container">
      <article class="n-editorial-card">
        <div class="n-meta">${editorialIntro}</div>
        <h1>${headline}</h1>
        ${subheadline ? `<p style="font-weight: 500; color: #4B5563; font-size: 1.25rem; margin-bottom: 30px;">${subheadline}</p>` : ''}
        
        ${getMedia(0, 'SLOT 03-A')}

        <div class="n-summary">${quickSummary}</div>
        
        <p>${patternInterrupt}</p>
        
        <h2>O Desafio Atual</h2>
        <p>${problemsSection}</p>
        ${getMedia(1, 'SLOT 05-B')}

        <h2>A Descoberta: O que é ${productName}?</h2>
        <p>${whatIsSection}</p>
        
        <div style="background: var(--primary); color: #fff; padding: 35px; border-radius: 16px; margin: 40px 0; box-shadow: 0 10px 30px -10px var(--primary);">
          <h3 style="margin-top: 0; font-size: 1.5rem;">Destaques Principais:</h3>
          <ul style="padding-left: 20px; font-size: 1.1rem; line-height: 1.8;">
            ${features.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>

        <p>${curiosityBridge}</p>

        <h2>Resultados Comprovados</h2>
        <div style="display: grid; gap: 20px; margin-bottom: 40px; background: #F9FAFB; padding: 30px; border-radius: 16px;">
          ${benefits.map(b => `<div style="display:flex; gap:14px; align-items:center;">
            <div style="background: var(--primary); width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <strong style="font-size: 1.1rem;">${b}</strong>
          </div>`).join('')}
        </div>

        ${comparisonTable.length ? `
          <h2>Análise Comparativa</h2>
          <table class="n-table">
            <thead>
              <tr><th>Recurso</th><th>${productName}</th><th>Concorrência</th></tr>
            </thead>
            <tbody>
              ${comparisonTable.map(r => `<tr><td>${r.feature}</td><td style="color: #059669; font-weight: 700;">${r.product}</td><td style="color: #EF4444;">${r.competitor}</td></tr>`).join('')}
            </tbody>
          </table>
        ` : ''}

        ${testimonials.length ? `
          <h2>O Que Dizem os Usuários</h2>
          <div style="display: grid; gap: 20px;">
            ${testimonials.map(t => `
              <div style="background: #fff; padding: 30px; border-radius: 16px; border: 1px solid #F3F4F6; box-shadow: 0 2px 10px rgba(0,0,0,0.02);">
                <div style="color: #F59E0B; margin-bottom: 12px; font-size: 1.2rem;">${'★'.repeat(t.rating)}</div>
                <p style="margin-bottom: 12px; font-size: 1.05rem; font-style: italic;">"${t.text}"</p>
                <div style="font-weight: 700; font-size: 0.95rem; color: #111827;">- ${t.name}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div style="margin: 80px 0; text-align: center;">
          <h2 style="margin-bottom: 15px;">Veredito Final</h2>
          <p>Com base em nossa investigação, o ${productName} é a melhor opção de mercado disponível hoje.</p>
          <a href="${ctaLink}" class="n-btn n-pulse">${callToAction}</a>
        </div>

        ${pricing.length ? `
          <h2 style="text-align: center;">Ofertas Exclusivas do Portal</h2>
          <div class="n-price-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
            ${pricing.map((p, idx) => `
              <div class="n-price-card ${p.isBestValue ? 'featured' : ''}">
                ${p.isBestValue ? '<div class="n-badge">RECOMENDADO</div>' : ''}
                <div style="font-weight: 800; font-size: 1.1rem; margin-bottom: 10px;">${p.quantity}</div>
                <div style="color: #059669; font-size: 0.85rem; font-weight: 700;">${p.discount}</div>
                <div style="font-size: 2.2rem; font-weight: 900; color: var(--primary); margin: 20px 0;">${p.price}</div>
                ${getMedia(idx, 'KIT ' + p.quantity)}
                <a href="${ctaLink}" style="background: var(--primary); color: #fff; padding: 15px; display: block; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 1rem; margin-top: 15px;">ESCOLHER ESTE</a>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${faqs.length ? `
          <h2>Dúvidas Frequentes</h2>
          <div style="display: grid; gap: 15px;">
            ${faqs.map(f => `
              <details style="border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; cursor: pointer;">
                <summary style="font-weight: 700; font-size: 1.1rem; list-style: none; display: flex; justify-content: space-between; align-items: center;">
                  ${f.q}
                  <span style="font-size: 1.5rem; color: var(--primary);">+</span>
                </summary>
                <p style="margin: 15px 0 0; font-size: 1.05rem; color: #4B5563;">${f.a}</p>
              </details>
            `).join('')}
          </div>
        ` : ''}
      </article>
    </div>

    <footer class="n-footer">
      <div class="n-container">
        <p>Copyright 2026 ${productName}. Todos os direitos reservados.</p>
        <p style="font-size: 0.75rem; opacity: 0.6; margin-top: 15px; max-width: 500px; margin-left: auto; margin-right: auto;">AVISO: Este site é um publieditorial. Os resultados podem variar de pessoa para pessoa. Não substitui consulta médica profissional.</p>
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
