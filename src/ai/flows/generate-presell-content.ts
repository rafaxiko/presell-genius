'use server';
/**
 * @fileOverview A Genkit flow that generates high-converting presell page content.
 * Extracted benefits and selling points directly from the product description.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePresellContentInputSchema = z.object({
  salesPageDescription: z
    .string()
    .describe('Detailed description of the product or service.'),
  targetLanguage: z
    .string()
    .describe('The language in which the content should be generated.'),
  templateType: z.string().describe('The type of template selected (Launch, Robust, Review, List).'),
});
export type GeneratePresellContentInput = z.infer<
  typeof GeneratePresellContentInputSchema
>;

const GeneratePresellContentOutputSchema = z.object({
  headline: z.string().describe('A high-converting headline.'),
  bodyCopy: z.string().describe('Engaging support copy with extracted benefits and social proof.'),
  callToAction: z.string().describe('Powerful call to action.'),
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
  prompt: `You are an expert copywriter specializing in direct response and affiliate marketing.

Your goal is to create a high-converting presell page based on the product description provided. 
Extract the key benefits, major objections, and emotional triggers automatically from the description.

Template Style: {{{templateType}}}
Target Language: {{{targetLanguage}}}

Tone: Highly persuasive, friendly, and authoritative.
Structure:
1. Headline: Catchy and results-oriented.
2. Body Copy: Must "warm up" the reader. Address the pain points, present the solution, and highlight 3-5 key benefits extracted from the description.
3. Call to Action: Urgent and clear.

CONTENT MUST BE WRITTEN ENTIRELY IN: {{{targetLanguage}}}.

Product Description:
{{{salesPageDescription}}}

Generate the content in JSON format.`,
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
