import { describe, expect, it } from "vitest";
import { recipes } from "../data/recipes";
import { findRecipesByContent } from "./recipeService";

describe("findRecipesByContent", () => {
  it("matches names with trimmed, case-insensitive queries", () => {
    expect(findRecipesByContent("  sPaGhEtTi CaRbOnArA  ").map(({ id }) => id))
      .toEqual(["1"]);
  });

  it("matches recipe descriptions", () => {
    expect(findRecipesByContent("gooey chocolate chips").map(({ id }) => id))
      .toContain("4");
  });

  it("matches recipe tags", () => {
    expect(findRecipesByContent("hEaLtHy").map(({ id }) => id))
      .toContain("3");
  });

  it("preserves dataset order", () => {
    const expectedIds = recipes
      .filter((recipe) => recipe.tags.includes("Dinner"))
      .map(({ id }) => id);

    expect(findRecipesByContent("dinner").map(({ id }) => id))
      .toEqual(expectedIds);
  });

  it("returns no results for an empty query", () => {
    expect(findRecipesByContent("   ")).toEqual([]);
  });
});
