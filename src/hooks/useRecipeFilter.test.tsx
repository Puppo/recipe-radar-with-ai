import {
  act,
  renderHook,
  type RenderHookResult,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { RecipePreview } from "../types/recipe";
import { useRecipeFilter } from "./useRecipeFilter";

const mocks = vi.hoisted(() => ({
  checkAvailability: vi.fn(),
  filterRecipes: vi.fn(),
  findRecipesByContent: vi.fn(),
}));

vi.mock("../services/ai/recipeFilterService", () => ({
  RecipeFilterService: class {
    checkAvailability = mocks.checkAvailability;
    filterRecipes = mocks.filterRecipes;
  },
}));

vi.mock("../services/recipeService", () => ({
  findRecipesByContent: mocks.findRecipesByContent,
}));

const recipes: RecipePreview[] = [
  {
    id: "1",
    name: "Pasta",
    description: "A quick dinner",
    imageUrl: "pasta.jpg",
  },
  {
    id: "2",
    name: "Curry",
    description: "A spicy dinner",
    imageUrl: "curry.jpg",
  },
];

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return { promise, resolve, reject };
}

async function settleEffects() {
  await act(async () => {
    await Promise.resolve();
  });
}

async function enterQuery(
  result: RenderHookResult<ReturnType<typeof useRecipeFilter>, unknown>["result"],
  query: string,
) {
  act(() => result.current.setSearchQuery(query));
  await act(async () => {
    await vi.advanceTimersByTimeAsync(600);
  });
}

describe("useRecipeFilter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mocks.checkAvailability.mockResolvedValue("available");
    mocks.filterRecipes.mockResolvedValue(["1"]);
    mocks.findRecipesByContent.mockReturnValue([recipes[1]]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.each(["available", "downloadable"])(
    "uses AI mode when model availability is %s",
    async (availability) => {
      mocks.checkAvailability.mockResolvedValue(availability);
      const { result } = renderHook(() => useRecipeFilter(recipes));

      await settleEffects();
      await enterQuery(result, "quick dinner");

      expect(result.current.searchMode).toBe("ai");
      expect(mocks.filterRecipes).toHaveBeenCalledWith(recipes, "quick dinner");
      expect(mocks.findRecipesByContent).not.toHaveBeenCalled();
      expect(result.current.results.map(({ id }) => id)).toEqual(["1"]);
    },
  );

  it("uses keyword search when Built-In AI is unavailable", async () => {
    mocks.checkAvailability.mockResolvedValue("unavailable");
    const { result } = renderHook(() => useRecipeFilter(recipes));

    await settleEffects();
    await enterQuery(result, "spicy");

    expect(result.current.searchMode).toBe("keyword");
    expect(mocks.findRecipesByContent).toHaveBeenCalledWith("spicy");
    expect(mocks.filterRecipes).not.toHaveBeenCalled();
    expect(result.current.results.map(({ id }) => id)).toEqual(["2"]);
  });

  it("waits for availability before running a pending query", async () => {
    const availability = deferred<"unavailable">();
    mocks.checkAvailability.mockReturnValue(availability.promise);
    const { result } = renderHook(() => useRecipeFilter(recipes));

    await enterQuery(result, "spicy");
    expect(result.current.searchMode).toBe("checking");
    expect(result.current.isSearching).toBe(true);
    expect(mocks.filterRecipes).not.toHaveBeenCalled();
    expect(mocks.findRecipesByContent).not.toHaveBeenCalled();

    availability.resolve("unavailable");
    await settleEffects();

    expect(result.current.searchMode).toBe("keyword");
    expect(mocks.findRecipesByContent).toHaveBeenCalledWith("spicy");
    expect(result.current.results.map(({ id }) => id)).toEqual(["2"]);
  });

  it("ignores a stale AI result after the query changes", async () => {
    const firstSearch = deferred<string[]>();
    const secondSearch = deferred<string[]>();
    mocks.filterRecipes
      .mockReturnValueOnce(firstSearch.promise)
      .mockReturnValueOnce(secondSearch.promise);
    const { result } = renderHook(() => useRecipeFilter(recipes));

    await settleEffects();
    await enterQuery(result, "first");
    await enterQuery(result, "second");

    secondSearch.resolve(["2"]);
    await settleEffects();
    firstSearch.resolve(["1"]);
    await settleEffects();

    expect(result.current.results.map(({ id }) => id)).toEqual(["2"]);
  });

  it("shows an AI error without falling back to keyword search", async () => {
    mocks.filterRecipes.mockRejectedValue(new Error("AI search failed"));
    const { result } = renderHook(() => useRecipeFilter(recipes));

    await settleEffects();
    await enterQuery(result, "dinner");

    expect(result.current.searchMode).toBe("ai");
    expect(result.current.error).toBe("AI search failed");
    expect(result.current.results).toEqual([]);
    expect(mocks.findRecipesByContent).not.toHaveBeenCalled();
  });
});
