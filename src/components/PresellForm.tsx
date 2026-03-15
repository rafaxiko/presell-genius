'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, ArrowRight, Palette, Link as LinkIcon, ListChecks, RotateCcw, Image as ImageIcon, Globe } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  salesPageDescription: z.string().min(10, 'Por favor, forneça mais detalhes sobre o produto.'),
  keySellingPoints: z.string().min(5, 'Pelo menos um ponto forte de venda é necessário.'),
  targetLanguage: z.string().min(1, 'Selecione um idioma de destino.'),
  buttonColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Deve ser uma cor hexadecimal válida.'),
  targetUrl: z.string().url('Por favor, insira uma URL válida.'),
  officialProductUrl: z.string().url('Por favor, insira uma URL válida.').optional().or(z.literal('')),
  productImageUrl: z.string().url('Por favor, insira uma URL de imagem válida.').optional().or(z.literal('')),
});

export type PresellFormValues = z.infer<typeof formSchema>;

interface PresellFormProps {
  onSubmit: (values: PresellFormValues) => void;
  onClear: () => void;
  isGenerating: boolean;
}

export function PresellForm({ onSubmit, onClear, isGenerating }: PresellFormProps) {
  const form = useForm<PresellFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salesPageDescription: '',
      keySellingPoints: '',
      targetLanguage: 'Português (Brasil)',
      buttonColor: '#2952A3',
      targetUrl: 'https://seulink.com/checkout',
      officialProductUrl: '',
      productImageUrl: '',
    },
  });

  const handleReset = () => {
    form.reset();
    onClear();
  };

  return (
    <Card className="h-full flex flex-col shadow-none border-none bg-transparent">
      <CardHeader className="space-y-1 shrink-0 px-0 pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Configuração do Workspace
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            type="button" 
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-slate-600 gap-1 h-8"
          >
            <RotateCcw className="h-3 w-3" />
            Limpar
          </Button>
        </div>
        <CardDescription className="text-xs">
          Defina os detalhes da sua oferta para que a IA crie sua página de alta conversão.
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6 pb-6">
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="targetLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <Globe className="h-3 w-3" />
                        Idioma / Mercado
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Selecione o idioma" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Português (Brasil)">Brasil 🇧🇷</SelectItem>
                          <SelectItem value="English (USA)">Estados Unidos 🇺🇸</SelectItem>
                          <SelectItem value="Spanish (Spain)">Espanha 🇪🇸</SelectItem>
                          <SelectItem value="English (Global)">Global 🌍</SelectItem>
                          <SelectItem value="French (France)">França 🇫🇷</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="buttonColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <Palette className="h-3 w-3" />
                        Cor do Botão
                      </FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input 
                            type="color" 
                            className="w-9 h-9 p-1 cursor-pointer rounded-md shrink-0 border-none bg-transparent"
                            {...field} 
                          />
                          <Input 
                            className="h-9 font-mono text-xs"
                            placeholder="#2952A3"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="salesPageDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <ListChecks className="h-3 w-3" />
                      O que você está vendendo?
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o produto, para quem ele serve e qual problema ele resolve..." 
                        className="min-h-[100px] resize-none text-sm"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="keySellingPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Benefícios & Gatilhos</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Garantia de 30 dias, Desconto exclusivo hoje..." className="h-9 text-sm" {...field} />
                    </FormControl>
                    <FormDescription className="text-[10px]">
                      Destaque os principais diferenciais. Separe por vírgulas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <LinkIcon className="h-3 w-3" />
                      Seu Link de Afiliado (Checkout)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://pay.hotmart.com/..." className="h-9 text-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="officialProductUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <LinkIcon className="h-3 w-3" />
                      URL da Página Oficial (Opcional)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://produtooficial.com" className="h-9 text-sm" {...field} />
                    </FormControl>
                    <FormDescription className="text-[10px]">
                      Para a IA tentar alinhar com a identidade visual da marca.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <ImageIcon className="h-3 w-3" />
                      URL da Imagem do Produto
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkdaimagem.jpg" className="h-9 text-sm" {...field} />
                    </FormControl>
                    <FormDescription className="text-[10px]">
                      URL direta da imagem (JPG, PNG, WEBP).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </ScrollArea>

          <div className="pt-6 border-t shrink-0">
            <Button 
              type="submit" 
              className={`w-full h-11 text-sm font-bold group bg-primary hover:bg-primary/90 transition-all shadow-md ${!isGenerating ? 'animate-pulse-button' : ''}`}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Gerando com IA...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Gerar Copy de Alta Conversão
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
