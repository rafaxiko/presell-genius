'use client';

import React, { useState, useEffect } from 'react';
import { PresellForm, PresellFormValues } from '@/components/PresellForm';
import { PresellPreview } from '@/components/PresellPreview';
import { generatePresellContent } from '@/ai/flows/generate-presell-content';
import { PresellData } from '@/lib/presell-template';
import { Zap, Rocket, LayoutDashboard } from 'lucide-react';
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
        title: "Copy Gerada!",
        description: "Seu material de pré-venda já está visível no painel lateral.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro na Geração",
        description: "Verifique sua conexão ou tente novamente mais tarde.",
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
    a.download = 'minha-pre-venda.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Concluído",
      description: "Salve o arquivo e use em sua estrutura de vendas.",
    });
  };

  if (!isMounted) return null;

  return (
    <div className="h-screen bg-slate-100 flex flex-col overflow-hidden">
      <Toaster />
      
      <header className="bg-white border-b h-14 shrink-0 px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary fill-primary" />
          <span className="text-lg font-bold tracking-tight">
            Presell <span className="text-primary">Genius</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-md border">
            <Rocket className="h-3 w-3" />
            Workspace IA Ativo
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Coluna de Configuração */}
        <aside className="w-full lg:w-[450px] shrink-0 h-full border-r bg-slate-50 p-4 overflow-hidden flex flex-col">
          <PresellForm 
            onSubmit={handleGenerate} 
            onClear={handleClear}
            isGenerating={isGenerating} 
          />
        </aside>

        {/* Coluna de Preview */}
        <section className="flex-1 h-full overflow-hidden bg-slate-200">
          <div className="h-full w-full p-4 md:p-8">
            <PresellPreview data={generatedData} onDownload={handleDownload} />
          </div>
        </section>
      </main>
    </div>
  );
}