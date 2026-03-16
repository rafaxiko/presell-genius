'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PricingPackageSchema = z.object({
  quantity: z.string().describe('Quantidade (ex: 1, 3, 6).'),
  unitName: z.string().describe('Unidade (Potes, Frascos, etc.).'),
  price: z.string().describe('Preço exibido (ex: R$ 197,00).'),
  savings: z.string().describe('Economia real (ex: R$ 780,00 ou 50%).'),
  isBestValue: z.boolean().describe('Verdadeiro apenas para o kit de 6 unidades.'),
});

const TestimonialSchema = z.object({
  name: z.string().describe('Nome do cliente.'),
  text: z.string().describe('Depoimento focado em bem-estar e confiança, sem promessas de cura.'),
  location: z.string().describe('Localização do cliente.'),
});

const GeneratePresellContentInputSchema = z.object({
  salesPageDescription: z
    .string()
    .describe('Descrição detalhada do produto ou URL da página de vendas.'),
  targetLanguage: z
    .string()
    .describe('País de destino para identificação automática do idioma.'),
  templateType: z.enum(['Lançamento', 'Robusta', 'Review', 'Cookie', 'Lista (Top 3/5)']).describe('O layout estrutural.'),
  copyStyle: z.enum(['White Hat (Conservador)', 'Black Hat (Agressivo)']).describe('O estilo da copy.'),
});

export type GeneratePresellContentInput = z.infer<
  typeof GeneratePresellContentInputSchema
>;

const GeneratePresellContentOutputSchema = z.object({
  productName: z.string().describe('Nome oficial do produto.'),
  headline: z.string().describe('Headline magnética e complacente.'),
  subheadline: z.string().describe('Texto de apoio focado em benefícios gerais.'),
  editorialIntro: z.string().describe('Meta-texto editorial (ex: Por Redação Saúde).'),
  quickSummary: z.string().describe('Resumo rápido e profissional.'),
  patternInterrupt: z.string().describe('Texto que desafia suposições comuns.'),
  problemsSection: z.string().describe('Descrição empática de desafios comuns de saúde.'),
  whatIsSection: z.string().describe('Explicação técnica da solução.'),
  curiosityBridge: z.string().describe('Gancho para continuar a leitura.'),
  features: z.array(z.string()).describe('Características principais do produto.'),
  benefits: z.array(z.string()).describe('Benefícios emocionais e de bem-estar.'),
  pricing: z.array(PricingPackageSchema).describe('Os 3 pacotes de preço encontrados.'),
  testimonials: z.array(TestimonialSchema).describe('Depoimentos de clientes verificados.'),
  callToAction: z.string().describe('Texto do botão principal (ex: Verificar Oferta Oficial).'),
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
  prompt: `Você é um motor de extração de dados de elite especializado no sistema Nutra Affiliate SaaS.

REGRAS DE TOM E COMPLACÊNCIA (WHITE HAT):
- NUNCA use: "garantido", "cura", "milagre", "provado que", "perca X kg em Y dias".
- SEMPRE use: "pode apoiar", "está associado a", "tem sido estudado", "verificar disponibilidade".
- O tom deve ser profissional, autoritário e prestativo.

ESTRUTURA DE PREÇOS (ROBUSTA):
- Extraia exatamente 3 pacotes da descrição: Kit 1 Pote, Kit 3 Potes e Kit 6 Potes.
- O Kit de 6 unidades deve ser marcado como "isBestValue: true".
- Se o produto não for um suplemento, detecte a unidade correta (Licenças, Módulos, etc.).

IDIOMA:
- Identifique o idioma de destino baseado em: "{{{targetLanguage}}}".
- Ex: USA = English, Brasil = Portuguese, España = Spanish.
- Gere TODO o conteúdo no idioma detectado.

DESCRIÇÃO DO PRODUTO:
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
