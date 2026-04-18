import { GeneratePresellContentOutput } from '@/ai/flows/generate-presell-content';

const AGGRESSIVE_COUNTRIES = [
  'Brasil','Estados Unidos','México','Argentina','Colômbia','Peru','Chile',
  'Venezuela','Equador','Bolívia','Paraguai','Uruguai','Guatemala','Honduras',
  'Costa Rica','Panamá','Nicarágua','Porto Rico','Canadá','Austrália',
  'Nova Zelândia','Índia','Filipinas','Indonésia','Tailândia','Vietnã','Singapura',
];

function isAggressive(country: string): boolean {
  return AGGRESSIVE_COUNTRIES.includes(country);
}

function lightenColor(hex: string, factor: number): string {
  const clean = hex.replace('#','');
  const r = parseInt(clean.substring(0,2),16);
  const g = parseInt(clean.substring(2,4),16);
  const b = parseInt(clean.substring(4,6),16);
  const nr = Math.round(r + (255-r)*factor);
  const ng = Math.round(g + (255-g)*factor);
  const nb = Math.round(b + (255-b)*factor);
  return '#' + [nr,ng,nb].map(v=>Math.min(255,v).toString(16).padStart(2,'0')).join('');
}

function darkenColor(hex: string, factor: number): string {
  const clean = hex.replace('#','');
  const r = parseInt(clean.substring(0,2),16);
  const g = parseInt(clean.substring(2,4),16);
  const b = parseInt(clean.substring(4,6),16);
  return '#' + [r,g,b].map(v=>Math.round(v*(1-factor)).toString(16).padStart(2,'0')).join('');
}

const PRESELL_TEMPLATE = `<!DOCTYPE html>
<html lang="{{TARGET_LANGUAGE}}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{PRODUCT_NAME}} — {{SITE_TITLE_SUFFIX}} {{PUBLISH_DATE_YEAR}}</title>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      "name": "{{PRODUCT_NAME}}",
      "description": "{{SEO_DESCRIPTION}}",
      "brand": { "@type": "Brand", "name": "{{MANUFACTURER}}" },
      "offers": {
        "@type": "Offer",
        "price": "{{PRICE_ENTRY}}",
        "priceCurrency": "{{CURRENCY}}",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "{{RATING}}",
        "reviewCount": "{{REVIEW_COUNT}}"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "{{FAQ_Q1}}", "acceptedAnswer": { "@type": "Answer", "text": "{{FAQ_A1}}" } },
        { "@type": "Question", "name": "{{FAQ_Q2}}", "acceptedAnswer": { "@type": "Answer", "text": "{{FAQ_A2}}" } },
        { "@type": "Question", "name": "{{FAQ_Q3}}", "acceptedAnswer": { "@type": "Answer", "text": "{{FAQ_A3}}" } }
      ]
    }
  ]
}
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',system-ui,sans-serif;color:#1F2937;background:#fff;-webkit-font-smoothing:antialiased;line-height:1.6;}
img{max-width:100%;height:auto;display:block;}
a{text-decoration:none;}
ul{list-style:none;}
:root{
  --primary:{{PRIMARY_COLOR}};
  --primary-light:{{PRIMARY_COLOR_LIGHT}};
  --primary-dark:{{PRIMARY_COLOR_DARK}};
  --text:#1F2937;
  --text-light:#6B7280;
  --bg:#fff;
  --bg-gray:#F9FAFB;
  --radius:12px;
  --shadow:0 4px 24px rgba(0,0,0,.10);
}
.container{max-width:1100px;margin:0 auto;padding:0 20px;}
.btn{display:inline-block;padding:16px 36px;background:var(--primary);color:#fff;font-family:'Poppins',sans-serif;font-weight:700;font-size:1.05rem;border-radius:50px;cursor:pointer;transition:background .2s,transform .1s;text-align:center;border:none;}
.btn:hover{background:var(--primary-dark);transform:translateY(-1px);}
.btn-lg{padding:20px 48px;font-size:1.15rem;}
.section-tag{display:inline-block;background:var(--primary-light);color:var(--primary-dark);font-weight:700;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;padding:6px 16px;border-radius:50px;margin-bottom:12px;}
.star{color:#F59E0B;}
.stars{color:#F59E0B;font-size:1.1rem;}

/* NAVBAR */
.navbar{position:sticky;top:0;z-index:100;background:#fff;box-shadow:0 1px 8px rgba(0,0,0,.08);padding:12px 0;}
.navbar .inner{display:flex;align-items:center;justify-content:space-between;gap:16px;}
.navbar .logo{font-family:'Poppins',sans-serif;font-weight:800;font-size:1.3rem;color:var(--primary);}
.navbar .logo img{height:40px;width:auto;}
.nav-links{display:flex;gap:24px;align-items:center;}
.nav-links a{color:var(--text);font-weight:500;font-size:.92rem;transition:color .2s;}
.nav-links a:hover{color:var(--primary);}
.nav-cta-btn{padding:9px 22px;font-size:.88rem;}
@media(max-width:640px){.nav-links{display:none;}.nav-cta-btn{padding:8px 16px;font-size:.8rem;}}

/* COUNTDOWN */
.countdown-bar{background:var(--primary-dark);color:#fff;text-align:center;padding:10px 16px;font-size:.9rem;font-weight:600;}
.countdown-bar span{font-weight:800;font-size:1.05rem;margin:0 4px;}
.countdown-timer{display:inline-flex;gap:8px;align-items:center;}
.countdown-unit{background:rgba(255,255,255,.2);border-radius:6px;padding:3px 8px;font-size:1rem;font-weight:800;min-width:36px;text-align:center;}

/* HERO */
.hero{background:linear-gradient(135deg,var(--primary-dark) 0%,var(--primary) 100%);padding:60px 0 40px;color:#fff;}
.hero .inner{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;}
.hero-tag{background:rgba(255,255,255,.18);color:#fff;font-weight:700;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;padding:6px 16px;border-radius:50px;display:inline-block;margin-bottom:16px;border:1px solid rgba(255,255,255,.3);}
.hero h1{font-family:'Poppins',sans-serif;font-size:2.6rem;font-weight:900;line-height:1.15;margin-bottom:18px;}
.hero-sub{font-size:1.1rem;opacity:.9;margin-bottom:28px;line-height:1.6;}
.hero-cta-wrap{display:flex;flex-direction:column;gap:14px;align-items:flex-start;}
.trust-badges{display:flex;flex-wrap:wrap;gap:10px;margin-top:10px;}
.trust-badge{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);border-radius:8px;padding:6px 12px;font-size:.78rem;font-weight:600;display:flex;align-items:center;gap:6px;}
.hero-img-wrap{text-align:center;}
.hero-img-wrap img{max-height:460px;width:auto;margin:0 auto;filter:drop-shadow(0 20px 40px rgba(0,0,0,.25));}
.social-proof{margin-top:16px;font-size:.85rem;opacity:.8;display:flex;align-items:center;gap:6px;}
@media(max-width:768px){.hero .inner{grid-template-columns:1fr;}.hero-img-wrap{order:-1;}.hero-img-wrap img{max-height:260px;}.hero h1{font-size:1.9rem;}}

/* PRICING */
.pricing{padding:72px 0;background:var(--bg-gray);}
.pricing h2{font-family:'Poppins',sans-serif;font-size:2rem;font-weight:800;text-align:center;color:var(--text);margin-bottom:8px;}
.pricing-sub{text-align:center;color:var(--text-light);margin-bottom:40px;font-size:1rem;}
.bundles-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;align-items:stretch;}
.bundle-card{background:#fff;border-radius:var(--radius);border:2px solid #E5E7EB;padding:28px 20px;text-align:center;position:relative;display:flex;flex-direction:column;gap:8px;transition:border-color .2s,box-shadow .2s;}
.bundle-card.featured{border-color:var(--primary);box-shadow:0 8px 32px rgba(0,0,0,.13);}
.bundle-ribbon{position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:var(--primary);color:#fff;font-size:.72rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:4px 16px;border-radius:50px;white-space:nowrap;}
.bundle-label{font-family:'Poppins',sans-serif;font-weight:700;font-size:1rem;color:var(--text);}
.bundle-bottles{font-size:2.2rem;font-weight:900;font-family:'Poppins',sans-serif;color:var(--primary);}
.bundle-supply{font-size:.82rem;color:var(--text-light);margin-top:-4px;}
.bundle-img{margin:12px auto;max-height:130px;width:auto;}
.bundle-price-per{font-size:2rem;font-weight:900;font-family:'Poppins',sans-serif;color:var(--primary-dark);}
.bundle-price-per small{font-size:.85rem;font-weight:500;color:var(--text-light);}
.bundle-original{font-size:.88rem;color:var(--text-light);text-decoration:line-through;}
.bundle-savings{background:#FEF3C7;color:#92400E;font-size:.8rem;font-weight:700;padding:4px 10px;border-radius:50px;display:inline-block;}
.bundle-shipping{font-size:.82rem;color:var(--text-light);}
.bundle-perks{display:flex;flex-direction:column;gap:4px;margin:8px 0;}
.bundle-perk{font-size:.82rem;color:var(--primary-dark);font-weight:600;}
.bundle-cta{margin-top:auto;width:100%;}
.urgency-bar{background:var(--primary-dark);color:#fff;text-align:center;padding:10px;font-size:.88rem;font-weight:700;border-radius:8px;margin-bottom:24px;}
.payment-icons{display:flex;justify-content:center;margin-top:24px;}
.payment-icons img{max-height:32px;}
.pricing-note{text-align:center;color:var(--text-light);font-size:.82rem;margin-top:14px;}
@media(max-width:768px){.bundles-grid{grid-template-columns:1fr;max-width:380px;margin:0 auto;}}

/* GUARANTEE */
.guarantee{padding:64px 0;background:#fff;}
.guarantee .inner{display:grid;grid-template-columns:auto 1fr;gap:36px;align-items:center;max-width:800px;margin:0 auto;}
.guarantee-badge img{width:160px;}
.guarantee h2{font-family:'Poppins',sans-serif;font-size:1.7rem;font-weight:800;margin-bottom:10px;}
.guarantee p{color:var(--text-light);font-size:.95rem;margin-bottom:18px;}
.trust-pills{display:flex;flex-wrap:wrap;gap:10px;}
.trust-pill{background:var(--bg-gray);border-radius:50px;padding:7px 16px;font-size:.82rem;font-weight:600;display:flex;align-items:center;gap:6px;}
@media(max-width:640px){.guarantee .inner{grid-template-columns:1fr;text-align:center;}.guarantee-badge{text-align:center;}.trust-pills{justify-content:center;}}

/* MECHANISM */
.mechanism{padding:72px 0;background:var(--bg-gray);}
.mechanism .inner{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center;}
.mechanism-content h2{font-family:'Poppins',sans-serif;font-size:1.9rem;font-weight:800;margin-bottom:10px;}
.mechanism-sub{color:var(--text-light);font-size:.95rem;margin-bottom:20px;}
.mechanism-paras{display:flex;flex-direction:column;gap:14px;}
.mechanism-paras p{font-size:.95rem;color:var(--text);line-height:1.7;}
.mechanism-quote{background:#fff;border-left:4px solid var(--primary);border-radius:0 var(--radius) var(--radius) 0;padding:16px 20px;margin-top:20px;font-style:italic;color:var(--text);font-size:.95rem;}
.mechanism-img img{border-radius:var(--radius);width:100%;}
@media(max-width:768px){.mechanism .inner{grid-template-columns:1fr;}.mechanism-img{order:-1;}}

/* OVERVIEW */
.overview{padding:72px 0;background:#fff;}
.overview .inner{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center;}
.overview h2{font-family:'Poppins',sans-serif;font-size:1.9rem;font-weight:800;margin-bottom:12px;}
.overview-desc{color:var(--text-light);margin-bottom:22px;font-size:.95rem;line-height:1.7;}
.overview-bullets{display:flex;flex-direction:column;gap:12px;}
.overview-bullet{display:flex;gap:10px;align-items:flex-start;}
.overview-bullet-icon{flex-shrink:0;width:22px;height:22px;background:var(--primary-light);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--primary-dark);font-weight:700;font-size:.75rem;}
.overview-bullet-text{font-size:.92rem;color:var(--text);line-height:1.5;}
.quality-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px;}
.quality-tag{background:var(--bg-gray);border:1px solid #E5E7EB;border-radius:8px;padding:6px 14px;font-size:.8rem;font-weight:600;color:var(--text-light);}
.overview-img img{border-radius:var(--radius);width:100%;}
@media(max-width:768px){.overview .inner{grid-template-columns:1fr;}}

/* INGREDIENTS */
.ingredients{padding:72px 0;background:var(--bg-gray);}
.ingredients h2{font-family:'Poppins',sans-serif;font-size:2rem;font-weight:800;text-align:center;margin-bottom:8px;}
.ingredients-sub{text-align:center;color:var(--text-light);margin-bottom:40px;}
.ingredients-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.ingredient-card{background:#fff;border-radius:var(--radius);padding:24px;text-align:center;box-shadow:var(--shadow);}
.ingredient-card.ingredient-hidden{display:none;}
.ingredient-img{width:80px;height:80px;object-fit:cover;border-radius:50%;margin:0 auto 12px;}
.ingredient-name{font-family:'Poppins',sans-serif;font-weight:700;font-size:1rem;margin-bottom:6px;}
.ingredient-benefit{font-size:.85rem;color:var(--text-light);line-height:1.5;}
@media(max-width:768px){.ingredients-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:480px){.ingredients-grid{grid-template-columns:1fr;}}

/* BONUSES */
.bonuses{padding:72px 0;background:#fff;}
.bonuses h2{font-family:'Poppins',sans-serif;font-size:2rem;font-weight:800;text-align:center;margin-bottom:8px;}
.bonuses-condition{text-align:center;color:var(--text-light);margin-bottom:36px;}
.bonuses-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;max-width:960px;margin:0 auto;}
.bonus-card{background:var(--bg-gray);border-radius:var(--radius);overflow:hidden;display:flex;flex-direction:column;}
.bonus-card.bonus-hidden{display:none;}
.bonus-img-wrap{position:relative;}
.bonus-img-wrap img{width:100%;aspect-ratio:4/3;object-fit:cover;}
.bonus-free-badge{position:absolute;top:10px;left:10px;background:var(--primary);color:#fff;font-size:.72rem;font-weight:800;padding:4px 10px;border-radius:50px;}
.bonus-body{padding:14px 16px;flex:1;display:flex;flex-direction:column;gap:4px;}
.bonus-title{font-weight:700;font-size:.95rem;}
.bonus-price{font-size:.82rem;color:var(--text-light);text-decoration:line-through;}
.bonus-desc{font-size:.82rem;color:var(--text-light);line-height:1.5;}

/* TESTIMONIALS */
.testimonials{padding:72px 0;background:var(--bg-gray);}
.testimonials h2{font-family:'Poppins',sans-serif;font-size:2rem;font-weight:800;text-align:center;margin-bottom:8px;}
.testimonials-sub{text-align:center;color:var(--text-light);margin-bottom:40px;}
.testis-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.testi-card{background:#fff;border-radius:var(--radius);padding:24px;box-shadow:var(--shadow);}
.testi-header{display:flex;gap:12px;align-items:center;margin-bottom:14px;}
.testi-photo{width:52px;height:52px;border-radius:50%;object-fit:cover;}
.testi-meta{flex:1;}
.testi-name{font-weight:700;font-size:.92rem;}
.testi-location{font-size:.78rem;color:var(--text-light);}
.testi-verified{font-size:.72rem;color:var(--primary);font-weight:600;margin-top:2px;}
.testi-title{font-weight:700;font-size:.95rem;margin-bottom:6px;}
.testi-body{font-size:.88rem;color:var(--text-light);line-height:1.6;}
@media(max-width:768px){.testis-grid{grid-template-columns:1fr;max-width:480px;margin:0 auto;}}

/* FAQ */
.faq{padding:72px 0;background:#fff;}
.faq h2{font-family:'Poppins',sans-serif;font-size:2rem;font-weight:800;text-align:center;margin-bottom:8px;}
.faq-sub{text-align:center;color:var(--text-light);margin-bottom:40px;}
.faq-list{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:12px;}
.faq-item{border:1px solid #E5E7EB;border-radius:var(--radius);overflow:hidden;}
.faq-question{width:100%;background:#fff;border:none;padding:18px 20px;text-align:left;font-size:.95rem;font-weight:600;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:12px;color:var(--text);}
.faq-question::after{content:'+';font-size:1.3rem;font-weight:300;color:var(--primary);flex-shrink:0;transition:transform .2s;}
.faq-item.open .faq-question::after{transform:rotate(45deg);}
.faq-answer{display:none;padding:0 20px 18px;font-size:.9rem;color:var(--text-light);line-height:1.7;}
.faq-item.open .faq-answer{display:block;}

/* FINAL CTA */
.final-cta{padding:80px 0;background:linear-gradient(135deg,var(--primary-dark) 0%,var(--primary) 100%);color:#fff;text-align:center;}
.final-cta h2{font-family:'Poppins',sans-serif;font-size:2.2rem;font-weight:900;margin-bottom:10px;}
.final-cta-sub{font-size:1.05rem;opacity:.9;margin-bottom:32px;}
.final-cta-card{background:rgba(255,255,255,.1);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.2);border-radius:20px;padding:32px 28px;max-width:480px;margin:0 auto 28px;}
.final-cta-img{max-height:180px;width:auto;margin:0 auto 20px;}
.final-cta-bundle{font-weight:700;font-size:.95rem;opacity:.85;margin-bottom:6px;}
.final-cta-price{font-size:2.6rem;font-weight:900;font-family:'Poppins',sans-serif;}
.final-cta-original{font-size:.9rem;opacity:.7;text-decoration:line-through;}
.final-cta-perday{font-size:.88rem;opacity:.8;margin-top:4px;}
.final-cta-trust{font-size:.82rem;opacity:.7;margin-top:8px;}
.final-cta-btn{font-size:1.2rem;padding:20px 52px;margin-bottom:12px;}
.final-cta-sub-btn{font-size:.82rem;opacity:.7;}

/* FOOTER */
.footer{background:#111827;color:#9CA3AF;padding:40px 0 24px;}
.footer-inner{max-width:900px;margin:0 auto;text-align:center;}
.footer-disclaimers{display:flex;flex-direction:column;gap:10px;margin-bottom:24px;}
.footer-disclaimer{font-size:.75rem;line-height:1.6;}
.footer-links{display:flex;justify-content:center;gap:20px;flex-wrap:wrap;margin-bottom:16px;}
.footer-links a{color:#9CA3AF;font-size:.82rem;transition:color .2s;}
.footer-links a:hover{color:#fff;}
.footer-copyright{font-size:.78rem;color:#6B7280;}

/* POPUP */
.popup-toast{position:fixed;bottom:24px;left:24px;z-index:9999;background:#fff;border-radius:14px;box-shadow:0 8px 32px rgba(0,0,0,.18);padding:14px 18px;display:flex;gap:12px;align-items:center;max-width:320px;animation:slideUp .4s ease;border-left:4px solid var(--primary);}
.popup-toast.hidden{display:none;}
.popup-toast-img{width:44px;height:44px;border-radius:8px;object-fit:cover;flex-shrink:0;}
.popup-toast-text{flex:1;}
.popup-toast-name{font-weight:700;font-size:.85rem;color:var(--text);}
.popup-toast-action{font-size:.78rem;color:var(--text-light);line-height:1.4;}
.popup-toast-close{background:none;border:none;cursor:pointer;color:#9CA3AF;font-size:1.2rem;line-height:1;padding:0 0 0 8px;flex-shrink:0;}
@keyframes slideUp{from{transform:translateY(60px);opacity:0;}to{transform:translateY(0);opacity:1;}}

/* UTILS */
.text-center{text-align:center;}
.mb-8{margin-bottom:8px;}
.mb-16{margin-bottom:16px;}
.mb-32{margin-bottom:32px;}
</style>
</head>
<body>

<!-- NAVBAR -->
<nav class="navbar">
  <div class="container inner">
    <a href="{{AFFILIATE_LINK}}" class="logo">{{PRODUCT_NAME}}</a>
    <div class="nav-links">
      <a href="#ingredients">{{NAV_LINK_1_LABEL}}</a>
      <a href="#pricing">{{NAV_LINK_2_LABEL}}</a>
      <a href="#faq">{{NAV_LINK_3_LABEL}}</a>
    </div>
    <a href="{{AFFILIATE_LINK}}" class="btn nav-cta-btn">{{NAV_CTA_TEXT}}</a>
  </div>
</nav>

<!-- COUNTDOWN BAR -->
<div class="countdown-bar" id="countdown-bar">
  {{COUNTDOWN_TEXT}} <span id="countdown-display" class="countdown-timer">
    <span class="countdown-unit" id="cd-min">10</span>:<span class="countdown-unit" id="cd-sec">00</span>
  </span>
</div>

<!-- HERO -->
<section class="hero">
  <div class="container inner">
    <div class="hero-content">
      <div class="hero-tag">{{HERO_TAG_LABEL}}</div>
      <h1>{{HERO_HEADLINE}}</h1>
      <p class="hero-sub">{{HERO_SUBHEADLINE}}</p>
      <div class="hero-cta-wrap">
        <a href="{{AFFILIATE_LINK}}" class="btn btn-lg">{{HERO_CTA_TEXT}}</a>
        <div class="social-proof">
          <span class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
          {{TRUST_BADGE_RATING}}
        </div>
      </div>
      <div class="trust-badges">
        <div class="trust-badge">&#10003; {{TRUST_BADGE_SECURE}}</div>
        <div class="trust-badge">&#10003; {{TRUST_BADGE_GUARANTEE}}</div>
        <div class="trust-badge">&#10003; {{TRUST_BADGE_SHIPPING}}</div>
      </div>
      <p class="social-proof" style="margin-top:16px;">{{SOCIAL_PROOF_LINE}}</p>
    </div>
    <div class="hero-img-wrap">
      <img src="{{HERO_PRODUCT_IMAGE}}" alt="{{PRODUCT_NAME}}" loading="eager">
    </div>
  </div>
</section>

<!-- PRICING -->
<section class="pricing" id="pricing">
  <div class="container">
    <div class="section-tag">Special Offer</div>
    <h2>{{PRICING_HEADLINE}}</h2>
    <p class="pricing-sub">{{PRICING_SUBHEADLINE}}</p>
    <div class="bundles-grid">

      <!-- BUNDLE 1 (entry / 1 bottle) -->
      <div class="bundle-card">
        <div class="bundle-label">{{BUNDLE_1_LABEL}}</div>
        <div class="bundle-bottles">{{BUNDLE_1_BOTTLES}}</div>
        <div class="bundle-supply">{{BUNDLE_1_SUPPLY}}</div>
        <img class="bundle-img" src="{{BUNDLE_1_IMAGE}}" alt="{{BUNDLE_1_LABEL}}">
        <div class="bundle-price-per" {{BUNDLE_1_PRICE_HIDDEN}}>{{BUNDLE_1_PRICE_PER}}<small> {{PER_BOTTLE_LABEL}}</small></div>
        <div class="bundle-original" {{BUNDLE_1_ORIGINAL_HIDDEN}}>{{REGULAR_PRICE_LABEL}} {{BUNDLE_1_ORIGINAL}}</div>
        <div class="bundle-savings">{{BUNDLE_1_SAVINGS}}</div>
        <div class="bundle-perks"></div>
        <div class="bundle-shipping">{{BUNDLE_1_SHIPPING}}</div>
        <a href="{{AFFILIATE_LINK}}" class="btn bundle-cta">{{BUNDLE_1_CTA}}</a>
      </div>

      <!-- BUNDLE 2 (best value / 6 bottles) -->
      <div class="bundle-card featured">
        <div class="bundle-ribbon">{{BUNDLE_2_RIBBON}}</div>
        <div class="bundle-label">{{BUNDLE_2_LABEL}}</div>
        <div class="bundle-bottles">{{BUNDLE_2_BOTTLES}}</div>
        <div class="bundle-supply">{{BUNDLE_2_SUPPLY}}</div>
        <img class="bundle-img" src="{{BUNDLE_2_IMAGE}}" alt="{{BUNDLE_2_LABEL}}">
        <div class="bundle-price-per" {{BUNDLE_2_PRICE_HIDDEN}}>{{BUNDLE_2_PRICE_PER}}<small> {{PER_BOTTLE_LABEL}}</small></div>
        <div class="bundle-original" {{BUNDLE_2_ORIGINAL_HIDDEN}}>{{REGULAR_PRICE_LABEL}} {{BUNDLE_2_ORIGINAL}}</div>
        <div class="bundle-savings">{{BUNDLE_2_SAVINGS}}</div>
        <div class="bundle-perks">
          <div class="bundle-perk" {{BUNDLE_BONUS_HIDDEN}}>{{BUNDLE_BONUS_TEXT}}</div>
          <div class="bundle-perk">{{BUNDLE_FREE_SHIPPING_TEXT}}</div>
        </div>
        <div class="bundle-shipping">{{BUNDLE_2_SHIPPING}}</div>
        <a href="{{AFFILIATE_LINK}}" class="btn bundle-cta">{{BUNDLE_2_CTA}}</a>
      </div>

      <!-- BUNDLE 3 (popular / 3 bottles) -->
      <div class="bundle-card">
        <div class="bundle-ribbon">{{BUNDLE_3_RIBBON}}</div>
        <div class="bundle-label">{{BUNDLE_3_LABEL}}</div>
        <div class="bundle-bottles">{{BUNDLE_3_BOTTLES}}</div>
        <div class="bundle-supply">{{BUNDLE_3_SUPPLY}}</div>
        <img class="bundle-img" src="{{BUNDLE_3_IMAGE}}" alt="{{BUNDLE_3_LABEL}}">
        <div class="bundle-price-per" {{BUNDLE_3_PRICE_HIDDEN}}>{{BUNDLE_3_PRICE_PER}}<small> {{PER_BOTTLE_LABEL}}</small></div>
        <div class="bundle-original" {{BUNDLE_3_ORIGINAL_HIDDEN}}>{{REGULAR_PRICE_LABEL}} {{BUNDLE_3_ORIGINAL}}</div>
        <div class="bundle-savings">{{BUNDLE_3_SAVINGS}}</div>
        <div class="bundle-perks">
          <div class="bundle-perk" {{BUNDLE_BONUS_HIDDEN}}>{{BUNDLE_BONUS_TEXT}}</div>
          <div class="bundle-perk">{{BUNDLE_FREE_SHIPPING_TEXT}}</div>
        </div>
        <div class="bundle-shipping">{{BUNDLE_3_SHIPPING}}</div>
        <a href="{{AFFILIATE_LINK}}" class="btn bundle-cta">{{BUNDLE_3_CTA}}</a>
      </div>

    </div>
    <div class="payment-icons"><img src="{{PAYMENT_ICONS_URL}}" alt="Payment methods"></div>
    <p class="pricing-note">{{PRICING_NOTE}}</p>
  </div>
</section>

<!-- GUARANTEE -->
<section class="guarantee">
  <div class="container">
    <div class="inner">
      <div class="guarantee-badge">
        <img src="{{GUARANTEE_BADGE_URL}}" alt="{{GUARANTEE_DAYS}}-Day Guarantee">
      </div>
      <div>
        <div class="section-tag">{{GUARANTEE_DAYS}}-Day Money Back</div>
        <h2>{{GUARANTEE_HEADLINE}}</h2>
        <p>{{GUARANTEE_TEXT}}</p>
        <div class="trust-pills">
          <div class="trust-pill">&#10003; {{TRUST_BADGE_SECURE}}</div>
          <div class="trust-pill">&#10003; {{TRUST_BADGE_GUARANTEE}}</div>
          <div class="trust-pill">&#10003; {{TRUST_BADGE_SHIPPING}}</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- MECHANISM -->
<section class="mechanism">
  <div class="container inner">
    <div class="mechanism-content">
      <div class="section-tag">{{MECHANISM_TAG}}</div>
      <h2>{{MECHANISM_HEADLINE}}</h2>
      <p class="mechanism-sub">{{MECHANISM_SUBHEADLINE}}</p>
      <div class="mechanism-paras">
        <p>{{MECHANISM_P1}}</p>
        <p>{{MECHANISM_P2}}</p>
        <p>{{MECHANISM_P3}}</p>
      </div>
      <blockquote class="mechanism-quote">{{MECHANISM_QUOTE}}</blockquote>
    </div>
    <div class="mechanism-img">
      <img src="{{MECHANISM_IMAGE}}" alt="{{MECHANISM_HEADLINE}}">
    </div>
  </div>
</section>

<!-- OVERVIEW -->
<section class="overview">
  <div class="container inner">
    <div>
      <h2>{{OVERVIEW_HEADLINE}}</h2>
      <p class="overview-desc">{{OVERVIEW_DESCRIPTION}}</p>
      <div class="overview-bullets" id="overview-bullets"></div>
      <div class="quality-tags" id="quality-tags"></div>
    </div>
    <div class="overview-img">
      <img src="{{OVERVIEW_IMAGE}}" alt="{{PRODUCT_NAME}}">
    </div>
  </div>
</section>

<!-- INGREDIENTS -->
<section class="ingredients" id="ingredients">
  <div class="container">
    <div class="section-tag">Formula</div>
    <h2>{{INGREDIENTS_HEADLINE}}</h2>
    <p class="ingredients-sub">{{INGREDIENTS_SUBHEADLINE}}</p>
    <div class="ingredients-grid">
      <div class="ingredient-card {{ING_1_HIDDEN}}">
        <img class="ingredient-img" src="{{ING_1_IMAGE}}" alt="{{ING_1_NAME}}">
        <div class="ingredient-name">{{ING_1_NAME}}</div>
        <div class="ingredient-benefit">{{ING_1_BENEFIT}}</div>
      </div>
      <div class="ingredient-card {{ING_2_HIDDEN}}">
        <img class="ingredient-img" src="{{ING_2_IMAGE}}" alt="{{ING_2_NAME}}">
        <div class="ingredient-name">{{ING_2_NAME}}</div>
        <div class="ingredient-benefit">{{ING_2_BENEFIT}}</div>
      </div>
      <div class="ingredient-card {{ING_3_HIDDEN}}">
        <img class="ingredient-img" src="{{ING_3_IMAGE}}" alt="{{ING_3_NAME}}">
        <div class="ingredient-name">{{ING_3_NAME}}</div>
        <div class="ingredient-benefit">{{ING_3_BENEFIT}}</div>
      </div>
      <div class="ingredient-card {{ING_4_HIDDEN}}">
        <img class="ingredient-img" src="{{ING_4_IMAGE}}" alt="{{ING_4_NAME}}">
        <div class="ingredient-name">{{ING_4_NAME}}</div>
        <div class="ingredient-benefit">{{ING_4_BENEFIT}}</div>
      </div>
      <div class="ingredient-card {{ING_5_HIDDEN}}">
        <img class="ingredient-img" src="{{ING_5_IMAGE}}" alt="{{ING_5_NAME}}">
        <div class="ingredient-name">{{ING_5_NAME}}</div>
        <div class="ingredient-benefit">{{ING_5_BENEFIT}}</div>
      </div>
      <div class="ingredient-card {{ING_6_HIDDEN}}">
        <img class="ingredient-img" src="{{ING_6_IMAGE}}" alt="{{ING_6_NAME}}">
        <div class="ingredient-name">{{ING_6_NAME}}</div>
        <div class="ingredient-benefit">{{ING_6_BENEFIT}}</div>
      </div>
      <div class="ingredient-card {{ING_7_HIDDEN}}">
        <img class="ingredient-img" src="{{ING_7_IMAGE}}" alt="{{ING_7_NAME}}">
        <div class="ingredient-name">{{ING_7_NAME}}</div>
        <div class="ingredient-benefit">{{ING_7_BENEFIT}}</div>
      </div>
      <div class="ingredient-card {{ING_8_HIDDEN}}">
        <img class="ingredient-img" src="{{ING_8_IMAGE}}" alt="{{ING_8_NAME}}">
        <div class="ingredient-name">{{ING_8_NAME}}</div>
        <div class="ingredient-benefit">{{ING_8_BENEFIT}}</div>
      </div>
      <div class="ingredient-card {{ING_9_HIDDEN}}">
        <img class="ingredient-img" src="{{ING_9_IMAGE}}" alt="{{ING_9_NAME}}">
        <div class="ingredient-name">{{ING_9_NAME}}</div>
        <div class="ingredient-benefit">{{ING_9_BENEFIT}}</div>
      </div>
    </div>
  </div>
</section>

<!-- BONUSES -->
<section class="bonuses">
  <div class="container">
    <div class="section-tag">Exclusive Bonuses</div>
    <h2>{{BONUSES_HEADLINE}}</h2>
    <p class="bonuses-condition">{{BONUSER_CONDITION}}</p>
    <div class="bonuses-grid">
      <div class="bonus-card {{BONUS_1_HIDDEN}}">
        <div class="bonus-img-wrap">
          <img src="{{BONUS_1_IMAGE}}" alt="{{BONUS_1_TITLE}}">
          <span class="bonus-free-badge">{{BONUS_FREE_LABEL}}</span>
        </div>
        <div class="bonus-body">
          <div class="bonus-title">{{BONUS_1_TITLE}}</div>
          <div class="bonus-price">{{BONUS_1_PRICE}}</div>
          <div class="bonus-desc">{{BONUS_1_DESC}}</div>
        </div>
      </div>
      <div class="bonus-card {{BONUS_2_HIDDEN}}">
        <div class="bonus-img-wrap">
          <img src="{{BONUS_2_IMAGE}}" alt="{{BONUS_2_TITLE}}">
          <span class="bonus-free-badge">{{BONUS_FREE_LABEL}}</span>
        </div>
        <div class="bonus-body">
          <div class="bonus-title">{{BONUS_2_TITLE}}</div>
          <div class="bonus-price">{{BONUS_2_PRICE}}</div>
          <div class="bonus-desc">{{BONUS_2_DESC}}</div>
        </div>
      </div>
      <div class="bonus-card {{BONUS_3_HIDDEN}}">
        <div class="bonus-img-wrap">
          <img src="{{BONUS_3_IMAGE}}" alt="{{BONUS_3_TITLE}}">
          <span class="bonus-free-badge">{{BONUS_FREE_LABEL}}</span>
        </div>
        <div class="bonus-body">
          <div class="bonus-title">{{BONUS_3_TITLE}}</div>
          <div class="bonus-price">{{BONUS_3_PRICE}}</div>
          <div class="bonus-desc">{{BONUS_3_DESC}}</div>
        </div>
      </div>
      <div class="bonus-card {{BONUS_4_HIDDEN}}">
        <div class="bonus-img-wrap">
          <img src="{{BONUS_4_IMAGE}}" alt="{{BONUS_4_TITLE}}">
          <span class="bonus-free-badge">{{BONUS_FREE_LABEL}}</span>
        </div>
        <div class="bonus-body">
          <div class="bonus-title">{{BONUS_4_TITLE}}</div>
          <div class="bonus-price">{{BONUS_4_PRICE}}</div>
          <div class="bonus-desc">{{BONUS_4_DESC}}</div>
        </div>
      </div>
      <div class="bonus-card {{BONUS_5_HIDDEN}}">
        <div class="bonus-img-wrap">
          <img src="{{BONUS_5_IMAGE}}" alt="{{BONUS_5_TITLE}}">
          <span class="bonus-free-badge">{{BONUS_FREE_LABEL}}</span>
        </div>
        <div class="bonus-body">
          <div class="bonus-title">{{BONUS_5_TITLE}}</div>
          <div class="bonus-price">{{BONUS_5_PRICE}}</div>
          <div class="bonus-desc">{{BONUS_5_DESC}}</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- TESTIMONIALS -->
<section class="testimonials">
  <div class="container">
    <div class="section-tag">Success Stories</div>
    <h2>{{TESTI_HEADLINE}}</h2>
    <p class="testimonials-sub">{{TEST_SUBHEADLINE}}</p>
    <div class="testis-grid">
      <div class="testi-card">
        <div class="testi-header">
          <img class="testi-photo" src="{{TESTI_1_PHOTO}}" alt="{{TESTI_1_NAME}}">
          <div class="testi-meta">
            <div class="testi-name">{{TESTI_1_NAME}}</div>
            <div class="testi-location">{{TESTI_1_LOCATION}}</div>
            <div class="testi-verified">&#10003; {{VERIFIED_PURCHASE_LABEL}}</div>
          </div>
        </div>
        <div class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <div class="testi-title">{{TESTI_1_TITLE}}</div>
        <div class="testi-body">{{TESTI_1_BODY}}</div>
      </div>
      <div class="testi-card">
        <div class="testi-header">
          <img class="testi-photo" src="{{TESTI_2_PHOTO}}" alt="{{TESTI_2_NAME}}">
          <div class="testi-meta">
            <div class="testi-name">{{TESTI_2_NAME}}</div>
            <div class="testi-location">{{TESTI_2_LOCATION}}</div>
            <div class="testi-verified">&#10003; {{VERIFIED_PURCHASE_LABEL}}</div>
          </div>
        </div>
        <div class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <div class="testi-title">{{TESTI_2_TITLE}}</div>
        <div class="testi-body">{{TESTI_2_BODY}}</div>
      </div>
      <div class="testi-card">
        <div class="testi-header">
          <img class="testi-photo" src="{{TESTI_3_PHOTO}}" alt="{{TESTI_3_NAME}}">
          <div class="testi-meta">
            <div class="testi-name">{{TESTI_3_NAME}}</div>
            <div class="testi-location">{{TESTI_3_LOCATION}}</div>
            <div class="testi-verified">&#10003; {{VERIFIED_PURCHASE_LABEL}}</div>
          </div>
        </div>
        <div class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <div class="testi-title">{{TESTI_3_TITLE}}</div>
        <div class="testi-body">{{TESTI_3_BODY}}</div>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="faq" id="faq">
  <div class="container">
    <div class="section-tag">Questions</div>
    <h2>{{FAQ_HEADLINE}}</h2>
    <p class="faq-sub">{{FAQ_SUBHEADLINE}}</p>
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-question">{{FAQ_Q1}}</button>
        <div class="faq-answer">{{FAQ_A1}}</div>
      </div>
      <div class="faq-item">
        <button class="faq-question">{{FAQ_Q2}}</button>
        <div class="faq-answer">{{FAQ_A2}}</div>
      </div>
      <div class="faq-item">
        <button class="faq-question">{{FAQ_Q3}}</button>
        <div class="faq-answer">{{FAQ_A3}}</div>
      </div>
      <div class="faq-item">
        <button class="faq-question">{{FAQ_Q4}}</button>
        <div class="faq-answer">{{FAQ_A4}}</div>
      </div>
      <div class="faq-item">
        <button class="faq-question">{{FAQ_Q5}}</button>
        <div class="faq-answer">{{FAQ_A5}}</div>
      </div>
      <div class="faq-item">
        <button class="faq-question">{{FAQ_Q6}}</button>
        <div class="faq-answer">{{FAQ_A6}}</div>
      </div>
    </div>
  </div>
</section>

<!-- FINAL CTA -->
<section class="final-cta">
  <div class="container">
    <h2>{{FINAL_CTA_HEADLINE}}</h2>
    <p class="final-cta-sub">{{FINAL_CTA_SUBHEADLINE}}</p>
    <div class="final-cta-card">
      <img class="final-cta-img" src="{{FINAL_CTA_IMAGE}}" alt="{{PRODUCT_NAME}}">
      <div class="final-cta-bundle">{{FINAL_CTA_BUNDLE_LABEL}}</div>
      <div class="final-cta-price">{{FINAL_CTA_PRICE}}<small style="font-size:1rem;"> {{PER_BOTTLE_LABEL}}</small></div>
      <div class="final-cta-original">{{FINAL_CTA_ORIGINAL}}</div>
      <div class="final-cta-perday">{{ONLY_LABEL}} {{FINAL_CTA_PER_DAY}} {{PER_DAY_LABEL}}</div>
      <div class="final-cta-trust">{{FINAL_CTA_TRUST_LINE}}</div>
    </div>
    <a href="{{AFFILIATE_LINK}}" class="btn btn-lg final-cta-btn">{{FINAL_CTA_BUTTON}}</a>
    <div class="final-cta-sub-btn">{{TRUST_BADGE_GUARANTEE}}</div>
  </div>
</section>

<!-- FOOTER -->
<footer class="footer">
  <div class="container footer-inner">
    <div class="footer-disclaimers">
      <p class="footer-disclaimer">{{FOOTER_DISCLAIMER_ADV}}</p>
      <p class="footer-disclaimer">{{FOOTER_DISCLAIMER_RES}}</p>
      <p class="footer-disclaimer">{{FOOTER_DISCLAIMER_MED}}</p>
    </div>
    <div class="footer-links">
      <a href="{{PRIVACY_URL}}">{{PRIVACY_LABEL}}</a>
      <a href="{{TERMS_URL}}">{{TERMS_LABEL}}</a>
    </div>
    <div class="footer-copyright">{{COPYRIGHT_TEXT}}</div>
  </div>
</footer>

<!-- POPUP TOAST -->
<div class="popup-toast hidden" id="popup-toast">
  <img class="popup-toast-img" src="{{POPUP_IMAGE}}" alt="{{PRODUCT_NAME}}" id="popup-img">
  <div class="popup-toast-text">
    <div class="popup-toast-name" id="popup-name">{{POPUP_NAME_1}}</div>
    <div class="popup-toast-action" id="popup-action">{{POPUP_ACTION_TEXT}} {{PRODUCT_NAME}}</div>
  </div>
  <button class="popup-toast-close" onclick="document.getElementById('popup-toast').classList.add('hidden')">&#215;</button>
</div>

<script>
(function(){
  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(function(btn){
    btn.addEventListener('click',function(){
      var item=this.closest('.faq-item');
      var wasOpen=item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(i){i.classList.remove('open');});
      if(!wasOpen)item.classList.add('open');
    });
  });

  // Countdown timer
  var mins=10,secs=0;
  var cdMin=document.getElementById('cd-min');
  var cdSec=document.getElementById('cd-sec');
  function tick(){
    if(secs===0){if(mins===0){return;}mins--;secs=59;}else{secs--;}
    if(cdMin)cdMin.textContent=String(mins).padStart(2,'0');
    if(cdSec)cdSec.textContent=String(secs).padStart(2,'0');
    setTimeout(tick,1000);
  }
  setTimeout(tick,1000);

  // Popup toast
  var names=[];var cities=[];
  try{names=JSON.parse('{{POPUP_NAMES_JSON}}')||[];}catch(e){}
  try{cities=JSON.parse('{{POPUP_CITIES_JSON}}')||[];}catch(e){}
  var toast=document.getElementById('popup-toast');
  var popupName=document.getElementById('popup-name');
  var popupAction=document.getElementById('popup-action');
  var productName='{{PRODUCT_NAME}}';
  var actionText='{{POPUP_ACTION_TEXT}}';
  var idx=0;
  function showPopup(){
    if(!toast||!names.length)return;
    var n=names[idx%names.length];
    var c=cities[idx%cities.length]||'';
    if(popupName)popupName.textContent=n+(c?' — '+c:'');
    if(popupAction)popupAction.textContent=actionText+' '+productName;
    toast.classList.remove('hidden');
    idx++;
    setTimeout(function(){toast.classList.add('hidden');},5000);
  }
  setTimeout(function(){showPopup();setInterval(showPopup,45000);},8000);
})();
</script>
</body>
</html>`;

export function generatePresellHTML(
  result: GeneratePresellContentOutput,
  targetUrl: string,
  images: string[],
  country: string = 'Brasil'
): string {
  console.log('[robusta] result:', JSON.stringify(result).slice(0, 500));
  console.log('[robusta-white] called, result keys:', Object.keys(result || {}));
  console.log('[robusta-white] meta:', JSON.stringify((result as any)?.meta || {}).slice(0, 200));
  const getImg = (index: number): string => images[index] ?? '';
  const aggressive = isAggressive(country);
  void aggressive;

  const r = result as any;
  const meta = r.meta || {};
  const hero = r.hero || {};
  const pricing = r.pricing || {};
  const bundles = pricing.bundles || [];
  const b1 = bundles[0] || {};
  const b2 = bundles[1] || {};
  const b3 = bundles[2] || {};
  const guarantee = r.guarantee || {};
  const mechanism = r.mechanism || {};
  const overview = r.product_overview || {};
  const ingredients = r.ingredients || {};
  const bonuses = r.bonuses || {};
  const testimonials = r.testimonials || {};
  const faq = r.faq || {};
  const finalCta = r.final_cta || {};
  const footer = r.footer || {};
  const popup = r.popup || {};
  const labels = r.labels || {};
  const schemaSeo = r.schema_seo || {};
  const primaryColor = (meta.primary_color && /^#[0-9a-fA-F]{6}$/.test(meta.primary_color))
    ? meta.primary_color
    : '#541213';

  const popupNames = (popup.names || ['Michael','James','Sarah','Robert','Anna'])
    .filter((n: string) => n && n.trim())
    .map((n: string) => `"${n}"`)
    .join(',');
  const popupCities = (popup.cities || ['New York, NY','Los Angeles, CA','London, UK','Toronto, CA','Sydney, AU'])
    .filter((c: string) => c && c.trim())
    .map((c: string) => `"${c}"`)
    .join(',');

  const replacements: Record<string, string> = {
    // Meta
    TARGET_LANGUAGE: meta.target_language ?? 'pt-BR',
    PRODUCT_NAME: meta.product_name ?? '',
    SITE_TITLE_SUFFIX: labels.site_title_suffix ?? 'Official Review',
    SEO_DESCRIPTION: schemaSeo.product_description ?? '',
    MANUFACTURER: schemaSeo.manufacturer ?? '',
    PUBLISH_DATE_YEAR: new Date().getFullYear().toString(),
    RATING: meta.rating ?? '4.9',
    REVIEW_COUNT: meta.review_count ?? '10,847',
    CURRENCY: schemaSeo.currency ?? 'USD',
    PRIMARY_COLOR: primaryColor,
    PRIMARY_COLOR_LIGHT: lightenColor(primaryColor, 0.85),
    PRIMARY_COLOR_DARK: darkenColor(primaryColor, 0.2),

    // Nav
    NAV_LINK_1_LABEL: hero.nav_link_1 ?? 'Ingredients',
    NAV_LINK_2_LABEL: hero.nav_link_2 ?? 'Offer',
    NAV_LINK_3_LABEL: hero.nav_link_3 ?? 'FAQ',
    NAV_CTA_TEXT: hero.nav_cta ?? 'Order Now',

    // Hero
    HERO_TAG_LABEL: labels.hero_tag_label ?? 'Natural Formula #1',
    HERO_HEADLINE: hero.headline ?? '',
    HERO_SUBHEADLINE: hero.subheadline ?? '',
    HERO_CTA_TEXT: hero.cta_text ?? '',
    HERO_PRODUCT_IMAGE: getImg(0),
    SOCIAL_PROOF_LINE: hero.social_proof_line ?? '',
    TRUST_BADGE_SECURE: guarantee.trust_pills?.[0] ?? 'Secure Checkout',
    TRUST_BADGE_GUARANTEE: (guarantee.days ?? '60') + (country === 'Brasil' ? ' Dias de Garantia' : '-Day Money Back Guarantee'),
    TRUST_BADGE_SHIPPING: b2.free_shipping ? (labels.bundle_free_shipping ?? 'Free Shipping') : 'Fast Delivery',
    TRUST_BADGE_RATING: (meta.rating ?? '4.9') + ' (' + (meta.review_count ?? '10,847') + ')',

    // Countdown
    COUNTDOWN_TEXT: hero.countdown_text ?? (country === 'Brasil' ? 'Atenção! Você tem apenas' : 'Hurry! Only'),

    // Pricing
    PRICING_HEADLINE: pricing.section_headline ?? '',
    PRICING_SUBHEADLINE: pricing.section_subheadline ?? '',
    PRICING_NOTE: pricing.note_below_cards ?? '',
    PER_BOTTLE_LABEL: labels.per_bottle ?? '/ bottle',
    PER_DAY_LABEL: labels.per_day ?? '/ day',
    REGULAR_PRICE_LABEL: labels.regular_price ?? 'Regular:',
    ONLY_LABEL: labels.only ?? 'Only',
    PAYMENT_ICONS_URL: getImg(17) || pricing.payment_icons_url || '',
    BUNDLE_BONUS_TEXT: labels.bundle_bonus_text ?? '✓ Bonuses Included',
    BUNDLE_BONUS_HIDDEN: (bonuses.items?.length > 0) ? '' : 'style="display:none"',
    BUNDLE_FREE_SHIPPING_TEXT: labels.bundle_free_shipping ?? '✓ Free Shipping',

    // Bundle 1
    BUNDLE_1_LABEL: b1.label ?? 'Starter',
    BUNDLE_1_BOTTLES: b1.bottles ?? '1',
    BUNDLE_1_SUPPLY: b1.supply_days ?? '30 Day Supply',
    BUNDLE_1_IMAGE: getImg(1),
    BUNDLE_1_PRICE_PER: b1.price_per_bottle ?? '',
    BUNDLE_1_PRICE_HIDDEN: b1.price_per_bottle ? '' : 'style="display:none"',
    BUNDLE_1_SAVINGS: b1.savings ? ('Save ' + b1.savings) : '',
    BUNDLE_1_SHIPPING: b1.shipping ?? '+ Shipping',
    BUNDLE_1_ORIGINAL: b1.price_total_original ?? '',
    BUNDLE_1_ORIGINAL_HIDDEN: b1.price_total_original ? '' : 'style="display:none"',
    BUNDLE_1_CTA: b1.cta_text ?? 'Buy Now',

    // Bundle 2
    BUNDLE_2_LABEL: b2.label ?? 'Best Value',
    BUNDLE_2_BOTTLES: b2.bottles ?? '6',
    BUNDLE_2_SUPPLY: b2.supply_days ?? '180 Day Supply',
    BUNDLE_2_IMAGE: getImg(4),
    BUNDLE_2_RIBBON: b2.ribbon ?? 'BEST VALUE',
    BUNDLE_2_PRICE_PER: b2.price_per_bottle ?? '',
    BUNDLE_2_PRICE_HIDDEN: b2.price_per_bottle ? '' : 'style="display:none"',
    BUNDLE_2_SAVINGS: b2.savings ? ('Save ' + b2.savings) : '',
    BUNDLE_2_SHIPPING: b2.free_shipping ? '' : (b2.shipping ?? ''),
    BUNDLE_2_ORIGINAL: b2.price_total_original ?? '',
    BUNDLE_2_ORIGINAL_HIDDEN: b2.price_total_original ? '' : 'style="display:none"',
    BUNDLE_2_CTA: b2.cta_text ?? 'Claim Discount',

    // Bundle 3
    BUNDLE_3_LABEL: b3.label ?? 'Popular',
    BUNDLE_3_BOTTLES: b3.bottles ?? '3',
    BUNDLE_3_SUPPLY: b3.supply_days ?? '90 Day Supply',
    BUNDLE_3_IMAGE: getImg(3),
    BUNDLE_3_RIBBON: b3.ribbon ?? 'MOST POPULAR',
    BUNDLE_3_PRICE_PER: b3.price_per_bottle ?? '',
    BUNDLE_3_PRICE_HIDDEN: b3.price_per_bottle ? '' : 'style="display:none"',
    BUNDLE_3_SAVINGS: b3.savings ? ('Save ' + b3.savings) : '',
    BUNDLE_3_SHIPPING: b3.free_shipping ? '' : (b3.shipping ?? ''),
    BUNDLE_3_ORIGINAL: b3.price_total_original ?? '',
    BUNDLE_3_ORIGINAL_HIDDEN: b3.price_total_original ? '' : 'style="display:none"',
    BUNDLE_3_CTA: b3.cta_text ?? 'Buy Now',

    // Guarantee
    GUARANTEE_BADGE_URL: getImg(16) || guarantee.badge_url || '',
    GUARANTEE_DAYS: guarantee.days ?? '60',
    GUARANTEE_HEADLINE: guarantee.headline ?? '',
    GUARANTEE_TEXT: guarantee.text ?? '',

    // Mechanism
    MECHANISM_TAG: mechanism.tag ?? '',
    MECHANISM_HEADLINE: mechanism.headline ?? '',
    MECHANISM_SUBHEADLINE: mechanism.subheadline ?? '',
    MECHANISM_P1: mechanism.body_paragraphs?.[0] ?? '',
    MECHANISM_P2: mechanism.body_paragraphs?.[1] ?? '',
    MECHANISM_P3: mechanism.body_paragraphs?.[2] ?? '',
    MECHANISM_QUOTE: mechanism.highlight_quote ?? '',
    MECHANISM_IMAGE: getImg(4),

    // Overview
    OVERVIEW_HEADLINE: overview.headline ?? '',
    OVERVIEW_DESCRIPTION: overview.description ?? '',
    OVERVIEW_IMAGE: getImg(0),

    // Ingredients
    INGREDIENTS_HEADLINE: ingredients.headline ?? '',
    INGREDIENTS_SUBHEADLINE: ingredients.subheadline ?? '',
    ING_1_NAME: ingredients.items?.[0]?.name ?? '',
    ING_1_IMAGE: getImg(5),
    ING_1_BENEFIT: ingredients.items?.[0]?.benefit ?? '',
    ING_1_HIDDEN: ingredients.items?.[0]?.name ? '' : 'ingredient-hidden',
    ING_2_NAME: ingredients.items?.[1]?.name ?? '',
    ING_2_IMAGE: getImg(6),
    ING_2_BENEFIT: ingredients.items?.[1]?.benefit ?? '',
    ING_2_HIDDEN: ingredients.items?.[1]?.name ? '' : 'ingredient-hidden',
    ING_3_NAME: ingredients.items?.[2]?.name ?? '',
    ING_3_IMAGE: getImg(7),
    ING_3_BENEFIT: ingredients.items?.[2]?.benefit ?? '',
    ING_3_HIDDEN: ingredients.items?.[2]?.name ? '' : 'ingredient-hidden',
    ING_4_NAME: ingredients.items?.[3]?.name ?? '',
    ING_4_IMAGE: getImg(8),
    ING_4_BENEFIT: ingredients.items?.[3]?.benefit ?? '',
    ING_4_HIDDEN: ingredients.items?.[3]?.name ? '' : 'ingredient-hidden',
    ING_5_NAME: ingredients.items?.[4]?.name ?? '',
    ING_5_IMAGE: getImg(9),
    ING_5_BENEFIT: ingredients.items?.[4]?.benefit ?? '',
    ING_5_HIDDEN: ingredients.items?.[4]?.name ? '' : 'ingredient-hidden',
    ING_6_NAME: ingredients.items?.[5]?.name ?? '',
    ING_6_IMAGE: getImg(10),
    ING_6_BENEFIT: ingredients.items?.[5]?.benefit ?? '',
    ING_6_HIDDEN: ingredients.items?.[5]?.name ? '' : 'ingredient-hidden',
    ING_7_NAME: ingredients.items?.[6]?.name ?? '',
    ING_7_IMAGE: getImg(22),
    ING_7_BENEFIT: ingredients.items?.[6]?.benefit ?? '',
    ING_7_HIDDEN: ingredients.items?.[6]?.name ? '' : 'ingredient-hidden',
    ING_8_NAME: ingredients.items?.[7]?.name ?? '',
    ING_8_IMAGE: getImg(23),
    ING_8_BENEFIT: ingredients.items?.[7]?.benefit ?? '',
    ING_8_HIDDEN: ingredients.items?.[7]?.name ? '' : 'ingredient-hidden',
    ING_9_NAME: ingredients.items?.[8]?.name ?? '',
    ING_9_IMAGE: getImg(24),
    ING_9_BENEFIT: ingredients.items?.[8]?.benefit ?? '',
    ING_9_HIDDEN: ingredients.items?.[8]?.name ? '' : 'ingredient-hidden',

    // Bonuses
    BONUSES_HEADLINE: bonuses.headline ?? '',
    BONUSER_CONDITION: bonuses.condition_text ?? '',
    BONUS_FREE_LABEL: labels.bonus_free_label ?? 'FREE',
    BONUS_1_IMAGE: getImg(11),
    BONUS_1_TITLE: bonuses.items?.[0]?.title ?? '',
    BONUS_1_PRICE: bonuses.items?.[0]?.original_price ?? '',
    BONUS_1_DESC: bonuses.items?.[0]?.description ?? '',
    BONUS_1_HIDDEN: bonuses.items?.[0]?.title ? '' : 'bonus-hidden',
    BONUS_2_IMAGE: getImg(12),
    BONUS_2_TITLE: bonuses.items?.[1]?.title ?? '',
    BONUS_2_PRICE: bonuses.items?.[1]?.original_price ?? '',
    BONUS_2_DESC: bonuses.items?.[1]?.description ?? '',
    BONUS_2_HIDDEN: bonuses.items?.[1]?.title ? '' : 'bonus-hidden',
    BONUS_3_IMAGE: getImg(18),
    BONUS_3_TITLE: bonuses.items?.[2]?.title ?? '',
    BONUS_3_PRICE: bonuses.items?.[2]?.original_price ?? '',
    BONUS_3_DESC: bonuses.items?.[2]?.description ?? '',
    BONUS_3_HIDDEN: bonuses.items?.[2]?.title ? '' : 'bonus-hidden',
    BONUS_4_IMAGE: getImg(19),
    BONUS_4_TITLE: bonuses.items?.[3]?.title ?? '',
    BONUS_4_PRICE: bonuses.items?.[3]?.original_price ?? '',
    BONUS_4_DESC: bonuses.items?.[3]?.description ?? '',
    BONUS_4_HIDDEN: bonuses.items?.[3]?.title ? '' : 'bonus-hidden',
    BONUS_5_IMAGE: getImg(20),
    BONUS_5_TITLE: bonuses.items?.[4]?.title ?? '',
    BONUS_5_PRICE: bonuses.items?.[4]?.original_price ?? '',
    BONUS_5_DESC: bonuses.items?.[4]?.description ?? '',
    BONUS_5_HIDDEN: bonuses.items?.[4]?.title ? '' : 'bonus-hidden',

    // Testimonials
    TESTI_HEADLINE: testimonials.headline ?? '',
    TEST_SUBHEADLINE: testimonials.subheadline ?? '',
    VERIFIED_PURCHASE_LABEL: labels.verified_purchase ?? 'Verified Purchase',
    TESTI_1_PHOTO: getImg(13),
    TESTI_1_NAME: testimonials.items?.[0]?.name ?? '',
    TESTI_1_LOCATION: testimonials.items?.[0]?.location ?? '',
    TESTI_1_TITLE: testimonials.items?.[0]?.quote_title ?? '',
    TESTI_1_BODY: testimonials.items?.[0]?.quote_body ?? '',
    TESTI_2_PHOTO: getImg(14),
    TESTI_2_NAME: testimonials.items?.[1]?.name ?? '',
    TESTI_2_LOCATION: testimonials.items?.[1]?.location ?? '',
    TESTI_2_TITLE: testimonials.items?.[1]?.quote_title ?? '',
    TESTI_2_BODY: testimonials.items?.[1]?.quote_body ?? '',
    TESTI_3_PHOTO: getImg(15),
    TESTI_3_NAME: testimonials.items?.[2]?.name ?? '',
    TESTI_3_LOCATION: testimonials.items?.[2]?.location ?? '',
    TESTI_3_TITLE: testimonials.items?.[2]?.quote_title ?? '',
    TESTI_3_BODY: testimonials.items?.[2]?.quote_body ?? '',

    // FAQ
    FAQ_HEADLINE: faq.headline ?? '',
    FAQ_SUBHEADLINE: faq.subheadline ?? '',
    FAQ_Q1: faq.items?.[0]?.question ?? '',
    FAQ_A1: faq.items?.[0]?.answer ?? '',
    FAQ_Q2: faq.items?.[1]?.question ?? '',
    FAQ_A2: faq.items?.[1]?.answer ?? '',
    FAQ_Q3: faq.items?.[2]?.question ?? '',
    FAQ_A3: faq.items?.[2]?.answer ?? '',
    FAQ_Q4: faq.items?.[3]?.question ?? '',
    FAQ_A4: faq.items?.[3]?.answer ?? '',
    FAQ_Q5: faq.items?.[4]?.question ?? '',
    FAQ_A5: faq.items?.[4]?.answer ?? '',
    FAQ_Q6: faq.items?.[5]?.question ?? '',
    FAQ_A6: faq.items?.[5]?.answer ?? '',

    // Final CTA
    FINAL_CTA_HEADLINE: finalCta.headline ?? '',
    FINAL_CTA_SUBHEADLINE: finalCta.subheadline ?? '',
    FINAL_CTA_IMAGE: getImg(2) || getImg(0),
    FINAL_CTA_BUNDLE_LABEL: finalCta.bundle_label ?? '',
    FINAL_CTA_PRICE: finalCta.price_per_bottle ?? '',
    FINAL_CTA_ORIGINAL: finalCta.price_original ?? '',
    FINAL_CTA_PER_DAY: finalCta.price_per_day ?? '',
    FINAL_CTA_TRUST_LINE: finalCta.trust_line ?? '',
    FINAL_CTA_BUTTON: finalCta.cta_text ?? '',
    PRICE_ENTRY: b1.price_per_bottle ?? '',

    // Footer
    FOOTER_DISCLAIMER_ADV: footer.disclaimer_advertising ?? '',
    FOOTER_DISCLAIMER_RES: footer.disclaimer_results ?? '',
    FOOTER_DISCLAIMER_MED: footer.disclaimer_medical ?? '',
    PRIVACY_URL: footer.privacy_url ?? targetUrl,
    PRIVACY_LABEL: labels.privacy_label ?? 'Privacy Policy',
    TERMS_URL: footer.terms_url ?? targetUrl,
    TERMS_LABEL: labels.terms_label ?? 'Terms',
    COPYRIGHT_TEXT: footer.copyright_text ?? ('© ' + new Date().getFullYear() + ' ' + (meta.product_name ?? '')),

    // Popup
    POPUP_IMAGE: getImg(0),
    POPUP_NAMES_JSON: '[' + popupNames + ']',
    POPUP_CITIES_JSON: '[' + popupCities + ']',
    POPUP_NAME_1: popup.names?.[0] ?? 'Michael',
    POPUP_CITY_1: popup.cities?.[0] ?? 'New York, NY',
    POPUP_ACTION_TEXT: hero.popup_action_text ?? 'just claimed a discount on',

    // Affiliate
    AFFILIATE_LINK: targetUrl,
  };

  let html = PRESELL_TEMPLATE;
  for (const [key, value] of Object.entries(replacements)) {
    html = html.split('{{' + key + '}}').join(value ?? '');
  }

  return html;
}
