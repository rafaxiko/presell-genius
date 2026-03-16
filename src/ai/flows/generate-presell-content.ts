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

REGRAS DE LAYOUT E ARQUITETURA:
- Se Modelo for "Robusta": Siga a estrutura de "Sales Page" (Men Balance Pro / Skin&Gut). Foco em conversão direta.
- Se Modelo for "Review": Siga a estrutura "Editorial Nutra v6" (27 seções modulares). Foco em investigação e autoridade.

DIRETRIZES DE TONALIDADE (BLINDAGEM):
- Se "White Hat (Conservador)": Use o tom AlphaFuel. Profissional, autoritário. Palavras-chave: "Suporte", "Equilíbrio", "Vitalidade", "Bem-estar", "Cuidado". Evite promessas exageradas.
- Se "Black Hat (Agressivo)": Use o tom ED/Skin TXT. Alto impacto, urgência máxima. Use estatísticas agressivas (ex: "92% das pessoas julgam..."). Foco em resultados imediatos e transformações drásticas.

EXTRAÇÃO DE DADOS:
- Analise a descrição e extraia EXATAMENTE os kits de preço.
- Identifique a unidade correta (Potes, Frascos, Unidades, Licenças, Módulos).
- Se for curso, mude unidade para "Módulos" ou "Níveis".

IDIOMA:
O conteúdo deve ser 100% no idioma de: "{{{targetLanguage}}}".
- USA/UK/Canadá: Inglês.
- Brasil/Portugal: Português.
- México/Espanha: Espanhol.

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
