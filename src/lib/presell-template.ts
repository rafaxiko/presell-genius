export type PresellData = {
  headline: string;
  bodyCopy: string;
  callToAction: string;
  buttonColor: string;
  targetUrl: string;
  productImageUrl?: string;
};

export function generatePresellHTML(data: PresellData): string {
  const { headline, bodyCopy, callToAction, buttonColor, targetUrl, productImageUrl } = data;
  const currentYear = new Date().getFullYear();

  // Robust image rendering logic
  const imageTag = productImageUrl 
    ? `<div class="product-image"><img src="${productImageUrl}" alt="Produto Principal"></div>`
    : `<div class="product-image placeholder">
         <img src="https://picsum.photos/seed/product/800/450" alt="Placeholder">
         <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 10px;">(Adicione uma URL de imagem no painel para ver seu produto aqui)</p>
       </div>`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${headline}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap" rel="stylesheet">
    <style>
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
            margin: 0 auto 35px;
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
            margin-bottom: 40px;
            color: #334155;
            text-align: left;
            white-space: pre-wrap;
        }
        .cta-container {
            margin-top: 20px;
        }
        .cta-button {
            display: inline-block;
            width: 100%;
            background-color: ${buttonColor || '#2952A3'};
            color: #ffffff;
            padding: 20px 35px;
            font-size: 1.5rem;
            font-weight: 800;
            text-decoration: none;
            border-radius: 12px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
            text-transform: uppercase;
            letter-spacing: 0.025em;
        }
        .cta-button:hover {
            transform: translateY(-3px) scale(1.02);
            filter: brightness(1.1);
            box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.3);
        }
        footer {
            padding: 60px 20px;
            text-align: center;
            font-size: 0.8rem;
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
            .cta-button { font-size: 1.2rem; padding: 16px 25px; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <h1>${headline}</h1>
        ${imageTag}
        <div class="content">${bodyCopy}</div>
        <div class="cta-container">
            <a href="${targetUrl}" class="cta-button">${callToAction}</a>
        </div>
    </div>
    <footer>
        AVISO LEGAL: Este site não é afiliado ao Google, Meta ou qualquer rede de publicidade. Os resultados podem variar de pessoa para pessoa.
        <br><br>
        &copy; ${currentYear} Presell Genius - Workspace de Afiliados.
    </footer>
</body>
</html>`;
}
