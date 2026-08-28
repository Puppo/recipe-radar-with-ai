export const FILTER_RECIPES_BY_DIET = `Goal: surface recipes that match a dietary constraint or vibe, and link the user to each.

Steps:
1. Call \`search_recipes\` with the diet keyword (e.g. "vegan", "keto", "quick", "low-carb", "gluten-free"). Try the user's exact phrase first; if zero hits, try a synonym.
2. If still zero hits, fall back to \`get_all_recipes\` and filter by \`tags\` in your reasoning.
3. For each candidate (cap at 5 results), call \`navigate_to_recipe\` and then \`get_current_recipe_info\`. Read \`name\`, \`description\`, \`tags\`, and skim \`ingredients\` to confirm it actually fits the diet (the tags alone can lie).
4. Present the confirmed matches as a bulleted list with name + one-line description + a "Open" hint that names the id. The user will navigate themselves with \`navigate_to_recipe\` (or click the link on the page).
5. Don't pre-select one unless the user asks.

Notes:
- "Vegan", "vegetarian", "keto", "gluten-free" often have NO perfect matches in a small recipe list. Say so honestly.
- Don't fabricate matches. If only 1 recipe is a fit, present 1.
`;
