export type PresellData = {
  meta: {
    product_name: string;
    primary_color: string;
    publish_date: string;
    rating: string;
    review_count: string;
    seo_description: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    cta_text: string;
    trust_badges: string[];
    social_proof_line: string;
  };
  mechanism: {
    tag: string;
    headline: string;
    subheadline: string;
    paragraphs: string[];
    quote: string;
  };
  overview: {
    headline: string;
    description: string;
    bullets: { icon: string; text: string }[];
  };
  pricing: {
    headline: string;
    subheadline: string;
    per_bottle_label: string;
    bundles: {
      id: string;
      label: string;
      bottles: string;
      supply: string;
      price_per: string;
      original_total: string;
      discounted_total: string;
      savings: string;
      shipping: string;
      isBestValue: boolean;
      isMostPopular: boolean;
      desktop_position: number;
      mobile_position: number;
    }[];
  };
  ingredients: { name: string; benefit: string; image_url?: string }[];
  testimonials: { name: string; location: string; title: string; body: string; photo_url?: string }[];
  faq: { question: string; answer: string }[];
  footer: { copyright_text: string };
  productImageUrls?: string[];
  targetUrl: string;
  templateType: 'Lançamento' | 'Robusta' | 'Review' | 'Cookie' | 'Lista (Top 3/5)';
  copyStyle: 'White Hat (Conservador)' | 'Black Hat (Agressivo)';
  targetLanguage?: string;
};

export function generatePresellHTML(data: PresellData | null): string {
  if (!data) return '';

  const { meta, hero, mechanism, overview, pricing, ingredients, testimonials, faq, footer, productImageUrls = [], targetUrl, copyStyle } = data;
  const primaryColor = meta.primary_color || '#2952A3';
  const year = new Date(meta.publish_date || new Date()).getFullYear();
  const isBlackHat = copyStyle === 'Black Hat (Agressivo)';

  const getImg = (index: number) => {
    if (productImageUrls && productImageUrls[index]) return productImageUrls[index];
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E`;
  };

  const getTestiPhoto = (index: number) => {
    return `https://picsum.photos/seed/${index + 10}/100/100`;
  };

  const htmlTemplate = `<!DOCTYPE html>
<html lang="${data.targetLanguage || 'pt-BR'}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${meta.product_name} — Official Website ${year}</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root {
  --color-primary: ${primaryColor};
  --color-primary-dark: color-mix(in srgb, ${primaryColor} 80%, black);
  --color-primary-10: color-mix(in srgb, ${primaryColor} 10%, white);
  --font-heading: 'Poppins', sans-serif;
  --font-body: 'Inter', sans-serif;
  --bg-white: #FFFFFF;
  --bg-gray: #F9FAFB;
  --bg-dark: #0F172A;
  --text-dark: #1F2937;
  --text-mid: #374151;
  --radius-card: 20px;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--font-body); color: var(--text-dark); background: var(--bg-white); line-height: 1.6; }
#progress-bar { position: fixed; top: 0; left: 0; height: 4px; width: 0%; background: var(--color-primary); z-index: 9999; }
.countdown-bar { background: #111827; color: #FFD056; text-align: center; padding: 10px; font-weight: 700; font-size: 14px; display: ${isBlackHat ? 'block' : 'none'}; }
.navbar { background: var(--color-primary); padding: 15px 20px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 99; }
.navbar-logo { font-family: var(--font-heading); font-weight: 900; font-size: 20px; color: #fff; }
.hero { background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%); padding: 60px 20px; color: #fff; }
.hero-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; }
.hero h1 { font-family: var(--font-heading); font-size: 42px; font-weight: 900; line-height: 1.1; margin-bottom: 20px; }
.btn { display: inline-block; background: #FF8C00; color: #fff; padding: 16px 32px; border-radius: 50px; font-weight: 700; text-decoration: none; text-align: center; transition: 0.3s; animation: pulse 2s infinite; }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(255, 140, 0, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(255, 140, 0, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 140, 0, 0); } }
.section { padding: 80px 20px; }
.pricing-grid { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.pricing-card { background: #fff; border: 1px solid #eee; border-radius: 20px; padding: 30px; text-align: center; position: relative; }
.pricing-card.featured { border: 3px solid var(--color-primary); transform: scale(1.05); z-index: 10; }
.pricing-card img { max-height: 200px; margin-bottom: 20px; }
.price-big { font-size: 48px; font-weight: 900; color: var(--text-dark); }
.savings { color: #16a34a; font-weight: 700; margin-bottom: 20px; }
@media (max-width: 768px) {
  .hero-inner { grid-template-columns: 1fr; text-align: center; }
  .pricing-grid { grid-template-columns: 1fr; }
  .pricing-card.featured { order: -1; transform: scale(1); margin-bottom: 20px; }
}
</style>
</head>
<body>
<div id="progress-bar"></div>
<div class="countdown-bar">🔥 ÚLTIMAS UNIDADES NO ESTOQUE! OFERTA TERMINA EM: <span id="timer">10:00</span></div>
<nav class="navbar"><div class="navbar-logo">${meta.product_name}</div></nav>
<section class="hero"><div class="hero-inner"><div><h1>${hero.headline}</h1><p>${hero.subheadline}</p><a href="${targetUrl}" class="btn">${hero.cta_text}</a></div><div><img src="${getImg(0)}" alt="Product"></div></div></section>
<section class="section" style="background: #F9FAFB;"><div style="max-width: 800px; margin: 0 auto; text-align: center;"><h2>${mechanism.headline}</h2><p>${mechanism.paragraphs[0]}</p></div></section>
<section class="section" id="pricing">
  <div class="pricing-grid">
    ${pricing.bundles.sort((a, b) => a.desktop_position - b.desktop_position).map(p => `
      <div class="pricing-card ${p.isBestValue ? 'featured' : ''}" style="order: ${p.desktop_position};">
        ${p.isBestValue ? '<div style="position:absolute;top:0;left:50%;transform:translateX(-50%);background:var(--color-primary);color:#fff;padding:5px 20px;border-radius:0 0 10px 10px;font-size:12px;font-weight:700;">MELHOR ESCOLHA</div>' : ''}
        <h3>${p.label}</h3>
        <img src="${getImg(0)}" alt="Kit">
        <div class="price-big">${p.price_per}</div>
        <div style="font-size:12px;opacity:0.6;">${pricing.per_bottle_label}</div>
        <div class="savings">ECONOMIZE ${p.savings}</div>
        <a href="${targetUrl}" class="btn" style="width:100%">${hero.cta_text}</a>
      </div>
    `).join('')}
  </div>
</section>
<section class="section" style="background: #fff;"><div style="max-width: 1000px; margin: 0 auto;"><h2>Depoimentos Verificados</h2><div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:20px;">
  ${testimonials.map((t, idx) => `<div style="background:#f9fafb;padding:20px;border-radius:15px;"><div style="display:flex;align-items:center;gap:15px;margin-bottom:15px;"><img src="${getTestiPhoto(idx)}" style="width:50px;height:50px;border-radius:50%;"><div style="font-weight:700;">${t.name}</div></div><p>"${t.body}"</p></div>`).join('')}
</div></div></section>
<footer style="background:#111827;color:#fff;padding:40px;text-align:center;"><p>${footer.copyright_text}</p></footer>
<script>
window.onscroll = function() {
  let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  document.getElementById("progress-bar").style.width = (winScroll / height) * 100 + "%";
};
let sec = 600;
setInterval(() => {
  sec--;
  let m = Math.floor(sec / 60);
  let s = sec % 60;
  document.getElementById("timer").innerHTML = m + ":" + (s < 10 ? "0" : "") + s;
}, 1000);
</script>
</body>
</html>`;

  return htmlTemplate;
}
