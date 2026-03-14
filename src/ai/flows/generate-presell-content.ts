'use server';
/**
 * @fileOverview A Genkit flow that generates high-converting presell page content (headline, body copy, CTA).
 *
 * - generatePresellContent - A function that handles the content generation process.
 * - GeneratePresellContentInput - The input type for the generatePresellContent function.
 * - GeneratePresellContentOutput - The return type for the generatePresellContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePresellContentInputSchema = z.object({
  salesPageDescription: z
    .string()
    .describe(
      'A detailed description of the product or service for the sales page.'
    ),
  keySellingPoints: z
    .array(z.string())
    .describe('A list of key selling points to highlight in the presell content.'),
});
export type GeneratePresellContentInput = z.infer<
  typeof GeneratePresellContentInputSchema
>;

const GeneratePresellContentOutputSchema = z.object({
  headline: z.string().describe('A high-converting headline for the presell page.'),
  bodyCopy: z.string().describe('Engaging body copy for the presell page.'),
  callToAction: z.string().describe('A compelling call-to-action.'),
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
  prompt: `You are an expert AI copywriter specializing in creating high-converting presell page content.

Your task is to generate a compelling headline, engaging body copy, and a strong call-to-action based on the provided sales page description and key selling points.

Ensure the content is persuasive, highlights the unique benefits, and encourages the user to proceed to the main sales page.

Sales Page Description:
{{{salesPageDescription}}}

Key Selling Points:
{{#each keySellingPoints}}
- {{{this}}}
{{/each}}

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
