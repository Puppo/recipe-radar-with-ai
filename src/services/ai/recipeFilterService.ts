import type { RecipePreview } from "../../types/recipe";

const SYSTEM_PROMPT = `You are a recipe filter assistant. Your task is to filter a list of recipes based on the user's natural language criteria.
Given a list of recipes and filter criteria, respond ONLY with a valid JSON array containing the IDs of matching recipes.
Example: ["1", "3", "5"]
If no recipes match, respond with: []
Do not include any explanation, markdown formatting, or other text — only the JSON array.`;

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

      const match = response.match(/\[[\s\S]*\]/);
      if (!match) return recipes.map((r) => r.id);

      const ids = JSON.parse(match[0]);
      return Array.isArray(ids) ? ids.map(String) : recipes.map((r) => r.id);
    } finally {
      session.destroy();
    }
  }
}
