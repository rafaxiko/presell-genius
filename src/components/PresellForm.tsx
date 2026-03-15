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
import { Sparkles, ArrowRight, Palette, Link as LinkIcon, ListChecks, RotateCcw, Globe, Activity, Code2, LayoutTemplate, ShoppingBag } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  productName: z.string().min(2, 'Informe o nome do produto.'),
  salesPageDescription: z.string().min(20, 'Forneça uma descrição detalhada para a IA.'),
  officialProductUrl: z.string().url('A URL da página oficial é obrigatória.'),
  targetLanguage: z.string().min(1, 'Selecione um país.'),
  templateType: z.enum(['Launch', 'Robust', 'Review', 'List']),
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

export function PresellForm({ onSubmit, onClear, isGenerating }: PresellFormProps) {
  const form = useForm<PresellFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: '',
      salesPageDescription: '',
      officialProductUrl: '',
      targetLanguage: 'Brasil',
      templateType: 'Robust',
      buttonColor: '#2952A3',
      targetUrl: 'https://seulink.com',
      trackingLink: '',
      clarityScript: '',
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
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" />
            Configurar Gerador
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
          Personalize sua estratégia e deixe a IA cuidar da copy de alta conversão.
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6 pb-6">
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <ShoppingBag className="h-3 w-3" />
                        Nome do Produto
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Detox Premium" className="h-9 text-sm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <Globe className="h-3 w-3" />
                        País de Destino
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Selecione o país" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COUNTRIES.map(country => (
                            <SelectItem key={country} value={country}>{country}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="templateType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <LayoutTemplate className="h-3 w-3" />
                        Modelo da Página
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Escolha o modelo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Launch">Lançamento</SelectItem>
                          <SelectItem value="Robust">Robusta</SelectItem>
                          <SelectItem value="Review">Review (Análise)</SelectItem>
                          <SelectItem value="List">Lista (Top 3/5)</SelectItem>
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
                          <Input type="color" className="w-9 h-9 p-1 rounded shrink-0 border-none bg-transparent cursor-pointer" {...field} />
                          <Input className="h-9 font-mono text-xs uppercase" placeholder="#2952A3" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="officialProductUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <LinkIcon className="h-3 w-3 text-primary" />
                      URL da Página Oficial *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://site-oficial.com" className="h-9 text-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salesPageDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <ListChecks className="h-3 w-3" />
                      Descrição do Produto
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Cole aqui o texto da página de vendas para que a IA extraia os benefícios automaticamente." 
                        className="min-h-[140px] resize-none text-sm"
                        {...field} 
                      />
                    </FormControl>
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
                      Link de Checkout / Afiliado
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://checkout.suaplataforma.com/..." className="h-9 text-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 space-y-4 border-t">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Scripts & Rastreio</h4>
                <FormField
                  control={form.control}
                  name="trackingLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <Activity className="h-3 w-3" />
                        Link de Rastreamento (Opcional)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://track.com/..." className="h-9 text-sm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clarityScript"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <Code2 className="h-3 w-3" />
                        Script de Análise (Clarity/Hotjar)
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="<script>...</script>" 
                          className="min-h-[60px] font-mono text-[10px] resize-none bg-slate-50"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </ScrollArea>

          <div className="pt-6 border-t shrink-0">
            <Button 
              type="submit" 
              className={`w-full h-12 text-sm font-bold group bg-primary hover:bg-primary/90 transition-all shadow-lg ${!isGenerating ? 'animate-pulse-button' : ''}`}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Gerando Copy...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  CRIAR PÁGINA AGORA
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
