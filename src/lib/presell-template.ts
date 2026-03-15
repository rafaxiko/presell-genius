
export type PresellData = {
  headline: string;
  bodyCopy: string;
  callToAction: string;
  buttonColor: string;
  targetUrl: string;
};

export function generatePresellHTML(data: PresellData): string {
  const { headline, bodyCopy, callToAction, buttonColor, targetUrl } = data;
  const currentYear = new Date().getFullYear();

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
            background-color: #f1f5f9;
            color: #1e293b;
            margin: 0;
            padding: 0;
            line-height: 1.6;
            display: flex;
            flex-direction: column;
            min-h: 100vh;
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
            font-size: 2.5rem;
            font-weight: 800;
            line-height: 1.1;
            margin-bottom: 30px;
            letter-spacing: -0.025em;
        }
        .content {
            font-size: 1.25rem;
            margin-bottom: 40px;
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
            padding: 20px 40px;
            font-size: 1.5rem;
            font-weight: 700;
            text-decoration: none;
            border-radius: 12px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .cta-button:hover {
            transform: scale(1.03);
            filter: brightness(1.1);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        footer {
            margin-top: auto;
            padding: 40px 0;
            text-align: center;
            font-size: 0.875rem;
            color: #94a3b8;
        }
        @media (max-width: 640px) {
            .wrapper {
                margin: 20px;
                padding: 25px;
            }
            h1 {
                font-size: 1.8rem;
            }
            .content {
                font-size: 1.1rem;
            }
            .cta-button {
                font-size: 1.2rem;
                padding: 15px 25px;
            }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <h1>${headline}</h1>
        <div class="content">
${bodyCopy}
        </div>
        <div class="cta-container">
            <a href="${targetUrl}" class="cta-button">${callToAction}</a>
        </div>
    </div>
    <footer>
        &copy; ${currentYear} Presell Genius. Todos os direitos reservados.
    </footer>
</body>
</html>`;
}
