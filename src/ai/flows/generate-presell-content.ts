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
  headline: z.string().describe('Magnetic editorial headline in target language.'),
  subheadline: z.string().describe('Supporting summary text.'),
  editorialIntro: z.string().describe('Author and date meta text.'),
  quickSummary: z.string().describe('Brief summary box content.'),
  patternInterrupt: z.string().describe('Text that challenges assumptions.'),
  problemsSection: z.string().describe('Empathetic pain point description.'),
  whatIsSection: z.string().describe('Clear explanation of the solution.'),
  curiosityBridge: z.string().describe('Hook to keep them reading.'),
  features: z.array(z.string()).describe('Key features.'),
  benefits: z.array(z.string()).describe('Emotional benefits.'),
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

IDIOMA:
O conteúdo deve ser 100% no idioma de: "{{{targetLanguage}}}".
- Se Estados Unidos/Canadá/UK/Austrália: Inglês.
- Se Brasil/Portugal: Português.
- Se México/Espanha: Espanhol.

ESTILO:
Nível de Blindagem: {{{copyStyle}}}
Modelo: {{{templateType}}}

Se "Black Hat (Agressivo)": Use Headlines agressivas, urgência extrema, palavras de poder e gatilhos de medo.
Se "White Hat (Conservador)": Use a estrutura editorial v6 (Investigativo, Empático, Lógico, tom de portal de notícias).

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
