export const COMPARE_RECIPES = `Goal: compare two recipes side-by-side on time, difficulty, ingredients, and (if asked) nutrition.

Steps:
1. Resolve both recipe IDs. Use \`search_recipes\` (one call per name) or \`get_all_recipes\` if the user is browsing.
2. Call \`navigate_to_recipe\` with the FIRST id, then \`get_current_recipe_info\` and read \`name\`, \`prepTime\`, \`cookTime\`, \`servings\`, \`ingredients\`, \`instructions\`, \`tags\`.
3. Call \`navigate_to_recipe\` with the SECOND id, then \`get_current_recipe_info\` again.
4. If the user wants nutrition, call \`calculate_recipe_nutrition\` for each id.
5. Present a side-by-side table: name, total time (prep+cook), servings, ingredient count, distinct tags, nutrition row(s).
6. End with a one-sentence recommendation that names a winner by the dimension the user cared about most (e.g. "Recipe A is faster; Recipe B is lower-carb").

Notes:
- Don't navigate away from the second recipe at the end — leave the user where they can act.
- If one recipe doesn't exist, report the error and stop; don't substitute without asking.
`;
