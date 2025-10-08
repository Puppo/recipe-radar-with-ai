import type { Recipe } from '../../types/recipe';
import { recipeService } from '../recipeService';

class SummarizerService {
  private readonly summaryCache = new Map<string, string>();
  private summarizer: Summarizer | null = null;

  async checkSummarizerSupport(): Promise<string> {
    if (!('Summarizer' in self)) return 'unavailable';
    
    try {
      return await Summarizer.availability();
    } catch {
      return 'unavailable';
    }
  }

  async initializeSummarizer(): Promise<boolean> {
    if (this.summarizer) return true;

    const support = await this.checkSummarizerSupport();
    if (support === 'unavailable') {
      throw new Error('Summarizer is not available in this browser');
    }

    this.summarizer = await Summarizer.create({
      type: 'key-points',
      format: 'markdown',
      length: 'short'
    });

    return true;
  }

  async summarizeRecipe(recipe: Recipe): Promise<string> {
    return this.getSummary(recipe.id, async () => {
      const recipeText = this.formatRecipeForSummarization(recipe);
      return await this.generateSummary(recipeText);
    });
  }

  async summarizeRecipeById(recipeId: string): Promise<string> {
    return this.getSummary(recipeId, async () => {
      const recipe = await recipeService.getRecipeById(recipeId);
      const recipeText = this.formatRecipeForSummarization(recipe);
      return await this.generateSummary(recipeText);
    });
  }

  private async getSummary(recipeId: string, generator: () => Promise<string>): Promise<string> {
    const cached = this.summaryCache.get(recipeId);
    if (cached) return cached;

    const summary = await generator();
    this.summaryCache.set(recipeId, summary);
    return summary;
  }

  private async generateSummary(text: string): Promise<string> {
    await this.initializeSummarizer();
    
    if (!this.summarizer) {
      throw new Error('Summarizer not initialized');
    }

    const summary = await this.summarizer.summarize(text);
    return this.formatSummaryAsHTML(summary);
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
    const htmlClasses = {
      list: 'text-blue-800',
      strong: 'font-semibold text-blue-900',
      heading: 'font-medium text-blue-900 mb-1 mt-2',
      paragraph: 'text-blue-800 mb-2',
      ul: 'list-disc list-inside space-y-1 ml-4 mb-2'
    };

    return summary
      .replace(/^[-*•]\s+(.+)$/gm, `<li class="${htmlClasses.list}">$1</li>`)
      .replace(/^\d+\.\s+(.+)$/gm, `<li class="${htmlClasses.list}">$1</li>`)
      .replace(/\*\*(.*?)\*\*/g, `<strong class="${htmlClasses.strong}">$1</strong>`)
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/^#{1,3}\s+(.+)$/gm, `<h5 class="${htmlClasses.heading}">$1</h5>`)
      .replace(/\n\n/g, `</p><p class="${htmlClasses.paragraph}">`)
      .replace(/\n/g, ' ')
      .replace(/(<li[^>]*>.*?<\/li>)(\s*<li[^>]*>.*?<\/li>)*/g, `<ul class="${htmlClasses.ul}">$&</ul>`)
      .replace(/^(?!<[puh]|<ul)(.+)$/gm, `<p class="${htmlClasses.paragraph}">$1</p>`)
      .replace(/<p[^>]*><\/p>/g, '');
  }

  destroy(): void {
    if (this.summarizer) {
      this.summarizer.destroy();
      this.summarizer = null;
    }
  }
}

const summarizerService = new SummarizerService();
export default summarizerService;
