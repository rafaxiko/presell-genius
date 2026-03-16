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
    productImageUrls: []
  };

  const finalData = data || defaultData;
  const { 
    productName, headline, subheadline, editorialIntro, quickSummary, patternInterrupt,
    problemsSection, whatIsSection, curiosityBridge, features = [], benefits = [], 
    comparisonTable = [], pros = [], cons = [], testimonials = [], pricing = [], 
    faqs = [], callToAction, buttonColor, targetUrl, productImageUrls = [], 
    trackingLink, clarityScript
  } = finalData;
  
  const ctaLink = trackingLink || targetUrl;

  // Media Slot Mapping
  const SLOT_03_A = productImageUrls[0] || ''; // Hero
  const SLOT_05_B = productImageUrls[1] || ''; // Problem Context
  const SLOT_09_C = productImageUrls[2] || ''; // Features
  const SLOT_16_P = productImageUrls[0] || ''; // Pricing Default

  const commonStyles = `
    :root { 
      --primary: ${buttonColor || '#2952A3'}; 
      --text: #1F2937; 
      --text-muted: #6B7280;
      --bg: #F3F4F6; 
      --card-bg: #FFFFFF;
      --radius: 12px;
      --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    * { box-sizing: border-box; }
    .nutra-v6 { font-family: 'Inter', -apple-system, sans-serif; background: var(--bg); color: var(--text); margin: 0; line-height: 1.6; }
    .n-container { max-width: 720px; margin: 0 auto; padding: 0 20px; }
    
    .n-header-bar { background: #111827; color: #fff; text-align: center; padding: 10px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .n-navbar { background: #fff; border-bottom: 1px solid #E5E7EB; padding: 15px 0; position: sticky; top: 0; z-index: 100; }
    .n-navbar-inner { display: flex; justify-content: space-between; align-items: center; }
    .n-logo { font-weight: 900; font-size: 1.2rem; color: #111827; text-decoration: none; }
    
    .n-editorial-card { background: #fff; padding: 40px; border-radius: 4px; box-shadow: var(--shadow); margin-top: 20px; }
    .n-meta { color: #6B7280; font-size: 0.85rem; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #F3F4F6; }
    
    h1 { font-size: 2.2rem; font-weight: 800; line-height: 1.2; color: #111827; margin: 0 0 20px; }
    h2 { font-size: 1.75rem; font-weight: 800; color: #111827; margin: 40px 0 20px; }
    p { margin-bottom: 20px; font-size: 1.125rem; }
    
    .n-slot-img { width: 100%; border-radius: 8px; margin-bottom: 30px; display: block; background: #F9FAFB; border: 1px solid #E5E7EB; }
    .n-slot-placeholder { height: 300px; display: flex; align-items: center; justify-content: center; color: #9CA3AF; font-size: 0.8rem; font-weight: 700; border: 2px dashed #D1D5DB; margin-bottom: 30px; border-radius: 8px; }
    
    .n-summary { background: #F9FAFB; border-left: 4px solid var(--primary); padding: 25px; margin-bottom: 40px; font-style: italic; }
    .n-btn { display: inline-block; width: 100%; background: var(--primary); color: #fff; text-align: center; padding: 22px; border-radius: 8px; font-weight: 800; font-size: 1.3rem; text-decoration: none; text-transform: uppercase; margin-top: 20px; transition: filter 0.2s; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
    .n-btn:hover { filter: brightness(1.1); }
    
    .n-price-grid { display: grid; gap: 20px; margin: 40px 0; }
    .n-price-card { background: #fff; border: 2px solid #E5E7EB; border-radius: 12px; padding: 30px; text-align: center; position: relative; transition: transform 0.2s; }
    .n-price-card.featured { border-color: var(--primary); transform: scale(1.05); z-index: 5; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
    .n-badge { background: var(--primary); color: #fff; font-size: 0.7rem; font-weight: 900; padding: 4px 12px; border-radius: 20px; position: absolute; top: -12px; left: 50%; transform: translateX(-50%); }
    
    .n-table { width: 100%; border-collapse: collapse; margin: 40px 0; font-size: 0.95rem; }
    .n-table th { background: #F9FAFB; padding: 15px; text-align: left; border-bottom: 2px solid #E5E7EB; }
    .n-table td { padding: 15px; border-bottom: 1px solid #F3F4F6; }
    
    .n-footer { text-align: center; padding: 60px 0; color: #9CA3AF; font-size: 0.85rem; border-top: 1px solid #E5E7EB; margin-top: 60px; background: #fff; }
    
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 ${buttonColor}4D; } 70% { box-shadow: 0 0 0 15px ${buttonColor}00; } 100% { box-shadow: 0 0 0 0 ${buttonColor}00; } }
    .n-pulse { animation: pulse 2s infinite; }

    @media (max-width: 640px) {
      h1 { font-size: 1.75rem; }
      .n-editorial-card { padding: 20px; }
    }
  `;

  const renderSlot = (url: string, code: string) => {
    if (url) return `<img src="${url}" class="n-slot-img" alt="Media ${code}">`;
    return `<div class="n-slot-placeholder">${code} - IMAGEM DO PRODUTO</div>`;
  };

  const finalHTML = `
    <div class="n-header-bar">Atenção: Oferta Especial por Tempo Limitado</div>
    <nav class="n-navbar">
      <div class="n-container n-navbar-inner">
        <a href="#" class="n-logo">PORTAL SAÚDE</a>
        <div style="font-size: 0.7rem; color: #EF4444; font-weight: 800;">● INVESTIGAÇÃO AO VIVO</div>
      </div>
    </nav>

    <div class="n-container">
      <article class="n-editorial-card">
        <div class="n-meta">${editorialIntro}</div>
        <h1>${headline}</h1>
        ${subheadline ? `<p style="font-weight: 500; color: #4B5563; font-size: 1.25rem;">${subheadline}</p>` : ''}
        
        ${renderSlot(SLOT_03_A, 'SLOT 03-A')}

        <div class="n-summary">${quickSummary}</div>
        
        <p>${patternInterrupt}</p>
        
        <h2>O Desafio Atual</h2>
        <p>${problemsSection}</p>
        ${renderSlot(SLOT_05_B, 'SLOT 05-B')}

        <h2>A Descoberta: O que é ${productName}?</h2>
        <p>${whatIsSection}</p>
        
        <div style="background: var(--primary); color: #fff; padding: 30px; border-radius: 8px; margin: 40px 0;">
          <h3 style="margin-top: 0;">Destaques Principais:</h3>
          <ul style="padding-left: 20px;">
            ${features.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>

        <p>${curiosityBridge}</p>

        <h2>Resultados Comprovados</h2>
        <div style="display: grid; gap: 15px; margin-bottom: 40px;">
          ${benefits.map(b => `<div style="display:flex; gap:12px; align-items:center;"><span>✅</span> <strong>${b}</strong></div>`).join('')}
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
              <div style="background: #F9FAFB; padding: 20px; border-radius: 8px;">
                <div style="color: #F59E0B; margin-bottom: 8px;">${'★'.repeat(t.rating)}</div>
                <p style="margin-bottom: 8px; font-size: 1rem;">"${t.text}"</p>
                <div style="font-weight: 700; font-size: 0.9rem;">- ${t.name}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div style="margin: 60px 0; text-align: center;">
          <h2 style="margin-bottom: 10px;">Veredito Final</h2>
          <p>Com base em nossa análise, o ${productName} é a melhor opção custo-benefício disponível hoje.</p>
          <a href="${ctaLink}" class="n-btn n-pulse">${callToAction}</a>
        </div>

        ${pricing.length ? `
          <h2 style="text-align: center;">Ofertas Exclusivas do Portal</h2>
          <div class="n-price-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
            ${pricing.map(p => `
              <div class="n-price-card ${p.isBestValue ? 'featured' : ''}">
                ${p.isBestValue ? '<div class="n-badge">MAIS POPULAR</div>' : ''}
                <div style="font-weight: 800; font-size: 1.1rem; margin-bottom: 10px;">${p.quantity}</div>
                <div style="color: #059669; font-size: 0.8rem; font-weight: 700;">${p.discount}</div>
                <div style="font-size: 2rem; font-weight: 900; color: var(--primary); margin: 15px 0;">${p.price}</div>
                <a href="${ctaLink}" style="background: var(--primary); color: #fff; padding: 12px; display: block; text-decoration: none; border-radius: 4px; font-weight: 700; font-size: 0.9rem;">COMPRAR AGORA</a>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${faqs.length ? `
          <h2>Dúvidas Frequentes</h2>
          <div style="display: grid; gap: 15px;">
            ${faqs.map(f => `
              <details style="border: 1px solid #E5E7EB; border-radius: 8px; padding: 15px;">
                <summary style="font-weight: 700; cursor: pointer;">${f.q}</summary>
                <p style="margin: 15px 0 0; font-size: 1rem; color: #4B5563;">${f.a}</p>
              </details>
            `).join('')}
          </div>
        ` : ''}
      </article>
    </div>

    <footer class="n-footer">
      <div class="n-container">
        <p>Copyright 2026 ${productName}. Todos os direitos reservados.</p>
        <p style="font-size: 0.7rem; opacity: 0.6; margin-top: 10px;">AVISO: Este site é um publieditorial. Os resultados podem variar de pessoa para pessoa.</p>
      </div>
    </footer>
    ${clarityScript || ''}
  `;

  if (wrapForElementor) {
    return `<div id="nutra-v6-wrapper" class="nutra-v6">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800;900&display=swap" rel="stylesheet">
  <style>${commonStyles}</style>
  ${finalHTML}
</div>`.trim();
  }

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${headline}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800;900&display=swap" rel="stylesheet">
    <style>${commonStyles}</style>
</head>
<body class="nutra-v6">
    ${finalHTML}
</body>
</html>`;
}
