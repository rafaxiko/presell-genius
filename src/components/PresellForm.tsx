'use client';

import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Palette, Link as LinkIcon, ListChecks, RotateCcw, Globe, Activity, Code2, LayoutTemplate, ShoppingBag, Upload, Trash2, ImageIcon, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  productName: z.string().min(2, 'Informe o nome do produto.'),
  salesPageDescription: z.string().min(20, 'Forneça uma descrição detalhada para a IA.'),
  officialProductUrl: z.string().url('A URL da página oficial é obrigatória.'),
  targetLanguage: z.string().min(1, 'Selecione um país.'),
  templateType: z.enum(['Lançamento', 'Robusta', 'Review', 'Cookie', 'Lista (Top 3/5)']),
  copyStyle: z.enum(['White Hat (Conservador)', 'Black Hat (Agressivo)']),
  buttonColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Cor hexadecimal inválida.'),
  targetUrl: z.string().url('Seu link de afiliado é obrigatório.'),
  trackingLink: z.string().optional().or(z.literal('')),
  clarityScript: z.string().optional().or(z.literal('')),
});

export type PresellFormValues = z.infer<typeof formSchema>;

interface PresellFormProps {
  onSubmit: (values: PresellFormValues) => void;
  onClear: () => void;
  isGenerating: boolean;
  productImageUrls: string[];
  onUpdateImages: (images: string[]) => void;
}

const COUNTRIES = [
  "África do Sul", "Albânia", "Alemanha", "Angola", "Argentina", "Austrália", "Áustria", "Bélgica", "Bolívia", "Brasil", 
  "Canadá", "Chile", "China", "Colômbia", "Coreia do Sul", "Costa Rica", "Croácia", "Dinamarca", "Egito", "Equador", 
  "Eslováquia", "Eslovênia", "Espanha", "Estados Unidos", "Estônia", "Filipinas", "Finlândia", "França", "Grécia", 
  "Guatemala", "Holanda", "Honduras", "Hong Kong", "Hungria", "Índia", "Indonésia", "Irlanda", "Israel", "Itália", 
  "Japão", "Luxemburgo", "Malásia", "Marrocos", "México", "Nicarágua", "Noruega", "Nova Zelândia", "Panamá", 
  "Paraguai", "Peru", "Polônia", "Portugal", "Porto Rico", "Reino Unido", "República Tcheca", "Romênia", "Singapura", 
  "Suécia", "Suíça", "Tailândia", "Taiwan", "Turquia", "Uruguai", "Venezuela", "Vietnã"
];

export function PresellForm({ onSubmit, onClear, isGenerating, productImageUrls, onUpdateImages }: PresellFormProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<PresellFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: '',
      salesPageDescription: '',
      officialProductUrl: '',
      targetLanguage: 'Brasil',
      templateType: 'Robusta',
      copyStyle: 'White Hat (Conservador)',
      buttonColor: '#2952A3',
      targetUrl: 'https://seulink.com',
      trackingLink: '',
      clarityScript: '',
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: string[] = [];
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      newImages.push(url);
    });

    onUpdateImages([...productImageUrls, ...newImages]);
    
    toast({
      title: "Imagens Adicionadas",
      description: `${newImages.length} imagem(ns) carregada(s).`,
    });
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    const updatedImages = [...productImageUrls];
    updatedImages.splice(index, 1);
    onUpdateImages(updatedImages);
  };

  return (
    <Card className="h-full flex flex-col shadow-none border-none bg-transparent">
      <CardHeader className="space-y-1 shrink-0 px-0 pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" />
            Configurar Página
          </CardTitle>
          <Button variant="ghost" size="sm" type="button" onClick={() => { form.reset(); onClear(); }} className="text-xs text-slate-400 gap-1 h-8">
            <RotateCcw className="h-3 w-3" /> Limpar
          </Button>
        </div>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6 pb-6">
              
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="productName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                      <ShoppingBag className="h-3 w-3" /> Nome do Produto
                    </FormLabel>
                    <FormControl><Input placeholder="Ex: Detox Premium" className="h-9" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="targetLanguage" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                      <Globe className="h-3 w-3" /> País de Destino
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl><SelectTrigger className="h-9"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {COUNTRIES.map(country => (<SelectItem key={country} value={country}>{country}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="templateType" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                      <LayoutTemplate className="h-3 w-3" /> Modelo da Página
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl><SelectTrigger className="h-9"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Lançamento">Lançamento</SelectItem>
                        <SelectItem value="Robusta">Robusta</SelectItem>
                        <SelectItem value="Review">Review</SelectItem>
                        <SelectItem value="Cookie">Cookie</SelectItem>
                        <SelectItem value="Lista (Top 3/5)">Lista (Top 3/5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />

                <FormField control={form.control} name="copyStyle" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                      <ShieldCheck className="h-3 w-3" /> Nível de Blindagem
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl><SelectTrigger className="h-9"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="White Hat (Conservador)">White Hat (Conservador)</SelectItem>
                        <SelectItem value="Black Hat (Agressivo)">Black Hat (Agressivo)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="buttonColor" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                      <Palette className="h-3 w-3" /> Cor Principal
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input type="color" className="w-9 h-9 p-1 bg-transparent cursor-pointer" {...field} />
                        <Input className="h-9 font-mono text-xs uppercase" {...field} />
                      </div>
                    </FormControl>
                  </FormItem>
                )} />

                <FormField control={form.control} name="officialProductUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                      <LinkIcon className="h-3 w-3" /> URL Oficial
                    </FormLabel>
                    <FormControl><Input placeholder="https://..." className="h-9" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                    <ImageIcon className="h-3 w-3" /> Mídia do Produto
                  </FormLabel>
                  <Button variant="outline" size="sm" type="button" onClick={() => fileInputRef.current?.click()} className="h-7 text-[10px] px-2">
                    <Upload className="h-3 w-3 mr-1" /> Upload WebP
                  </Button>
                  <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                </div>
                
                {productImageUrls.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2 bg-slate-50 p-2 rounded-lg border border-dashed">
                    {productImageUrls.map((url, idx) => (
                      <div key={idx} className="group relative aspect-square bg-white rounded border overflow-hidden">
                        <img src={url} alt="Prod" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-20 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 bg-slate-50 text-[10px]">
                    Nenhuma imagem enviada.
                  </div>
                )}
              </div>

              <FormField control={form.control} name="salesPageDescription" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                    <ListChecks className="h-3 w-3" /> Descrição do Produto (IA)
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Cole o texto da página de vendas aqui para extração de preços e kits..." className="min-h-[120px] resize-none text-sm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="targetUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                    <LinkIcon className="h-3 w-3" /> Link de Afiliado
                  </FormLabel>
                  <FormControl><Input placeholder="https://..." className="h-9" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="pt-4 space-y-4 border-t">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Rastreamento</h4>
                <FormField control={form.control} name="trackingLink" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                      <Activity className="h-3 w-3" /> Link de Rastreio (Opcional)
                    </FormLabel>
                    <FormControl><Input className="h-9" {...field} /></FormControl>
                  </FormItem>
                )} />

                <FormField control={form.control} name="clarityScript" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                      <Code2 className="h-3 w-3" /> Script Analytics / Clarity
                    </FormLabel>
                    <FormControl><Textarea className="min-h-[60px] font-mono text-[10px]" {...field} /></FormControl>
                  </FormItem>
                )} />
              </div>
            </div>
          </ScrollArea>

          <div className="pt-6 border-t">
            <Button type="submit" className="w-full h-12 text-sm font-bold bg-primary hover:bg-primary/90 shadow-lg" disabled={isGenerating}>
              {isGenerating ? "Processando IA..." : "CRIAR PÁGINA AGORA"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
