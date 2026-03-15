'use server';
/**
 * @fileOverview Genkit flow to generate high-conversion presell content.
 * Advanced language detection and multi-country support.
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
  quantity: z.string(),
  discount: z.string(),
  price: z.string(),
  isBestValue: z.boolean(),
});

const GeneratePresellContentOutputSchema = z.object({
  headline: z.string().describe('Magnetic headline.'),
  subheadline: z.string().describe('Persuasive supporting text.'),
  bodyCopy: z.string().describe('Body copy focused on warming up the audience.'),
  benefits: z.array(z.string()).describe('Key benefits.'),
  ingredients: z.array(z.string()).optional().describe('Ingredients or components.'),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional().describe('FAQs.'),
  pros: z.array(z.string()).optional().describe('Positive points (for Review).'),
  cons: z.array(z.string()).optional().describe('Points of concern (for Review).'),
  comparisonTable: z.array(z.object({ 
    feature: z.string(), 
    product: z.string(), 
    competitor: z.string() 
  })).optional().describe('Comparative data (for List).'),
  callToAction: z.string().describe('Button text.'),
  pricing: z.array(PricingOptionSchema).optional().describe('Pricing packages.'),
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
  prompt: `Você é um Copywriter de elite focado em tráfego direto para mercados globais.

INSTRUÇÃO DE IDIOMA E LOCALIZAÇÃO:
Analise o país selecionado: "{{{targetLanguage}}}" e gere a saída no idioma predominante desse local.

GRUPOS DE IDIOMAS:
- PORTUGUÊS: Brasil, Portugal, Angola.
- INGLÊS: EUA, Reino Unido, Canadá, Austrália, Irlanda, Nova Zelândia, África do Sul, Singapura, Hong Kong, Índia, Filipinas.
- ESPANHOL: Argentina, Bolívia, Chile, Colômbia, Costa Rica, Equador, Espanha, Guatemala, Honduras, México, Nicarágua, Panamá, Paraguai, Peru, Porto Rico, Uruguai, Venezuela.
- FRANCÊS: França, Bélgica, Suíça, Luxemburgo.
- ALEMÃO: Alemanha, Áustria.
- ITALIANO: Itália.
- OUTROS: Siga o idioma oficial do país (ex: Japão -> Japonês).

REGRAS DE OURO:
1. NUNCA misture idiomas. O texto deve ser 100% no idioma de destino.
2. Use gírias e gatilhos mentais locais do país {{{targetLanguage}}}.
3. O tom deve ser de "aquecimento" para a página oficial.

ESTRATÉGIA DO TEMPLATE:
- Lançamento (Launch): Curiosidade, escassez e tom de "oportunidade única".
- Robusta (Robust): Foco em autoridade, provas, ingredientes e oferta de pacotes.
- Review: Tom editorial, analisando sinceramente os prós e contras.
- Lista (List): Comparativo oficial onde este produto vence marcas comuns.

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
