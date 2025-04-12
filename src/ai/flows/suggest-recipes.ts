'use server';

/**
 * @fileOverview A recipe suggestion AI agent.
 *
 * - suggestRecipes - A function that handles the recipe suggestion process.
 * - SuggestRecipesInput - The input type for the suggestRecipes function.
 * - SuggestRecipesOutput - The return type for the SuggestRecipes function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestRecipesInputSchema = z.object({
  ingredients: z.string().describe('The ingredients available for the recipe.'),
  servingSize: z.number().describe('The number of servings for the recipe.'),
  occasion: z.string().describe('The occasion for the recipe (e.g., daily, celebration, party).'),
});
export type SuggestRecipesInput = z.infer<typeof SuggestRecipesInputSchema>;

const SuggestRecipesOutputSchema = z.object({
  recipeName: z.string().describe('The name of the suggested recipe.'),
  ingredients: z.array(z.string()).describe('The ingredients needed for the recipe with quantities.'),
  instructions: z.string().describe('The step-by-step instructions for the recipe.'),
  confidence: z.number().describe('A confidence score (0-1) indicating the quality of the recipe suggestion.'),
});
export type SuggestRecipesOutput = z.infer<typeof SuggestRecipesOutputSchema>;

export async function suggestRecipes(input: SuggestRecipesInput): Promise<SuggestRecipesOutput> {
  return suggestRecipesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRecipesPrompt',
  input: {
    schema: z.object({
      ingredients: z.string().describe('The ingredients available for the recipe.'),
      servingSize: z.number().describe('The number of servings for the recipe.'),
      occasion: z.string().describe('The occasion for the recipe (e.g., daily, celebration, party).'),
    }),
  },
  output: {
    schema: z.object({
      recipeName: z.string().describe('The name of the suggested recipe.'),
      ingredients: z.array(z.string()).describe('The ingredients needed for the recipe with quantities.'),
      instructions: z.string().describe('The step-by-step instructions for the recipe.'),
      confidence: z.number().describe('A confidence score (0-1) indicating the quality of the recipe suggestion.'),
    }),
  },
  prompt: `You are an expert recipe generator. Given a list of ingredients, a serving size, and the occasion, you will generate a recipe that can be made with those ingredients.
  You must provide a confidence score between 0 and 1 for the recipe suggestion. 1 is a great recipe and 0 is not.

  Ingredients: {{{ingredients}}}
  Serving Size: {{{servingSize}}}
  Occasion: {{{occasion}}}

  Generate a detailed recipe, including the name of the recipe, a list of ingredients with quantities needed, and detailed step-by-step instructions. Also, assign a confidence score for the recipe. Make the response be in Traditional Chinese.`,
});

const suggestRecipesFlow = ai.defineFlow<
  typeof SuggestRecipesInputSchema,
  typeof SuggestRecipesOutputSchema
>({
  name: 'suggestRecipesFlow',
  inputSchema: SuggestRecipesInputSchema,
  outputSchema: SuggestRecipesOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  if (!output) {
    throw new Error('Failed to generate recipe from AI.');
  }
  return output!;
});
