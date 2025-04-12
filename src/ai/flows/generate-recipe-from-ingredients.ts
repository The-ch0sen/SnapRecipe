'use server';
/**
 * @fileOverview Recipe generation flow based on identified ingredients.
 *
 * - generateRecipeFromIngredients - A function that generates a recipe from a list of ingredients.
 * - GenerateRecipeInput - The input type for the generateRecipeFromIngredients function.
 * - GenerateRecipeOutput - The return type for the generateRecipeFromIngredients function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateRecipeInputSchema = z.object({
  ingredients: z.array(z.string()).describe('A list of identified ingredients.'),
});
export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;

const GenerateRecipeOutputSchema = z.object({
  recipeName: z.string().describe('The name of the generated recipe.'),
  instructions: z.string().describe('The recipe instructions.'),
  ingredients: z.array(z.string()).describe('The ingredients needed for the recipe.'),
});
export type GenerateRecipeOutput = z.infer<typeof GenerateRecipeOutputSchema>;

export async function generateRecipeFromIngredients(input: GenerateRecipeInput): Promise<GenerateRecipeOutput> {
  return generateRecipeFromIngredientsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipeFromIngredientsPrompt',
  input: {
    schema: z.object({
      ingredients: z.array(z.string()).describe('A list of identified ingredients.'),
    }),
  },
  output: {
    schema: z.object({
      recipeName: z.string().describe('The name of the generated recipe.'),
      instructions: z.string().describe('The recipe instructions.'),
      ingredients: z.array(z.string()).describe('The ingredients needed for the recipe.'),
    }),
  },
  prompt: `You are a recipe generation expert. Given a list of ingredients, you will generate a recipe that can be made with those ingredients.

Ingredients: {{{ingredients}}}

Generate a detailed recipe including the name of the recipe, ingredients needed and the instructions. Give detailed steps for the recipe.`, 
});

const generateRecipeFromIngredientsFlow = ai.defineFlow<
  typeof GenerateRecipeInputSchema,
  typeof GenerateRecipeOutputSchema
>({
  name: 'generateRecipeFromIngredientsFlow',
  inputSchema: GenerateRecipeInputSchema,
  outputSchema: GenerateRecipeOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});

