export interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  tags: string[];
}

export type RecipePreview = Pick<Recipe, 'id' | 'name' | 'description' | 'imageUrl'>;

export interface TranslatedRecipe extends Recipe {
  translations?: Record<string, Omit<Recipe, 'id' | 'imageUrl' | 'servings'>>;
}
