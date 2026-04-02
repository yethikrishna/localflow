export * from './SemanticMemory';
export * from './EpisodicMemory';
export * from './ProceduralMemory';

import { SemanticMemory } from './SemanticMemory';
import { EpisodicMemory } from './EpisodicMemory';
import { ProceduralMemory } from './ProceduralMemory';

export interface AgentMemory {
  semantic: SemanticMemory;
  episodic: EpisodicMemory;
  procedural: ProceduralMemory;
}

export class MemoryManager {
  private semantic: SemanticMemory;
  private procedural: ProceduralMemory;
  private episodicSessions: Map<string, EpisodicMemory> = new Map();

  constructor(private projectRoot: string) {
    this.semantic = new SemanticMemory(projectRoot);
    this.procedural = new ProceduralMemory();
  }

  public async initialize(): Promise<void> {
    await Promise.all([
      this.semantic.initialize(),
      this.procedural.initialize()
    ]);
  }

  public getSession(sessionId: string): EpisodicMemory {
    if (!this.episodicSessions.has(sessionId)) {
      this.episodicSessions.set(sessionId, new EpisodicMemory(sessionId));
    }
    return this.episodicSessions.get(sessionId)!;
  }

  public getAgentMemory(sessionId: string): AgentMemory {
    return {
      semantic: this.semantic,
      episodic: this.getSession(sessionId),
      procedural: this.procedural
    };
  }

  public async getAgentContextSummary(sessionId: string): Promise<{
    semantic: string[];
    episodic: string[];
    procedural: string[];
  }> {
    const memory = this.getAgentMemory(sessionId);
    const sections = await memory.semantic.getSections();
    const skills = await memory.procedural.loadSkills();
    const history = memory.episodic.getHistory();

    return {
      semantic: sections.map(s => s.section),
      episodic: history.slice(-5).map(e => `${e.agentId}: ${e.type}`),
      procedural: skills.map(s => s.name)
    };
  }

  public async recordDiscovery(services: any[]): Promise<void> {
    await this.semantic.recordDiscovery(services);
  }
}
