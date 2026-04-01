'use client';

import React, { useState, useEffect } from 'react';
import { PresellForm, PresellFormValues } from '@/components/PresellForm';
import { PresellPreview } from '@/components/PresellPreview';
import { generatePresellContent, GeneratePresellContentOutput } from '@/ai/flows/generate-presell-content';
import { generateReviewContent } from '@/ai/flows/generate-review-content';
import { generatePresellHTML } from '@/lib/presell-template';
import { generateReviewHTML } from '@/lib/review-template';
import { Zap, Rocket, Star, Globe, Eye } from 'lucide-react';
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

export default function PresellGeniusApp() {
  const [isGenerating, setIsGenerating] = useState(false);
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
  }, []);

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

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <Toaster />

      {/* HEADER */}
      <header className="bg-white border-b h-14 shrink-0 px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-1.5 shadow-sm">
            <Zap className="h-4 w-4 text-white fill-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Presell <span className="text-primary">Genius</span>
          </span>
          <div className="ml-4 hidden sm:flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded text-[10px] font-bold text-slate-500 border border-slate-200">
            <Globe className="h-3 w-3 text-primary" />
            V2 ENGINE
          </div>
        </div>
        <div className="flex items-center gap-4">
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
          <div className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <Rocket className="h-3.5 w-3.5" />
            ELITE EXTRACTION
          </div>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-[10px] font-bold text-yellow-700 border border-yellow-100">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            PREMIUM
          </div>
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