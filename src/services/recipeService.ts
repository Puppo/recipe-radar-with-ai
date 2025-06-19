import { recipes } from '../data/recipes';
import type { Recipe, RecipePreview } from '../types/recipe';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const recipeService = {
  async searchRecipes(query: string): Promise<RecipePreview[]> {
    await delay(300);
    
    if (!query.trim()) {
      return [];
    }
    
    const lowerQuery = query.toLowerCase();
    
    const filteredRecipes = recipes.filter((recipe) => 
      recipe.name.toLowerCase().includes(lowerQuery) ||
      recipe.description.toLowerCase().includes(lowerQuery) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
      
    return filteredRecipes.map(({ id, name, description, imageUrl }): RecipePreview => ({
      id,
      name,
      description,
      imageUrl,
    }));
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
    
    return recipes.map(({ id, name, description, imageUrl }): RecipePreview => ({
      id,
      name,
      description,
      imageUrl,
    }));
  }
};
