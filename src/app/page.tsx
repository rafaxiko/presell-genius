'use client';

import React, { useState, useEffect } from 'react';
import { PresellForm, PresellFormValues } from '@/components/PresellForm';
import { PresellPreview } from '@/components/PresellPreview';
import { generatePresellContent } from '@/ai/flows/generate-presell-content';
import { PresellData } from '@/lib/presell-template';
import { Zap, Rocket, LayoutDashboard, Star } from 'lucide-react';
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
      const keyPoints = values.keySellingPoints.split(',').map(s => s.trim()).filter(Boolean);
      
      const result = await generatePresellContent({
        salesPageDescription: values.salesPageDescription,
        keySellingPoints: keyPoints,
        targetLanguage: values.targetLanguage,
      });

      setGeneratedData({
        headline: result.headline,
        bodyCopy: result.bodyCopy,
        callToAction: result.callToAction,
        buttonColor: values.buttonColor,
        targetUrl: values.targetUrl,
        productImageUrl: values.productImageUrl || undefined,
      });

      toast({
        title: "Sucesso!",
        description: "Sua página de pré-venda foi gerada com sucesso.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Falha na Geração",
        description: "Não foi possível gerar a copy. Tente novamente.",
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
    a.download = 'presell-genius.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Concluído",
      description: "Arquivo pronto para uso em sua estrutura.",
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
            IA Engine V2.5 Ativa
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Coluna de Configuração - LADO ESQUERDO */}
        <aside className="w-[450px] shrink-0 h-full border-r bg-slate-50/50 p-6 overflow-hidden flex flex-col">
          <PresellForm 
            onSubmit={handleGenerate} 
            onClear={handleClear}
            isGenerating={isGenerating} 
          />
        </aside>

        {/* Painel de Preview - LADO DIREITO */}
        <section className="flex-1 h-full overflow-hidden bg-slate-100 flex flex-col">
          <div className="flex-1 p-8 overflow-auto">
            <PresellPreview data={generatedData} onDownload={handleDownload} />
          </div>
        </section>
      </main>
    </div>
  );
}
