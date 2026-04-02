// Provider-agnostic LLM abstraction layer
// Supporting 100+ providers via LiteLLM/direct SDKs

export interface LLMProvider {
  name: string;
  generate(prompt: string): Promise<string>;
}

export class NexusLLM {
  private providers: Map<string, LLMProvider> = new Map();

  register(provider: LLMProvider) {
    this.providers.set(provider.name, provider);
  }
}
