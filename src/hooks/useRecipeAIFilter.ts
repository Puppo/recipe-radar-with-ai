import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RecipeFilterService } from "../services/ai/recipeFilterService";
import type { RecipePreview } from "../types/recipe";
import useDebounce from "./useDebounce";

type UseRecipeAIFilterProps = {
  initialQuery?: string;
};

type FilterResult = {
  matchedIds: string[] | null;
  forQuery: string;
  error: string | null;
};

const initialResult: FilterResult = {
  matchedIds: null,
  forQuery: "",
  error: null,
};

export function useRecipeAIFilter(
  recipes: RecipePreview[],
  { initialQuery = "" }: UseRecipeAIFilterProps = {},
) {
  const [filterQuery, setFilterQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  useDebounce(() => setDebouncedQuery(filterQuery), 600, [filterQuery]);
  const [filterResult, setFilterResult] =
    useState<FilterResult>(initialResult);
  const [isAvailable, setIsAvailable] = useState(false);
  const serviceRef = useRef(new RecipeFilterService());

  useEffect(() => {
    serviceRef.current.checkAvailability().then((avail) => {
      setIsAvailable(avail !== "unavailable");
    });
  }, []);

  useEffect(() => {
    const query = debouncedQuery.trim();
    if (!query || recipes.length === 0) return;

    const controller = new AbortController();

    serviceRef.current
      .filterRecipes(recipes, debouncedQuery)
      .then((ids) => {
        if (!controller.signal.aborted) {
          setFilterResult({
            matchedIds: ids,
            forQuery: debouncedQuery,
            error: null,
          });
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setFilterResult({
            matchedIds: null,
            forQuery: debouncedQuery,
            error:
              err instanceof Error ? err.message : "Failed to filter recipes",
          });
        }
      });

    return () => controller.abort();
  }, [debouncedQuery, recipes]);

  const isFilterActive = debouncedQuery.trim().length > 0;

  const isFiltering =
    isFilterActive &&
    recipes.length > 0 &&
    filterResult.forQuery !== debouncedQuery;

  const filteredRecipes = useMemo(() => {
    if (!isFilterActive || filterResult.forQuery !== debouncedQuery)
      return recipes;
    if (filterResult.matchedIds === null) return recipes;
    return recipes.filter((r) => filterResult.matchedIds!.includes(r.id));
  }, [recipes, debouncedQuery, isFilterActive, filterResult]);

  const clearFilter = useCallback(() => {
    setFilterQuery("");
    setDebouncedQuery("");
    setFilterResult(initialResult);
  }, []);

  return {
    filterQuery,
    setFilterQuery,
    filteredRecipes,
    isFiltering,
    error: isFilterActive ? filterResult.error : null,
    isAvailable,
    isFilterActive,
    clearFilter,
  };
}
