'use client';

import React, { useState, useEffect } from 'react';
import { PresellForm, PresellFormValues } from '@/components/PresellForm';
import { PresellPreview } from '@/components/PresellPreview';
import { generatePresellContent, GeneratePresellContentOutput } from '@/ai/flows/generate-presell-content';
import { generateReviewContent } from '@/ai/flows/generate-review-content';
import { generatePresellHTML } from '@/lib/presell-template';
import { generateReviewHTML } from '@/lib/review-template';
import { Zap, Globe, Eye, Sparkles, Lock, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const COUNTRY_TO_LANGUAGE: Record<string, string> = {
  "Brasil": "Português (Brasil)",
  "Portugal": "Português (Portugal)",
  "Estados Unidos": "English (United States)",
  "Reino Unido": "English (United Kingdom)",
  "Canadá": "English (Canada)",
  "Austrália": "English (Australia)",
  "Nova Zelândia": "English (New Zealand)",
  "Irlanda": "English (Ireland)",
  "Espanha": "Español (España)",
  "México": "Español (México)",
  "Argentina": "Español (Argentina)",
  "Colômbia": "Español (Colombia)",
  "Chile": "Español (Chile)",
  "Peru": "Español (Perú)",
  "Venezuela": "Español (Venezuela)",
  "Equador": "Español (Ecuador)",
  "Bolívia": "Español (Bolivia)",
  "Paraguai": "Español (Paraguay)",
  "Uruguai": "Español (Uruguay)",
  "Guatemala": "Español (Guatemala)",
  "Honduras": "Español (Honduras)",
  "Costa Rica": "Español (Costa Rica)",
  "Panamá": "Español (Panamá)",
  "Nicarágua": "Español (Nicaragua)",
  "Porto Rico": "Español (Puerto Rico)",
  "França": "Français",
  "Bélgica": "Français (Belgique)",
  "Suíça": "Français (Suisse)",
  "Alemanha": "Deutsch",
  "Áustria": "Deutsch (Österreich)",
  "Itália": "Italiano",
  "Holanda": "Nederlands",
  "Polônia": "Polski",
  "Romênia": "Română",
  "Hungria": "Magyar",
  "Grécia": "Ελληνικά",
  "Turquia": "Türkçe",
  "Finlândia": "Suomi",
  "Suécia": "Svenska",
  "Dinamarca": "Dansk",
  "Noruega": "Norsk",
  "Israel": "עברית",
  "África do Sul": "English (South Africa)",
  "Índia": "English (India)",
  "Indonésia": "Bahasa Indonesia",
  "Malásia": "Bahasa Malaysia",
  "Filipinas": "Filipino",
  "Tailândia": "ภาษาไทย",
  "Vietnã": "Tiếng Việt",
  "Singapura": "English (Singapore)",
  "Japão": "日本語",
};

const STORAGE_KEY = 'pg_access';
const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_BETA_PASSWORD ?? 'GENIUS2026';

export default function PresellGeniusApp() {
  const [isGenerating, setIsGenerating] = useState(false);

  // ── Password gate ─────────────────────────────────────────────────────────
  const [isAuthed, setIsAuthed] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState(false);
  const [generatedData, setGeneratedData] = useState<GeneratePresellContentOutput | null>(null);
  const [generatedHTML, setGeneratedHTML] = useState<string | null>(null);
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [primaryColor, setPrimaryColor] = useState<string>('#2952A3');
  const [selectedCountry, setSelectedCountry] = useState<string>('Estados Unidos');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('Robusta');
  const [productImageUrls, setProductImageUrls] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) === '1') {
      setIsAuthed(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwInput === CORRECT_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, '1');
      setIsAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
      setPwInput('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  const handleGenerate = async (values: PresellFormValues) => {
    setIsGenerating(true);
    setTargetUrl(values.targetUrl);
    setPrimaryColor(values.buttonColor);
    setSelectedCountry(values.targetLanguage);
    setSelectedTemplate(values.templateType);

    try {
      const targetLanguage = COUNTRY_TO_LANGUAGE[values.targetLanguage] || values.targetLanguage;
      const isReview = values.templateType === 'Review';

      // Campos comuns a todos os templates
      const commonFields = {
        productName:          values.productName ?? '',
        productInfo:          values.productInfo ?? '',        // ← ANTI-ALUCINAÇÃO
        salesPageDescription: values.salesPageDescription ?? '',
        officialProductUrl:   values.officialProductUrl,
        targetUrl:            values.targetUrl,
        targetLanguage:       targetLanguage,
        templateType:         values.templateType as any,
        copyStyle:            values.copyStyle,
      };

      let result: any;
      let html: string;

      if (isReview) {
        // ── TEMPLATE REVIEW ──────────────────────────────────────────
        result = await generateReviewContent({
          ...commonFields,
          popupEnabled: values.popupEnabled ?? false,
        });
        
        if (result?.meta) {
          result.meta.primary_color       = values.buttonColor;
          result.meta.primary_color_light = lightenColor(values.buttonColor, 0.85);
          result.meta.primary_color_dark  = darkenColor(values.buttonColor, 0.25);
        }

        result._testiOverrides = {
          name1: (values as any).testi1Name || undefined,
          loc1:  (values as any).testi1Location || undefined,
          name2: (values as any).testi2Name || undefined,
          loc2:  (values as any).testi2Location || undefined,
          name3: (values as any).testi3Name || undefined,
          loc3:  (values as any).testi3Location || undefined,
        };

        html = generateReviewHTML(
          result,
          values.targetUrl,
          productImageUrls,
          values.targetLanguage
        );
      } else {
        // ── ROBUSTA WHITE + demais templates ─────────────────────────
        result = await generatePresellContent({
          ...commonFields,
        });

        if (result?.meta) {
          result.meta.primary_color       = values.buttonColor;
          result.meta.primary_color_light = lightenColor(values.buttonColor, 0.85);
          result.meta.primary_color_dark  = darkenColor(values.buttonColor, 0.25);
        }

        html = generatePresellHTML(
          result,
          values.targetUrl,
          productImageUrls,
          values.targetLanguage
        );
      }

      setGeneratedData(result);
      setGeneratedHTML(html);

      toast({
        title: isReview ? '✅ Review Gerada!' : '✅ Página Gerada!',
        description: isReview
          ? 'Template Review processado com sucesso.'
          : 'Presell Robusta gerada com sucesso.',
      });

    } catch (error: any) {
      console.error('[handleGenerate] Erro:', error);
      toast({
        variant: 'destructive',
        title: 'Erro na Geração',
        description: error?.message
          ? `Detalhe: ${error.message.substring(0, 120)}`
          : 'A IA encontrou um problema. Verifique o console para detalhes.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateImages = (images: string[]) => {
    setProductImageUrls(images);

    if (generatedData) {
      try {
        const isReview = selectedTemplate === 'Review';
        const html = isReview
          ? generateReviewHTML(generatedData, targetUrl, images, selectedCountry)
          : generatePresellHTML(generatedData, targetUrl, images, selectedCountry);
        setGeneratedHTML(html);
      } catch (e) {
        console.warn('[handleUpdateImages] Erro ao regenerar HTML:', e);
      }
    }
  };

  const handlePreview = () => {
    if (!generatedHTML) {
      toast({
        title: 'Nenhuma página gerada',
        description: 'Gere uma página primeiro antes de visualizar.',
      });
      return;
    }
    // Abre o HTML numa nova aba via blob URL
    const blob = new Blob([generatedHTML], { type: 'text/html;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
  };

  const handleDownload = (wrapForElementor: boolean) => {
    if (!generatedData) return;

    const isReview = selectedTemplate === 'Review';

    const content = wrapForElementor
      ? JSON.stringify(generatedData, null, 2)
      : (generatedHTML ?? (isReview
          ? generateReviewHTML(generatedData, targetUrl, productImageUrls, selectedCountry)
          : generatePresellHTML(generatedData, targetUrl, productImageUrls, selectedCountry)));

    const productName = (generatedData as any).meta?.product_name
      ?.toLowerCase().replace(/\s+/g, '-') ?? 'presell';

    const blob = new Blob(
      [content],
      { type: wrapForElementor ? 'application/json' : 'text/html;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href     = url;
    a.download = wrapForElementor ? `presell-${productName}.json` : `presell-${productName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setGeneratedData(null);
    setGeneratedHTML(null);
    setProductImageUrls([]);
    setTargetUrl('');
    setPrimaryColor('#2952A3');
    setSelectedCountry('Estados Unidos');
    setSelectedTemplate('Robusta');
  };

  if (!isMounted) return null;

  // ── Gate screen ───────────────────────────────────────────────────────────
  if (!isAuthed) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter',system-ui,sans-serif", padding: '24px' }}>
        <Toaster />
        <div style={{ width: '100%', maxWidth: '380px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
            <img src="/Logo Presell Genius.jpg" style={{ height: '56px', width: 'auto', marginBottom: '32px' }} alt="Presell Genius" />
          </div>

          {/* Card */}
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '28px 28px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Lock style={{ width: '14px', height: '14px', color: '#2563EB', flexShrink: 0 }} />
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>Acesso Restrito</span>
            </div>
            <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0 0 20px', lineHeight: 1.5 }}>
              Introduz a senha de acesso para continuar.
            </p>

            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="password"
                value={pwInput}
                onChange={e => { setPwInput(e.target.value); setPwError(false); }}
                placeholder="Senha"
                autoFocus
                style={{
                  width: '100%', height: '40px', borderRadius: '8px',
                  border: `1.5px solid ${pwError ? '#EF4444' : '#E5E7EB'}`,
                  fontSize: '14px', color: '#0F172A', padding: '0 12px',
                  outline: 'none', background: pwError ? '#FEF2F2' : '#fff',
                  boxSizing: 'border-box' as const, fontFamily: 'inherit',
                  letterSpacing: '0.1em',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => { if (!pwError) e.target.style.borderColor = '#2563EB'; }}
                onBlur={e => { if (!pwError) e.target.style.borderColor = '#E5E7EB'; }}
              />
              {pwError && (
                <div style={{ fontSize: '11px', color: '#EF4444', fontWeight: 500, marginTop: '-4px' }}>
                  Senha incorrecta
                </div>
              )}
              <button
                type="submit"
                style={{
                  height: '40px', background: '#2563EB', color: '#fff', border: 'none',
                  borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', letterSpacing: '-0.01em',
                  boxShadow: '0 1px 3px rgba(37,99,235,0.3)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#1D4ED8'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#2563EB'; }}
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <Toaster />

      {/* HEADER */}
      <header className="bg-white border-b h-14 shrink-0 px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <img src="/Logo Presell Genius.jpg" style={{ height: '44px', width: 'auto' }} alt="Presell Genius" />
          <div className="ml-4 hidden sm:flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded text-[10px] font-bold text-slate-500 border border-slate-200">
            <Globe className="h-3 w-3 text-primary" />
            V2 ENGINE
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Botão Visualizar — aparece quando há HTML gerado */}
          {generatedHTML && (
            <button
              onClick={handlePreview}
              className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-primary border border-slate-200 hover:border-primary rounded-lg px-3 py-1.5 transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              Visualizar
            </button>
          )}
          {/* Sair */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
            title="Terminar sessão"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* LAYOUT PRINCIPAL */}
      <main className="flex-1 flex overflow-hidden">

        {/* SIDEBAR — Formulário */}
        <aside className="w-[440px] shrink-0 h-full border-r bg-slate-50/20 flex flex-col overflow-y-auto">
          <PresellForm
            onSubmit={handleGenerate}
            onClear={handleClear}
            isGenerating={isGenerating}
            productImageUrls={productImageUrls}
            onUpdateImages={handleUpdateImages}
            onPreview={generatedHTML ? handlePreview : undefined}
          />
        </aside>

        {/* ÁREA DE PREVIEW */}
        <section className="flex-1 h-full bg-slate-100/50 flex flex-col overflow-hidden">
          <div className="flex-1 p-6 md:p-8 overflow-auto">
            <PresellPreview
              data={generatedHTML}
              onDownload={handleDownload}
              onUpdateImages={handleUpdateImages}
            />
          </div>
        </section>

      </main>
    </div>
  );
}

// ── Utilitários de cor ────────────────────────────────────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.substring(0, 2), 16),
    parseInt(clean.substring(2, 4), 16),
    parseInt(clean.substring(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b]
    .map(v => Math.min(255, Math.max(0, Math.round(v))).toString(16).padStart(2, '0'))
    .join('');
}

function lightenColor(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * factor, g + (255 - g) * factor, b + (255 - b) * factor);
}

function darkenColor(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * (1 - factor), g * (1 - factor), b * (1 - factor));
}