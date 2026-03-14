
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, ArrowRight, Palette, Link as LinkIcon, ListChecks } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const formSchema = z.object({
  salesPageDescription: z.string().min(10, 'Please provide more detail about the product.'),
  keySellingPoints: z.string().min(5, 'At least one key selling point is required.'),
  buttonColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color.'),
  targetUrl: z.string().url('Please enter a valid URL.'),
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
      targetUrl: 'https://example.com/checkout',
    },
  });

  return (
    <Card className="shadow-lg border-none">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Configure Generator
        </CardTitle>
        <CardDescription>
          Input your product details and the AI will craft your presell page.
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
                    Product Description
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your product, service, and who it's for..." 
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
                  <FormLabel>Key Selling Points</FormLabel>
                  <FormControl>
                    <Input placeholder="Fast delivery, 24/7 Support, Eco-friendly..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Separate points with commas.
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
                      Button Color
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
                      Target Link
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
                  Generating Copy...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Generate Presell Page
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
