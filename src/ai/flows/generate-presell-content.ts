'use server';
/**
 * @fileOverview Fluxo Genkit para gerar conteúdo de pré-venda.
 * Focado em consistência linguística absoluta baseada no país de destino.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePresellContentInputSchema = z.object({
  salesPageDescription: z
    .string()
    .describe('Descrição detalhada do produto ou serviço.'),
  targetLanguage: z
    .string()
    .describe('O país de destino (ex: Brasil, Estados Unidos, Espanha).'),
  templateType: z.enum(['Launch', 'Robust', 'Review', 'List']).describe('O tipo de estratégia de conversão.'),
});
export type GeneratePresellContentInput = z.infer<
  typeof GeneratePresellContentInputSchema
>;

const PricingOptionSchema = z.object({
  quantity: z.string(),
  discount: z.string(),
  price: z.string(),
  isBestValue: z.boolean(),
});

const GeneratePresellContentOutputSchema = z.object({
  headline: z.string().describe('Headline magnética.'),
  subheadline: z.string().describe('Texto de apoio persuasivo.'),
  bodyCopy: z.string().describe('Corpo do texto focado em aquecimento.'),
  benefits: z.array(z.string()).describe('Benefícios principais.'),
  ingredients: z.array(z.string()).optional().describe('Ingredientes ou componentes.'),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional().describe('FAQs.'),
  pros: z.array(z.string()).optional().describe('Pontos positivos (para Review).'),
  cons: z.array(z.string()).optional().describe('Pontos negativos (para Review).'),
  comparisonTable: z.array(z.object({ 
    feature: z.string(), 
    product: z.string(), 
    competitor: z.string() 
  })).optional().describe('Dados comparativos (para Lista).'),
  callToAction: z.string().describe('Texto do botão.'),
  pricing: z.array(PricingOptionSchema).optional().describe('Opções de preço.'),
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
  prompt: `Você é um Copywriter de elite focado em tráfego direto para o país: {{{targetLanguage}}}.

INSTRUÇÃO DE IDIOMA CRÍTICA:
- Se o país for "Estados Unidos", gere TODO o conteúdo estritamente em INGLÊS.
- Se o país for "Brasil" ou "Portugal", gere TODO o conteúdo em PORTUGUÊS.
- Se o país for "Espanha" ou "México", gere TODO o conteúdo em ESPANHOL.
- NÃO misture idiomas. Use gírias e gatilhos mentais locais do país {{{targetLanguage}}}.

ESTRATÉGIA DO TEMPLATE:
- Launch: Curiosidade, escassez e tom de "oportunidade única".
- Robust: Foco em autoridade, provas, ingredientes e oferta de pacotes.
- Review: Tom jornalístico, sincero, analisando se o produto realmente funciona.
- List: Comparativo onde este produto é o vencedor absoluto.

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
