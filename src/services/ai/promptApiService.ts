export class PromptApiService {
  private _session: LanguageModel | null = null;
  private _initializationPromise: Promise<LanguageModel> | null = null;

  async checkAvailability(): Promise<Availability> {
    try {
      return await LanguageModel?.availability() ?? 'unavailable';
    } catch {
      return 'unavailable';
    }
  }

  async createSession(options: LanguageModelCreateOptions = {}): Promise<LanguageModel> {
    // Return existing promise or session
    if (this._initializationPromise) return this._initializationPromise;
    if (this._session) return this._session;

    this._initializationPromise = (async () => {
      try {
        const capabilities = await this.checkAvailability();

        if (capabilities === 'unavailable') {
          throw new Error('Prompt API is not available in this browser');
        }

        const sessionOptions: LanguageModelCreateOptions = {
          initialPrompts: options.initialPrompts ?? [],
          topK: options.topK ?? 40,
          temperature: options.temperature ?? 0.7,
        };

        // Add monitor for download progress if needed
        if (capabilities === 'available') {
          sessionOptions.monitor = (m: CreateMonitor) => {
            m.addEventListener('downloadprogress', (e) => {
              console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
            });
          };
        }

        this._session = await LanguageModel.create(sessionOptions);
        return this._session;
      } finally {
        this._initializationPromise = null;
      }
    })();

    return this._initializationPromise;
  }

  private async ensureSession(options?: LanguageModelCreateOptions): Promise<LanguageModel> {
    if (!this._session) {
      await this.createSession(options);
    }
    return this._session!;
  }

  async prompt(message: string, options?: LanguageModelCreateOptions): Promise<string> {
    const session = await this.ensureSession(options);
    return session.prompt(message);
  }

  async promptStreaming(
    message: string,
    onChunk: (chunk: string) => void,
    options?: LanguageModelCreateOptions
  ): Promise<void> {
    const session = await this.ensureSession(options);
    const stream = session.promptStreaming(message);
    const reader = stream.getReader();
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        onChunk(value);
      }
    } finally {
      reader.releaseLock();
    }
  }

  async cloneSession(): Promise<LanguageModel | null> {
    return this._session?.clone() ?? null;
  }

  destroySession(): void {
    this._session?.destroy();
    this._session = null;
  }

  getSession(): LanguageModel | null {
    return this._session;
  }
}
