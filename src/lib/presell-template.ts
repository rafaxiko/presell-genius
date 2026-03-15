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

  const imageTag = productImageUrl 
    ? `<div class="product-image"><img src="${productImageUrl}" alt="Produto"></div>`
    : `<div class="product-image placeholder">
         <img src="https://picsum.photos/seed/product/600/350" alt="Exemplo de Produto">
         <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 5px;">(Imagem de Exemplo)</p>
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
            margin: 40px auto;
            padding: 40px;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            color: #0f172a;
            font-size: 2.2rem;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 25px;
            letter-spacing: -0.025em;
        }
        .product-image {
            margin: 0 auto 30px;
            max-width: 100%;
            border-radius: 12px;
            overflow: hidden;
        }
        .product-image img {
            width: 100%;
            height: auto;
            display: block;
        }
        .product-image.placeholder {
            border: 2px dashed #e2e8f0;
            padding: 10px;
        }
        .content {
            font-size: 1.15rem;
            margin-bottom: 35px;
            color: #475569;
            text-align: left;
            white-space: pre-wrap;
        }
        .cta-container {
            margin-top: 20px;
        }
        .cta-button {
            display: block;
            background-color: ${buttonColor || '#2952A3'};
            color: #ffffff;
            padding: 18px 30px;
            font-size: 1.4rem;
            font-weight: 700;
            text-decoration: none;
            border-radius: 12px;
            transition: all 0.3s ease;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .cta-button:hover {
            transform: translateY(-2px);
            filter: brightness(1.1);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        footer {
            padding: 40px 0;
            text-align: center;
            font-size: 0.8rem;
            color: #94a3b8;
        }
        @media (max-width: 640px) {
            .wrapper {
                margin: 15px;
                padding: 20px;
            }
            h1 { font-size: 1.7rem; }
            .content { font-size: 1rem; }
            .cta-button { font-size: 1.1rem; }
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
        Este site não faz parte do Google ou do Facebook. Além disso, este site NÃO é endossado pelo Google ou Facebook de nenhuma maneira.<br>
        &copy; ${currentYear} Presell Genius. Todos os direitos reservados.
    </footer>
</body>
</html>`;
}