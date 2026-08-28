export const PLAN_SHOPPING_LIST = `Goal: produce a shopping list scaled to N servings of a recipe.

Steps:
1. Find the recipe.
   - If the user is on \`/recipes/:id\`, call \`get_current_recipe_info\` to read \`id\`, \`servings\`, and \`ingredients\`.
   - Else, \`search_recipes\` by name (or \`get_all_recipes\`), then \`navigate_to_recipe\` to open it.
2. Ask the user how many servings they want if not given (default to the recipe's \`servings\`).
3. Compute \`factor = targetServings / recipe.servings\`. Scale each ingredient string by multiplying the leading quantity (the first number) by \`factor\`. If an ingredient has no number, leave it as-is.
4. Call \`calculate_ingredients_nutrition\` with the scaled ingredient list as a sanity-check on totals.
5. Present the scaled list as a numbered list. If the user wanted nutrition too, fold the sanity-check into the brief.

Notes:
- Don't try to be clever with fractions — round to 1 decimal place when the scaled quantity is not whole.
- If \`get_current_recipe_info\` returns ingredients without leading numbers (e.g. "Salt to taste"), include them verbatim with a note that they don't scale.
`;
