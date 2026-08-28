export const DISCOVER_BRIEF = `Goal: when the user has no idea what to cook, give them 3 diverse options to pick from.

Steps:
1. Call \`get_all_recipes\` and read all entries.
2. Pick 3 recipes whose \`tags\` are most different from each other (e.g. one Italian pasta, one Asian stir-fry, one quick breakfast). Don't pick three from the same cuisine.
3. Present each option as: name + first sentence of \`description\` + the top 1-2 tags. Don't list ingredients or instructions — the point is to narrow intent, not overwhelm.
4. Ask the user which one they want, OR offer a "more like this" / "different direction" follow-up. Do NOT navigate yet.
5. Once the user picks, switch to \`skill_find_recipe_for_occasion\` with their answer.

Notes:
- If there are fewer than 3 recipes total, present all of them.
- If the recipe list is large (>20), prefer recipes whose \`description\` mentions common entry points (weeknight, weekend, comfort, fresh).
`;
