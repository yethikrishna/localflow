import { llm } from "@nexus/llm";
import { ProceduralMemory } from './memory/ProceduralMemory';

export interface WorkflowNode {
  id: string;
  type: string;
  data: any;
}

export interface WorkflowEdge {
  source: string;
  target: string;
}

export interface WorkflowDefinition {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

/**
 * NexusWorkflow Execution Engine (Phase 1 Prototype)
 */
export class WorkflowEngine {
  private memory?: ProceduralMemory;

  constructor(memory?: ProceduralMemory) {
    this.memory = memory;
  }

  setMemory(memory: ProceduralMemory) {
    this.memory = memory;
  }

  async executeOllamaToAppFlowy(prompt: string, pageId: string) {
    console.log(`[Workflow] Starting Ollama -> AppFlowy for prompt: ${prompt}`);

    try {
      // 1. Call Ollama
      const response = await llm.generateText({
        model: "llama3",
        messages: [{ role: "user", content: prompt }]
      });

      console.log(`[Workflow] Ollama response received: ${response.substring(0, 50)}...`);

      // 2. Read AppFlowy Page (Optional validation)
      const appflowyUrl = process.env.APPFLOWY_BASE_URL || "http://localhost:8080";
      const apiKey = process.env.APPFLOWY_API_KEY;

      // 3. Write/Update AppFlowy Page
      const updateResponse = await fetch(`${appflowyUrl}/api/document/${pageId}`, {
        method: "PATCH",
        headers: { 
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: response
        })
      });

      if (!updateResponse.ok) {
        throw new Error(`Failed to update AppFlowy: ${updateResponse.statusText}`);
      }

      console.log(`[Workflow] Successfully updated AppFlowy page: ${pageId}`);
      
      // 4. Record successful execution in ProceduralMemory
      if (this.memory) {
        await this.memory.recordExecution('OllamaToAppFlowy', true, {
          prompt,
          result: response
        });
      }

      return { success: true, result: response };
    } catch (error) {
      console.error(`[Workflow] Execution failed: ${error}`);
      
      if (this.memory) {
          await this.memory.recordExecution('OllamaToAppFlowy', false, {
              prompt,
              error: (error as Error).message
          });
      }
      throw error;
    }
  }

  /**
   * Execute a generic workflow definition
   */
  async executeWorkflow(workflow: WorkflowDefinition) {
    const results: Record<string, any> = {};
    
    // Simple linear execution for prototype (Phase 2)
    for (const node of workflow.nodes) {
      const result = await this.executeNode(node, results);
      results[node.id] = result;
    }

    return results;
  }

  private async executeNode(node: WorkflowNode, previousResults: Record<string, any>) {
    console.log(`[Workflow] Executing node: ${node.id} (${node.type})`);
    
    const resolvedData = this.resolveReferences(node.data, previousResults);

    switch (node.type) {
      case 'ollama_chat':
        return await llm.generateText(resolvedData);
      
      case 'browser_navigate':
        return await this.fetchLocal('BROWSER_USE_URL', 'http://localhost:8000', '/navigate', resolvedData);
      
      case 'browser_interact':
        return await this.fetchLocal('BROWSER_USE_URL', 'http://localhost:8000', '/interact', resolvedData);
      
      case 'storm_research':
        return await this.fetchLocal('STORM_API_URL', 'http://localhost:5000', '/research', resolvedData);

      case 'appflowy_read_page':
        return await this.fetchAppFlowy(`/api/document/${resolvedData.page_id}`, 'GET');

      case 'appflowy_update_page':
        return await this.fetchAppFlowy(`/api/document/${resolvedData.page_id}`, 'PATCH', { content: resolvedData.content });

      case 'nocodb_query_data':
        const { project_name, table_name, where } = resolvedData;
        let url = `/api/v1/db/data/noco/${project_name}/${table_name}`;
        if (where) url += `?where=${encodeURIComponent(where)}`;
        return await this.fetchNocoDB(url);

      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  private resolveReferences(data: any, results: Record<string, any>): any {
    let str = JSON.stringify(data);
    str = str.replace(/\{\{(.*?)\.output\}\}/g, (_, id) => {
      const result = results[id];
      if (typeof result === 'string') return result;
      if (typeof result === 'object') return JSON.stringify(result);
      return `{{${id}.output}}`;
    });
    return JSON.parse(str);
  }

  private async fetchLocal(env: string, defaultUrl: string, path: string, body: any) {
    const baseUrl = process.env[env] || defaultUrl;
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`${env} error: ${res.statusText}`);
    return await res.json();
  }

  private async fetchAppFlowy(path: string, method: string, body?: any) {
    const baseUrl = process.env.APPFLOWY_BASE_URL || "http://localhost:8080";
    const apiKey = process.env.APPFLOWY_API_KEY;
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: { 
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) throw new Error(`AppFlowy error: ${res.statusText}`);
    return await res.json();
  }

  private async fetchNocoDB(path: string) {
    const baseUrl = process.env.NOCODB_BASE_URL || "http://localhost:8080";
    const apiKey = process.env.NOCODB_API_KEY;
    const res = await fetch(`${baseUrl}${path}`, {
      headers: { 'xc-token': apiKey || '' }
    });
    if (!res.ok) throw new Error(`NocoDB error: ${res.statusText}`);
    return await res.json();
  }
}

export const workflowEngine = new WorkflowEngine();
