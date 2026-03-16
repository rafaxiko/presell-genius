'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PricingPackageSchema = z.object({
  quantity: z.string().describe('Quantidade (ex: 1, 3, 6).'),
  unitName: z.string().describe('Unidade (Potes, Frascos, Licenças).'),
  price: z.string().describe('Preço exibido (ex: R$ 197,00).'),
  savings: z.string().describe('Economia real (ex: R$ 780,00 ou 50%).'),
  isBestValue: z.boolean().describe('Verdadeiro apenas para o kit de 6 unidades.'),
  isMostPopular: z.boolean().describe('Verdadeiro para o kit de 3 unidades.'),
  totalPrice: z.string().optional().describe('Preço total do pacote.'),
});

const TestimonialSchema = z.object({
  name: z.string().describe('Nome do cliente.'),
  text: z.string().describe('Depoimento focado em estilo de vida e confiança, sem promessas de cura.'),
  location: z.string().describe('Localização do cliente.'),
});

const FAQItemSchema = z.object({
  question: z.string().describe('Pergunta comum do cliente.'),
  answer: z.string().describe('Resposta editorial e segura (White Hat).'),
});

const IngredientSchema = z.object({
  name: z.string().describe('Nome do ingrediente principal.'),
  description: z.string().describe('Benefício principal focado em suporte à saúde.'),
});

const BonusSchema = z.object({
  title: z.string().describe('Título do bônus.'),
  value: z.string().describe('Valor estimado do bônus (ex: R$ 97,00).'),
  description: z.string().describe('Descrição curta do que o bônus oferece.'),
  enabled: z.boolean().describe('Se o bônus foi encontrado na descrição.'),
});

const GeneratePresellContentInputSchema = z.object({
  salesPageDescription: z
    .string()
    .describe('Descrição detalhada do produto ou URL da página de vendas.'),
  targetLanguage: z
    .string()
    .describe('País de destino para identificação automática do idioma.'),
  templateType: z.enum(['Lançamento', 'Robusta', 'Review', 'Cookie', 'Lista (Top 3/5)']).describe('O layout estrutural.'),
  copyStyle: z.enum(['White Hat (Conservador)', 'Black Hat (Agressivo)']).describe('O nível de blindagem.'),
});

export type GeneratePresellContentInput = z.infer<
  typeof GeneratePresellContentInputSchema
>;

const GeneratePresellContentOutputSchema = z.object({
  productName: z.string().describe('Nome oficial do produto.'),
  primaryColor: z.string().describe('Cor principal da marca em formato HEX (ex: #2952A3).'),
  headline: z.string().describe('Headline magnética e complacente.'),
  subheadline: z.string().describe('Texto de apoio focado em benefícios gerais.'),
  editorialIntro: z.string().describe('Meta-texto editorial.'),
  quickSummary: z.string().describe('Resumo rápido e profissional.'),
  patternInterrupt: z.string().describe('Texto que desafia suposições comuns.'),
  problemsSection: z.string().describe('Descrição empática de desafios comuns.'),
  whatIsSection: z.string().describe('Explicação técnica da solução.'),
  curiosityBridge: z.string().describe('Gancho para continuar a leitura.'),
  features: z.array(z.string()).describe('Características principais do produto.'),
  benefits: z.array(z.string()).describe('Benefícios emocionais.'),
  pricing: z.array(PricingPackageSchema).describe('Os 3 pacotes de preço (1, 3 e 6 unidades).'),
  testimonials: z.array(TestimonialSchema).min(6).describe('Mínimo de 6 depoimentos altamente emocionais.'),
  faq_items: z.array(FAQItemSchema).min(6).describe('Mínimo de 6 itens de FAQ.'),
  ingredients: z.array(IngredientSchema).min(6).describe('Mínimo de 6 ingredientes principais.'),
  bonuses: z.array(BonusSchema).describe('Lista de bônus encontrados.'),
  callToAction: z.string().describe('Texto do botão (ex: Verificar Oferta Oficial).'),
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
  prompt: `Você é um Redator Publicitário Sênior de Resposta Direta e Analista de Dados especializado no mercado Nutra.

SUA TAREFA:
Extrair informações do produto e gerar uma estrutura de dados JSON rigorosa para o template "Robusta White".

DIRETRIZES DE TONE & COMPLIANCE (ESTRITO):
- Estilo: White Hat (Autoridade, Baseado em Ciência, Confiável).
- NUNCA use: "cura", "garantido", "milagre", "perca X kg", "100% provado", "fórmula mágica".
- USE: "pode apoiar", "estudado para", "projetado para ajudar", "verificar disponibilidade", "experiência pessoal".
- Depoimentos: Devem ser altamente emocionais, focados em estilo de vida e confiança. NUNCA mencione perda de peso específica ou curas médicas nos depoimentos.

LÓGICA DE PREÇOS:
- Kit 1: 1 Unidade.
- Kit 2: 6 Unidades (MELHOR ESCOLHA / BEST VALUE).
- Kit 3: 3 Unidades (MAIS POPULAR).
- Identifique o nome da unidade (Potes, Frascos, Licenças, etc.).

IDIOMA:
- Identifique o idioma de destino baseado em: "{{{targetLanguage}}}".
- Gere TODO o conteúdo no idioma detectado.

REQUISITOS DE DENSIDADE:
- Gere pelo menos 6 depoimentos únicos e variados.
- Gere pelo menos 6 ingredientes com descrições de benefícios.
- Gere pelo menos 6 perguntas e respostas frequentes.

PRODUTO PARA ANÁLISE:
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
