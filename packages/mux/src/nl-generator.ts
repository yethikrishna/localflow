import { llm } from "@nexus/llm";

export interface WorkflowStep {
  id: string;
  tool: 'ollama_chat' | 'ollama_list_models' | 'appflowy_read_page' | 'appflowy_update_page' | 'nocodb_query_data' | 'browser_navigate' | 'storm_research';
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
}

export class NLWorkflowGeneratorError extends Error {
  constructor(message: string, public code: 'VALIDATION_FAILED' | 'OLLAMA_OFFLINE' | 'LLM_FAILURE') {
    super(message);
    this.name = 'NLWorkflowGeneratorError';
  }
}

/**
 * Type Validator for WorkflowDefinition
 */
function isWorkflowDefinition(obj: any): obj is WorkflowDefinition {
  if (!obj || typeof obj !== 'object') return false;
  if (typeof obj.id !== 'string') return false;
  if (typeof obj.name !== 'string') return false;
  if (typeof obj.description !== 'string') return false;
  if (!obj.trigger || typeof obj.trigger !== 'object') return false;
  if (obj.trigger.type !== 'manual' && obj.trigger.type !== 'schedule') return false;
  if (obj.trigger.type === 'schedule' && typeof obj.trigger.cron !== 'string') return false;
  if (!Array.isArray(obj.steps)) return false;
  
  const validTools = ['ollama_chat', 'ollama_list_models', 'appflowy_read_page', 'appflowy_update_page', 'nocodb_query_data', 'browser_navigate', 'storm_research'];
  
  for (const step of obj.steps) {
    if (typeof step.id !== 'string') return false;
    if (!validTools.includes(step.tool)) return false;
    if (!step.params || typeof step.params !== 'object') return false;
    if (step.dependsOn && !Array.isArray(step.dependsOn)) return false;
  }
  
  if (typeof obj.createdAt !== 'string') return false;
  
  return true;
}

/**
 * Fallback parser for natural language prompts
 */
export function parseWorkflowFromText(text: string): WorkflowDefinition {
  const steps: WorkflowStep[] = [];
  const lowerText = text.toLowerCase();
  
  // Very naive parsing for fallback
  if (lowerText.includes('ollama')) {
    steps.push({
      id: 'step-1',
      tool: 'ollama_chat',
      params: { prompt: text }
    });
  }
  
  if (lowerText.includes('appflowy')) {
    steps.push({
      id: 'step-2',
      tool: 'appflowy_update_page',
      params: { content: 'Summarized content' },
      dependsOn: steps.length > 0 ? [steps[steps.length - 1].id] : []
    });
  }

  return {
    id: `wf-${Date.now()}`,
    name: 'NL Generated Workflow',
    description: `Workflow generated from: ${text}`,
    trigger: { 
        type: lowerText.includes('every') || lowerText.includes('cron') ? 'schedule' : 'manual',
        cron: lowerText.includes('monday') ? '0 0 * * 1' : undefined
    },
    steps: steps.length > 0 ? steps : [{
        id: 'step-1',
        tool: 'ollama_chat',
        params: { prompt: text }
    }],
    createdAt: new Date().toISOString()
  };
}

export class NLWorkflowGenerator {
  private systemPrompt = `You are a Workflow Generator for LocalFlow.
Extract a structured workflow from natural language.
Available tools: 'ollama_chat', 'ollama_list_models', 'appflowy_read_page', 'appflowy_update_page', 'nocodb_query_data', 'browser_navigate', 'storm_research'.

Output MUST be a valid JSON object matching this schema:
{
  "id": string,
  "name": string,
  "description": string,
  "trigger": { "type": "manual" | "schedule", "cron"?: string },
  "steps": [
    {
      "id": string,
      "tool": "ollama_chat" | "ollama_list_models" | "appflowy_read_page" | "appflowy_update_page" | "nocodb_query_data" | "browser_navigate" | "storm_research",
      "params": object,
      "dependsOn": string[]
    }
  ],
  "createdAt": string
}

Instructions:
1. For steps involving LLM, use 'ollama_chat'.
2. For research tasks, use 'storm_research' or 'browser_navigate'.
3. For data storage, use 'appflowy_update_page' or 'nocodb_query_data'.
4. Ensure 'id' is unique for each step.
5. Provide a clear 'name' and 'description' based on the intent.

Respond ONLY with the JSON.`;

  async generate(prompt: string): Promise<WorkflowDefinition> {
    try {
      const response = await llm.generateText({
        model: 'llama3',
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: prompt }
        ]
      });

      let workflow: any;
      try {
        // Find JSON block if LLM adds text
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : response;
        workflow = JSON.parse(jsonStr);
      } catch (parseError) {
        console.error('Failed to parse LLM response as JSON:', response);
        throw new NLWorkflowGeneratorError('Failed to parse LLM response', 'LLM_FAILURE');
      }

      if (!isWorkflowDefinition(workflow)) {
        throw new NLWorkflowGeneratorError('Generated workflow does not match schema', 'VALIDATION_FAILED');
      }

      return workflow;
    } catch (error) {
      if (error instanceof NLWorkflowGeneratorError) throw error;
      
      console.warn('Ollama error, falling back to manual parser:', error);
      try {
          // Check if it's a fetch error which might indicate Ollama is offline
          const errorMessage = (error as Error).message;
          if (errorMessage.includes('fetch') || errorMessage.includes('ECONNREFUSED')) {
              return parseWorkflowFromText(prompt);
          }
      } catch (e) {}
      
      throw new NLWorkflowGeneratorError(`Failed to generate workflow: ${(error as Error).message}`, 'LLM_FAILURE');
    }
  }
}
