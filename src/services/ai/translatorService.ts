import { languages } from './../../constants/languages';

// Local type declarations for our specific use case
interface TranslationMonitor {
  addEventListener: (event: 'downloadprogress', handler: (e: { loaded: number; total?: number }) => void) => void;
}

const DEFAULT_LANGUAGE = languages[0].code;

class TranslatorService {
  private _languageMap: Record<string, Translator> = {}

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
  
}

const translatorService = new TranslatorService();
export default translatorService;