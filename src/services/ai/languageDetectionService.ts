export class LanguageDetectionService {
  private detector: LanguageDetector | null = null;
  private initPromise: Promise<void> | null = null;

  async checkLanguageDetectionSupport(): Promise<Availability> {
    if (!('LanguageDetector' in self)) {
      return 'unavailable';
    }

    try {
      return await LanguageDetector.availability();
    } catch {
      return 'unavailable';
    }
  }

  async initializeDetector(): Promise<boolean> {
    // Already initialized
    if (this.detector) return true;

    // Already initializing
    if (this.initPromise) {
      await this.initPromise;
      return this.detector !== null;
    }

    // Start initialization
    this.initPromise = this.doInitialize();
    await this.initPromise;
    return this.detector !== null;
  }

  private async doInitialize(): Promise<void> {
    const support = await this.checkLanguageDetectionSupport();
    
    if (support === 'unavailable') {
      throw new Error('Language detection is not available in this browser');
    }

    this.detector = await LanguageDetector.create();
  }

  private normalizeLanguageCode(langCode: string): string {
    // Normalize Chinese variants to 'zh'
    if (langCode.startsWith('zh')) return 'zh';
    
    // Extract base language code (e.g., 'en-US' -> 'en')
    return langCode.split('-')[0].toLowerCase();
  }

  async detectRecipeLanguage(recipe: { name: string; description: string; ingredients: string[] }): Promise<string> {
    try {
      await this.initializeDetector();
      
      if (!this.detector) {
        return 'en';
      }

      const textToDetect = `${recipe.name} ${recipe.description} ${recipe.ingredients.slice(0, 3).join(' ')}`;
      const detections = await this.detector.detect(textToDetect);

      // Find first detection with confidence > 0.5
      const bestDetection = detections.find(d => (d.confidence ?? 0) > 0.5 && d.detectedLanguage);

      if (bestDetection?.detectedLanguage) {
        const normalized = this.normalizeLanguageCode(bestDetection.detectedLanguage);
        console.log(`Detected language: ${normalized} (confidence: ${bestDetection.confidence})`);
        return normalized;
      }
      
      return 'en';
    } catch (error) {
      console.error('Recipe language detection failed:', error);
      return 'en';
    }
  }

  async detectBrowserLanguage(): Promise<string> {
    const browserLang = navigator.language || navigator.languages?.[0];
    
    if (browserLang) {
      const normalized = this.normalizeLanguageCode(browserLang);
      console.log(`Browser language detected: ${browserLang} -> ${normalized}`);
      return normalized;
    }

    return 'en';
  }
}

const languageDetectionService = new LanguageDetectionService();
export default languageDetectionService;
