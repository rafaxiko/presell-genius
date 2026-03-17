'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PricingPackageSchema = z.object({
  id: z.string(),
  label: z.string().describe('Ex: 1 Frasco, 6 Frascos (BEST VALUE), 3 Frascos (MOST POPULAR).'),
  bottles: z.string(),
  supply: z.string().describe('Ex: 30 Day Supply.'),
  price_per: z.string().describe('Preço por unidade (ex: $49).'),
  original_total: z.string().describe('Preço total sem desconto.'),
  discounted_total: z.string().describe('Preço total com desconto.'),
  savings: z.string().describe('Apenas o valor da economia (ex: $780).'),
  shipping: z.string().describe('Status do frete (ex: Free Shipping).'),
  isBestValue: z.boolean(),
  isMostPopular: z.boolean(),
  desktop_position: z.number(),
  mobile_position: z.number(),
});

const TestimonialSchema = z.object({
  name: z.string(),
  location: z.string(),
  title: z.string().describe('Título curto do depoimento.'),
  body: z.string().describe('Depoimento focado em estilo de vida e confiança, tom White Hat.'),
  photo_url: z.string().optional(),
});

const FAQItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const IngredientSchema = z.object({
  name: z.string(),
  benefit: z.string().describe('Benefício principal focado em suporte à saúde.'),
  image_url: z.string().optional(),
});

const GeneratePresellContentInputSchema = z.object({
  salesPageDescription: z.string().describe('URL ou texto da página de vendas.'),
  targetLanguage: z.string().describe('Idioma/País de destino.'),
  templateType: z.enum(['Lançamento', 'Robusta', 'Review', 'Cookie', 'Lista (Top 3/5)']),
  copyStyle: z.enum(['White Hat (Conservador)', 'Black Hat (Agressivo)']),
});

export type GeneratePresellContentInput = z.infer<typeof GeneratePresellContentInputSchema>;

const GeneratePresellContentOutputSchema = z.object({
  meta: z.object({
    product_name: z.string(),
    primary_color: z.string().describe('HEX da cor principal.'),
    publish_date: z.string(),
    rating: z.string(),
    review_count: z.string(),
    seo_description: z.string(),
  }),
  hero: z.object({
    headline: z.string(),
    subheadline: z.string(),
    cta_text: z.string(),
    trust_badges: z.array(z.string()),
    social_proof_line: z.string(),
  }),
  mechanism: z.object({
    tag: z.string(),
    headline: z.string(),
    subheadline: z.string(),
    paragraphs: z.array(z.string()).min(3),
    quote: z.string(),
  }),
  overview: z.object({
    headline: z.string(),
    description: z.string(),
    bullets: z.array(z.object({ icon: z.string(), text: z.string() })),
  }),
  pricing: z.object({
    headline: z.string(),
    subheadline: z.string(),
    per_bottle_label: z.string().describe('Ex: por frasco, per bottle.'),
    bundles: z.array(PricingPackageSchema),
  }),
  ingredients: z.array(IngredientSchema).min(6),
  testimonials: z.array(TestimonialSchema).min(3),
  faq: z.array(FAQItemSchema).min(6),
  footer: z.object({
    copyright_text: z.string(),
  })
});

export type GeneratePresellContentOutput = z.infer<typeof GeneratePresellContentOutputSchema>;

const prompt = ai.definePrompt({
  name: 'generatePresellContentPrompt',
  input: {schema: GeneratePresellContentInputSchema},
  output: {schema: GeneratePresellContentOutputSchema},
  prompt: `Você é um Redator Publicitário Sênior e Analista de Dados especializado em Nutracêuticos.

SUA MISSÃO:
Extrair dados e gerar copy de alta conversão para o template "Robusta White v2".

DIRETRIZES DE TONE & COMPLIANCE (ESTRITO):
- Estilo: {{{copyStyle}}}
- Se White Hat: Tom editorial, científico e autoritário. Use termos como "pode apoiar", "estudado para". NUNCA use "cura", "garantia de resultado", "milagre".
- Se Black Hat: Headline de alto impacto, urgência agressiva e gatilhos de escassez.
- Idioma: O conteúdo gerado deve estar em {{{targetLanguage}}}.

LÓGICA DE PRECIFICAÇÃO:
- Bundle 1: 1 Frasco (Entrada). Desktop pos 1, Mobile pos 3.
- Bundle 2: 6 Frascos (BEST VALUE). Desktop pos 2, Mobile pos 1.
- Bundle 3: 3 Frascos (MOST POPULAR). Desktop pos 3, Mobile pos 2.
- Savings: Forneça APENAS o valor (ex: $780). O rótulo "ECONOMIZE" já está no template.

PRODUTO:
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

export async function generatePresellContent(input: GeneratePresellContentInput): Promise<GeneratePresellContentOutput> {
  return generatePresellContentFlow(input);
}
