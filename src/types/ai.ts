/**
 * Categorical sampling modes for the Prompt API (Chrome 151+).
 *
 * Replaces the legacy raw `temperature` and `topK` knobs, which have been
 * removed from the web-context surface of `LanguageModel.create()` to ensure
 * cross-model consistency. The browser maps each semantic preset to the
 * optimal raw parameters for the underlying model.
 *
 * @see https://developer.chrome.com/docs/ai/prompt-api
 */
export type AILanguageModelSamplingMode =
  | "most-predictable" // strict consistency / factual extraction
  | "predictable" // highly focused outputs
  | "balanced" // default for standard prompting
  | "creative" // variety over strict facts
  | "most-creative"; // maximum token diversity / brainstorming

/**
 * Local extension of the upstream `LanguageModelCreateOptions` that adds the
 * new `samplingMode` field. The `@types/dom-chromium-ai` package does not yet
 * reflect Chrome 151, so we declare the field ourselves to keep a working
 * build without pinning the dependency.
 */
export type PromptApiCreateOptions = LanguageModelCreateOptions & {
  samplingMode?: AILanguageModelSamplingMode;
};

