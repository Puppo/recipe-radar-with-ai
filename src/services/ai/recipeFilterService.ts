import type { RecipePreview } from "../../types/recipe";

const SYSTEM_PROMPT = `You are a recipe filter assistant. You receive a JSON array of recipes (each with id, name, and description) and a user's natural language filter criteria. Your job is to return only the recipes that match the criteria.

Matching rules:
- Use semantic understanding: "quick meals" matches recipes described as fast, easy, or with short prep times.
- Consider ingredients, cuisine type, dietary preferences, cooking method, and any detail in the name or description.
- Be inclusive on partial matches — if a recipe is reasonably relevant, include it.
- If the criteria are vague or match everything, return all IDs.

Output rules:
- Respond with a JSON array of matching recipe ID strings, e.g. ["1", "3", "5"]
- If no recipes match, respond with: []
- Do NOT include any explanation, markdown, or additional text — output ONLY the raw JSON array.`;

export class RecipeFilterService {
  async checkAvailability(): Promise<Availability> {
    try {
      return (await LanguageModel?.availability()) ?? "unavailable";
    } catch {
      return "unavailable";
    }
  }

  async filterRecipes(
    recipes: RecipePreview[],
    query: string,
  ): Promise<string[]> {
    const availability = await this.checkAvailability();
    if (availability === "unavailable") {
      throw new Error("AI filtering is not available in this browser");
    }

    const session = await LanguageModel.create({
      initialPrompts: [{ role: "system", content: SYSTEM_PROMPT }],
    });

    try {
      const recipesData = recipes.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
      }));

      const message = `Recipes:\n${JSON.stringify(recipesData)}\n\nFilter criteria: "${query}"\n\nReturn ONLY a JSON array of matching recipe IDs.`;
      const response = await session.prompt(message);

      console.debug("AI filter response:", response);

      const match = response.match(/\[[\s\S]*\]/);
      if (!match) return recipes.map((r) => r.id);

      const ids = JSON.parse(match[0]);
      return Array.isArray(ids) ? ids.map(String) : recipes.map((r) => r.id);
    } finally {
      session.destroy();
    }
  }
}
