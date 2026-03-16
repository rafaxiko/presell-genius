'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePresellContentInputSchema = z.object({
  salesPageDescription: z
    .string()
    .describe('Detailed description of the product or service.'),
  targetLanguage: z
    .string()
    .describe('The target country for language identification.'),
  templateType: z.enum(['Lançamento', 'Robusta', 'Review', 'Cookie', 'Lista (Top 3/5)']).describe('The structural layout.'),
  copyStyle: z.enum(['White Hat (Conservador)', 'Black Hat (Agressivo)']).describe('The intensity of the copy.'),
});
export type GeneratePresellContentInput = z.infer<
  typeof GeneratePresellContentInputSchema
>;

const GeneratePresellContentOutputSchema = z.object({
  headline: z.string().describe('Magnetic editorial or sales headline in target language.'),
  subheadline: z.string().describe('Supporting summary text.'),
  editorialIntro: z.string().describe('Author and date meta text (e.g., By Health Desk).'),
  quickSummary: z.string().describe('Brief summary box content or punchy intro.'),
  patternInterrupt: z.string().describe('Text that challenges assumptions.'),
  problemsSection: z.string().describe('Empathetic pain point description or problem focus.'),
  whatIsSection: z.string().describe('Clear explanation of the solution.'),
  curiosityBridge: z.string().describe('Hook to keep them reading.'),
  features: z.array(z.string()).describe('Key features.'),
  benefits: z.array(z.string()).describe('Emotional benefits.'),
  pricing: z.array(z.object({
    quantity: z.string().describe('Quantity of items (e.g. 1, 3, 6).'),
    unitName: z.string().describe('Unit type (Bottles, Pots, Units).'),
    price: z.string().describe('Display price with currency.'),
    savings: z.string().describe('Amount saved (e.g. 40%, $50).'),
    isBestValue: z.boolean().describe('If this is the main focus kit.'),
  })).describe('Dynamic pricing packages found in text.'),
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
  prompt: `Você é um copywriter sênior especializado no Nutra Presell System v6.

REGRAS DE LAYOUT:
- Se Modelo for "Review": Use tom Editorial, investigativo e imparcial. A página deve parecer uma notícia ou análise de portal.
- Se Modelo for "Robusta": Use tom de Página de Vendas direta, com foco em benefícios, autoridade e conversão.

REGRAS DE BLINDAGEM (TONALIDADE):
- Se "Black Hat (Agressivo)": Use Headlines com promessas fortes, urgência máxima, escassez e palavras de impacto.
- Se "White Hat (Conservador)": Use tom moderado, jornalístico, focado em ciência e fatos.

EXTRAÇÃO DE DADOS:
- Analise a descrição do produto e extraia EXATAMENTE os kits de preço citados (1, 3, 6 unidades, etc).
- Identifique a unidade correta (Potes, Frascos, Unidades, etc).
- Não invente kits que não estão no texto.

IDIOMA:
O conteúdo deve ser 100% no idioma de: "{{{targetLanguage}}}".
- Se Estados Unidos/UK/Canadá: Inglês.
- Se Brasil/Portugal: Português.
- Se México/Espanha: Espanhol.

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
