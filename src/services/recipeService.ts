import { recipes } from '../data/recipes';
import type { Recipe, RecipePreview } from '../types/recipe';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const toPreview = ({ id, name, description, imageUrl }: Recipe): RecipePreview => ({
  id,
  name,
  description,
  imageUrl,
});

export function findRecipesByContent(query: string): RecipePreview[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return recipes
    .filter((recipe) =>
      recipe.name.toLowerCase().includes(normalizedQuery) ||
      recipe.description.toLowerCase().includes(normalizedQuery) ||
      recipe.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)),
    )
    .map(toPreview);
}

export const recipeService = {
  async searchRecipes(query: string): Promise<RecipePreview[]> {
    await delay(300);

    return findRecipesByContent(query);
  },
  
  async getRecipeById(id: string): Promise<Recipe> {
    await delay(300);
    
    const recipe = recipes.find(recipe => recipe.id === id);
    
    if (!recipe) {
      throw new Error('Recipe not found');
    }
    
    return recipe;
  },
  
  async getAllRecipes(): Promise<RecipePreview[]> {
    await delay(300);

    return recipes.map(toPreview);
  }
};
