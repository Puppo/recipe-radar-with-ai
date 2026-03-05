import z from "zod";

export const NutritionPer100gSchema = z.object({
  calories: z.number().describe("Calories per 100g"),
  protein: z.number().describe("Protein in grams per 100g"),
  carbs: z.number().describe("Carbohydrates in grams per 100g"),
  fat: z.number().describe("Fat in grams per 100g"),
});

export type NutritionPer100g = z.infer<typeof NutritionPer100gSchema>;

// Keyed by lowercase ingredient keyword, values are per 100g
export const nutritionDatabase: Record<string, NutritionPer100g> = {
  // Pasta & Grains
  spaghetti: { calories: 158, protein: 5.8, carbs: 31, fat: 0.9 },
  flour: { calories: 364, protein: 10, carbs: 76, fat: 1 },
  "sourdough bread": { calories: 274, protein: 11, carbs: 51, fat: 3.2 },

  // Meats
  guanciale: { calories: 655, protein: 11, carbs: 0, fat: 69 },
  pancetta: { calories: 393, protein: 14, carbs: 0, fat: 37 },
  "chicken breast": { calories: 165, protein: 31, carbs: 0, fat: 3.6 },

  // Dairy & Eggs
  egg: { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
  pecorino: { calories: 387, protein: 32, carbs: 0, fat: 27 },
  parmesan: { calories: 431, protein: 38, carbs: 4, fat: 29 },
  yogurt: { calories: 59, protein: 10, carbs: 3.6, fat: 0.7 },
  "heavy cream": { calories: 340, protein: 2, carbs: 2.8, fat: 36 },
  "feta cheese": { calories: 264, protein: 14, carbs: 4.1, fat: 21 },
  butter: { calories: 717, protein: 0.9, carbs: 0.1, fat: 81 },

  // Vegetables & Fruits
  avocado: { calories: 160, protein: 2, carbs: 8.5, fat: 15 },
  tomato: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  "tomato sauce": { calories: 29, protein: 1.3, carbs: 5.4, fat: 0.5 },
  cucumber: { calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1 },
  "bell pepper": { calories: 20, protein: 0.9, carbs: 4.6, fat: 0.2 },
  onion: { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1 },
  lemon: { calories: 29, protein: 1.1, carbs: 9.3, fat: 0.3 },
  garlic: { calories: 149, protein: 6.4, carbs: 33, fat: 0.5 },
  ginger: { calories: 80, protein: 1.8, carbs: 18, fat: 0.8 },

  // Oils & Fats
  "olive oil": { calories: 884, protein: 0, carbs: 0, fat: 100 },
  "vegetable oil": { calories: 884, protein: 0, carbs: 0, fat: 100 },

  // Sweets & Baking
  "brown sugar": { calories: 380, protein: 0, carbs: 98, fat: 0 },
  "white sugar": { calories: 387, protein: 0, carbs: 100, fat: 0 },
  "chocolate chips": { calories: 502, protein: 5, carbs: 60, fat: 30 },
  walnuts: { calories: 654, protein: 15, carbs: 14, fat: 65 },

  // Other
  olives: { calories: 115, protein: 0.8, carbs: 6, fat: 11 },
};
