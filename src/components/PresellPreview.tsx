'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, Code, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generatePresellHTML, PresellData } from '@/lib/presell-template';

interface PresellPreviewProps {
  data: PresellData | null;
  onDownload: () => void;
}

export function PresellPreview({ data, onDownload }: PresellPreviewProps) {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    if (data) {
      setHtml(generatePresellHTML(data));
      // Scroll suave para o preview quando os dados são gerados
      const section = document.getElementById('preview-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [data]);

  if (!data) {
    return (
      <Card className="flex flex-col items-center justify-center text-center p-12 bg-white border-2 border-dashed">
        <div className="bg-slate-50 p-6 rounded-full mb-6">
          <Eye className="h-10 w-10 text-slate-300" />
        </div>
        <CardTitle className="text-xl text-slate-400">Aguardando Geração</CardTitle>
        <CardDescription className="max-w-xs mt-2">
          Preencha o formulário acima e clique em "Gerar Pré-venda" para visualizar sua página aqui.
        </CardDescription>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-none overflow-hidden bg-white">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Eye className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Resultado da Geração</CardTitle>
            <CardDescription>Visualize ou copie o código da sua página</CardDescription>
          </div>
        </div>
        <Button onClick={onDownload} className="gap-2 shadow-lg hover:scale-105 transition-transform">
          <Download className="h-4 w-4" />
          Baixar HTML
        </Button>
      </CardHeader>
      
      <Tabs defaultValue="preview" className="w-full">
        <div className="px-6 py-4 bg-white border-b flex justify-start">
          <TabsList className="bg-slate-100 p-1">
            <TabsTrigger value="preview" className="data-[state=active]:bg-white">Visualizar</TabsTrigger>
            <TabsTrigger value="code" className="data-[state=active]:bg-white">Código Fonte</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="preview" className="m-0 bg-slate-200 p-4 md:p-8 min-h-[600px]">
          <div className="mx-auto max-w-2xl bg-white shadow-2xl rounded-xl overflow-hidden min-h-[500px] border">
            <iframe
              srcDoc={html}
              title="Presell Preview"
              className="w-full min-h-[500px] border-none"
              sandbox="allow-scripts"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="code" className="m-0">
          <div className="p-6 bg-slate-900 text-slate-300 font-mono text-sm overflow-x-auto">
            <pre className="whitespace-pre-wrap leading-relaxed">
              {html}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
