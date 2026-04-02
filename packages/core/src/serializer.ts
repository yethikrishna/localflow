import { WorkflowDefinition } from './registry';

/**
 * Serializes a workflow definition to a JSON string.
 */
export function serializeWorkflow(workflow: WorkflowDefinition): string {
  return JSON.stringify(workflow, null, 2);
}

/**
 * Deserializes a workflow definition from a JSON string.
 */
export function deserializeWorkflow(json: string): WorkflowDefinition {
  const parsed = JSON.parse(json);
  // Basic validation could be added here, but the registry handles some of it.
  return parsed as WorkflowDefinition;
}

/**
 * Converts a workflow definition to a simple YAML-like format for human readability.
 */
export function workflowToYAML(workflow: WorkflowDefinition): string {
  const lines: string[] = [];
  
  lines.push(`id: ${workflow.id}`);
  lines.push(`name: ${workflow.name}`);
  lines.push(`description: ${workflow.description}`);
  lines.push(`trigger:`);
  lines.push(`  type: ${workflow.trigger.type}`);
  if (workflow.trigger.cron) {
    lines.push(`  cron: ${workflow.trigger.cron}`);
  }
  
  if (workflow.version) lines.push(`version: ${workflow.version}`);
  if (workflow.author) lines.push(`author: ${workflow.author}`);
  if (workflow.tags && workflow.tags.length > 0) {
    lines.push(`tags: [${workflow.tags.join(', ')}]`);
  }
  
  lines.push(`createdAt: ${workflow.createdAt}`);
  
  lines.push(`steps:`);
  workflow.steps.forEach((step) => {
    lines.push(`  - id: ${step.id}`);
    lines.push(`    tool: ${step.tool}`);
    lines.push(`    params: ${JSON.stringify(step.params)}`);
    if (step.dependsOn && step.dependsOn.length > 0) {
      lines.push(`    dependsOn: [${step.dependsOn.join(', ')}]`);
    }
  });
  
  return lines.join('\n');
}
