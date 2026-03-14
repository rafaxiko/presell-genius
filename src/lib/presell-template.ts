
export type PresellData = {
  headline: string;
  bodyCopy: string;
  callToAction: string;
  buttonColor: string;
  targetUrl: string;
};

export function generatePresellHTML(data: PresellData): string {
  const { headline, bodyCopy, callToAction, buttonColor, targetUrl } = data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${headline}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 50px auto;
            padding: 40px;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
        h1 {
            color: #0f172a;
            font-size: 2.5rem;
            line-height: 1.2;
            margin-bottom: 24px;
            text-align: center;
        }
        .content {
            font-size: 1.125rem;
            margin-bottom: 32px;
            white-space: pre-wrap;
        }
        .cta-container {
            text-align: center;
        }
        .cta-button {
            display: inline-block;
            background-color: ${buttonColor || '#2952A3'};
            color: #ffffff;
            padding: 16px 32px;
            font-size: 1.25rem;
            font-weight: 700;
            text-decoration: none;
            border-radius: 8px;
            transition: transform 0.2s ease, filter 0.2s ease;
        }
        .cta-button:hover {
            transform: translateY(-2px);
            filter: brightness(1.1);
        }
        footer {
            margin-top: 40px;
            text-align: center;
            font-size: 0.875rem;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${headline}</h1>
        <div class="content">
${bodyCopy}
        </div>
        <div class="cta-container">
            <a href="${targetUrl}" class="cta-button">${callToAction}</a>
        </div>
    </div>
    <footer>
        &copy; ${new Date().getFullYear()} Presell Genius. All rights reserved.
    </footer>
</body>
</html>`;
}
