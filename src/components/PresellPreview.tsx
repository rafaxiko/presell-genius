'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, Code, FileCode, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generatePresellHTML, PresellData } from '@/lib/presell-template';
import { useToast } from '@/hooks/use-toast';

interface PresellPreviewProps {
  data: PresellData | null;
  onDownload: (wrapForElementor: boolean) => void;
  onUpdateImages: (images: string[]) => void;
}

export function PresellPreview({ data, onDownload }: PresellPreviewProps) {
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoize HTML generation to avoid unnecessary re-renders
  const html = useMemo(() => {
    return generatePresellHTML(data);
  }, [data]);

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(html);
      toast({
        title: "Copiado!",
        description: "Código fonte copiado para a área de transferência.",
      });
    }
  };

  if (!isClient) return null;

  return (
    <Card className="shadow-2xl border-none overflow-hidden bg-white h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50 shrink-0 py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Eye className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Visualização ao Vivo</CardTitle>
            <CardDescription className="text-xs">Visualize sua página em tempo real</CardDescription>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onDownload(true)} className="gap-2 text-xs h-8">
            <FileCode className="h-4 w-4" />
            Exportar Elementor
          </Button>
          <Button onClick={() => onDownload(false)} className="gap-2 shadow-lg h-8">
            <Download className="h-4 w-4" />
            Baixar HTML
          </Button>
        </div>
      </CardHeader>
      
      <Tabs defaultValue="preview" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-2 bg-white border-b flex justify-between items-center shrink-0">
          <TabsList className="bg-slate-100 p-1 h-8">
            <TabsTrigger value="preview" className="data-[state=active]:bg-white text-[10px] px-3">Desktop</TabsTrigger>
            <TabsTrigger value="code" className="data-[state=active]:bg-white text-[10px] px-3">Código</TabsTrigger>
          </TabsList>
          
          <TabsContent value="code" className="m-0">
            <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-[10px] h-6 gap-1 px-2">
              <Code className="h-3 w-3" />
              Copiar Tudo
            </Button>
          </TabsContent>
        </div>
        
        <TabsContent value="preview" className="flex-1 m-0 bg-slate-100/30 p-4 md:p-6 overflow-auto">
          <div className="mx-auto max-w-full lg:max-w-2xl bg-white shadow-xl rounded-2xl overflow-hidden min-h-[1000px] border relative">
            <iframe
              srcDoc={html}
              title="Presell Preview"
              className="w-full h-full min-h-[1200px] border-none"
              sandbox="allow-scripts"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="code" className="flex-1 m-0 overflow-auto">
          <div className="p-6 bg-slate-900 text-slate-300 font-mono text-[10px] h-full">
            <pre className="whitespace-pre-wrap leading-relaxed">
              {html}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
