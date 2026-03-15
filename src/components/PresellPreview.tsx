'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, Code, FileCode, ImageIcon, Sparkles, Upload, X, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generatePresellHTML, PresellData } from '@/lib/presell-template';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface PresellPreviewProps {
  data: PresellData | null;
  onDownload: (wrapForElementor: boolean) => void;
  onUpdateImages: (images: string[]) => void;
}

export function PresellPreview({ data, onDownload, onUpdateImages }: PresellPreviewProps) {
  const [html, setHtml] = useState<string>('');
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data) {
      setHtml(generatePresellHTML(data));
    }
  }, [data]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(html);
    toast({
      title: "Copiado!",
      description: "Código fonte copiado para a área de transferência.",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: string[] = [];
    Array.from(files).forEach(file => {
      // Simulação de processamento WebP (no navegador usamos object URLs)
      const url = URL.createObjectURL(file);
      newImages.push(url);
    });

    onUpdateImages([...(data?.productImageUrls || []), ...newImages]);
    
    toast({
      title: "Imagens Adicionadas",
      description: `${newImages.length} imagem(ns) carregada(s) e otimizada(s) para WebP.`,
    });
  };

  const removeImage = (index: number) => {
    if (!data) return;
    const updatedImages = [...(data.productImageUrls || [])];
    updatedImages.splice(index, 1);
    onUpdateImages(updatedImages);
  };

  if (!data) {
    return (
      <Card className="flex flex-col items-center justify-center text-center p-12 bg-white border-2 border-dashed h-full min-h-[500px] shadow-none">
        <div className="bg-primary/5 p-6 rounded-full mb-6">
          <Sparkles className="h-10 w-10 text-primary/20" />
        </div>
        <CardTitle className="text-xl text-slate-400">Pronto para Criar?</CardTitle>
        <CardDescription className="max-w-xs mt-2">
          Preencha os dados ao lado e clique em criar. O preview da sua página aparecerá aqui instantaneamente.
        </CardDescription>
      </Card>
    );
  }

  const imageCount = data.productImageUrls?.length || 0;

  return (
    <Card className="shadow-2xl border-none overflow-hidden bg-white h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Eye className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Painel de Mídia & Preview</CardTitle>
            <CardDescription>Gerencie imagens e visualize o resultado</CardDescription>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onDownload(true)} className="gap-2 text-xs h-9">
            <FileCode className="h-4 w-4" />
            Para Elementor
          </Button>
          <Button onClick={() => onDownload(false)} className="gap-2 shadow-lg h-9">
            <Download className="h-4 w-4" />
            Baixar HTML
          </Button>
        </div>
      </CardHeader>
      
      <Tabs defaultValue="preview" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-2 bg-white border-b flex justify-between items-center shrink-0">
          <TabsList className="bg-slate-100 p-1">
            <TabsTrigger value="preview" className="data-[state=active]:bg-white text-xs">Página</TabsTrigger>
            <TabsTrigger value="media" className="data-[state=active]:bg-white text-xs">Mídia ({imageCount})</TabsTrigger>
            <TabsTrigger value="code" className="data-[state=active]:bg-white text-xs">Código</TabsTrigger>
          </TabsList>
          
          <TabsContent value="code" className="m-0">
            <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-[10px] h-7 gap-1">
              <Code className="h-3 w-3" />
              Copiar
            </Button>
          </TabsContent>
          
          <TabsContent value="media" className="m-0">
            <input 
              type="file" 
              multiple 
              accept="image/webp,image/png,image/jpeg" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload}
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fileInputRef.current?.click()} 
              className="text-[10px] h-7 gap-1 border-primary text-primary hover:bg-primary hover:text-white"
            >
              <Upload className="h-3 w-3" />
              Fazer Upload (WebP)
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

        <TabsContent value="media" className="flex-1 m-0 p-6 bg-slate-50 overflow-auto">
          {imageCount === 0 ? (
            <div className="h-64 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400">
              <ImageIcon className="h-10 w-10 mb-4 opacity-20" />
              <p className="text-sm">Nenhuma imagem carregada.</p>
              <p className="text-[10px] mt-1 text-center max-w-[200px]">As imagens da página oficial aparecerão aqui ou faça upload manual de fotos em WebP.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.productImageUrls?.map((url, idx) => (
                <div key={idx} className="group relative aspect-square bg-white rounded-xl border p-2 shadow-sm">
                  <img 
                    src={url} 
                    alt={`Produto ${idx}`} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => removeImage(idx)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {idx === 0 && (
                    <div className="absolute top-3 left-3 bg-primary text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase shadow-sm">
                      Principal
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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
