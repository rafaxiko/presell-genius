'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, Monitor, Smartphone, Copy, FileCode } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generatePresellHTML, PresellData } from '@/lib/presell-template';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PresellPreviewProps {
  data: PresellData | null;
  onDownload: (wrapForElementor: boolean) => void;
  onUpdateImages: (images: string[]) => void;
}

export function PresellPreview({ data, onDownload }: PresellPreviewProps) {
  const [isClient, setIsClient] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const html = useMemo(() => {
    return generatePresellHTML(data);
  }, [data]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
          <Button variant="outline" size="sm" onClick={() => onDownload(true)} className="gap-2 text-[10px] h-9 font-bold px-4">
            <FileCode className="h-4 w-4" />
            Baixar JSON (Elementor)
          </Button>
          <Button size="sm" onClick={() => onDownload(false)} className="gap-2 shadow-md h-9 text-[10px] bg-primary hover:bg-primary/90 font-bold px-4">
            <Download className="h-4 w-4" />
            Baixar HTML (Direto)
          </Button>
        </div>
      </CardHeader>
      
      <Tabs defaultValue="preview" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-2 bg-white border-b flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <TabsList className="bg-slate-100 p-1 h-8">
              <TabsTrigger value="preview" className="data-[state=active]:bg-white text-[10px] px-3 font-bold uppercase tracking-wider">Visualizar</TabsTrigger>
              <TabsTrigger value="code" className="data-[state=active]:bg-white text-[10px] px-3 font-bold uppercase tracking-wider">Código</TabsTrigger>
            </TabsList>
            
            <div className="flex bg-slate-100 p-1 rounded-md h-8">
              <button 
                onClick={() => setViewMode('desktop')}
                className={cn(
                  "px-2 rounded flex items-center justify-center transition-all",
                  viewMode === 'desktop' ? "bg-white shadow-sm text-primary" : "text-slate-400 hover:text-slate-600"
                )}
                title="Desktop"
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setViewMode('mobile')}
                className={cn(
                  "px-2 rounded flex items-center justify-center transition-all",
                  viewMode === 'mobile' ? "bg-white shadow-sm text-primary" : "text-slate-400 hover:text-slate-600"
                )}
                title="Mobile"
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <TabsContent value="code" className="m-0">
            <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-[10px] h-6 gap-1 px-2">
              <Copy className="h-3 w-3" />
              Copiar
            </Button>
          </TabsContent>
        </div>
        
        <TabsContent value="preview" className="flex-1 m-0 bg-slate-100/30 p-4 md:p-8 overflow-auto scroll-smooth" ref={scrollContainerRef}>
          <div 
            className={cn(
              "mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden border relative transition-all duration-300",
              viewMode === 'desktop' ? "max-w-full lg:max-w-3xl" : "max-w-[375px]"
            )}
            style={{ minHeight: '1200px' }}
          >
            <iframe
              srcDoc={html}
              title="Presell Preview"
              className="w-full h-full border-none min-h-[1200px]"
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
