class LanguageDetectionService {
  private _detector: LanguageDetector | null = null;
  private _isInitialized = false;
  private _initPromise: Promise<boolean> | null = null;

  async checkLanguageDetectionSupport(): Promise<Availability> {
    console.log('Checking language detection support...');
    if (!('LanguageDetector' in self)) {
      console.warn('LanguageDetector is not available in this browser');
      return 'unavailable';
    }

    try {
      const availability = await LanguageDetector.availability();
      console.log(`Language detection support: ${availability}`);
      return availability;
    } catch (error) {
      console.error('Error checking language detection support:', error);
      return 'unavailable';
    }
  }

  async initializeDetector(): Promise<boolean> {
    if (this._isInitialized) return true;
    if (this._initPromise) return this._initPromise;

    this._initPromise = this._doInitialize();
    return this._initPromise;
  }

  private async _doInitialize(): Promise<boolean> {
    if (!('LanguageDetector' in self)) {
      throw new Error('LanguageDetector is not available in this browser');
    }

    const support = await this.checkLanguageDetectionSupport();
    console.log(`Language detection support status: ${support}`);
    if (support === 'unavailable') {
      throw new Error('Language detection is not available in this browser');
    }

    try {
      if (support === 'downloadable') {
        console.log('Downloading language detection model...');
      }

      this._detector = await LanguageDetector.create();
      this._isInitialized = true;
      console.log('Language detector initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize language detector:', error);
      this._initPromise = null;
      throw error;
    }
  }

  async detectLanguage(text: string): Promise<LanguageDetectionResult[]> {
    if (!this._isInitialized || !this._detector) {
      const initialized = await this.initializeDetector();
      if (!initialized || !this._detector) {
        throw new Error('Language detector not initialized');
      }
    }

    try {
      return await this._detector.detect(text);
    } catch (error) {
      throw new Error(`Language detection failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private getSupportedLanguageMapping(): Record<string, string> {
    return {
      'en': 'en',
      'es': 'es', 
      'fr': 'fr',
      'it': 'it',
      'de': 'de',
      'pt': 'pt',
      'ja': 'ja',
      'ko': 'ko',
      'zh': 'zh',
      'zh-CN': 'zh',
      'zh-TW': 'zh'
    };
  }

  mapToSupportedLanguage(detectedLanguage: string): string {
    const mapping = this.getSupportedLanguageMapping();
    return mapping[detectedLanguage] || 'en';
  }

  async detectRecipeLanguage(recipe: { name: string; description: string; ingredients: string[] }): Promise<string> {
    try {
      const textToDetect = `${recipe.name} ${recipe.description} ${recipe.ingredients.slice(0, 3).join(' ')}`;
      
      const detections = await this.detectLanguage(textToDetect);

      const bestDetection = detections.map(d => ({
        detectedLanguage: this.mapToSupportedLanguage(d.detectedLanguage!),
        confidence: d.confidence ?? 0
      })).find(d => (d.confidence ?? 0 > 0.5) && !!d.detectedLanguage);

      if (bestDetection) {
        console.log(`Detected language: ${bestDetection.detectedLanguage} (confidence: ${bestDetection.confidence})`);
        return bestDetection.detectedLanguage;
      }
      
      console.log('Language detection confidence too low, defaulting to English');
      return 'en';
    } catch (error) {
      console.error('Recipe language detection failed:', error);
      return 'en';
    }
  }

  async detectBrowserLanguage(): Promise<string> {
    try {
      const browserLang = navigator.language || navigator.languages?.[0];
      if (browserLang) {
        const mappedLanguage = this.mapToSupportedLanguage(browserLang);
        if (mappedLanguage !== 'en') {
          console.log(`Browser language detected: ${browserLang} -> mapped to: ${mappedLanguage}`);
          return mappedLanguage;
        }
      }

      const sampleText = "Welcome to Recipe Radar. Find and discover amazing recipes.";
      const detections = await this.detectLanguage(sampleText);

      const bestDetection = detections.find(d => (d.confidence ?? 0 > 0.7) && !!d.detectedLanguage);
      if (bestDetection) {
        const mappedLanguage = this.mapToSupportedLanguage(bestDetection.detectedLanguage!);
        console.log(`Sample text detection: ${bestDetection.detectedLanguage} (confidence: ${bestDetection.confidence}) -> mapped to: ${mappedLanguage}`);
        return mappedLanguage;
      }

      return 'en';
    } catch (error) {
      console.error('Browser language detection failed:', error);
      return 'en';
    }
  }
}

const languageDetectionService = new LanguageDetectionService();
export default languageDetectionService;
