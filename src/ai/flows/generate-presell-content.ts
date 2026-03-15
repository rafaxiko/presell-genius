'use server';
/**
 * @fileOverview Fluxo Genkit que gera conteúdo estruturado para 4 tipos de templates.
 * Focado em 100% de consistência linguística no idioma alvo.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePresellContentInputSchema = z.object({
  salesPageDescription: z
    .string()
    .describe('Descrição detalhada do produto ou serviço.'),
  targetLanguage: z
    .string()
    .describe('O país ou idioma de destino (ex: Brasil, Estados Unidos, Espanha).'),
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
  headline: z.string().describe('Headline magnética e impactante.'),
  subheadline: z.string().describe('Texto de apoio persuasivo.'),
  bodyCopy: z.string().describe('Corpo do texto focado em convencimento e aquecimento.'),
  benefits: z.array(z.string()).describe('Lista de benefícios principais do produto.'),
  ingredients: z.array(z.string()).optional().describe('Lista de componentes ou ingredientes se for suplemento/físico.'),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional().describe('Dúvidas frequentes.'),
  pros: z.array(z.string()).optional().describe('Pontos positivos para o template de Review.'),
  cons: z.array(z.string()).optional().describe('Pontos negativos (não críticos) para dar autoridade ao Review.'),
  comparisonTable: z.array(z.object({ 
    feature: z.string(), 
    product: z.string(), 
    competitor: z.string() 
  })).optional().describe('Dados para tabela comparativa no template de Lista.'),
  callToAction: z.string().describe('Texto curto e urgente para o botão principal.'),
  pricing: z.array(PricingOptionSchema).optional().describe('Opções de pacotes (1, 3, 6 unidades).'),
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
  prompt: `Você é um copywriter especialista em tráfego pago e afiliados, com foco em conversão imediata.

SUA TAREFA:
Gere os textos para uma página de pré-venda (presell) baseando-se na descrição do produto abaixo.

REGRAS CRÍTICAS:
1. IDIOMA: Todo o conteúdo gerado DEVE estar 100% no idioma falado em: {{{targetLanguage}}}. Não misture inglês se o alvo for Brasil, Espanha, etc.
2. ESTRATÉGIA: Use o modelo {{{templateType}}}.
   - Launch: Foco em curiosidade, antecipação e escassez.
   - Robust: Modelo completo, focado em prova social, ingredientes, benefícios e oferta múltipla.
   - Review: Tom jornalístico/editorial. "Será que funciona?". Liste prós e contras reais.
   - List: Ranking comparativo. O produto atual DEVE ser o #1 campeão recomendado.
3. CONTEÚDO: Extraia benefícios e detalhes técnicos da descrição fornecida. Seja persuasivo e use gatilhos mentais adequados ao mercado de {{{targetLanguage}}}.

Descrição do Produto:
{{{salesPageDescription}}}

Gere o JSON estruturado para alimentar o template selecionado.`,
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
