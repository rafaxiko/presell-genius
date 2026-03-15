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
 * Generates the full HTML for the presell page with strict image hierarchy.
 */
export function generatePresellHTML(data: PresellData, wrapForElementor = false): string {
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
  } = data;
  
  const ctaLink = trackingLink || targetUrl;
  
  // Image Hierarchy Logic
  const primaryImg = productImageUrls[0] || 'https://picsum.photos/seed/product/800/450';
  const secondaryImages = productImageUrls.length > 1 ? productImageUrls.slice(1, productImageUrls.length > 2 ? -1 : undefined) : [];
  const trustBadgeImg = productImageUrls.length > 2 ? productImageUrls[productImageUrls.length - 1] : null;

  const commonStyles = `
    :root { 
      --primary: ${buttonColor || '#2952A3'}; 
      --text: #1e293b; 
      --bg: #f8fafc; 
      --card-bg: #ffffff;
      --radius: 20px;
      --shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    .pg-body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); margin: 0; line-height: 1.6; -webkit-font-smoothing: antialiased; }
    .pg-container { max-width: 800px; margin: 0 auto; padding: 40px 20px; box-sizing: border-box; }
    .pg-card { background: var(--card-bg); border-radius: var(--radius); padding: 40px; border: 1px solid #e2e8f0; box-shadow: var(--shadow); margin-bottom: 40px; overflow: hidden; }
    .pg-btn { display: block; width: 100%; background: var(--primary); color: #fff; text-align: center; padding: 22px; border-radius: 12px; font-weight: 800; font-size: 1.3rem; text-decoration: none; text-transform: uppercase; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-sizing: border-box; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
    .pg-btn:hover { transform: translateY(-3px); filter: brightness(1.1); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2); }
    .pg-img-hero { width: 100%; max-width: 600px; border-radius: 15px; display: block; margin: 0 auto 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
    .pg-img-secondary { width: 100%; border-radius: 12px; display: block; margin: 0 auto; transition: transform 0.3s ease; }
    .pg-img-secondary:hover { transform: scale(1.02); }
    .pg-img-trust { max-width: 250px; height: auto; display: block; margin: 20px auto 0; opacity: 0.9; }
    .pg-gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin: 40px 0; }
    .pg-footer { text-align: center; padding: 60px 40px; color: #64748b; font-size: 0.85rem; line-height: 1.8; }
    .pg-badge { background: #f1f5f9; padding: 6px 14px; border-radius: 30px; font-size: 0.75rem; font-weight: 700; color: var(--primary); margin-bottom: 20px; display: inline-block; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid #e2e8f0; }
    h1, h2, h3 { color: #0f172a; font-weight: 800; text-align: center; margin-top: 0; }
    p { margin-bottom: 20px; }
    @media (max-width: 640px) {
      .pg-card { padding: 25px; }
      h1 { font-size: 2rem !important; }
      .pg-btn { font-size: 1.1rem; padding: 18px; }
    }
  `;

  let content = '';

  const renderTrustBadge = () => trustBadgeImg ? `<img src="${trustBadgeImg}" class="pg-img-trust" alt="Segurança">` : '';

  switch (templateType) {
    case 'Launch':
      content = `
        <div class="pg-card" style="text-align: center;">
          <div class="pg-badge">Acesso Exclusivo</div>
          <h1 style="font-size: 3rem; letter-spacing: -2px; margin-bottom: 20px; line-height: 1.1;">${headline}</h1>
          <p style="font-size: 1.3rem; color: #64748b; margin-bottom: 40px;">${subheadline || ''}</p>
          <div style="background: #0f172a; color: #fff; padding: 30px; border-radius: 15px; margin-bottom: 40px; display: inline-block; min-width: 200px;">
            <div style="font-size: 0.7rem; text-transform: uppercase; color: #94a3b8; margin-bottom: 5px;">A oferta encerra em:</div>
            <div style="font-family: monospace; font-size: 2.5rem; font-weight: bold;" id="pg-timer">09:54</div>
          </div>
          <img src="${primaryImg}" class="pg-img-hero">
          <div style="text-align: left; font-size: 1.1rem; color: #334155; margin-bottom: 40px;">${bodyCopy}</div>
          <a href="${ctaLink}" class="pg-btn">${callToAction}</a>
          ${renderTrustBadge()}
        </div>
        <script>
          let pg_time = 594;
          setInterval(() => {
            let m = Math.floor(pg_time/60); let s = pg_time%60;
            const el = document.getElementById('pg-timer');
            if(el) el.innerText = (m<10?'0':'')+m+':'+(s<10?'0':'')+s;
            if(pg_time > 0) pg_time--;
          }, 1000);
        </script>
      `;
      break;

    case 'Robust':
      content = `
        <div class="pg-card">
          <h1 style="font-size: 2.8rem; line-height: 1.1; margin-bottom: 30px;">${headline}</h1>
          <p style="font-size: 1.2rem; color: #64748b; margin-bottom: 30px; text-align: center;">${subheadline || ''}</p>
          
          <img src="${primaryImg}" class="pg-img-hero">
          
          <div style="font-size: 1.15rem; color: #334155; margin-bottom: 40px;">${bodyCopy}</div>
          
          ${secondaryImages.length > 0 ? `
            <h2 style="margin: 60px 0 30px; font-size: 1.8rem;">Galeria do Produto</h2>
            <div class="pg-gallery">
              ${secondaryImages.map(url => `<div style="overflow:hidden; border-radius:12px; border:1px solid #eee;"><img src="${url}" class="pg-img-secondary"></div>`).join('')}
            </div>
          ` : ''}

          <h2 style="margin: 60px 0 30px; font-size: 1.8rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px;">Por que escolher o ${productName}?</h2>
          <div style="display: grid; gap: 20px;">
            ${benefits.map(b => `
              <div style="display: flex; gap: 15px; align-items: start; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
                <div style="color: var(--primary); font-size: 1.5rem; line-height: 1;">✓</div>
                <div style="font-weight: 600; font-size: 1.1rem;">${b}</div>
              </div>
            `).join('')}
          </div>

          ${ingredients.length ? `
            <h2 style="margin: 60px 0 30px; font-size: 1.8rem;">Composição Premium</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px;">
              ${ingredients.map(i => `<div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 18px; border-radius: 12px; font-size: 0.95rem; font-weight: 500; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.02);">${i}</div>`).join('')}
            </div>
          ` : ''}
        </div>

        <h2 style="text-align: center; margin-bottom: 40px; font-size: 2rem;">Escolha o Melhor Plano</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 20px; margin-bottom: 60px;">
          ${pricing.length ? pricing.map(p => `
            <div class="pg-card" style="text-align: center; padding: 40px 25px; border: ${p.isBestValue ? '3px solid var(--primary)' : '1px solid #e2e8f0'}; position: relative; margin-bottom: 0;">
              ${p.isBestValue ? '<div style="position: absolute; top: -18px; left: 50%; transform: translateX(-50%); background: var(--primary); color: #fff; padding: 6px 20px; border-radius: 30px; font-size: 0.75rem; font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">O MAIS DESEJADO</div>' : ''}
              <div style="font-size: 1.4rem; font-weight: 800; margin-bottom: 5px;">${p.quantity}</div>
              <div style="font-size: 0.85rem; color: #16a34a; font-weight: 700;">${p.discount}</div>
              <div style="font-size: 2.5rem; font-weight: 900; color: var(--primary); margin: 25px 0;">${p.price}</div>
              <a href="${ctaLink}" class="pg-btn" style="font-size: 1rem; padding: 15px;">COMPRAR AGORA</a>
            </div>
          `).join('') : `
            <div class="pg-card" style="text-align: center; grid-column: 1 / -1; margin-bottom: 0;">
              <a href="${ctaLink}" class="pg-btn">${callToAction}</a>
              ${renderTrustBadge()}
            </div>
          `}
        </div>

        ${faqs.length ? `
          <div class="pg-card">
            <h2 style="margin-bottom: 30px;">Dúvidas Frequentes</h2>
            ${faqs.map(f => `
              <details style="margin-bottom: 10px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px 20px; cursor: pointer;">
                <summary style="font-weight: 700; font-size: 1rem;">${f.q}</summary>
                <p style="margin-top: 15px; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 15px;">${f.a}</p>
              </details>
            `).join('')}
          </div>
        ` : ''}
      `;
      break;

    case 'Review':
      content = `
        <div class="pg-card">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 30px; justify-content: center;">
            <div style="width: 44px; height: 44px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #64748b;">SH</div>
            <div style="text-align: left;">
              <div style="font-weight: 700; font-size: 0.95rem;">Portal Saúde & Bem-estar</div>
              <div style="font-size: 0.75rem; color: #94a3b8;">Verificado • 2026</div>
            </div>
          </div>
          <h1 style="font-size: 2.6rem; margin-bottom: 20px;">${headline}</h1>
          <p style="font-style: italic; color: #64748b; font-size: 1.2rem; border-left: 4px solid var(--primary); padding-left: 20px; margin-bottom: 40px; text-align: left;">${subheadline || ''}</p>
          <img src="${primaryImg}" class="pg-img-hero">
          <div style="font-size: 1.1rem; line-height: 1.8; color: #334155;">${bodyCopy}</div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; margin: 50px 0;">
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 30px; border-radius: 15px;">
              <h4 style="color: #166534; margin: 0 0 20px; font-weight: 800; font-size: 1.1rem; text-align: left;">PONTOS POSITIVOS</h4>
              <ul style="padding-left: 20px; font-size: 0.95rem; color: #166534; list-style-type: '✓ ';">
                ${pros.map(p => `<li style="margin-bottom: 10px;">${p}</li>`).join('')}
              </ul>
            </div>
            <div style="background: #fff1f2; border: 1px solid #fecdd3; padding: 30px; border-radius: 15px;">
              <h4 style="color: #991b1b; margin: 0 0 20px; font-weight: 800; font-size: 1.1rem; text-align: left;">PONTOS DE ATENÇÃO</h4>
              <ul style="padding-left: 20px; font-size: 0.95rem; color: #991b1b; list-style-type: '⚠ ';">
                ${cons.map(c => `<li style="margin-bottom: 10px;">${c}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div style="background: #0f172a; padding: 40px; border-radius: 15px; color: #fff; text-align: center;">
            <h3 style="color: #fff; margin-top: 0; font-size: 1.8rem;">Veredito Final</h3>
            <p style="color: #94a3b8; margin-bottom: 30px;">Nossa análise técnica concluiu que o ${productName} é a solução mais eficaz testada este ano.</p>
            <a href="${ctaLink}" class="pg-btn" style="background: #fff; color: #0f172a;">Ver Site Oficial</a>
            ${renderTrustBadge()}
          </div>
        </div>
      `;
      break;

    case 'List':
      content = `
        <div class="pg-card">
          <h1 style="font-size: 2.6rem; text-align: center; margin-bottom: 20px;">Top Produtos para 2026</h1>
          <p style="text-align: center; color: #64748b; font-size: 1.1rem; margin-bottom: 50px;">Comparativo técnico imparcial baseado em Pureza e Resultados.</p>
          
          <div style="margin-bottom: 60px;">
            <div style="background: #fffbeb; border: 3px solid #fbbf24; padding: 40px; border-radius: 20px; position: relative;">
              <div style="position: absolute; top: -18px; left: 30px; background: #fbbf24; color: #fff; padding: 8px 25px; border-radius: 30px; font-weight: 900; font-size: 0.8rem;">TOP #1 RECOMENDADO</div>
              <div style="display: flex; gap: 40px; align-items: center; flex-wrap: wrap;">
                <img src="${primaryImg}" style="width: 180px; height: 180px; object-fit: cover; border-radius: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <div style="flex: 1; min-width: 250px;">
                  <h2 style="margin: 0 0 10px; font-size: 2rem; text-align: left;">${productName}</h2>
                  <p style="font-size: 1rem; color: #78350f; margin-bottom: 25px;">Vencedor absoluto em absorção e custo-benefício.</p>
                  <a href="${ctaLink}" class="pg-btn" style="background: #0f172a; font-size: 1rem; padding: 18px;">Ver Desconto Exclusivo</a>
                </div>
              </div>
            </div>
          </div>

          <h3 style="margin-bottom: 25px; font-size: 1.5rem;">Tabela Comparativa</h3>
          <div style="overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 12px;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">
              <thead>
                <tr style="background: #f8fafc;">
                  <th style="padding: 20px; border-bottom: 1px solid #e2e8f0;">Critério</th>
                  <th style="padding: 20px; border-bottom: 1px solid #e2e8f0; background: #fffbeb; text-align: center;">${productName}</th>
                  <th style="padding: 20px; border-bottom: 1px solid #e2e8f0; text-align: center;">Média Mercado</th>
                </tr>
              </thead>
              <tbody>
                ${comparisonTable.map(row => `
                  <tr>
                    <td style="padding: 18px 20px; border-bottom: 1px solid #f1f5f9; font-weight: 700;">${row.feature}</td>
                    <td style="padding: 18px 20px; border-bottom: 1px solid #f1f5f9; background: #fffbeb; color: #166534; font-weight: 700; text-align: center;">${row.product}</td>
                    <td style="padding: 18px 20px; border-bottom: 1px solid #f1f5f9; color: #991b1b; text-align: center;">${row.competitor}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ${renderTrustBadge()}
        </div>
      `;
      break;
  }

  const finalHTML = `
    <div class="pg-container">
        ${content}
    </div>
    <footer class="pg-footer">
        AVISO: Este site não é afiliado ao Facebook ou Google. Os resultados individuais podem variar.<br>
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
