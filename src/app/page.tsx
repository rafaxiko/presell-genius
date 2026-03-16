'use client';

import React, { useState, useEffect } from 'react';
import { PresellForm, PresellFormValues } from '@/components/PresellForm';
import { PresellPreview } from '@/components/PresellPreview';
import { generatePresellContent } from '@/ai/flows/generate-presell-content';
import { PresellData } from '@/lib/presell-template';
import { Zap, Rocket, Star, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function PresellGeniusApp() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<PresellData | null>(null);
  const [productImageUrls, setProductImageUrls] = useState<string[]>([]);
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
        copyStyle: values.copyStyle,
      });

      const newData: PresellData = {
        productName: values.productName,
        headline: result.headline,
        subheadline: result.subheadline,
        editorialIntro: result.editorialIntro,
        quickSummary: result.quickSummary,
        patternInterrupt: result.patternInterrupt,
        problemsSection: result.problemsSection,
        whatIsSection: result.whatIsSection,
        curiosityBridge: result.curiosityBridge,
        features: result.features,
        benefits: result.benefits,
        comparisonTable: result.comparisonTable,
        pros: result.pros,
        cons: result.cons,
        testimonials: result.testimonials,
        pricing: result.pricing,
        faqs: result.faqs,
        callToAction: result.callToAction,
        buttonColor: values.buttonColor,
        targetUrl: values.targetUrl,
        productImageUrls: productImageUrls,
        trackingLink: values.trackingLink,
        clarityScript: values.clarityScript,
        templateType: values.templateType as any,
        copyStyle: values.copyStyle,
        targetLanguage: values.targetLanguage,
      };

      setGeneratedData(newData);

      toast({
        title: "Análise Gerada!",
        description: "Estrutura Nutra System v6 aplicada com sucesso.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro na Geração",
        description: "A IA encontrou um problema. Tente novamente.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateImages = (images: string[]) => {
    setProductImageUrls(images);
    if (generatedData) {
      setGeneratedData({
        ...generatedData,
        productImageUrls: images,
      });
    }
  };

  const handleClear = () => {
    setGeneratedData(null);
    setProductImageUrls([]);
  };

  if (!isMounted) return null;

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <Toaster />
      
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
            SISTEMA NUTRA v6
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <Rocket className="h-3.5 w-3.5" />
            ESTRATÉGIA VSL 2026
          </div>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-[10px] font-bold text-yellow-700 border border-yellow-100">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            PREMIUM
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-[440px] shrink-0 h-full border-r bg-slate-50/20 p-6 flex flex-col overflow-hidden">
          <PresellForm 
            onSubmit={handleGenerate} 
            onClear={handleClear}
            isGenerating={isGenerating}
            productImageUrls={productImageUrls}
            onUpdateImages={handleUpdateImages}
          />
        </aside>

        <section className="flex-1 h-full bg-slate-100/50 flex flex-col overflow-hidden">
          <div className="flex-1 p-6 md:p-8 overflow-auto">
            <PresellPreview 
              data={generatedData} 
              onDownload={() => {}} // Handled inside PresellPreview
              onUpdateImages={handleUpdateImages}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
