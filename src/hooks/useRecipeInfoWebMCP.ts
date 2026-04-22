import z from "zod";
import type { Recipe } from "../types/recipe";
import { useWebMCP } from "./useWebMCP";

export function useRecipeInfoWebMCP(recipe: Recipe) {
  useWebMCP({
    name: "get_current_recipe_info",
    description:
      "Get full details of the recipe currently being viewed on the page, including name, description, preparation and cooking time, servings, ingredients, instructions, and tags.",
    execute: async () => {
      return {
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        tags: recipe.tags,
      };
    },
    outputSchema: z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      prepTime: z.string(),
      cookTime: z.string(),
      servings: z.number(),
      ingredients: z.array(z.string()),
      instructions: z.array(z.string()),
      tags: z.array(z.string()),
    }),
  });
}
