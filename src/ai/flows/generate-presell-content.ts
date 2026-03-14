'use server';
/**
 * @fileOverview Um fluxo Genkit que gera conteúdo de página de pré-venda de alta conversão em Português do Brasil.
 *
 * - generatePresellContent - Uma função que lida com o processo de geração de conteúdo.
 * - GeneratePresellContentInput - O tipo de entrada para a função generatePresellContent.
 * - GeneratePresellContentOutput - O tipo de retorno para a função generatePresellContent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePresellContentInputSchema = z.object({
  salesPageDescription: z
    .string()
    .describe(
      'Uma descrição detalhada do produto ou serviço para a página de vendas.'
    ),
  keySellingPoints: z
    .array(z.string())
    .describe('Uma lista de pontos-chave de venda para destacar no conteúdo.'),
});
export type GeneratePresellContentInput = z.infer<
  typeof GeneratePresellContentInputSchema
>;

const GeneratePresellContentOutputSchema = z.object({
  headline: z.string().describe('Uma headline de alta conversão em Português.'),
  bodyCopy: z.string().describe('Um texto de apoio (copy) envolvente em Português.'),
  callToAction: z.string().describe('Uma chamada para ação (CTA) poderosa em Português.'),
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
  prompt: `Você é um copywriter especialista em marketing de afiliados no Brasil, focado em alta conversão.

Sua tarefa é gerar uma headline matadora, um corpo de texto persuasivo (copy de pré-venda) e uma chamada para ação (CTA) forte com base na descrição do produto e nos pontos de venda fornecidos.

O conteúdo deve ser escrito INTEIRAMENTE EM PORTUGUÊS DO BRASIL, usando um tom amigável, mas extremamente persuasivo. O objetivo da página de pré-venda é "aquecer" o tráfego frio, quebrando as principais objeções e gerando curiosidade antes do clique para a página de vendas oficial.

Use gatilhos mentais como autoridade, escassez ou prova social se fizer sentido com o contexto.

Descrição da Página de Vendas/Produto:
{{{salesPageDescription}}}

Pontos Fortes de Venda:
{{#each keySellingPoints}}
- {{{this}}}
{{/each}}

Gere o conteúdo em formato JSON de acordo com o esquema de saída.`,
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
