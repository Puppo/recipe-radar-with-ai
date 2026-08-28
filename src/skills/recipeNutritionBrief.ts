export const RECIPE_NUTRITION_BRIEF = `Goal: present approximate nutrition (calories, protein, carbs, fat per serving and total) for a recipe.

Steps:
1. Determine the recipe ID.
   - If the current page is \`/recipes/:id\`, call \`get_current_recipe_info\` first to read its \`id\`.
   - Else, call \`search_recipes\` with the recipe name (or \`get_all_recipes\` if the user is browsing) and pick the best match.
2. If not already on the detail page, call \`navigate_to_recipe\` with that id so the user sees the recipe while you summarise.
3. Call \`calculate_recipe_nutrition\` with the id.
4. Read the \`nutrition\` object: \`calories\`, \`protein\`, \`carbs\`, \`fat\` are per-serving totals. Present them in a small table or bullet list. Include both per-serving AND total values for clarity.
5. If the user asked about a specific diet (low-carb, high-protein), call out whether the values fit. Otherwise stop here.

Notes:
- Nutrition is approximate — say so in the summary.
- The calculator returns \`{ error: "..." }\` for unknown IDs. If that happens, retry once with a different id from \`get_all_recipes\`.
`;
