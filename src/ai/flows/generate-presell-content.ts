'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PricingPackageSchema = z.object({
  quantity: z.string().describe('Quantidade (ex: 1, 3, 6).'),
  unitName: z.string().describe('Unidade (Potes, Frascos, Licenças).'),
  price: z.string().describe('Preço exibido (ex: R$ 197,00).'),
  savings: z.string().describe('Apenas o valor da economia, sem rótulos. Ex: "R$ 780,00" ou "50%".'),
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
  pricing: z.array(PricingPackageSchema).describe('Os pacotes de preço encontrados na descrição.'),
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
  prompt: `Você é um Redator Publicitário Sênior de Resposta Direta e Analista de Dados.

SUA TAREFA:
Extrair informações do produto e gerar uma estrutura de dados JSON rigorosa para o template "{{{templateType}}}".

DIRETRIZES DE TONE & COMPLIANCE (ESTRITO):
- Estilo: {{{copyStyle}}}
- Se White Hat: Use tom editorial, autoridade e base científica. NUNCA use "cura", "garantido", "milagre".
- Se Black Hat: Headline de alto impacto, urgência e escassez agressiva.
- Depoimentos: Devem ser altamente emocionais, focados em estilo de vida e confiança.

LÓGICA DE DADOS:
- Economia (savings): Forneça APENAS o valor (ex: "R$ 780,00" ou "50%"). NUNCA inclua o texto "Economize" ou similar, pois o rótulo já está no template.
- Preços: Identifique EXATAMENTE as quantidades e preços citados na descrição. Não invente kits se não estiverem no texto.
- Cores: Tente identificar a cor principal da marca (HEX).

IDIOMA:
- Identifique o idioma de destino baseado em: "{{{targetLanguage}}}".
- Gere TODO o conteúdo no idioma detectado.

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
