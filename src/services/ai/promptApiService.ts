export class PromptApiService {
  private _session: LanguageModel | null = null;
  private _isInitializing = false;
  private _initializationPromise: Promise<LanguageModel> | null = null;

  async checkAvailability(): Promise<Availability> {
    if (!('LanguageModel' in self) || !self.LanguageModel) {
      return 'unavailable';
    }

    try {
      return await LanguageModel.availability();
    } catch (error) {
      console.error('Error checking Prompt API availability:', error);
      return 'unavailable';
    }
  }

  async createSession(options: LanguageModelCreateOptions = {}): Promise<LanguageModel> {
    // If already initializing, return the existing promise
    if (this._isInitializing && this._initializationPromise) {
      return this._initializationPromise;
    }

    // If session already exists, return it
    if (this._session) {
      return this._session;
    }

    this._isInitializing = true;

    this._initializationPromise = (async () => {
      try {
        if (!('LanguageModel' in self) || !self.LanguageModel) {
          throw new Error('Prompt API is not available in this browser');
        }

        const capabilities = await this.checkAvailability();

        if (capabilities === 'unavailable') {
          throw new Error('Prompt API is not available');
        }

        const sessionOptions: LanguageModelCreateOptions = {
          initialPrompts: options.initialPrompts ?? [],
          topK: options.topK ?? 40,
          temperature: options.temperature ?? 0.7,
        }

        // Add monitor for download progress if needed
        if (capabilities === 'available') {
          sessionOptions.monitor = (m: CreateMonitor) => {
            m.addEventListener('downloadprogress', (e) => {
              console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
            });
          };
        }

        const session = await LanguageModel.create(sessionOptions);
        this._session = session;
        return session;
      } catch (error) {
        console.error('Failed to create Prompt API session:', error);
        throw error;
      } finally {
        this._isInitializing = false;
        this._initializationPromise = null;
      }
    })();

    return this._initializationPromise;
  }

  async prompt(message: string, options?: LanguageModelCreateOptions): Promise<string> {
    try {
      // Create session if it doesn't exist
      if (!this._session) {
        await this.createSession(options);
      }

      if (!this._session) {
        throw new Error('Failed to create AI session');
      }

      const response = await this._session.prompt(message);
      return response;
    } catch (error) {
      console.error('Failed to get prompt response:', error);
      throw error;
    }
  }

  async promptStreaming(
    message: string,
    onChunk: (chunk: string) => void,
    options?: LanguageModelCreateOptions
  ): Promise<void> {
    try {
      // Create session if it doesn't exist
      if (!this._session) {
        await this.createSession(options);
      }

      if (!this._session) {
        throw new Error('Failed to create AI session');
      }

      const stream = this._session.promptStreaming(message);
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
    } catch (error) {
      console.error('Failed to stream prompt response:', error);
      throw error;
    }
  }

  async cloneSession(): Promise<LanguageModel | null> {
    if (!this._session) {
      return null;
    }

    try {
      const clonedSession = await this._session.clone();
      return clonedSession;
    } catch (error) {
      console.error('Failed to clone session:', error);
      return null;
    }
  }

  /**
   * Destroy the current session and free up resources
   */
  destroySession(): void {
    if (this._session) {
      this._session.destroy();
      this._session = null;
    }
  }

  getSession(): LanguageModel | null {
    return this._session;
  }
}
