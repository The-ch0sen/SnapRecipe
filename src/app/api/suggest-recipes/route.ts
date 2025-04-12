'use server';

import {suggestRecipes} from '@/ai/flows/suggest-recipes';
import {NextResponse} from 'next/server';
import {z} from 'zod';

const SuggestRecipesInputSchema = z.object({
  ingredients: z.string().min(1, {message: 'Ingredients must not be empty.'}),
  servingSize: z.number().min(1, {message: 'Serving size must be at least 1.'}),
   occasion: z.string().describe('The occasion for the recipe (e.g., daily, celebration, party).').optional(),
});

export type SuggestRecipesInput = z.infer<typeof SuggestRecipesInputSchema>;

export async function POST(request: Request) {
  try {
    const body: SuggestRecipesInput = await request.json();

    // Validate the request body against the schema
    const validatedBody = SuggestRecipesInputSchema.parse(body);

    // Call the Genkit flow with the validated data
    const recipe = await suggestRecipes(validatedBody);

    // Return the recipe as a JSON response
    return NextResponse.json(recipe);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      // Return a 400 response with the Zod error message
      return NextResponse.json({message: error.errors[0].message}, {status: 400});
    } else {
      // Return a 500 response with the error message
      console.error('Failed to generate recipe:', error);
      return NextResponse.json({message: error.message || 'Failed to generate recipe.'}, {status: 500});
    }
  }
}
