import type { Recipe, TranslatedRecipe } from '../../types/recipe';

class TranslatorService {
  private readonly languageTranslators = new Map<string, Translator>();
  private readonly translationCache = new Map<string, string>();

  get languageMap(): Record<string, Translator> {
    return Object.fromEntries(this.languageTranslators);
  }

  async isTranslationBetweenLanguagesSupported(
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<string> {
    if (!('Translator' in self)) return 'unavailable';
    
    try {
      return await Translator.availability({ sourceLanguage, targetLanguage });
    } catch {
      return 'unavailable';
    }
  }

  setTranslator(languageCode: string, translator: Translator): void {
    this.languageTranslators.set(languageCode, translator);
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    if (targetLanguage === 'en') return text;

    const cacheKey = `${text}|${targetLanguage}`;
    const cached = this.translationCache.get(cacheKey);
    if (cached) return cached;

    const translator = this.languageTranslators.get(targetLanguage);
    if (!translator) {
      throw new Error(`Translator not available for language: ${targetLanguage}`);
    }

    const translatedText = await translator.translate(text);
    this.translationCache.set(cacheKey, translatedText);
    return translatedText;
  }

  async translateArray(texts: string[], targetLanguage: string): Promise<string[]> {
    if (targetLanguage === 'en') return texts;
    return Promise.all(texts.map(text => this.translateText(text, targetLanguage)));
  }

  async translateRecipe(recipe: Recipe, targetLanguage: string): Promise<TranslatedRecipe> {
    if (targetLanguage === 'en') return recipe;

    const [name, description, ingredients, instructions, tags, cookTime, prepTime] = await Promise.all([
      this.translateText(recipe.name, targetLanguage),
      this.translateText(recipe.description, targetLanguage),
      this.translateArray(recipe.ingredients, targetLanguage),
      this.translateArray(recipe.instructions, targetLanguage),
      this.translateArray(recipe.tags, targetLanguage),
      this.translateText(recipe.cookTime, targetLanguage),
      this.translateText(recipe.prepTime, targetLanguage),
    ]);

    return {
      ...recipe,
      translations: {
        ...(recipe as TranslatedRecipe).translations,
        [targetLanguage]: {
          name,
          description,
          ingredients,
          instructions,
          tags,
          cookTime,
          prepTime,
        }
      }
    };
  }

  getTranslatedContent(recipe: TranslatedRecipe, language: string): Omit<Recipe, 'id' | 'imageUrl' | 'servings'> {
    const baseContent = {
      name: recipe.name,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      tags: recipe.tags,
      cookTime: recipe.cookTime,
      prepTime: recipe.prepTime,
    };

    return language === 'en' || !recipe.translations?.[language]
      ? baseContent
      : recipe.translations[language];
  }

  hasTranslation(recipe: TranslatedRecipe, language: string): boolean {
    return language === 'en' || !!recipe.translations?.[language];
  }
  
}

const translatorService = new TranslatorService();
export default translatorService;