import type { Recipe } from '../../types/recipe';

class SummarizerService {
  private readonly _summaryCache: Record<string, string> = {};
  private _summarizer: Summarizer | null = null;

  async checkSummarizerSupport(): Promise<string> {
    if (!('Summarizer' in self)) return 'unavailable';
    
    try {
      const response = await Summarizer.availability();
      console.log('Summarizer support:', response);
      return response;
    } catch (error) {
      console.error('Error checking summarizer support:', error);
      return 'unavailable';
    }
  }

  async initializeSummarizer(): Promise<boolean> {
    if (this._summarizer) return true;

    const support = await this.checkSummarizerSupport();
    if (support === 'unavailable') {
      throw new Error('Summarizer is not available in this browser');
    }

    try {
      if (support === 'after-download') {
        console.log('Downloading summarizer model...');
      }

      this._summarizer = await Summarizer.create({
        type: 'key-points',
        format: 'markdown',
        length: 'short'
      });

      return true;
    } catch (error) {
      console.error('Failed to initialize summarizer:', error);
      throw error;
    }
  }

  async summarizeRecipe(recipe: Recipe): Promise<string> {
    const cacheKey = `recipe-${recipe.id}`;
    if (this._summaryCache[cacheKey]) {
      return this._summaryCache[cacheKey];
    }

    await this.initializeSummarizer();
    
    if (!this._summarizer) {
      throw new Error('Summarizer not initialized');
    }

    try {
      // Create a comprehensive text representation of the recipe
      const recipeText = this.formatRecipeForSummarization(recipe);
      
      const summary = await this._summarizer.summarize(recipeText);
      this._summaryCache[cacheKey] = this.formatSummaryAsHTML(summary);
      
      return this._summaryCache[cacheKey];
    } catch (error) {
      console.error(`Failed to summarize recipe ${recipe.id}:`, error);
      throw error;
    }
  }

  async summarizeRecipeById(recipeId: string): Promise<string> {
    const cacheKey = `recipe-${recipeId}`;
    if (this._summaryCache[cacheKey]) {
      return this._summaryCache[cacheKey];
    }

    await this.initializeSummarizer();
    
    if (!this._summarizer) {
      throw new Error('Summarizer not initialized');
    }

    try {
      // Import recipe service to get full recipe data
      const { recipeService } = await import('../recipeService');
      const recipe = await recipeService.getRecipeById(recipeId);
      
      // Create a comprehensive text representation of the recipe
      const recipeText = this.formatRecipeForSummarization(recipe);
      
      const summary = await this._summarizer.summarize(recipeText);
      this._summaryCache[cacheKey] = this.formatSummaryAsHTML(summary);
      
      return this._summaryCache[cacheKey];
    } catch (error) {
      console.error(`Failed to summarize recipe ${recipeId}:`, error);
      throw error;
    }
  }

  private formatRecipeForSummarization(recipe: Recipe): string {
    return `
Recipe: ${recipe.name}

Description: ${recipe.description}

Prep Time: ${recipe.prepTime}
Cook Time: ${recipe.cookTime}
Servings: ${recipe.servings}

Ingredients:
${recipe.ingredients.map(ingredient => `- ${ingredient}`).join('\n')}

Instructions:
${recipe.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n')}

Tags: ${recipe.tags.join(', ')}
    `.trim();
  }

  private formatSummaryAsHTML(summary: string): string {
    // Convert markdown-style formatting to HTML with Tailwind classes
    let formattedSummary = summary
      // Convert bullet points to HTML list items
      .replace(/^[-*•]\s+(.+)$/gm, '<li class="text-blue-800">$1</li>')
      // Convert numbered lists
      .replace(/^\d+\.\s+(.+)$/gm, '<li class="text-blue-800">$1</li>')
      // Convert bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-blue-900">$1</strong>')
      // Convert italic text
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Convert headers
      .replace(/^#{1,3}\s+(.+)$/gm, '<h5 class="font-medium text-blue-900 mb-1 mt-2">$1</h5>')
      // Convert line breaks to paragraph breaks
      .replace(/\n\n/g, '</p><p class="text-blue-800 mb-2">')
      // Remove standalone newlines
      .replace(/\n/g, ' ');

    // Wrap consecutive list items in ul tags
    formattedSummary = formattedSummary.replace(/(<li[^>]*>.*?<\/li>)(\s*<li[^>]*>.*?<\/li>)*/g, '<ul class="list-disc list-inside space-y-1 ml-4 mb-2">$&</ul>');
    
    // Wrap in paragraph tags if not already formatted
    if (!formattedSummary.includes('<p') && !formattedSummary.includes('<ul') && !formattedSummary.includes('<h')) {
      formattedSummary = `<p class="text-blue-800">${formattedSummary}</p>`;
    }

    // Clean up any empty paragraphs
    formattedSummary = formattedSummary.replace(/<p[^>]*><\/p>/g, '');

    return formattedSummary;
  }

  destroy(): void {
    if (this._summarizer) {
      this._summarizer.destroy();
      this._summarizer = null;
    }
  }
}

const summarizerService = new SummarizerService();
export default summarizerService;
