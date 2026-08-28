import { useWebMCP } from "./useWebMCP";
import { FIND_RECIPE_FOR_OCCASION } from "../skills/findRecipeForOccasion";
import { RECIPE_NUTRITION_BRIEF } from "../skills/recipeNutritionBrief";
import { PLAN_SHOPPING_LIST } from "../skills/planShoppingList";
import { COMPARE_RECIPES } from "../skills/compareRecipes";
import { FILTER_RECIPES_BY_DIET } from "../skills/filterRecipesByDiet";
import { DISCOVER_BRIEF } from "../skills/discoverBrief";

const SKILL_ANNOTATIONS = {
  readOnlyHint: true,
  idempotentHint: true,
  openWorldHint: false,
} as const;

export function useSkillWebMCP(): void {
  useWebMCP({
    name: "skill_find_recipe_for_occasion",
    description:
      "Use when the user describes a craving, occasion, or vibe (e.g. 'something cozy for a rainy day', 'a quick weeknight dinner'). Returns a playbook explaining how to search, narrow, navigate, and summarise.",
    annotations: SKILL_ANNOTATIONS,
    execute: async () => FIND_RECIPE_FOR_OCCASION,
  });

  useWebMCP({
    name: "skill_recipe_nutrition_brief",
    description:
      "Use when the user wants nutrition information (calories, protein, carbs, fat) for a specific recipe. Returns a playbook covering navigation and calculation steps.",
    annotations: SKILL_ANNOTATIONS,
    execute: async () => RECIPE_NUTRITION_BRIEF,
  });

  useWebMCP({
    name: "skill_plan_shopping_list",
    description:
      "Use when the user wants to know what to buy for N servings of a recipe. Returns a playbook for scaling ingredients and an optional nutrition sanity-check.",
    annotations: SKILL_ANNOTATIONS,
    execute: async () => PLAN_SHOPPING_LIST,
  });

  useWebMCP({
    name: "skill_compare_recipes",
    description:
      "Use when the user wants to compare two recipes side-by-side (time, ingredients, nutrition). Returns a playbook.",
    annotations: SKILL_ANNOTATIONS,
    execute: async () => COMPARE_RECIPES,
  });

  useWebMCP({
    name: "skill_filter_recipes_by_diet",
    description:
      "Use when the user asks for recipes fitting a diet or constraint (vegan, keto, gluten-free, quick, kid-friendly). Returns a playbook.",
    annotations: SKILL_ANNOTATIONS,
    execute: async () => FILTER_RECIPES_BY_DIET,
  });

  useWebMCP({
    name: "skill_discover_brief",
    description:
      "Use when the user has no idea what to cook and wants suggestions. Returns a playbook for picking 3 diverse recipes and letting the user choose.",
    annotations: SKILL_ANNOTATIONS,
    execute: async () => DISCOVER_BRIEF,
  });
}
