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

export type PresellData = {
  productName: string;
  headline: string;
  subheadline?: string;
  bodyCopy: string;
  benefits?: string[];
  ingredients?: string[];
  faqs?: FAQItem[];
  pros?: string[];
  cons?: string[];
  comparisonTable?: ComparisonRow[];
  pricing?: PricingOption[];
  callToAction: string;
  buttonColor: string;
  targetUrl: string;
  productImageUrls?: string[];
  trackingLink?: string;
  clarityScript?: string;
  templateType: 'Launch' | 'Robust' | 'Review' | 'List';
};

/**
 * Generates the full HTML for the presell page with modern SaaS aesthetic.
 */
export function generatePresellHTML(data: PresellData | null, wrapForElementor = false): string {
  // Placeholder data for initial render
  const defaultData: PresellData = {
    productName: "Seu Produto Premium",
    headline: "O Título Magnético Aparecerá Aqui Após a Geração",
    subheadline: "Prepare sua audiência com um subtítulo persuasivo que gere curiosidade e desejo imediato pelo seu produto.",
    bodyCopy: "Este é o seu rascunho. Clique em 'Criar Página' para que nossa IA gere uma copy de alta conversão baseada na descrição do seu produto.",
    benefits: ["Transformação Real", "Resultados Comprovados", "Garantia de Satisfação"],
    ingredients: ["Componente Ativo", "Fórmula Natural", "Tecnologia Patenteada"],
    faqs: [{ q: "Como devo usar?", a: "Siga as instruções da embalagem para melhores resultados." }],
    pricing: [
      { quantity: "01 Unidade", discount: "Preço Regular", price: "R$ 197", isBestValue: false },
      { quantity: "03 Unidades", discount: "50% OFF", price: "R$ 447", isBestValue: true },
      { quantity: "05 Unidades", discount: "Melhor Custo", price: "R$ 697", isBestValue: false }
    ],
    callToAction: "QUERO GARANTIR MEU ACESSO",
    buttonColor: "#2952A3",
    targetUrl: "#",
    templateType: "Robust",
    productImageUrls: []
  };

  const finalData = data || defaultData;
  const { 
    productName, 
    headline, 
    subheadline,
    bodyCopy, 
    benefits = [],
    ingredients = [],
    faqs = [],
    pros = [],
    cons = [],
    comparisonTable = [],
    pricing = [],
    callToAction, 
    buttonColor, 
    targetUrl, 
    productImageUrls = [], 
    trackingLink, 
    clarityScript,
    templateType
  } = finalData;
  
  const ctaLink = trackingLink || targetUrl;
  const primaryImg = productImageUrls.length > 0 ? productImageUrls[0] : null;

  const commonStyles = `
    :root { 
      --primary: ${buttonColor || '#2952A3'}; 
      --text: #111827; 
      --text-muted: #6B7280;
      --bg: #F9FAFB; 
      --card-bg: #FFFFFF;
      --radius: 16px;
      --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
    }
    * { box-sizing: border-box; }
    .pg-body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); margin: 0; line-height: 1.5; -webkit-font-smoothing: antialiased; }
    .pg-container { max-width: 800px; margin: 0 auto; padding: 40px 16px; }
    .pg-card { background: var(--card-bg); border-radius: var(--radius); padding: 40px; border: 1px solid rgba(0,0,0,0.05); box-shadow: var(--shadow); margin-bottom: 32px; }
    .pg-btn { display: inline-block; width: 100%; background: var(--primary); color: #fff; text-align: center; padding: 20px; border-radius: 12px; font-weight: 700; font-size: 1.15rem; text-decoration: none; text-transform: uppercase; transition: all 0.2s ease; border: none; cursor: pointer; box-shadow: 0 4px 14px 0 rgba(0, 118, 255, 0.15); }
    .pg-btn:hover { transform: translateY(-2px); filter: brightness(1.05); box-shadow: 0 6px 20px rgba(0, 118, 255, 0.23); }
    
    .pg-img-placeholder { 
      width: 100%; height: 300px; background: #F3F4F6; border: 2px dashed #E5E7EB; border-radius: var(--radius); 
      display: flex; flex-direction: column; align-items: center; justify-content: center; color: #9CA3AF; margin-bottom: 24px;
    }
    .pg-img-hero { width: 100%; height: auto; border-radius: var(--radius); display: block; margin: 0 auto 24px; object-fit: contain; }
    
    .pg-badge { background: #EEF2FF; color: #4F46E5; padding: 6px 12px; border-radius: 30px; font-size: 0.75rem; font-weight: 700; margin-bottom: 16px; display: inline-block; }
    
    h1 { font-size: 2.5rem; font-weight: 800; text-align: center; margin-top: 0; line-height: 1.2; color: #111827; }
    h2 { font-size: 1.75rem; font-weight: 700; text-align: center; margin-bottom: 24px; color: #111827; }
    p { margin-bottom: 20px; color: #374151; }

    @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1); } 70% { box-shadow: 0 0 0 10px rgba(0, 0, 0, 0); } 100% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); } }
    .pg-btn-pulse { animation: pulse 2s infinite; }

    @media (max-width: 640px) {
      .pg-card { padding: 24px; }
      h1 { font-size: 1.85rem !important; }
      .pg-container { padding: 20px 12px; }
    }
  `;

  let content = '';

  const renderHeroImage = () => {
    if (primaryImg) {
      return `<img src="${primaryImg}" class="pg-img-hero" alt="${productName}">`;
    }
    return `
      <div class="pg-img-placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        <span style="margin-top: 12px; font-weight: 600; font-size: 0.9rem;">Sua Foto do Produto Aqui</span>
      </div>
    `;
  };

  switch (templateType) {
    case 'Launch':
      content = `
        <div class="pg-card" style="text-align: center;">
          <div class="pg-badge">Oportunidade Única</div>
          <h1>${headline}</h1>
          <p style="font-size: 1.25rem; color: var(--text-muted); margin-bottom: 32px;">${subheadline || ''}</p>
          <div style="background: #111827; color: #fff; padding: 24px; border-radius: 12px; margin-bottom: 32px; display: inline-block;">
            <div style="font-size: 0.7rem; text-transform: uppercase; margin-bottom: 8px; opacity: 0.7;">Expira em:</div>
            <div style="font-family: monospace; font-size: 2rem; font-weight: bold;" id="timer">09:59</div>
          </div>
          ${renderHeroImage()}
          <div style="text-align: left; font-size: 1.1rem;">${bodyCopy}</div>
          <a href="${ctaLink}" class="pg-btn pg-btn-pulse">${callToAction}</a>
        </div>
        <script>
          let t = 599; setInterval(() => {
            let m=Math.floor(t/60), s=t%60;
            document.getElementById('timer').innerText = (m<10?'0':'')+m+':'+(s<10?'0':'')+s;
            if(t>0) t--;
          }, 1000);
        </script>
      `;
      break;

    case 'Robust':
      content = `
        <div class="pg-card">
          <h1>${headline}</h1>
          <p style="font-size: 1.15rem; color: var(--text-muted); text-align: center; margin-bottom: 32px;">${subheadline || ''}</p>
          ${renderHeroImage()}
          <div style="font-size: 1.1rem; line-height: 1.7;">${bodyCopy}</div>
          
          <h2 style="margin-top: 56px;">Por que o ${productName} funciona?</h2>
          <div style="display: grid; gap: 16px;">
            ${benefits.map(b => `
              <div style="display: flex; gap: 12px; align-items: flex-start; background: #F9FAFB; padding: 20px; border-radius: 12px; border: 1px solid #F3F4F6;">
                <div style="color: var(--primary); font-weight: bold;">✓</div>
                <div style="font-weight: 600;">${b}</div>
              </div>
            `).join('')}
          </div>

          ${ingredients.length ? `
            <h2 style="margin-top: 56px;">Fórmula Avançada</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
              ${ingredients.map(i => `<span style="background: #FFF; border: 1px solid #E5E7EB; padding: 10px 18px; border-radius: 30px; font-size: 0.9rem; font-weight: 500;">${i}</span>`).join('')}
            </div>
          ` : ''}
        </div>

        <h2 style="margin: 48px 0 32px;">Garanta o Seu Hoje</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px;">
          ${pricing.map(p => `
            <div class="pg-card" style="text-align: center; padding: 32px 24px; border: ${p.isBestValue ? '2px solid var(--primary)' : '1px solid #E5E7EB'}; margin-bottom: 0;">
              <div style="font-size: 1.25rem; font-weight: 800; margin-bottom: 8px;">${p.quantity}</div>
              <div style="color: #059669; font-weight: 700; font-size: 0.85rem;">${p.discount}</div>
              <div style="font-size: 2.25rem; font-weight: 900; color: var(--primary); margin: 20px 0;">${p.price}</div>
              <a href="${ctaLink}" class="pg-btn" style="padding: 12px; font-size: 0.9rem;">COMPRAR AGORA</a>
            </div>
          `).join('')}
        </div>

        ${faqs.length ? `
          <div class="pg-card" style="margin-top: 48px;">
            <h2>Dúvidas Frequentes</h2>
            ${faqs.map(f => `
              <details style="margin-bottom: 8px; border: 1px solid #F3F4F6; border-radius: 12px; padding: 16px; cursor: pointer;">
                <summary style="font-weight: 700;">${f.q}</summary>
                <div style="margin-top: 12px; color: var(--text-muted); font-size: 0.95rem;">${f.a}</div>
              </details>
            `).join('')}
          </div>
        ` : ''}
      `;
      break;

    case 'Review':
      content = `
        <div class="pg-card">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; background: #E5E7EB; border-radius: 50%;"></div>
            <div>
              <div style="font-weight: 700; font-size: 0.9rem;">Review por Saúde em Dia</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Publicado em 2026</div>
            </div>
          </div>
          <h1 style="text-align: left; font-size: 2.25rem;">${headline}</h1>
          <p style="font-style: italic; color: var(--text-muted); font-size: 1.15rem; margin: 24px 0;">${subheadline || ''}</p>
          ${renderHeroImage()}
          <div style="font-size: 1.1rem;">${bodyCopy}</div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 40px 0;">
            <div style="background: #ECFDF5; padding: 24px; border-radius: 12px;">
              <div style="color: #047857; font-weight: 800; margin-bottom: 12px;">PONTOS POSITIVOS</div>
              ${pros.map(p => `<div style="font-size: 0.9rem; margin-bottom: 8px;">✓ ${p}</div>`).join('')}
            </div>
            <div style="background: #FFF1F2; padding: 24px; border-radius: 12px;">
              <div style="color: #BE123C; font-weight: 800; margin-bottom: 12px;">PONTOS DE ATENÇÃO</div>
              ${cons.map(c => `<div style="font-size: 0.9rem; margin-bottom: 8px;">! ${c}</div>`).join('')}
            </div>
          </div>

          <div style="background: #111827; color: #fff; padding: 32px; border-radius: 16px; text-align: center;">
            <div style="font-size: 1.5rem; font-weight: 800; margin-bottom: 12px;">Nosso Veredito</div>
            <p style="color: #9CA3AF; margin-bottom: 24px;">Após testes intensivos, o ${productName} provou ser a melhor escolha no mercado atual.</p>
            <a href="${ctaLink}" class="pg-btn" style="background: #fff; color: #111827;">Ir para Site Oficial</a>
          </div>
        </div>
      `;
      break;

    case 'List':
      content = `
        <div class="pg-card">
          <h1>Top Melhores Escolhas de 2026</h1>
          <p style="text-align: center; color: var(--text-muted); margin-bottom: 40px;">Comparamos os principais produtos baseados em pureza e eficácia.</p>
          
          <div style="background: #FEF3C7; border: 2px solid #F59E0B; padding: 32px; border-radius: 16px; position: relative; margin-bottom: 48px;">
            <div style="position: absolute; top: -14px; left: 24px; background: #F59E0B; color: #fff; padding: 4px 16px; border-radius: 30px; font-weight: 800; font-size: 0.75rem;">NOSSA ESCOLHA #1</div>
            <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
              <div style="width: 120px;">${renderHeroImage()}</div>
              <div style="flex: 1; min-width: 200px;">
                <h2 style="text-align: left; margin: 0 0 8px;">${productName}</h2>
                <p style="font-size: 0.95rem; margin-bottom: 16px;">Vencedor absoluto em absorção e custo-benefício.</p>
                <a href="${ctaLink}" class="pg-btn" style="padding: 12px; font-size: 0.9rem;">Ver Oferta Especial</a>
              </div>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-top: 32px; font-size: 0.9rem;">
            <thead>
              <tr style="border-bottom: 2px solid #E5E7EB;">
                <th style="padding: 12px; text-align: left;">Critério</th>
                <th style="padding: 12px; text-align: center; background: #FEF3C7;">${productName}</th>
                <th style="padding: 12px; text-align: center;">Outros</th>
              </tr>
            </thead>
            <tbody>
              ${comparisonTable.map(row => `
                <tr style="border-bottom: 1px solid #F3F4F6;">
                  <td style="padding: 12px; font-weight: 700;">${row.feature}</td>
                  <td style="padding: 12px; text-align: center; color: #059669; font-weight: 800;">${row.product}</td>
                  <td style="padding: 12px; text-align: center; color: #DC2626;">${row.competitor}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      break;
  }

  const finalHTML = `
    <div class="pg-container">
        ${content}
    </div>
    <footer style="text-align: center; padding: 48px 16px; color: #9CA3AF; font-size: 0.8rem;">
        Copyright 2026 ${productName}. Todos os direitos reservados.
    </footer>
  `;

  if (wrapForElementor) {
    return `
<div id="pg-wrapper" class="pg-body">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap" rel="stylesheet">
  <style>${commonStyles}</style>
  ${finalHTML}
</div>
    `.trim();
  }

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${headline} | ${productName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap" rel="stylesheet">
    ${clarityScript || ''}
    <style>${commonStyles}</style>
</head>
<body class="pg-body">
    ${finalHTML}
</body>
</html>`;
}
