'use server';
/**
 * @fileOverview Fluxo Genkit que gera conteúdo estruturado para 4 tipos de templates.
 * Extrai benefícios, ingredientes, FAQs e comparativos da descrição do produto.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePresellContentInputSchema = z.object({
  salesPageDescription: z
    .string()
    .describe('Descrição detalhada do produto ou serviço.'),
  targetLanguage: z
    .string()
    .describe('O idioma em que o conteúdo deve ser gerado.'),
  templateType: z.enum(['Launch', 'Robust', 'Review', 'List']).describe('O tipo de estratégia de conversão selecionado.'),
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
  headline: z.string().describe('Headline magnética de alta conversão.'),
  subheadline: z.string().describe('Texto de apoio persuasivo.'),
  bodyCopy: z.string().describe('Corpo do texto focado em "esquentar" o lead.'),
  benefits: z.array(z.string()).describe('Lista de 3-5 benefícios principais.'),
  ingredients: z.array(z.string()).optional().describe('Lista de ingredientes ou componentes (se aplicável).'),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional().describe('Perguntas e respostas frequentes.'),
  pros: z.array(z.string()).optional().describe('Pontos positivos para o template de Review.'),
  cons: z.array(z.string()).optional().describe('Pontos negativos "leves" para dar autoridade ao Review.'),
  comparisonTable: z.array(z.object({ 
    feature: z.string(), 
    product: z.string(), 
    competitor: z.string() 
  })).optional().describe('Dados para tabela comparativa no template de Lista.'),
  callToAction: z.string().describe('Chamada para ação urgente.'),
  pricing: z.array(PricingOptionSchema).optional().describe('Sugestões de pacotes de preço (1, 3, 6 unidades).'),
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
  prompt: `Você é um copywriter de elite especializado em marketing direto e afiliados.
Sua missão é criar uma página de pré-venda (presell) baseada no produto fornecido.

ESTRATÉGIA DE CONVERSÃO: {{{templateType}}}
IDIOMA: {{{targetLanguage}}}

Diretrizes por Template:
- Launch: Foco em curiosidade extrema, antecipação e escassez. 
- Robust: O pacote completo. Prove valor, mostre ingredientes/componentes, prova social e ofertas múltiplas.
- Review: Estilo editorial/notícia. Tonalidade pessoal: "Será que o {{{productName}}} funciona mesmo?". Inclua prós e contras honestos.
- List: Estilo comparativo "Top 3". O produto atual DEVE ser o #1 da lista.

CONTEÚDO DEVE SER TOTALMENTE EM: {{{targetLanguage}}}.

Descrição do Produto:
{{{salesPageDescription}}}

Gere o JSON estruturado contendo todos os campos necessários para o template selecionado.`,
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
