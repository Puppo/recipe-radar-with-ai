import type { Recipe, TranslatedRecipe } from '../../types/recipe';

class TranslatorService {
  private _languageMap: Record<string, Translator> = {}
  private readonly _translationCache: Record<string, string> = {}

  get languageMap(): Record<string, Translator> {
    return this._languageMap;
  }

  // Make this method public for use in the hook
  async isTranslationBetweenLanguagesSupported(
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<string> {
    if (!('Translator' in self)) return 'unavailable';
    try {
      const response = await Translator.availability({
        sourceLanguage,
        targetLanguage
      });
      console.log(`Translation support from '${sourceLanguage}' to '${targetLanguage}':`, response);
      return response;
    } catch (error) {
      console.error('Error checking translation support:', error);
      return 'unavailable';
    }
  }

  // Add method to set translator in language map
  setTranslator(languageCode: string, translator: Translator): void {
    this._languageMap[languageCode] = translator;
  }

  // Translate a single text string
  async translateText(text: string, targetLanguage: string): Promise<string> {
    if (targetLanguage === 'en') {
      return text; // No translation needed for English
    }

    const cacheKey = `${text}-${targetLanguage}`;
    if (this._translationCache[cacheKey]) {
      return this._translationCache[cacheKey];
    }

    const translator = this._languageMap[targetLanguage];
    if (!translator) {
      throw new Error(`Translator not available for language: ${targetLanguage}`);
    }

    try {
      const translatedText = await translator.translate(text);
      this._translationCache[cacheKey] = translatedText;
      return translatedText;
    } catch (error) {
      console.error(`Translation failed for text: ${text}`, error);
      throw error;
    }
  }

  // Translate an array of strings
  async translateArray(texts: string[], targetLanguage: string): Promise<string[]> {
    if (targetLanguage === 'en') {
      return texts; // No translation needed for English
    }

    const translations = await Promise.all(
      texts.map(text => this.translateText(text, targetLanguage))
    );
    return translations;
  }

  // Translate recipe content
  async translateRecipe(recipe: Recipe, targetLanguage: string): Promise<TranslatedRecipe> {
    if (targetLanguage === 'en') {
      return recipe; // No translation needed for English
    }

    try {
      const [name, description, ingredients, instructions, tags] = await Promise.all([
        this.translateText(recipe.name, targetLanguage),
        this.translateText(recipe.description, targetLanguage),
        this.translateArray(recipe.ingredients, targetLanguage),
        this.translateArray(recipe.instructions, targetLanguage),
        this.translateArray(recipe.tags, targetLanguage)
      ]);

      const translatedRecipe: TranslatedRecipe = {
        ...recipe,
        translations: {
          ...(recipe as TranslatedRecipe).translations,
          [targetLanguage]: {
            name,
            description,
            ingredients,
            instructions,
            tags
          }
        }
      };

      return translatedRecipe;
    } catch (error) {
      console.error(`Failed to translate recipe to ${targetLanguage}:`, error);
      throw error;
    }
  }

  // Get translated content from a recipe
  getTranslatedContent(recipe: TranslatedRecipe, language: string) {
    if (language === 'en') {
      return {
        name: recipe.name,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        tags: recipe.tags
      };
    }

    const translation = recipe.translations?.[language];
    if (!translation) {
      // Return original content if translation not available
      return {
        name: recipe.name,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        tags: recipe.tags
      };
    }

    return translation;
  }

  // Check if recipe has translation for language
  hasTranslation(recipe: TranslatedRecipe, language: string): boolean {
    return language === 'en' || !!recipe.translations?.[language];
  }
  
}

const translatorService = new TranslatorService();
export default translatorService;