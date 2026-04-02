export enum MemoryEntryType {
  NAVIGATION = 'navigation',
  EDIT = 'edit',
  COMMAND = 'command',
  THOUGHT = 'thought',
  OBSERVATION = 'observation'
}

export interface EpisodicMemoryEntry {
  timestamp: number;
  type: MemoryEntryType;
  payload: any;
  agentId: string;
}

export class EpisodicMemory {
  private history: EpisodicMemoryEntry[] = [];
  private activeContext: {
    openFiles: string[];
    visibleTerminalOutput: string;
    recentDiffs: string[];
  } = {
    openFiles: [],
    visibleTerminalOutput: '',
    recentDiffs: []
  };

  constructor(private sessionId: string) {}

  public log(type: MemoryEntryType, payload: any, agentId: string): void {
    const entry: EpisodicMemoryEntry = {
      timestamp: Date.now(),
      type,
      payload,
      agentId
    };
    this.history.push(entry);
  }

  public getHistory(): EpisodicMemoryEntry[] {
    return [...this.history];
  }

  public getContext(): any {
    return { ...this.activeContext };
  }

  public updateContext(update: Partial<typeof this.activeContext>): void {
    this.activeContext = { ...this.activeContext, ...update };
  }

  /**
   * Return a summary of the session for the LLM
   */
  public getSummary(): string {
    return this.history
      .slice(-20) // last 20 events for context
      .map(e => `[${new Date(e.timestamp).toLocaleTimeString()}] ${e.agentId} (${e.type}): ${JSON.stringify(e.payload)}`)
      .join('\n');
  }
}
