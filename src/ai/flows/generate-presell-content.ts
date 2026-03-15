'use server';
/**
 * @fileOverview Genkit flow to generate high-conversion presell content.
 * Extracted pricing data and multi-language support.
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
});
export type GeneratePresellContentInput = z.infer<
  typeof GeneratePresellContentInputSchema
>;

const PricingOptionSchema = z.object({
  quantity: z.string().describe('Exact quantity and unit name from text (e.g., 01 Pote, 3 Garrafas, 01 Módulo).'),
  discount: z.string().describe('Discount text or savings explicitly mentioned (e.g., 50% OFF, ECONOMIZE R$ 200).'),
  price: z.string().describe('The formatted price exactly as in text (e.g., R$ 197, $47).'),
  isBestValue: z.boolean().describe('Whether this is the high-conversion package (usually the largest quantity).'),
});

const GeneratePresellContentOutputSchema = z.object({
  headline: z.string().describe('Magnetic headline in target language.'),
  subheadline: z.string().describe('Persuasive supporting text in target language.'),
  bodyCopy: z.string().describe('Body copy focused on warming up the audience in target language.'),
  benefits: z.array(z.string()).describe('Key benefits in target language.'),
  ingredients: z.array(z.string()).optional().describe('Ingredients or components if applicable.'),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional().describe('FAQs in target language.'),
  pros: z.array(z.string()).optional().describe('Positive points (for Review).'),
  cons: z.array(z.string()).optional().describe('Points of concern (for Review).'),
  comparisonTable: z.array(z.object({ 
    feature: z.string(), 
    product: z.string(), 
    competitor: z.string() 
  })).optional().describe('Comparative data (for List).'),
  callToAction: z.string().describe('Button text in target language.'),
  pricing: z.array(PricingOptionSchema).optional().describe('ONLY extract packages explicitly mentioned in the description. Do NOT invent packages if they are not in the text.'),
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
  prompt: `Você é um Copywriter de elite focado em tráfego direto global.

INSTRUÇÃO DE IDIOMA:
Gere TODO o conteúdo no idioma oficial de: "{{{targetLanguage}}}". Sem misturar idiomas.

REGRAS CRÍTICAS DE PRECIFICAÇÃO:
1. EXTRAIA APENAS O QUE EXISTE: Analise a "Descrição do Produto" e identifique os kits de venda.
2. ZERO ALUCINAÇÃO: Se a descrição mencionar apenas 1 kit, gere apenas 1 card de preço. Se mencionar 2, gere 2. NUNCA invente um terceiro kit (ex: 6 unidades) se ele não estiver no texto.
3. UNIDADES REAIS: Use a nomenclatura exata do texto (Potes, Garrafas, Unidades, Módulos, Licenças, etc.).
4. PREÇOS REAIS: Extraia os valores exatos. Se não houver preço nenhum no texto, deixe o campo 'price' vazio ou com "Consultar Valor".

ESTRATÉGIA DO TEMPLATE:
- Lançamento (Launch): Curiosidade e escassez.
- Robusta (Robust): Foco em autoridade e oferta clara.
- Review: Análise editorial sincera.
- Lista (List): Comparativo onde este produto vence.

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
