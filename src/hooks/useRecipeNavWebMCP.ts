import { useNavigate } from "react-router-dom";
import { useWebMCP } from "./useWebMCP";

export function useRecipeNavWebMCP(): void {
  const navigate = useNavigate();

  useWebMCP({
    name: "go_back_to_search",
    description:
      "From a recipe detail page, return to the search page (which redirects to home with the previous filter if any).",
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      openWorldHint: false,
    },
    execute: async (_args, client) => {
      await client.requestUserInteraction(async () => {
        navigate("/search");
      });
      return { navigated_to: "/search" };
    },
  });
}
