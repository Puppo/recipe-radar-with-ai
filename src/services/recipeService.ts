import { recipes } from '../data/recipes';
import type { Recipe, RecipePreview } from '../types/recipe';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API functions for recipes
export const recipeService = {
  /**
   * Search recipes by query
   */
  async searchRecipes(query: string): Promise<RecipePreview[]> {
    // Simulate API latency
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
  
  /**
   * Get recipe by id
   */
  async getRecipeById(id: string): Promise<Recipe> {
    // Simulate API latency
    await delay(300);
    
    const recipe = recipes.find(recipe => recipe.id === id);
    
    if (!recipe) {
      throw new Error('Recipe not found');
    }
    
    return recipe;
  },
  
  /**
   * Get all recipes
   */
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
