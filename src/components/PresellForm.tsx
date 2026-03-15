'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, ArrowRight, Palette, Link as LinkIcon, ListChecks, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  salesPageDescription: z.string().min(10, 'Por favor, forneça mais detalhes sobre o produto.'),
  keySellingPoints: z.string().min(5, 'Pelo menos um ponto forte de venda é necessário.'),
  buttonColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Deve ser uma cor hexadecimal válida.'),
  targetUrl: z.string().url('Por favor, insira uma URL válida.'),
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
      buttonColor: '#2952A3',
      targetUrl: 'https://seulink.com/checkout',
      productImageUrl: '',
    },
  });

  const handleReset = () => {
    form.reset();
    onClear();
  };

  return (
    <Card className="h-full flex flex-col shadow-lg border-none overflow-hidden bg-white">
      <CardHeader className="space-y-1 shrink-0 pb-4 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Configuração
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            type="button" 
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-slate-600 gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Limpar
          </Button>
        </div>
        <CardDescription className="text-xs">
          Defina os detalhes da sua oferta para a IA.
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-6 py-6">
              <FormField
                control={form.control}
                name="salesPageDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <ListChecks className="h-3.5 w-3.5" />
                      O que você está vendendo?
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ex: Curso de Emagrecimento para mães ocupadas..." 
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
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Benefícios / Gatilhos</FormLabel>
                    <FormControl>
                      <Input placeholder="Garantia 30 dias, Desconto de 50%, Bônus VIP..." className="text-sm" {...field} />
                    </FormControl>
                    <FormDescription className="text-[10px]">
                      Destaque o que faz o lead querer clicar. Separe por vírgulas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="targetUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <LinkIcon className="h-3.5 w-3.5" />
                        Link de Destino
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://pay.hotmart.com/..." className="text-sm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <ImageIcon className="h-3.5 w-3.5" />
                        URL da Imagem
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkdaimagem.jpg" className="text-sm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="buttonColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <Palette className="h-3.5 w-3.5" />
                      Cor do Botão de Chamada
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input 
                          type="color" 
                          className="w-10 h-10 p-1 cursor-pointer rounded-lg shrink-0"
                          {...field} 
                        />
                        <Input 
                          className="font-mono text-sm"
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
          </ScrollArea>

          <div className="p-6 border-t bg-slate-50 shrink-0">
            <Button 
              type="submit" 
              className={`w-full h-12 text-base font-bold group bg-primary hover:bg-primary/90 transition-all shadow-lg ${!isGenerating ? 'animate-pulse-button' : ''}`}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Gerando com IA...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Gerar Página Agora
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}