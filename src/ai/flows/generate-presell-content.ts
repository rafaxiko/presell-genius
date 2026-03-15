'use server';
/**
 * @fileOverview A Genkit flow that generates high-converting presell page content in multiple languages.
 *
 * - generatePresellContent - Function to handle the generation process.
 * - GeneratePresellContentInput - Input type for the function.
 * - GeneratePresellContentOutput - Return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePresellContentInputSchema = z.object({
  salesPageDescription: z
    .string()
    .describe('Detailed description of the product or service.'),
  keySellingPoints: z
    .array(z.string())
    .describe('List of key selling points to highlight.'),
  targetLanguage: z
    .string()
    .describe('The language in which the content should be generated (e.g., Portuguese, English, Spanish).'),
});
export type GeneratePresellContentInput = z.infer<
  typeof GeneratePresellContentInputSchema
>;

const GeneratePresellContentOutputSchema = z.object({
  headline: z.string().describe('A high-converting headline in the target language.'),
  bodyCopy: z.string().describe('Engaging support copy in the target language.'),
  callToAction: z.string().describe('Powerful call to action in the target language.'),
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
  prompt: `You are an expert copywriter specializing in affiliate marketing, focused on high conversion.

Your task is to generate a killer headline, persuasive body copy (presell copy), and a strong call to action (CTA) based on the product description and selling points provided.

CONTENT MUST BE WRITTEN ENTIRELY IN: {{{targetLanguage}}}.

Use a friendly but extremely persuasive tone. The goal of the presell page is to "warm up" cold traffic, breaking major objections and generating curiosity before the click to the official sales page.

Use mental triggers like authority, scarcity, or social proof if it fits the context.

Sales Page/Product Description:
{{{salesPageDescription}}}

Key Selling Points:
{{#each keySellingPoints}}
- {{{this}}}
{{/each}}

Target Language: {{{targetLanguage}}}

Generate the content in JSON format according to the output schema.`,
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
