export const FIND_RECIPE_FOR_OCCASION = `Goal: find a recipe matching the user's occasion/vibe and present a brief summary.

Steps:
1. Call \`search_recipes\` with a short query derived from the user's words (e.g. "cozy", "quick weeknight", "summer"). Don't pass the full user sentence — extract the keywords.
2. Read the first 3 hits (ignore the rest). Each hit has \`id\`, \`name\`, \`description\`, \`tags\`.
3. Pick the best match based on name/description/tag overlap with the user's intent. If none look like a fit, broaden the query and retry once.
4. Call \`navigate_to_recipe\` with the chosen \`id\` so the user lands on the detail page.
5. Call \`get_current_recipe_info\` (now that we're on the detail page) and read \`name\`, \`description\`, \`prepTime\`, \`cookTime\`, \`servings\`, \`tags\`.
6. Summarise for the user in 2-3 sentences. Don't dump all the ingredients — they are visible on the page.

Notes:
- If the user is already on a recipe detail page, skip steps 1-4 and start at step 5.
- Do NOT call \`calculate_recipe_nutrition\` here unless the user asked about nutrition — that's the \`skill_recipe_nutrition_brief\` job.
`;
