import { z } from "zod";
import { useLocation, useNavigate } from "react-router-dom";
import { recipes } from "../data/recipes";
import { useWebMCP } from "./useWebMCP";

const NAV_ANNOTATIONS = {
  readOnlyHint: false,
  destructiveHint: false,
  openWorldHint: false,
} as const;

export function useNavigationWebMCP(): void {
  const navigate = useNavigate();
  const location = useLocation();

  useWebMCP(
    {
      name: "navigate_home",
      description:
        "Navigate to the home page (/). Use when the user wants to see all recipes or start over.",
      annotations: NAV_ANNOTATIONS,
      execute: async (_args, client) => {
        await client.requestUserInteraction(async () => {
          navigate("/");
        });
        return { navigated_to: "/" };
      },
    },
    [],
  );

  useWebMCP(
    {
      name: "navigate_to_recipe",
      description:
        "Navigate to the detail page of a specific recipe by its ID (e.g. '1', '2'). Use after search_recipes or get_all_recipes returns a candidate.",
      inputSchema: z.object({
        recipeId: z
          .string()
          .describe("The recipe ID to open, e.g. '1', '2', '3'"),
      }),
      annotations: NAV_ANNOTATIONS,
      execute: async ({ recipeId }, client) => {
        if (!recipes.some((r) => r.id === recipeId)) {
          return {
            error: `Recipe with ID "${recipeId}" not found. Use search_recipes or get_all_recipes to find valid IDs.`,
          };
        }
        await client.requestUserInteraction(async () => {
          navigate(`/recipes/${recipeId}`);
        });
        return { navigated_to: `/recipes/${recipeId}` };
      },
    },
    [],
  );

  useWebMCP(
    {
      name: "navigate_to_search",
      description:
        "Navigate to /search?filter=<query>. The search page redirects to home and applies AI-enhanced search when available, with keyword search as a fallback.",
      inputSchema: z.object({
        filter: z
          .string()
          .optional()
          .describe(
            "Optional recipe search query that will be applied on the home page",
          ),
      }),
      annotations: NAV_ANNOTATIONS,
      execute: async ({ filter }, client) => {
        const to = filter
          ? `/search?filter=${encodeURIComponent(filter)}`
          : "/search";
        await client.requestUserInteraction(async () => {
          navigate(to);
        });
        return { navigated_to: to };
      },
    },
    [],
  );

  useWebMCP(
    {
      name: "go_back",
      description:
        "Go back one step in browser history (equivalent to the browser back button).",
      annotations: NAV_ANNOTATIONS,
      execute: async (_args, client) => {
        await client.requestUserInteraction(async () => {
          navigate(-1);
        });
        return { went_back: true };
      },
    },
    [],
  );

  useWebMCP(
    {
      name: "get_current_page",
      description:
        "Get the current page path, search params, and which WebMCP tools are most useful here. Read-only.",
      annotations: { readOnlyHint: true, openWorldHint: false },
      execute: async () => {
        const path = location.pathname;
        const isHome = path === "/";
        const isDetail = path.startsWith("/recipes/");
        return {
          path,
          search: location.search,
          page: isHome ? "home" : isDetail ? "recipe_detail" : "unknown",
          availableTools: isHome
            ? [
                "get_all_recipes",
                "search_recipes",
                "navigate_to_recipe",
                "navigate_to_search",
                "skill_discover_brief",
                "skill_find_recipe_for_occasion",
                "skill_filter_recipes_by_diet",
              ]
            : isDetail
              ? [
                  "get_current_recipe_info",
                  "calculate_recipe_nutrition",
                  "navigate_home",
                  "navigate_to_search",
                  "go_back",
                  "skill_recipe_nutrition_brief",
                  "skill_plan_shopping_list",
                ]
              : ["navigate_home", "navigate_to_search", "go_back"],
        };
      },
    },
    [location.pathname, location.search],
  );
}
