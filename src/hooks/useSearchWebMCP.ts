import { z } from "zod";
import { recipes } from "../data/recipes";
import { recipeService } from "../services/recipeService";
import { useWebMCP } from "./useWebMCP";

export function useSearchWebMCP() {
  useWebMCP({
    name: "get_all_recipes",
    description:
      "Get a list of all available recipes with their IDs, names, descriptions, and tags.",
    execute: async () => {
      return recipes.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        tags: r.tags,
      }));
    },
  });

  useWebMCP({
    name: "search_recipes",
    description:
      "Search recipes by keyword. Matches against recipe name, description, and tags.",
    inputSchema: z.object({
      query: z
        .string()
        .describe(
          "Search keyword to match against recipe name, description, or tags",
        ),
    }),
    execute: async ({ query }) => {
      return recipeService.searchRecipes(query);
    },
  });
}
