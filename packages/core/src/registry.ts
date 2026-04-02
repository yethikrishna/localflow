import * as fs from 'fs';
import * as path from 'path';

export interface WorkflowStep {
  id: string;
  tool: string;
  params: Record<string, unknown>;
  dependsOn?: string[];
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  trigger: { type: 'manual' | 'schedule'; cron?: string };
  steps: WorkflowStep[];
  createdAt: string;
  version?: string;
  author?: string;
  tags?: string[];
}

export interface RegistryStats {
  total: number;
  byTool: Record<string, number>;
  recentlyAdded: WorkflowDefinition[];
}

export const BUILT_IN_WORKFLOWS: WorkflowDefinition[] = [
  {
    id: 'ai-news-weekly',
    name: 'Weekly AI News Summary',
    description: 'Research AI news, summarize with Ollama, and save to AppFlowy.',
    trigger: { type: 'schedule', cron: '0 9 * * 1' },
    steps: [
      { id: 'research', tool: 'web-search', params: { query: 'latest AI news' } },
      { id: 'summarize', tool: 'ollama-summarize', params: { model: 'llama3' }, dependsOn: ['research'] },
      { id: 'save', tool: 'appflowy-save', params: { databaseId: 'ai-news' }, dependsOn: ['summarize'] },
    ],
    createdAt: new Date().toISOString(),
    version: '1.0.0',
    author: 'LocalFlow',
    tags: ['ai', 'news', 'automation'],
  },
  {
    id: 'nocodb-report',
    name: 'NocoDB to AppFlowy Report',
    description: 'Query NocoDB table, summarize data, and update AppFlowy page.',
    trigger: { type: 'manual' },
    steps: [
      { id: 'query', tool: 'nocodb-query', params: { table: 'Tasks' } },
      { id: 'summarize', tool: 'ai-summarize', params: { prompt: 'Summarize tasks' }, dependsOn: ['query'] },
      { id: 'update', tool: 'appflowy-update', params: { pageId: 'reports' }, dependsOn: ['summarize'] },
    ],
    createdAt: new Date().toISOString(),
    version: '1.0.0',
    author: 'LocalFlow',
    tags: ['database', 'report'],
  },
  {
    id: 'web-research',
    name: 'Web Research Assistant',
    description: 'Navigate to a URL, perform STORM research, and save the summary.',
    trigger: { type: 'manual' },
    steps: [
      { id: 'navigate', tool: 'browser-navigate', params: { url: 'https://news.ycombinator.com' } },
      { id: 'storm', tool: 'storm-research', params: { depth: 2 }, dependsOn: ['navigate'] },
      { id: 'save', tool: 'file-save', params: { path: './research.md' }, dependsOn: ['storm'] },
    ],
    createdAt: new Date().toISOString(),
    version: '1.0.0',
    author: 'LocalFlow',
    tags: ['research', 'web', 'storm'],
  },
];

export class WorkflowRegistry {
  private workflows: Map<string, WorkflowDefinition> = new Map();
  private readonly storagePath: string;

  constructor() {
    this.storagePath = path.join(process.cwd(), '.nexus', 'workflows');
    this.ensureDirectoryExists();
    this.loadFromStorage();
    this.registerBuiltIns();
  }

  private ensureDirectoryExists(): void {
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  private loadFromStorage(): void {
    try {
      const files = fs.readdirSync(this.storagePath);
      files.forEach((file) => {
        if (file.endsWith('.json')) {
          const filePath = path.join(this.storagePath, file);
          const data = fs.readFileSync(filePath, 'utf8');
          try {
            const workflow = JSON.parse(data) as WorkflowDefinition;
            this.workflows.set(workflow.id, workflow);
          } catch (e) {
            console.error(`Failed to parse workflow file: ${file}`, e);
          }
        }
      });
    } catch (e) {
      console.error('Failed to read workflow directory', e);
    }
  }

  private registerBuiltIns(): void {
    BUILT_IN_WORKFLOWS.forEach((w) => {
      if (!this.workflows.has(w.id)) {
        this.register(w);
      }
    });
  }

  register(workflow: WorkflowDefinition): void {
    this.workflows.set(workflow.id, workflow);
    const filePath = path.join(this.storagePath, `${workflow.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(workflow, null, 2), 'utf8');
  }

  get(id: string): WorkflowDefinition | undefined {
    return this.workflows.get(id);
  }

  list(filter?: { tags?: string[]; author?: string }): WorkflowDefinition[] {
    let list = Array.from(this.workflows.values());
    if (filter) {
      if (filter.tags) {
        list = list.filter((w) => filter.tags!.every((t) => w.tags?.includes(t)));
      }
      if (filter.author) {
        list = list.filter((w) => w.author === filter.author);
      }
    }
    return list;
  }

  delete(id: string): boolean {
    const deleted = this.workflows.delete(id);
    if (deleted) {
      const filePath = path.join(this.storagePath, `${id}.json`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    return deleted;
  }

  search(query: string): WorkflowDefinition[] {
    const q = query.toLowerCase();
    return this.list().filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        w.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }

  export(id: string): string {
    const workflow = this.get(id);
    if (!workflow) {
      throw new Error(`Workflow with ID ${id} not found`);
    }
    return JSON.stringify(workflow, null, 2);
  }

  import(json: string): WorkflowDefinition {
    const workflow = JSON.parse(json) as WorkflowDefinition;
    this.register(workflow);
    return workflow;
  }

  getStats(): RegistryStats {
    const all = this.list();
    const byTool: Record<string, number> = {};
    
    all.forEach((w) => {
      w.steps.forEach((s) => {
        byTool[s.tool] = (byTool[s.tool] || 0) + 1;
      });
    });

    const recentlyAdded = [...all]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      total: all.length,
      byTool,
      recentlyAdded,
    };
  }
}
