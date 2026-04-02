import { llm } from "@nexus/llm";
import { normalizeToolOutput, createErrorBundle } from './normalization';

/**
 * NexusMCP Client
 * Provides a simple interface for NEXUS agents/UI to call MCP tools.
 * In Phase 2 Prototype, this acts as a direct-to-provider bridge for low-latency canvas rendering.
 */
export class NexusMCP {
  async browserNavigate(url: string, action?: 'click' | 'type' | 'extract', selector?: string, text?: string) {
    return this.callTool('browser_navigate', { url, action, selector, text });
  }

  async stormResearch(topic: string, depth: 'quick' | 'deep' = 'quick') {
    return this.callTool('storm_research', { topic, depth });
  }

  async callTool(name: string, args: any) {
    console.log(`[MCP Client] Executing tool: ${name}`, args);

    try {
      let result;
      switch (name) {
        case 'ollama_chat':
          result = { 
            content: await llm.generateText({
              model: args.model || "llama3",
              messages: args.messages
            })
          };
          break;

        case 'appflowy_read_page':
          result = await this.handleAppFlowyRead(args.page_id);
          break;

        case 'appflowy_update_page':
          result = await this.handleAppFlowyUpdate(args.page_id, args.content);
          break;

        case 'nocodb_query_data':
          result = await this.handleNocoDBQuery(args.project_name, args.table_name, args.where);
          break;

        case 'browser_navigate':
          result = await this.handleBrowserNavigate(args.url, args.action, args.selector, args.text);
          break;

        case 'storm_research':
          result = await this.handleStormResearch(args.topic, args.depth);
          break;

        default:
          throw new Error(`Unknown tool in prototype: ${name}`);
      }
      return normalizeToolOutput(name, result);
    } catch (e: any) {
      console.error(`[MCP Client] Error executing ${name}:`, e);
      return createErrorBundle(name, e);
    }
  }

  private async handleAppFlowyRead(pageId: string) {
    const baseUrl = process.env.APPFLOWY_BASE_URL || "http://localhost:8080";
    const apiKey = process.env.APPFLOWY_API_KEY;

    if (!apiKey) {
      // Fallback for demo if no API key is provided
      return { content: `[Demo] Content for AppFlowy page ${pageId}: LocalFlow is the local-first hub for agentic workflows.` };
    }

    const response = await fetch(`${baseUrl}/api/document/${pageId}`, {
      headers: { "Authorization": `Bearer ${apiKey}` },
    });

    if (!response.ok) throw new Error(`AppFlowy API error: ${response.statusText}`);
    const data = await response.json();
    return { content: JSON.stringify(data) };
  }

  private async handleNocoDBQuery(projectName: string, tableName: string, where?: string) {
    const baseUrl = process.env.NOCODB_BASE_URL || "http://localhost:8080";
    const apiKey = process.env.NOCODB_API_KEY;

    if (!apiKey) {
      return { content: `[Demo] Query results for ${projectName}.${tableName} where ${where}` };
    }

    let url = `${baseUrl}/api/v1/db/data/noco/${projectName}/${tableName}`;
    if (where) url += `?where=${encodeURIComponent(where)}`;

    const response = await fetch(url, {
      headers: { "xc-token": apiKey },
    });

    if (!response.ok) throw new Error(`NocoDB API error: ${response.statusText}`);
    const data = await response.json();
    return { content: JSON.stringify(data.list) };
  }

  private async handleAppFlowyUpdate(pageId: string, content: string) {
    const baseUrl = process.env.APPFLOWY_BASE_URL || "http://localhost:8080";
    const apiKey = process.env.APPFLOWY_API_KEY;

    if (!apiKey) {
      console.log(`[Demo] Simulated Update to AppFlowy page ${pageId}: ${content}`);
      return { content: "Success (Demo Mode)" };
    }

    const response = await fetch(`${baseUrl}/api/document/${pageId}`, {
      method: "PATCH",
      headers: { 
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) throw new Error(`AppFlowy API error: ${response.statusText}`);
    const data = await response.json();
    return { content: JSON.stringify(data) };
  }

  private async handleBrowserNavigate(url: string, action?: string, selector?: string, text?: string) {
    console.log(`[Demo] Browser navigating to: ${url} (Action: ${action})`);
    return { content: `Navigation to ${url} successful (Demo Mode)` };
  }

  private async handleBrowserInteract(action: string, selector?: string, value?: string) {
    console.log(`[Demo] Browser interaction: ${action} on ${selector} with ${value}`);
    return { content: `Interaction ${action} successful (Demo Mode)` };
  }

  private async handleStormResearch(topic: string, depth?: string) {
    console.log(`[Demo] STORM starting ${depth} research on: ${topic}`);
    return { content: `[Demo] Research report for ${topic}: STORM has synthesized the following findings...` };
  }
}
