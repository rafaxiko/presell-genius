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
 * Generates the full HTML for the presell page with dynamic pricing and brand colors.
 */
export function generatePresellHTML(data: PresellData | null, wrapForElementor = false): string {
  const defaultData: PresellData = {
    productName: "Seu Produto Premium",
    headline: "O Título Magnético Aparecerá Aqui",
    subheadline: "Prepare sua audiência com um subtítulo persuasivo.",
    bodyCopy: "Este é o seu rascunho. Clique em 'Criar Página' para gerar a copy real.",
    benefits: ["Transformação Real", "Resultados Comprovados", "Garantia de Satisfação"],
    ingredients: ["Componente Ativo", "Fórmula Natural"],
    faqs: [{ q: "Como usar?", a: "Siga as instruções para melhores resultados." }],
    pricing: [
      { quantity: "01 Unidade", discount: "Preço Regular", price: "R$ 197", isBestValue: false },
      { quantity: "03 Unidades", discount: "50% OFF", price: "R$ 447", isBestValue: true },
      { quantity: "06 Unidades", discount: "Melhor Custo", price: "R$ 697", isBestValue: false }
    ],
    callToAction: "QUERO GARANTIR MEU ACESSO",
    buttonColor: "#2952A3",
    targetUrl: "#",
    templateType: "Robust",
    productImageUrls: []
  };

  const finalData = data || defaultData;
  const { 
    productName, headline, subheadline, bodyCopy, 
    benefits = [], ingredients = [], faqs = [], pros = [], cons = [], 
    comparisonTable = [], pricing = [], callToAction, buttonColor, 
    targetUrl, productImageUrls = [], trackingLink, clarityScript, templateType
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
      --radius: 20px;
      --shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.08);
    }
    * { box-sizing: border-box; }
    .pg-body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); margin: 0; line-height: 1.6; -webkit-font-smoothing: antialiased; }
    .pg-container { max-width: 800px; margin: 0 auto; padding: 60px 16px; }
    .pg-card { background: var(--card-bg); border-radius: var(--radius); padding: 40px; border: 1px solid rgba(0,0,0,0.04); box-shadow: var(--shadow-sm); margin-bottom: 32px; transition: all 0.3s ease; }
    
    .pg-btn { 
      display: inline-block; width: 100%; background: var(--primary); color: #fff; text-align: center; 
      padding: 22px; border-radius: 14px; font-weight: 800; font-size: 1.25rem; text-decoration: none; 
      text-transform: uppercase; transition: all 0.2s ease; border: none; cursor: pointer;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    .pg-btn:hover { transform: scale(1.02); filter: brightness(1.1); box-shadow: 0 0 20px ${buttonColor}4D; }
    
    .pg-img-hero { width: 100%; max-height: 450px; border-radius: var(--radius); display: block; margin: 0 auto 32px; object-fit: contain; }
    
    .pg-badge-best { 
      background: var(--primary); color: #fff; padding: 8px 16px; border-radius: 30px; 
      font-size: 0.75rem; font-weight: 800; position: absolute; top: -15px; left: 50%; transform: translateX(-50%);
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    
    h1 { font-size: 2.75rem; font-weight: 800; text-align: center; margin-top: 0; line-height: 1.1; color: #111827; letter-spacing: -0.02em; }
    h2 { font-size: 2rem; font-weight: 800; text-align: center; margin: 48px 0 24px; color: #111827; }
    p { margin-bottom: 24px; color: #374151; font-size: 1.1rem; }

    /* Dynamic Pricing Grid */
    .pg-price-grid { 
      display: grid; 
      gap: 24px; 
      margin-top: 40px; 
      align-items: stretch;
      justify-content: center;
    }
    .grid-cols-1 { grid-template-columns: minmax(280px, 450px); }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(240px, 1fr)); }
    .grid-cols-3 { grid-template-columns: repeat(3, minmax(240px, 1fr)); }

    .pg-price-card { 
      position: relative; border-radius: var(--radius); background: #fff; padding: 40px 24px; text-align: center;
      border: 1px solid #E5E7EB; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer;
    }
    .pg-price-card.featured { border: 3px solid var(--primary); transform: scale(1.05); z-index: 10; box-shadow: var(--shadow-lg); }
    .pg-price-card:hover { transform: translateY(-8px) scale(1.02); }
    .pg-price-card.featured:hover { transform: translateY(-8px) scale(1.07); }

    @keyframes pulse { 0% { box-shadow: 0 0 0 0 ${buttonColor}66; } 70% { box-shadow: 0 0 0 15px ${buttonColor}00; } 100% { box-shadow: 0 0 0 0 ${buttonColor}00; } }
    .pg-btn-pulse { animation: pulse 2s infinite; }

    @media (max-width: 768px) {
      .pg-price-grid { grid-template-columns: 1fr !important; }
      .pg-price-card.featured { transform: scale(1); }
      .pg-price-card.featured:hover { transform: translateY(-8px) scale(1.02); }
    }
  `;

  const renderHeroImage = () => {
    if (primaryImg) return `<img src="${primaryImg}" class="pg-img-hero" alt="${productName}">`;
    return `
      <div style="width: 100%; height: 300px; background: #F3F4F6; border: 2px dashed #E5E7EB; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #9CA3AF; margin-bottom: 32px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        <p style="margin-top: 12px; font-size: 0.9rem; font-weight: 600;">Sua Foto do Produto Aqui</p>
      </div>
    `;
  };

  let content = '';
  switch (templateType) {
    case 'Launch':
      content = `
        <div class="pg-card" style="text-align: center;">
          <h1 style="margin-bottom: 24px;">${headline}</h1>
          <p style="font-size: 1.25rem; color: var(--text-muted); margin-bottom: 40px;">${subheadline || ''}</p>
          <div style="background: #111827; color: #fff; padding: 24px 48px; border-radius: 16px; margin-bottom: 40px; display: inline-block;">
            <div style="font-size: 0.8rem; text-transform: uppercase; margin-bottom: 8px; opacity: 0.7; letter-spacing: 0.1em;">Oferta termina em:</div>
            <div style="font-family: monospace; font-size: 2.5rem; font-weight: 800;" id="timer">09:59</div>
          </div>
          ${renderHeroImage()}
          <div style="text-align: left; font-size: 1.2rem; color: #4B5563;">${bodyCopy}</div>
          <div style="margin-top: 48px;">
            <a href="${ctaLink}" class="pg-btn pg-btn-pulse">${callToAction}</a>
          </div>
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
      const priceGridClass = pricing.length === 1 ? 'grid-cols-1' : pricing.length === 2 ? 'grid-cols-2' : 'grid-cols-3';
      content = `
        <div class="pg-card">
          <h1>${headline}</h1>
          <p style="text-align: center; margin-bottom: 40px; font-weight: 500;">${subheadline || ''}</p>
          ${renderHeroImage()}
          <div style="font-size: 1.15rem; color: #4B5563;">${bodyCopy}</div>
          
          <h2>Por que escolher o ${productName}?</h2>
          <div style="display: grid; gap: 20px;">
            ${benefits.map(b => `
              <div style="display: flex; gap: 16px; align-items: center; background: #F8FAFC; padding: 24px; border-radius: 16px; border-left: 5px solid var(--primary);">
                <div style="color: var(--primary); font-size: 1.5rem;">★</div>
                <div style="font-weight: 700; font-size: 1.1rem;">${b}</div>
              </div>
            `).join('')}
          </div>

          ${ingredients.length ? `
            <h2>Fórmula Premium</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;">
              ${ingredients.map(i => `<span style="background: #fff; border: 1px solid #E2E8F0; padding: 12px 24px; border-radius: 50px; font-weight: 600; font-size: 0.95rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">${i}</span>`).join('')}
            </div>
          ` : ''}
        </div>

        <h2 id="oferta">Escolha o seu Pacote</h2>
        <div class="pg-price-grid ${priceGridClass}">
          ${pricing.length > 0 ? pricing.map((p, idx) => {
            const kitImg = productImageUrls[idx] || primaryImg;
            return `
              <div class="pg-price-card ${p.isBestValue ? 'featured' : ''}">
                ${p.isBestValue ? '<div class="pg-badge-best">RECOMENDADO</div>' : ''}
                <div style="font-size: 1.5rem; font-weight: 800; margin-bottom: 16px;">${p.quantity}</div>
                ${kitImg ? `<img src="${kitImg}" style="width: 100%; max-height: 150px; object-fit: contain; margin-bottom: 20px;" alt="${p.quantity}">` : ''}
                <div style="color: #059669; font-weight: 800; font-size: 0.9rem; margin-bottom: 12px;">${p.discount}</div>
                <div style="font-size: 2.5rem; font-weight: 900; color: var(--primary); margin-bottom: 24px;">${p.price || '<span style="font-size: 1rem; color: #EF4444;">Preencher valor</span>'}</div>
                <a href="${ctaLink}" class="pg-btn" style="padding: 16px; font-size: 1rem;">COMPRAR AGORA</a>
              </div>
            `;
          }).join('') : `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: #FEF2F2; border-radius: 20px; color: #EF4444; font-weight: 600;">
              Nenhum pacote de preço detectado na descrição.
            </div>
          `}
        </div>

        ${faqs.length ? `
          <div class="pg-card" style="margin-top: 60px;">
            <h2>Dúvidas Frequentes</h2>
            ${faqs.map(f => `
              <details style="margin-bottom: 12px; border: 1px solid #F1F5F9; border-radius: 16px; padding: 20px; cursor: pointer; background: #fff;">
                <summary style="font-weight: 800; font-size: 1.05rem;">${f.q}</summary>
                <div style="margin-top: 16px; color: #64748B; line-height: 1.7;">${f.a}</div>
              </details>
            `).join('')}
          </div>
        ` : ''}
      `;
      break;

    case 'Review':
      content = `
        <div class="pg-card">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 32px;">
            <div style="width: 50px; height: 50px; background: #CBD5E1; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #fff;">P</div>
            <div>
              <div style="font-weight: 800; font-size: 1rem;">Portal Saúde & Tech</div>
              <div style="font-size: 0.8rem; color: #64748B;">Atualizado em 2026</div>
            </div>
          </div>
          <h1 style="text-align: left; margin-bottom: 24px;">${headline}</h1>
          <p style="font-style: italic; color: #64748B; font-size: 1.2rem; border-left: 4px solid var(--primary); padding-left: 20px;">${subheadline || ''}</p>
          ${renderHeroImage()}
          <div style="font-size: 1.15rem; color: #4B5563;">${bodyCopy}</div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin: 48px 0;">
            <div style="background: #F0FDF4; padding: 32px; border-radius: 20px; border: 1px solid #DCFCE7;">
              <div style="color: #166534; font-weight: 900; margin-bottom: 20px; font-size: 1.1rem;">✓ O QUE GOSTAMOS</div>
              ${pros.map(p => `<div style="font-size: 1rem; margin-bottom: 12px; display: flex; gap: 10px;"><span>✅</span> ${p}</div>`).join('')}
            </div>
            <div style="background: #FEF2F2; padding: 32px; border-radius: 20px; border: 1px solid #FEE2E2;">
              <div style="color: #991B1B; font-weight: 900; margin-bottom: 20px; font-size: 1.1rem;">! PONTOS DE ATENÇÃO</div>
              ${cons.map(c => `<div style="font-size: 1rem; margin-bottom: 12px; display: flex; gap: 10px;"><span>⚠️</span> ${c}</div>`).join('')}
            </div>
          </div>

          <div style="background: #111827; color: #fff; padding: 48px; border-radius: 24px; text-align: center; margin-top: 40px;">
            <div style="font-size: 1.75rem; font-weight: 900; margin-bottom: 16px;">Veredito Final</div>
            <p style="color: #94A3B8; margin-bottom: 32px;">Nossos testes mostram que o ${productName} supera as expectativas.</p>
            <a href="${ctaLink}" class="pg-btn" style="background: #fff; color: #111827; max-width: 400px;">IR PARA O SITE OFICIAL</a>
          </div>
        </div>
      `;
      break;

    case 'List':
      content = `
        <div class="pg-card">
          <h1>Ranking Oficial de 2026</h1>
          <p style="text-align: center; color: #64748B; margin-bottom: 48px;">Analisamos os melhores produtos do nicho.</p>
          
          <div style="background: #FFFBEB; border: 3px solid #F59E0B; padding: 40px; border-radius: 24px; position: relative; margin-bottom: 48px; box-shadow: 0 10px 30px rgba(245, 158, 11, 0.1);">
            <div style="position: absolute; top: -16px; left: 32px; background: #F59E0B; color: #fff; padding: 6px 20px; border-radius: 50px; font-weight: 900; font-size: 0.85rem; letter-spacing: 0.05em;">NOSSA ESCOLHA #1</div>
            <div style="display: flex; gap: 32px; align-items: center; flex-wrap: wrap;">
              <div style="width: 140px; flex-shrink: 0;">${renderHeroImage()}</div>
              <div style="flex: 1; min-width: 200px;">
                <h2 style="text-align: left; margin: 0 0 12px;">${productName}</h2>
                <p style="font-size: 1.05rem; margin-bottom: 24px;">Melhor desempenho em testes laboratoriais.</p>
                <a href="${ctaLink}" class="pg-btn" style="padding: 16px; font-size: 1rem;">ACESSAR SITE OFICIAL</a>
              </div>
            </div>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; margin-top: 32px; font-size: 1rem; border-radius: 16px; overflow: hidden;">
              <thead>
                <tr style="background: #F8FAFC;">
                  <th style="padding: 20px; text-align: left; border-bottom: 2px solid #E2E8F0;">Comparativo</th>
                  <th style="padding: 20px; text-align: center; background: #FEF3C7; border-bottom: 2px solid #F59E0B;">${productName}</th>
                  <th style="padding: 20px; text-align: center; border-bottom: 2px solid #E2E8F0;">Concorrência</th>
                </tr>
              </thead>
              <tbody>
                ${comparisonTable.map(row => `
                  <tr style="border-bottom: 1px solid #F1F5F9;">
                    <td style="padding: 16px 20px; font-weight: 700; color: #475569;">${row.feature}</td>
                    <td style="padding: 16px 20px; text-align: center; color: #059669; font-weight: 900; font-size: 1.1rem;">${row.product}</td>
                    <td style="padding: 16px 20px; text-align: center; color: #EF4444; font-weight: 500;">${row.competitor}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
      break;
  }

  const finalHTML = `
    <div class="pg-container">
        ${content}
    </div>
    <footer style="text-align: center; padding: 60px 16px; color: #94A3B8; font-size: 0.9rem; border-top: 1px solid #E2E8F0; margin-top: 60px;">
        Copyright 2026 ${productName}. Todos os direitos reservados.
    </footer>
  `;

  if (wrapForElementor) {
    return `<div id="pg-wrapper" class="pg-body">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap" rel="stylesheet">
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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap" rel="stylesheet">
    ${clarityScript || ''}
    <style>${commonStyles}</style>
</head>
<body class="pg-body">
    ${finalHTML}
</body>
</html>`;
}
