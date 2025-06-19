import type { Recipe, TranslatedRecipe } from '../../types/recipe';

class TranslatorService {
  private _languageMap: Record<string, Translator> = {}
  private readonly _translationCache: Record<string, string> = {}

  get languageMap(): Record<string, Translator> {
    return this._languageMap;
  }

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

  setTranslator(languageCode: string, translator: Translator): void {
    this._languageMap[languageCode] = translator;
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    if (targetLanguage === 'en') {
      return text;
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

  async translateArray(texts: string[], targetLanguage: string): Promise<string[]> {
    if (targetLanguage === 'en') {
      return texts;
    }

    const translations = await Promise.all(
      texts.map(text => this.translateText(text, targetLanguage))
    );
    return translations;
  }

  async translateRecipe(recipe: Recipe, targetLanguage: string): Promise<TranslatedRecipe> {
    if (targetLanguage === 'en') {
      return recipe;
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

  hasTranslation(recipe: TranslatedRecipe, language: string): boolean {
    return language === 'en' || !!recipe.translations?.[language];
  }
  
}

const translatorService = new TranslatorService();
export default translatorService;