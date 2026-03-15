'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, Code } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generatePresellHTML, PresellData } from '@/lib/presell-template';

interface PresellPreviewProps {
  data: PresellData | null;
  onDownload: () => void;
}

export function PresellPreview({ data, onDownload }: PresellPreviewProps) {
  if (!data) {
    return (
      <Card className="h-full flex flex-col items-center justify-center text-center p-8 bg-white/50 border-dashed border-2">
        <div className="bg-muted p-4 rounded-full mb-4">
          <Eye className="h-8 w-8 text-muted-foreground" />
        </div>
        <CardTitle className="text-xl mb-2">Visualização em Tempo Real</CardTitle>
        <CardDescription className="max-w-[280px]">
          Configure sua oferta ao lado e clique em gerar para ver o preview da sua página de aquecimento.
        </CardDescription>
      </Card>
    );
  }

  const html = generatePresellHTML(data);

  return (
    <Card className="h-full flex flex-col shadow-lg border-none overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 bg-white border-b shrink-0">
        <div>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Eye className="h-4 w-4 text-accent" />
            Preview da Página
          </CardTitle>
          <CardDescription className="text-xs">Visualize como seus leads verão a página</CardDescription>
        </div>
        <Button onClick={onDownload} size="sm" className="gap-2 bg-accent hover:bg-accent/90 text-xs h-8">
          <Download className="h-3.5 w-3.5" />
          Baixar HTML
        </Button>
      </CardHeader>
      
      <Tabs defaultValue="preview" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-2 bg-muted/30 border-b flex justify-center shrink-0">
          <TabsList className="grid grid-cols-2 w-[200px] h-8">
            <TabsTrigger value="preview" className="text-[10px] flex items-center gap-1.5">
              <Eye className="h-3 w-3" /> Visualizar
            </TabsTrigger>
            <TabsTrigger value="code" className="text-[10px] flex items-center gap-1.5">
              <Code className="h-3 w-3" /> Código
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="preview" className="flex-1 m-0 p-0 overflow-hidden bg-slate-100">
          <div className="w-full h-full bg-white shadow-inner">
            <iframe
              srcDoc={html}
              title="Presell Preview"
              className="w-full h-full border-none"
              sandbox="allow-scripts"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="code" className="flex-1 m-0 p-0 overflow-hidden bg-slate-900">
          <div className="h-full overflow-auto p-6 text-slate-100 font-mono text-xs leading-relaxed">
            <pre className="whitespace-pre-wrap">
              {html}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
