'use server';
/**
 * @fileOverview Genkit flow to generate Nutra Presell System v6 content.
 * Investigative editorial tone, multi-language support, and copy style control.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePresellContentInputSchema = z.object({
  salesPageDescription: z
    .string()
    .describe('Detailed description of the product or service.'),
  targetLanguage: z
    .string()
    .describe('The target country from the exhaustive list.'),
  templateType: z.enum(['Launch', 'Robust', 'Review', 'List']).describe('The conversion strategy style.'),
  copyStyle: z.enum(['Conservador', 'Agressivo']).describe('The intensity of the sales copy.'),
});
export type GeneratePresellContentInput = z.infer<
  typeof GeneratePresellContentInputSchema
>;

const PricingOptionSchema = z.object({
  quantity: z.string().describe('Exact quantity and unit name from text.'),
  discount: z.string().describe('Discount text or savings explicitly mentioned.'),
  price: z.string().describe('The formatted price exactly as in text.'),
  isBestValue: z.boolean().describe('Whether this is the recommended package.'),
});

const GeneratePresellContentOutputSchema = z.object({
  headline: z.string().describe('Magnetic editorial headline in target language.'),
  subheadline: z.string().describe('Supporting summary text.'),
  editorialIntro: z.string().describe('Author and date meta text in target language.'),
  quickSummary: z.string().describe('Brief "Why read this" box content.'),
  patternInterrupt: z.string().describe('Text that challenges user assumptions.'),
  problemsSection: z.string().describe('Empathetic description of the pain point.'),
  whatIsSection: z.string().describe('Clear explanation of the product/solution.'),
  curiosityBridge: z.string().describe('Hook to keep them reading about results.'),
  features: z.array(z.string()).describe('List of key features.'),
  benefits: z.array(z.string()).describe('List of emotional benefits.'),
  comparisonTable: z.array(z.object({ 
    feature: z.string(), 
    product: z.string(), 
    competitor: z.string() 
  })).optional(),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
  testimonials: z.array(z.object({
    name: z.string(),
    text: z.string(),
    rating: z.number().min(1).max(5)
  })).optional(),
  pricing: z.array(PricingOptionSchema).optional(),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  callToAction: z.string().describe('Button text in target language.'),
});
export type GeneratePresellContentOutput = z.infer<
  typeof GeneratePresellContentOutputSchema
>;

export async function generatePresellContent(
  input: GeneratePresellContentInput
): Promise<GeneratePresellContentOutput> {
  return generatePresellContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePresellContentPrompt',
  input: {schema: GeneratePresellContentInputSchema},
  output: {schema: GeneratePresellContentOutputSchema},
  prompt: `Você é um Jornalista Investigativo Sênior especializado em saúde e bem-estar (Nutra Presell System v6).

INSTRUÇÃO DE IDIOMA:
Gere TODO o conteúdo no idioma oficial de: "{{{targetLanguage}}}". 
- Se for Estados Unidos/Reino Unido/Canadá/Austrália: 100% Inglês.
- Se for Brasil/Portugal/Angola: 100% Português.
- Se for México/Espanha/Argentina: 100% Espanhol.

TONALIDADE (Invisible Copy):
Estilo selecionado: {{{copyStyle}}}

Se "Conservador":
- Seja neutro, empático e informativo.
- NÃO use linguagem de vendas agressiva nas seções editoriais.
- Escreva como se fosse um portal de notícias independente analisando se o produto funciona.

Se "Agressivo":
- Use Headlines de alto impacto com Power Words.
- Foque mais em resultados imediatos e na dor latente.
- Aumente o uso de palavras de urgência no final ("Apenas Hoje", "Estoque Limitado").
- Use uma linguagem mais direta e persuasiva, mas mantenha a moldura de review.

ESTRUTURA DE 27 SEÇÕES (Resumo):
1. Headline Editorial (Magnética e curiosa).
2. Intro Editorial (Autor e Data).
3. Resumo Rápido (Por que ler isso?).
4. Interrupção de Padrão (Por que métodos comuns falham).
5. Seção de Problemas (Empatia com a dor do leitor).
6. O que é o produto (Explicação lógica).
7. Ponte de Curiosidade (Resultados ocultos).
8. Benefícios e Funcionalidades.
9. Tabela Comparativa (Produto vs Outros).
10. Testemunhos reais.
11. Ofertas de Preço (Extraídas da descrição).
12. Veredito Final e FAQ.

Descrição do Produto:
{{{salesPageDescription}}}`,
});

const generatePresellContentFlow = ai.defineFlow(
  {
    name: 'generatePresellContentFlow',
    inputSchema: GeneratePresellContentInputSchema,
    outputSchema: GeneratePresellContentOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
