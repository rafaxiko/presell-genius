'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, ArrowRight, Palette, Link as LinkIcon, ListChecks } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const formSchema = z.object({
  salesPageDescription: z.string().min(10, 'Por favor, forneça mais detalhes sobre o produto.'),
  keySellingPoints: z.string().min(5, 'Pelo menos um ponto forte de venda é necessário.'),
  buttonColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Deve ser uma cor hexadecimal válida.'),
  targetUrl: z.string().url('Por favor, insira uma URL válida.'),
});

export type PresellFormValues = z.infer<typeof formSchema>;

interface PresellFormProps {
  onSubmit: (values: PresellFormValues) => void;
  isGenerating: boolean;
}

export function PresellForm({ onSubmit, isGenerating }: PresellFormProps) {
  const form = useForm<PresellFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salesPageDescription: '',
      keySellingPoints: '',
      buttonColor: '#2952A3',
      targetUrl: 'https://seulink.com/checkout',
    },
  });

  return (
    <Card className="shadow-lg border-none">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Configurar Gerador
        </CardTitle>
        <CardDescription>
          Insira os detalhes da oferta e a IA criará sua copy de pré-venda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="salesPageDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <ListChecks className="h-4 w-4" />
                    Descrição do Produto/Oferta
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o produto, a dor que ele resolve e para quem ele é..." 
                      className="min-h-[120px] resize-none"
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
                  <FormLabel>Principais Benefícios</FormLabel>
                  <FormControl>
                    <Input placeholder="Acesso vitalício, Suporte VIP, Bônus exclusivo..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Separe os pontos por vírgulas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="buttonColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Cor do Botão (CTA)
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input 
                          type="color" 
                          className="w-12 h-10 p-1 cursor-pointer"
                          {...field} 
                        />
                        <Input 
                          className="font-mono"
                          placeholder="#000000"
                          {...field} 
                        />
                      </div>
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
                    <FormLabel className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" />
                      Link do Checkout/Venda
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold group bg-primary hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Criando Copy Poderosa...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Gerar Página de Pré-venda
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
