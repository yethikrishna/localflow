export interface LLMMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface GenerateTextOptions {
  model?: string;
  messages: LLMMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface LLMProvider {
  name: string;
  generateText(options: GenerateTextOptions): Promise<string>;
  listModels(): Promise<string[]>;
}

/**
 * Ollama Local Provider
 */
export class OllamaProvider implements LLMProvider {
  name = "ollama";
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  }

  async generateText(options: GenerateTextOptions): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: options.model || "llama3",
        messages: options.messages,
        stream: false,
        options: {
          temperature: options.temperature,
          num_predict: options.maxTokens,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.message.content;
  }

  async listModels(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/api/tags`);
    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.models.map((m: any) => m.name);
  }
}

/**
 * Unified LLM Gateway
 */
export class LLMGateway {
  private providers: Map<string, LLMProvider> = new Map();
  private defaultProvider: string = "ollama";

  constructor() {
    this.registerProvider(new OllamaProvider());
  }

  registerProvider(provider: LLMProvider) {
    this.providers.set(provider.name, provider);
  }

  async generateText(options: GenerateTextOptions & { provider?: string }): Promise<string> {
    const providerName = options.provider || this.defaultProvider;
    const provider = this.providers.get(providerName);

    if (!provider) {
      throw new Error(`Provider not found: ${providerName}`);
    }

    return provider.generateText(options);
  }

  async listAllModels(): Promise<Record<string, string[]>> {
    const result: Record<string, string[]> = {};
    for (const [name, provider] of this.providers.entries()) {
      result[name] = await provider.listModels();
    }
    return result;
  }
}

export const llm = new LLMGateway();
