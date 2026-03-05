import z from "zod";
import {
  nutritionDatabase,
  NutritionPer100gSchema,
  type NutritionPer100g,
} from "../data/nutritionData";
import { recipes } from "../data/recipes";

// Approximate unit-to-grams conversions for demo purposes
const unitToGrams: Record<string, number> = {
  g: 1,
  kg: 1000,
  cup: 240,
  cups: 240,
  tbsp: 15,
  tsp: 5,
  can: 400,
  clove: 5,
  cloves: 5,
  large: 60,
  slice: 40,
  slices: 40,
};

export const IngredientNutritionSchema = z.object({
  name: z.string().describe('Original ingredient text (e.g. "400g spaghetti")'),
  grams: z.number().describe("Estimated weight in grams for this ingredient"),
  nutrition: NutritionPer100gSchema.describe(
    "Estimated nutrition for the given quantity of this ingredient",
  ),
  matched: z
    .boolean()
    .describe(
      "Whether this ingredient was successfully matched to a nutrition entry",
    ),
});

export type IngredientNutrition = z.infer<typeof IngredientNutritionSchema>;

export const NutritionResultSchema = z.object({
  recipeName: z.string().describe("Name of the recipe"),
  servings: z.number().describe("Number of servings the recipe makes"),
  total: NutritionPer100gSchema.describe(
    "Total nutrition for the entire recipe",
  ),
  totalPerServing: NutritionPer100gSchema.describe(
    "Estimated nutrition per serving",
  ),
  ingredients: IngredientNutritionSchema.array().describe(
    "Array of ingredient nutrition breakdowns",
  ),
});

export type NutritionResult = z.infer<typeof NutritionResultSchema>;

const ZERO_NUTRITION: NutritionPer100g = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
};

function parseQuantityGrams(ingredient: string): {
  grams: number;
  rest: string;
} {
  const lower = ingredient.toLowerCase().trim();

  // Match patterns like "400g", "2 cups", "1/2 tsp", "1 can (400g)"
  const match = lower.match(
    /^(\d+(?:[./]\d+)?)\s*(g|kg|cups?|tbsp|tsp|cloves?|large|slices?|can)?\s*/,
  );

  if (!match) {
    return { grams: 100, rest: lower }; // default 100g for unquantified items
  }

  const quantity = match[1].includes("/")
    ? match[1].split("/").reduce((a, b) => Number(a) / Number(b), 0)
    : Number(match[1]);

  const unit = match[2]?.toLowerCase();
  const grams = unit ? quantity * (unitToGrams[unit] ?? 100) : quantity;
  const rest = lower.slice(match[0].length);

  return { grams, rest };
}

function findNutritionMatch(ingredientText: string): NutritionPer100g | null {
  const lower = ingredientText.toLowerCase();

  // Try exact key matches first (longer keys first for specificity)
  const sortedKeys = Object.keys(nutritionDatabase).toSorted(
    (a, b) => b.length - a.length,
  );

  for (const key of sortedKeys) {
    if (lower.includes(key)) {
      return nutritionDatabase[key];
    }
  }

  return null;
}

function scaleNutrition(
  per100g: NutritionPer100g,
  grams: number,
): NutritionPer100g {
  const factor = grams / 100;
  return {
    calories: Math.round(per100g.calories * factor),
    protein: Math.round(per100g.protein * factor * 10) / 10,
    carbs: Math.round(per100g.carbs * factor * 10) / 10,
    fat: Math.round(per100g.fat * factor * 10) / 10,
  };
}

function addNutrition(
  a: NutritionPer100g,
  b: NutritionPer100g,
): NutritionPer100g {
  return {
    calories: a.calories + b.calories,
    protein: Math.round((a.protein + b.protein) * 10) / 10,
    carbs: Math.round((a.carbs + b.carbs) * 10) / 10,
    fat: Math.round((a.fat + b.fat) * 10) / 10,
  };
}

export function calculateNutrition(
  ingredients: string[],
  recipeName: string,
  servings: number,
): NutritionResult {
  let total: NutritionPer100g = { ...ZERO_NUTRITION };
  const ingredientResults: IngredientNutrition[] = [];

  for (const ingredient of ingredients) {
    const { grams } = parseQuantityGrams(ingredient);
    const nutritionPer100g = findNutritionMatch(ingredient);

    if (nutritionPer100g) {
      const scaled = scaleNutrition(nutritionPer100g, grams);
      total = addNutrition(total, scaled);
      ingredientResults.push({
        name: ingredient,
        grams,
        nutrition: scaled,
        matched: true,
      });
    } else {
      ingredientResults.push({
        name: ingredient,
        grams: 0,
        nutrition: { ...ZERO_NUTRITION },
        matched: false,
      });
    }
  }

  const totalPerServing: NutritionPer100g = {
    calories: Math.round(total.calories / servings),
    protein: Math.round((total.protein / servings) * 10) / 10,
    carbs: Math.round((total.carbs / servings) * 10) / 10,
    fat: Math.round((total.fat / servings) * 10) / 10,
  };

  return {
    recipeName,
    servings,
    total,
    totalPerServing,
    ingredients: ingredientResults,
  };
}

export function calculateNutritionByRecipeId(
  recipeId: string,
): NutritionResult | null {
  const recipe = recipes.find((r) => r.id === recipeId);
  if (!recipe) return null;
  return calculateNutrition(recipe.ingredients, recipe.name, recipe.servings);
}
