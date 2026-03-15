'use client';

import React, { useState } from 'react';
import { PresellForm, PresellFormValues } from '@/components/PresellForm';
import { PresellPreview } from '@/components/PresellPreview';
import { generatePresellContent } from '@/ai/flows/generate-presell-content';
import { PresellData } from '@/lib/presell-template';
import { Zap, Rocket } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePresellHTML } from '@/lib/presell-template';
import { Toaster } from '@/components/ui/toaster';

export default function PresellGeniusApp() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<PresellData | null>(null);
  const { toast } = useToast();

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
      });

      toast({
        title: "Conteúdo Gerado!",
        description: "Sua página de pré-venda de alta conversão está pronta.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Falha na Geração",
        description: "Houve um erro ao gerar seu conteúdo. Por favor, tente novamente.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedData) return;

    const html = generatePresellHTML(generatedData);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pagina-pre-venda.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Sucesso!",
      description: "Página baixada com sucesso.",
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Toaster />
      
      {/* Header Compacto */}
      <header className="shrink-0 w-full border-b bg-background/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg shadow-inner">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-primary">
              Presell <span className="text-accent">Genius</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-accent/10 border border-accent/20 px-3 py-1 rounded-full text-accent font-bold text-[10px] uppercase tracking-wider">
              <Rocket className="h-3 w-3" />
              IA Gemini 1.5 Flash Ativa
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors">Ajuda</button>
            <button className="bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all">
              Pro
            </button>
          </div>
        </div>
      </header>

      {/* Workspace Principal - Side by Side */}
      <main className="flex-1 overflow-hidden p-4 md:p-6">
        <div className="h-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Coluna de Configuração */}
          <div className="lg:col-span-4 xl:col-span-3 h-full overflow-hidden">
            <PresellForm onSubmit={handleGenerate} isGenerating={isGenerating} />
          </div>

          {/* Coluna de Preview */}
          <div className="lg:col-span-8 xl:col-span-9 h-full overflow-hidden">
            <PresellPreview data={generatedData} onDownload={handleDownload} />
          </div>

        </div>
      </main>
    </div>
  );
}
