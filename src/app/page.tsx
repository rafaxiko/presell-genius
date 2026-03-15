'use client';

import React, { useState, useEffect } from 'react';
import { PresellForm, PresellFormValues } from '@/components/PresellForm';
import { PresellPreview } from '@/components/PresellPreview';
import { generatePresellContent } from '@/ai/flows/generate-presell-content';
import { PresellData } from '@/lib/presell-template';
import { Zap, Rocket, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePresellHTML } from '@/lib/presell-template';
import { Toaster } from '@/components/ui/toaster';

export default function PresellGeniusApp() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<PresellData | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleGenerate = async (values: PresellFormValues) => {
    setIsGenerating(true);
    try {
      const result = await generatePresellContent({
        salesPageDescription: values.salesPageDescription,
        targetLanguage: values.targetLanguage,
        templateType: values.templateType as any,
      });

      const imageUrls = values.productImageUrl 
        ? values.productImageUrl.split(',').map(u => u.trim()).filter(Boolean)
        : [];

      setGeneratedData({
        productName: values.productName,
        headline: result.headline,
        subheadline: result.subheadline,
        bodyCopy: result.bodyCopy,
        benefits: result.benefits,
        ingredients: result.ingredients,
        faqs: result.faqs,
        pros: result.pros,
        cons: result.cons,
        comparisonTable: result.comparisonTable,
        pricing: result.pricing,
        callToAction: result.callToAction,
        buttonColor: values.buttonColor,
        targetUrl: values.targetUrl,
        productImageUrls: imageUrls,
        trackingLink: values.trackingLink,
        clarityScript: values.clarityScript,
        templateType: values.templateType as any,
      });

      toast({
        title: "Sucesso!",
        description: "Página gerada com alta conversão.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro na Geração",
        description: "Falha ao processar os dados com a IA.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setGeneratedData(null);
  };

  const handleDownload = () => {
    if (!generatedData) return;

    const html = generatePresellHTML(generatedData);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedData.productName.toLowerCase().replace(/\s+/g, '-')}-presell.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Concluído",
      description: "Página salva com sucesso.",
    });
  };

  if (!isMounted) return null;

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <Toaster />
      
      <header className="bg-white border-b h-14 shrink-0 px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-1">
            <Zap className="h-4 w-4 text-white fill-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Presell <span className="text-primary">Genius</span>
          </span>
          <div className="ml-4 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-[10px] font-medium text-slate-500 border">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            SaaS Affiliate Suite
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <Rocket className="h-3 w-3" />
            IA Engine v3.0 Ativa
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Coluna de Configuração */}
        <aside className="w-[450px] shrink-0 h-full border-r bg-slate-50/50 p-6 overflow-hidden flex flex-col">
          <PresellForm 
            onSubmit={handleGenerate} 
            onClear={handleClear}
            isGenerating={isGenerating} 
          />
        </aside>

        {/* Painel de Preview */}
        <section className="flex-1 h-full overflow-hidden bg-slate-100 flex flex-col">
          <div className="flex-1 p-8 overflow-auto">
            <PresellPreview data={generatedData} onDownload={handleDownload} />
          </div>
        </section>
      </main>
    </div>
  );
}
