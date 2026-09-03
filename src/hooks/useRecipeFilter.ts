import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RecipeFilterService } from "../services/ai/recipeFilterService";
import { findRecipesByContent } from "../services/recipeService";
import type { RecipePreview } from "../types/recipe";
import useDebounce from "./useDebounce";

type UseRecipeFilterProps = {
  initialQuery?: string;
};

export type RecipeSearchMode = "checking" | "ai" | "keyword";

type SearchResult = {
  matchedIds: string[];
  forQuery: string;
  mode: RecipeSearchMode | null;
  error: string | null;
};

const initialResult: SearchResult = {
  matchedIds: [],
  forQuery: "",
  mode: null,
  error: null,
};

export function useRecipeFilter(
  recipes: RecipePreview[],
  { initialQuery = "" }: UseRecipeFilterProps = {},
) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [searchResult, setSearchResult] = useState<SearchResult>(initialResult);
  const [searchMode, setSearchMode] = useState<RecipeSearchMode>("checking");
  const serviceRef = useRef(new RecipeFilterService());

  useDebounce(() => setDebouncedQuery(searchQuery), 600, [searchQuery]);

  useEffect(() => {
    let cancelled = false;

    serviceRef.current
      .checkAvailability()
      .then((availability) => {
        if (!cancelled) {
          setSearchMode(availability === "unavailable" ? "keyword" : "ai");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSearchMode("keyword");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const query = debouncedQuery.trim();
    if (!query || recipes.length === 0 || searchMode === "checking") return;

    let cancelled = false;
    const search =
      searchMode === "ai"
        ? serviceRef.current.filterRecipes(recipes, query)
        : Promise.resolve(
            findRecipesByContent(query).map((recipe) => recipe.id),
          );

    search
      .then((matchedIds) => {
        if (!cancelled) {
          setSearchResult({
            matchedIds,
            forQuery: query,
            mode: searchMode,
            error: null,
          });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setSearchResult({
            matchedIds: [],
            forQuery: query,
            mode: searchMode,
            error:
              error instanceof Error ? error.message : "Failed to search recipes",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, recipes, searchMode]);

  const normalizedQuery = debouncedQuery.trim();
  const isSearchActive = normalizedQuery.length > 0;
  const resultIsCurrent =
    searchResult.forQuery === normalizedQuery && searchResult.mode === searchMode;
  const error = isSearchActive && resultIsCurrent ? searchResult.error : null;
  const isSearching =
    isSearchActive &&
    (searchMode === "checking" ||
      recipes.length === 0 ||
      !resultIsCurrent);

  const results = useMemo(() => {
    if (!isSearchActive) return recipes;
    if (!resultIsCurrent || searchResult.error) return [];

    return recipes.filter((recipe) => searchResult.matchedIds.includes(recipe.id));
  }, [isSearchActive, recipes, resultIsCurrent, searchResult]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setDebouncedQuery("");
    setSearchResult(initialResult);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    results,
    isSearching,
    error,
    searchMode,
    isSearchActive,
    clearSearch,
  };
}
