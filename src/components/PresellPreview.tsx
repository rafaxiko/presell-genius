'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, Code, FileCode } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generatePresellHTML, PresellData } from '@/lib/presell-template';
import { useToast } from '@/hooks/use-toast';

interface PresellPreviewProps {
  data: PresellData | null;
  onDownload: (wrapForElementor: boolean) => void;
}

export function PresellPreview({ data, onDownload }: PresellPreviewProps) {
  const [html, setHtml] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if (data) {
      setHtml(generatePresellHTML(data));
      const section = document.getElementById('preview-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [data]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(html);
    toast({
      title: "Copiado!",
      description: "Código fonte copiado para a área de transferência.",
    });
  };

  if (!data) {
    return (
      <Card className="flex flex-col items-center justify-center text-center p-12 bg-white border-2 border-dashed h-full min-h-[500px]">
        <div className="bg-slate-50 p-6 rounded-full mb-6">
          <Eye className="h-10 w-10 text-slate-300" />
        </div>
        <CardTitle className="text-xl text-slate-400">Aguardando Geração</CardTitle>
        <CardDescription className="max-w-xs mt-2">
          Configure seu produto e clique em "Gerar Página" para ver a mágica acontecer aqui.
        </CardDescription>
      </Card>
    );
  }

  return (
    <Card className="shadow-2xl border-none overflow-hidden bg-white h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Eye className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Preview em Tempo Real</CardTitle>
            <CardDescription>Visualize o resultado da sua estratégia</CardDescription>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onDownload(true)} className="gap-2 text-xs h-9">
            <FileCode className="h-4 w-4" />
            Para Elementor
          </Button>
          <Button onClick={() => onDownload(false)} className="gap-2 shadow-lg hover:scale-105 transition-transform h-9">
            <Download className="h-4 w-4" />
            Baixar HTML
          </Button>
        </div>
      </CardHeader>
      
      <Tabs defaultValue="preview" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-2 bg-white border-b flex justify-between items-center shrink-0">
          <TabsList className="bg-slate-100 p-1">
            <TabsTrigger value="preview" className="data-[state=active]:bg-white text-xs">Visualizar</TabsTrigger>
            <TabsTrigger value="code" className="data-[state=active]:bg-white text-xs">Código Fonte</TabsTrigger>
          </TabsList>
          <TabsContent value="code" className="m-0">
            <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-[10px] h-7 gap-1">
              <Code className="h-3 w-3" />
              Copiar Código
            </Button>
          </TabsContent>
        </div>
        
        <TabsContent value="preview" className="flex-1 m-0 bg-slate-100/50 p-4 md:p-6 overflow-auto">
          <div className="mx-auto max-w-2xl bg-white shadow-xl rounded-2xl overflow-hidden min-h-[800px] border relative">
            <iframe
              srcDoc={html}
              title="Presell Preview"
              className="w-full h-full min-h-[1000px] border-none"
              sandbox="allow-scripts"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="code" className="flex-1 m-0 overflow-auto">
          <div className="p-6 bg-slate-900 text-slate-300 font-mono text-[11px] h-full">
            <pre className="whitespace-pre-wrap leading-relaxed">
              {html}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
