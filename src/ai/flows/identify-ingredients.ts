'use server';
/**
 * @fileOverview This file defines a Genkit flow for identifying ingredients in a food photo.
 * 
 * - identifyIngredients - A function that takes a photo URL and returns a list of identified ingredients.
 * - IdentifyIngredientsInput - The input type for the identifyIngredients function.
 * - IdentifyIngredientsOutput - The return type for the identifyIngredients function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const IdentifyIngredientsInputSchema = z.object({
  photoUrl: z.string().describe('The URL of the food photo.'),
});
export type IdentifyIngredientsInput = z.infer<typeof IdentifyIngredientsInputSchema>;

const IdentifyIngredientsOutputSchema = z.object({
  ingredients: z.array(z.string()).describe('A list of identified ingredients.'),
});
export type IdentifyIngredientsOutput = z.infer<typeof IdentifyIngredientsOutputSchema>;

export async function identifyIngredients(input: IdentifyIngredientsInput): Promise<IdentifyIngredientsOutput> {
  return identifyIngredientsFlow(input);
}

const identifyIngredientsPrompt = ai.definePrompt({
  name: 'identifyIngredientsPrompt',
  input: {
    schema: z.object({
      photoUrl: z.string().describe('The URL of the food photo.'),
    }),
  },
  output: {
    schema: z.object({
      ingredients: z.array(z.string()).describe('A list of identified ingredients.'),
    }),
  },
  prompt: `You are an expert chef. Your task is to identify the ingredients present in the following food photo.

Analyze the photo and extract a list of the ingredients. Only list the ingredients.

Photo: {{media url=photoUrl}}

Ingredients:`,
});

const identifyIngredientsFlow = ai.defineFlow<
  typeof IdentifyIngredientsInputSchema,
  typeof IdentifyIngredientsOutputSchema
>({
  name: 'identifyIngredientsFlow',
  inputSchema: IdentifyIngredientsInputSchema,
  outputSchema: IdentifyIngredientsOutputSchema,
},
async input => {
  const {output} = await identifyIngredientsPrompt(input);
  return output!;
});
