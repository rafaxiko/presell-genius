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

export function generatePresellHTML(data: PresellData): string {
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
  const primaryImg = productImageUrls[0] || 'https://picsum.photos/seed/product/800/450';

  const commonStyles = `
    :root { --primary: ${buttonColor || '#2952A3'}; --text: #1e293b; --bg: #f8fafc; }
    body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); margin: 0; line-height: 1.6; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    .card { background: #fff; border-radius: 20px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); margin-bottom: 30px; }
    .btn { display: block; width: 100%; background: var(--primary); color: #fff; text-align: center; padding: 20px; border-radius: 12px; font-weight: 800; font-size: 1.4rem; text-decoration: none; text-transform: uppercase; transition: 0.3s; box-sizing: border-box; }
    .btn:hover { transform: translateY(-3px); filter: brightness(1.1); box-shadow: 0 15px 25px rgba(0,0,0,0.2); }
    img { max-width: 100%; border-radius: 12px; }
    footer { text-align: center; padding: 40px; color: #94a3b8; font-size: 0.8rem; }
    .badge { background: #e2e8f0; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; color: #64748b; margin-bottom: 15px; display: inline-block; }
  `;

  let specificContent = '';

  switch (templateType) {
    case 'Launch':
      specificContent = `
        <div class="card" style="text-align: center;">
          <div class="badge">ACESSO EXCLUSIVO DISPONÍVEL</div>
          <h1 style="font-size: 2.5rem; letter-spacing: -1px; margin-top: 0;">${headline}</h1>
          <p style="font-size: 1.2rem; color: #64748b;">${subheadline || ''}</p>
          <div style="background: #0f172a; color: #fff; padding: 20px; border-radius: 12px; margin: 30px 0; font-family: monospace; font-size: 2rem;">
            OFERTA EXPIRA EM: <span id="timer">09:54</span>
          </div>
          <img src="${primaryImg}" style="margin-bottom: 30px;">
          <div style="text-align: left; margin-bottom: 30px;">${bodyCopy}</div>
          <a href="${ctaLink}" class="btn">${callToAction}</a>
        </div>
        <script>
          let time = 594;
          setInterval(() => {
            let m = Math.floor(time/60); let s = time%60;
            document.getElementById('timer').innerText = (m<10?'0':'')+m+':'+(s<10?'0':'')+s;
            if(time > 0) time--;
          }, 1000);
        </script>
      `;
      break;

    case 'Robust':
      specificContent = `
        <div class="card">
          <h1 style="font-size: 2.8rem; line-height: 1.1;">${headline}</h1>
          <img src="${primaryImg}" style="margin: 20px 0;">
          <div class="content">${bodyCopy}</div>
          
          <h2 style="margin-top: 50px;">Por que escolher o ${productName}?</h2>
          <ul style="padding-left: 20px; color: #334155;">
            ${benefits.map(b => `<li style="margin-bottom: 12px; font-size: 1.1rem;"><strong>✓</strong> ${b}</li>`).join('')}
          </ul>

          ${ingredients.length ? `
            <h2 style="margin-top: 50px;">Fórmula Avançada</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              ${ingredients.map(i => `<div style="background: #f1f5f9; padding: 15px; border-radius: 10px; font-size: 0.9rem;">${i}</div>`).join('')}
            </div>
          ` : ''}
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px;">
          ${pricing.length ? pricing.map(p => `
            <div class="card" style="text-align: center; border: ${p.isBestValue ? '3px solid var(--primary)' : '1px solid #e2e8f0'}; position: relative;">
              ${p.isBestValue ? '<div style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: var(--primary); color: #fff; padding: 4px 15px; border-radius: 20px; font-size: 0.7rem;">MELHOR ESCOLHA</div>' : ''}
              <h3 style="margin-bottom: 5px;">${p.quantity}</h3>
              <div style="font-size: 0.8rem; color: #94a3b8;">${p.discount}</div>
              <div style="font-size: 2rem; font-weight: 800; color: var(--primary); margin: 15px 0;">${p.price}</div>
              <a href="${ctaLink}" class="btn" style="font-size: 0.9rem; padding: 12px;">COMPRAR AGORA</a>
            </div>
          `).join('') : `
            <div class="card" style="text-align: center; grid-column: 1 / -1;">
              <a href="${ctaLink}" class="btn">${callToAction}</a>
            </div>
          `}
        </div>

        ${faqs.length ? `
          <div class="card">
            <h2>Dúvidas Frequentes</h2>
            ${faqs.map(f => `<details style="margin-bottom: 15px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px;">
              <summary style="font-weight: 700; cursor: pointer;">${f.q}</summary>
              <p style="margin-top: 10px; color: #64748b;">${f.a}</p>
            </details>`).join('')}
          </div>
        ` : ''}
      `;
      break;

    case 'Review':
      specificContent = `
        <div class="card">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
            <div style="width: 40px; height: 40px; background: #cbd5e1; border-radius: 50%;"></div>
            <div><strong>Redação Saúde Hoje</strong> • Atualizado em Junho de 2026</div>
          </div>
          <h1 style="font-size: 2.4rem;">${headline}</h1>
          <p style="font-style: italic; color: #64748b; font-size: 1.2rem;">"${subheadline || ''}"</p>
          <img src="${primaryImg}" style="margin: 20px 0;">
          <div class="content">${bodyCopy}</div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 40px 0;">
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 12px;">
              <h4 style="color: #166534; margin: 0 0 10px;">PRÓS</h4>
              <ul style="padding-left: 20px; font-size: 0.9rem; color: #166534;">
                ${pros.map(p => `<li>${p}</li>`).join('')}
              </ul>
            </div>
            <div style="background: #fff1f2; border: 1px solid #fecdd3; padding: 20px; border-radius: 12px;">
              <h4 style="color: #991b1b; margin: 0 0 10px;">CONTRAS</h4>
              <ul style="padding-left: 20px; font-size: 0.9rem; color: #991b1b;">
                ${cons.map(c => `<li>${c}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div style="background: #f8fafc; padding: 30px; border-radius: 15px; border-left: 5px solid var(--primary);">
            <h3 style="margin-top: 0;">Veredito Final</h3>
            <p>Após nossa análise detalhada, concluímos que o ${productName} oferece o melhor custo-benefício para quem busca resultados reais.</p>
            <a href="${ctaLink}" class="btn" style="margin-top: 20px;">VER DISPONIBILIDADE NO SITE OFICIAL</a>
          </div>
        </div>
      `;
      break;

    case 'List':
      specificContent = `
        <div class="card">
          <h1>Ranking 2026: Os Melhores Produtos para Sua Saúde</h1>
          <p>Analisamos os 15 principais produtos do mercado e selecionamos os Top 3 para você não errar na escolha.</p>
          
          <div style="margin: 40px 0;">
            <div style="background: #fffbeb; border: 2px solid #fbbf24; padding: 30px; border-radius: 20px; position: relative;">
              <div style="position: absolute; top: -15px; left: 20px; background: #fbbf24; color: #fff; padding: 5px 15px; border-radius: 20px; font-weight: 800;">#1 CAMPEÃO</div>
              <div style="display: flex; gap: 25px; align-items: center;">
                <img src="${primaryImg}" style="width: 150px; height: 150px; object-fit: cover;">
                <div>
                  <h2 style="margin: 0;">${productName}</h2>
                  <p style="font-size: 0.9rem; color: #64748b;">A escolha definitiva da nossa equipe editorial.</p>
                  <a href="${ctaLink}" class="btn" style="font-size: 1rem; padding: 12px;">VISITAR SITE OFICIAL</a>
                </div>
              </div>
            </div>
          </div>

          <h3>Tabela Comparativa</h3>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
              <thead>
                <tr style="background: #f1f5f9;">
                  <th style="padding: 12px; border: 1px solid #e2e8f0;">Recurso</th>
                  <th style="padding: 12px; border: 1px solid #e2e8f0; background: #fffbeb;">${productName}</th>
                  <th style="padding: 12px; border: 1px solid #e2e8f0;">Concorrentes</th>
                </tr>
              </thead>
              <tbody>
                ${comparisonTable.length ? comparisonTable.map(row => `
                  <tr>
                    <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: 700;">${row.feature}</td>
                    <td style="padding: 12px; border: 1px solid #e2e8f0; background: #fffbeb; color: #166534;"><strong>✓</strong> ${row.product}</td>
                    <td style="padding: 12px; border: 1px solid #e2e8f0; color: #991b1b;"><strong>✕</strong> ${row.competitor}</td>
                  </tr>
                `).join('') : `
                  <tr><td colspan="3" style="padding: 12px; text-align: center;">Comparativo gerado pela IA...</td></tr>
                `}
              </tbody>
            </table>
          </div>
        </div>
        <div style="text-align: center;">
          <a href="${ctaLink}" class="btn" style="max-width: 400px; margin: 0 auto;">${callToAction}</a>
        </div>
      `;
      break;
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
<body>
    <div class="container">
        ${specificContent}
    </div>
    <footer>
        AVISO: Este site não é afiliado ao Google ou Facebook. Os resultados podem variar.<br><br>
        Copyright 2026 ${productName}. Todos os direitos reservados.
    </footer>
</body>
</html>`;
}
