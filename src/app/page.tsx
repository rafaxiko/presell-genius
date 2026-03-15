'use client';

import React, { useState, useEffect } from 'react';
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
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  // Previne erros de hidratação garantindo que o componente renderize apenas no cliente
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
      });

      toast({
        title: "Conteúdo Gerado!",
        description: "Sua página de pré-venda está pronta para visualização.",
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

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Toaster />
      
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary fill-primary" />
            <span className="text-xl font-bold tracking-tight">
              Presell <span className="text-primary">Genius</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-slate-100 px-3 py-1 rounded-full">
            <Rocket className="h-3 w-3" />
            Gemini AI Ativa
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <section>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Configurar Gerador</h1>
            <p className="text-slate-500 text-sm">Insira os detalhes do produto para criar sua copy de alta conversão.</p>
          </div>
          <PresellForm onSubmit={handleGenerate} isGenerating={isGenerating} />
        </section>

        <section id="preview-section" className="pb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Preview da Pré-venda</h2>
            <p className="text-slate-500 text-sm">Visualize e exporte sua página de aquecimento.</p>
          </div>
          <PresellPreview data={generatedData} onDownload={handleDownload} />
        </section>
      </main>
    </div>
  );
}
