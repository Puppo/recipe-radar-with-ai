import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RecipePreview } from "../types/recipe";
import { HomePage } from "./HomePage";

const mocks = vi.hoisted(() => ({
  useRecipeFilter: vi.fn(),
  useAllRecipes: vi.fn(),
}));

vi.mock("../hooks/useRecipeFilter", () => ({
  useRecipeFilter: mocks.useRecipeFilter,
}));

vi.mock("../hooks/useRecipes", () => ({
  useAllRecipes: mocks.useAllRecipes,
}));

vi.mock("../hooks/useSearchWebMCP", () => ({
  useSearchWebMCP: vi.fn(),
}));

vi.mock("../components/RecipeCard", () => ({
  RecipeCard: ({ recipe }: { recipe: RecipePreview }) => (
    <article>{recipe.name}</article>
  ),
}));

const recipe: RecipePreview = {
  id: "1",
  name: "Pasta",
  description: "A quick dinner",
  imageUrl: "pasta.jpg",
};

function mockSearchState(
  overrides: Partial<ReturnType<typeof defaultSearchState>> = {},
) {
  mocks.useRecipeFilter.mockImplementation(
    (_recipes: RecipePreview[], options?: { initialQuery?: string }) => ({
      ...defaultSearchState(),
      searchQuery: options?.initialQuery ?? "",
      ...overrides,
    }),
  );
}

function defaultSearchState() {
  return {
    searchQuery: "",
    setSearchQuery: vi.fn(),
    results: [recipe],
    isSearching: false,
    error: null as string | null,
    searchMode: "checking" as "checking" | "ai" | "keyword",
    isSearchActive: false,
    clearSearch: vi.fn(),
  };
}

describe("HomePage adaptive search", () => {
  beforeEach(() => {
    mocks.useAllRecipes.mockReturnValue({ recipes: [recipe] });
    mockSearchState();
  });

  it.each([
    ["checking", "Checking AI…"],
    ["ai", "AI enhanced"],
    ["keyword", "Keyword search"],
  ] as const)("keeps the input visible in %s mode", (searchMode, modeLabel) => {
    mockSearchState({ searchMode });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("searchbox", { name: "Recipe search" }))
      .toBeInTheDocument();
    expect(screen.getByText(modeLabel)).toBeInTheDocument();
  });

  it("uses the URL filter as the initial query in keyword mode", () => {
    mockSearchState({
      searchMode: "keyword",
      isSearchActive: true,
    });

    render(
      <MemoryRouter initialEntries={["/?filter=pasta"]}>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("searchbox", { name: "Recipe search" }))
      .toHaveValue("pasta");
    expect(screen.getByText(/using keyword search across names/i))
      .toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /search results/i }))
      .toBeInTheDocument();
  });

  it("announces an AI execution error and suppresses results", () => {
    mockSearchState({
      searchQuery: "dinner",
      searchMode: "ai",
      isSearchActive: true,
      results: [],
      error: "AI search failed",
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("AI search failed");
    expect(screen.queryByRole("heading", { name: /search results/i }))
      .not.toBeInTheDocument();
    expect(screen.queryByText(/no recipes match/i)).not.toBeInTheDocument();
  });
});
