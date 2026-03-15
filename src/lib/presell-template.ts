export type PresellData = {
  productName: string;
  headline: string;
  bodyCopy: string;
  callToAction: string;
  buttonColor: string;
  targetUrl: string;
  productImageUrls?: string[];
  trackingLink?: string;
  clarityScript?: string;
  templateType?: string;
};

export function generatePresellHTML(data: PresellData): string {
  const { 
    productName, 
    headline, 
    bodyCopy, 
    callToAction, 
    buttonColor, 
    targetUrl, 
    productImageUrls, 
    trackingLink, 
    clarityScript 
  } = data;
  
  const currentYear = new Date().getFullYear();
  const ctaLink = trackingLink || targetUrl;

  // Renderização de múltiplas imagens
  const imagesHtml = productImageUrls && productImageUrls.length > 0 
    ? productImageUrls.map(url => `
        <div class="product-image">
          <img src="${url.trim()}" alt="${productName}">
        </div>
      `).join('')
    : `<div class="product-image placeholder">
         <img src="https://picsum.photos/seed/product/800/450" alt="Placeholder">
         <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 10px;">(Adicione URLs de imagens no painel)</p>
       </div>`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${headline} | ${productName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap" rel="stylesheet">
    ${clarityScript || ''}
    <style>
        :root {
            --primary-color: ${buttonColor || '#2952A3'};
        }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        .wrapper {
            max-width: 650px;
            margin: 60px auto;
            padding: 50px;
            background: #ffffff;
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
            text-align: center;
        }
        h1 {
            color: #0f172a;
            font-size: 2.5rem;
            font-weight: 800;
            line-height: 1.1;
            margin-bottom: 30px;
            letter-spacing: -0.025em;
        }
        .product-image {
            margin: 0 auto 25px;
            width: 100%;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        }
        .product-image img {
            width: 100%;
            height: auto;
            display: block;
            object-fit: cover;
        }
        .product-image.placeholder {
            border: 2px dashed #cbd5e1;
            padding: 20px;
            background-color: #f1f5f9;
        }
        .content {
            font-size: 1.1rem;
            margin: 40px 0;
            color: #334155;
            text-align: left;
            white-space: pre-wrap;
        }
        .cta-container {
            margin-top: 30px;
        }
        .cta-button {
            display: inline-block;
            width: 100%;
            background-color: var(--primary-color);
            color: #ffffff;
            padding: 22px 35px;
            font-size: 1.5rem;
            font-weight: 800;
            text-decoration: none;
            border-radius: 12px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
            text-transform: uppercase;
            letter-spacing: 0.025em;
            box-sizing: border-box;
        }
        .cta-button:hover {
            transform: translateY(-3px) scale(1.01);
            filter: brightness(1.1);
            box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.3);
        }
        footer {
            padding: 60px 20px;
            text-align: center;
            font-size: 0.85rem;
            color: #94a3b8;
            max-width: 600px;
            margin: 0 auto;
        }
        @media (max-width: 640px) {
            .wrapper {
                margin: 20px;
                padding: 30px 20px;
                border-radius: 16px;
            }
            h1 { font-size: 1.8rem; }
            .content { font-size: 1rem; }
            .cta-button { font-size: 1.2rem; padding: 18px 25px; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <h1>${headline}</h1>
        <div class="images-container">
          ${imagesHtml}
        </div>
        <div class="content">${bodyCopy}</div>
        <div class="cta-container">
            <a href="${ctaLink}" class="cta-button">${callToAction}</a>
        </div>
    </div>
    <footer>
        AVISO LEGAL: Este site não é afiliado ao Google, Meta ou qualquer rede de publicidade. Os resultados podem variar de pessoa para pessoa.
        <br><br>
        Copyright 2026 ${productName}. All rights reserved.
    </footer>
</body>
</html>`;
}
