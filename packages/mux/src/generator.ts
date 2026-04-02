import { llm } from "@nexus/llm";
import { WorkflowDefinition } from './workflows';
import { validateWorkflow, WorkflowRegistry, Workflow } from '@nexus/core';

export const SYSTEM_PROMPT = `
You are the LocalFlow Workflow Generator. Your mission is to parse natural language requests into structured, type-safe agentic workflows for the LocalFlow Hub (ClawHub).

Return ONLY a valid JSON object following this schema:
{
  "id": "string (unique-uuid)",
  "name": "string (Title Case)",
  "description": "string (Short summary)",
  "version": "1.0.0",
  "author": "LocalFlow Agent",
  "tags": ["tag1", "tag2"],
  "nodes": [
    { 
      "id": "node-1", 
      "type": "string", 
      "data": {},
      "position": { "x": number, "y": number }
    }
  ],
  "edges": [
    { "id": "edge-1", "source": "node-1", "target": "node-2" }
  ],
  "createdAt": "string (ISO Date)",
  "updatedAt": "string (ISO Date)"
}

Available Node Types:
- ollama_chat: { model: string, messages: [{ role: string, content: string }] }
- appflowy_read_page: { page_id: string }
- appflowy_update_page: { page_id: string, content: string }
- nocodb_query_data: { project_name: string, table_name: string, where: string }
- browser_navigate: { url: string }
- browser_interact: { action: "click" | "type" | "scroll", selector?: string, value?: string }
- storm_research: { topic: string, depth: "standard" | "deep" }

Rules:
1. Generate unique IDs for all nodes and edges.
2. Provide sensible 2D positions for nodes (avoid overlapping, e.g., grid or sequence).
3. Connect nodes logically using edges.
4. Use data from previous nodes by referencing them (e.g., "{{nodeId.output}}").
5. Include metadata: name, description, tags.
`;

export class WorkflowGenerator {
  async generate(prompt: string, register: boolean = false): Promise<Workflow> {
    const response = await llm.generateText({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1
    });

    try {
      const jsonStr = response.match(/\{[\s\S]*\}/)?.[0] || response;
      const workflow = JSON.parse(jsonStr) as Workflow;
      
      // Basic validation for definitions
      const validation = validateWorkflow(workflow as unknown as WorkflowDefinition);
      if (!validation.valid) {
        console.warn('Workflow validation failed, attempting self-correction:', validation.errors);
        return await this.selfCorrect(prompt, workflow, validation.errors);
      }

      if (register) {
        WorkflowRegistry.register(workflow);
      }

      return workflow;
    } catch (e) {
      console.error('Failed to parse workflow JSON:', response);
      throw new Error('AI failed to generate a valid workflow structure.');
    }
  }

  private async selfCorrect(prompt: string, malformedWorkflow: any, errors: string[]): Promise<Workflow> {
    const correctionPrompt = `
The previous workflow you generated was invalid according to the schema.
Errors found:
${errors.map(err => `- ${err}`).join('\n')}

Original User Request:
${prompt}

Previous Workflow:
${JSON.stringify(malformedWorkflow, null, 2)}

Please fix the errors and provide a valid, type-safe JSON workflow including metadata and positions.
    `;

    const response = await llm.generateText({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: correctionPrompt }
      ],
      temperature: 0.1
    });

    const jsonStr = response.match(/\{[\s\S]*\}/)?.[0] || response;
    const workflow = JSON.parse(jsonStr) as Workflow;
    
    const validation = validateWorkflow(workflow as unknown as WorkflowDefinition);
    if (!validation.valid) {
      throw new Error(`Self-correction failed: ${validation.errors.join(', ')}`);
    }

    return workflow;
  }
}
