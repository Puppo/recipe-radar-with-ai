import { useWebMCP } from "@mcp-b/react-webmcp";
import { z } from "zod";
import {
  calculateNutrition,
  calculateNutritionByRecipeId,
  NutritionResultSchema,
} from "../services/nutritionCalculator";

export function useNutritionWebMCP() {
  useWebMCP({
    name: "calculate_recipe_nutrition",
    description:
      "Calculate approximate nutritional information (calories, protein, carbs, fat) for a recipe by its ID. Returns per-serving and total values with a per-ingredient breakdown.",
    inputSchema: {
      recipeId: z
        .string()
        .describe('The recipe ID to calculate nutrition for (e.g. "1", "2")'),
    },
    handler: async ({ recipeId }) => {
      const nutrition = calculateNutritionByRecipeId(recipeId);
      if (!nutrition)
        return { error: `Recipe with ID "${recipeId}" not found` };
      return {
        nutrition,
      };
    },
  });

  useWebMCP({
    name: "calculate_ingredients_nutrition",
    description:
      'Calculate approximate nutritional information for an arbitrary list of ingredients with quantities (e.g. "400g spaghetti", "2 cups yogurt").',
    inputSchema: {
      ingredients: z
        .array(z.string())
        .describe("Array of ingredient strings with quantities"),
    },
    handler: async ({ ingredients }) => {
      const nutrition = calculateNutrition(ingredients, "Custom", 1);
      return {
        nutrition,
      };
    },
    outputSchema: {
      nutrition: NutritionResultSchema.describe(
        "Nutrition information for the ingredients",
      ),
    },
  });
}
