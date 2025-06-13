import { languages } from './../../constants/languages';

const DEFAULT_LANGUAGE = languages[0].code;

class TranslatorService {
  static get availability(): boolean {
    return 'Translator' in self;
  }

  private _languageMap: Record<string, Translator> = {}

  get languageMap(): Record<string, Translator> {
    return this._languageMap;
  }

  private async isTranslationBetweenLanguagesSupported(
  sourceLanguage: string,
  targetLanguage: string
): Promise<Availability> {
  if (!TranslatorService.availability) return 'unavailable';
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

  async init() {
    await Promise.all(languages.map(async (lang) => {
      const availability = await this.isTranslationBetweenLanguagesSupported(DEFAULT_LANGUAGE, lang.code);
      if (availability !== 'unavailable') {
        const translator = await Translator.create({
          sourceLanguage: DEFAULT_LANGUAGE,
          targetLanguage: lang.code,
          monitor(m) {
            m.addEventListener('downloadprogress', (e) => {
              console.log(`Downloaded ${e.loaded * 100}% for ${lang.code}`);
            });
          },
        });
        this._languageMap[lang.code] = translator;
      } else {
        console.warn(`Translation from ${DEFAULT_LANGUAGE} to ${lang.code} is not supported.`);
      }
    }));
  }
  
}

const translatorService = new TranslatorService();
translatorService.init().catch((error) => {
  console.error('Failed to initialize translator service:', error);
});
export default translatorService;