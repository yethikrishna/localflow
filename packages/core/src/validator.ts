
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

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ValidationReport {
  valid: boolean;
  stepResults: Record<string, ValidationResult>;
  globalErrors: string[];
}

export interface CompatibilityResult {
  compatible: boolean;
  reason?: string;
}

export interface GraphValidation {
  valid: boolean;
  cycles: string[][];
  missingDeps: string[];
}

export const TOOL_SCHEMAS: Record<string, { required: string[]; optional: string[] }> = {
  ollama_chat: { required: ['model', 'messages'], optional: ['temperature', 'max_tokens'] },
  ollama_list_models: { required: [], optional: [] },
  appflowy_read_page: { required: ['page_id'], optional: [] },
  appflowy_update_page: { required: ['page_id', 'content'], optional: [] },
  nocodb_query_data: { required: ['table_id'], optional: ['where', 'limit', 'offset'] },
  browser_navigate: { required: ['url'], optional: ['action', 'selector'] },
  storm_research: { required: ['topic'], optional: ['depth', 'output_format'] },
};

export class WorkflowValidator {
  /**
   * Validates a single workflow step.
   */
  validateStep(step: WorkflowStep): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const schema = TOOL_SCHEMAS[step.tool];
    if (!schema) {
      errors.push(`Unknown tool: ${step.tool}`);
      return { valid: false, errors, warnings };
    }

    // Check required params
    for (const field of schema.required) {
      if (!(field in step.params)) {
        errors.push(`Missing required parameter: ${field} for tool ${step.tool}`);
      }
    }

    // Check for unexpected params
    for (const field of Object.keys(step.params)) {
      if (!schema.required.includes(field) && !schema.optional.includes(field)) {
        warnings.push(`Unexpected parameter: ${field} for tool ${step.tool}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validates a whole workflow definition.
   */
  validateWorkflow(workflow: WorkflowDefinition): ValidationReport {
    const stepResults: Record<string, ValidationResult> = {};
    const globalErrors: string[] = [];
    let allValid = true;

    // Validate each step
    for (const step of workflow.steps) {
      const result = this.validateStep(step);
      stepResults[step.id] = result;
      if (!result.valid) {
        allValid = false;
      }
    }

    // Validate graph (cycles and missing dependencies)
    const graphValidation = this.validateDependencyGraph(workflow.steps);
    if (!graphValidation.valid) {
      allValid = false;
      for (const cycle of graphValidation.cycles) {
        globalErrors.push(`Circular dependency detected: ${cycle.join(' -> ')}`);
      }
      for (const missing of graphValidation.missingDeps) {
        globalErrors.push(`Missing dependency: ${missing}`);
      }
    }

    // Check for duplicate step IDs
    const ids = new Set<string>();
    for (const step of workflow.steps) {
      if (ids.has(step.id)) {
        globalErrors.push(`Duplicate step ID: ${step.id}`);
        allValid = false;
      }
      ids.add(step.id);
    }

    return {
      valid: allValid && globalErrors.length === 0,
      stepResults,
      globalErrors,
    };
  }

  /**
   * Checks if the output of one step is compatible as input for another.
   * This is a placeholder for more complex type checking logic.
   */
  checkCompatibility(outputStep: WorkflowStep, inputStep: WorkflowStep): CompatibilityResult {
    // Current simple implementation: all are compatible unless explicitly known otherwise.
    // In a real system, we'd check tool output types vs parameter types.
    return { compatible: true };
  }

  /**
   * Checks for circular dependencies and missing dependencies in the workflow.
   */
  validateDependencyGraph(steps: WorkflowStep[]): GraphValidation {
    const stepIds = new Set(steps.map((s) => s.id));
    const missingDeps: string[] = [];
    const adj = new Map<string, string[]>();

    // Build adjacency list and find missing deps
    for (const step of steps) {
      const deps = step.dependsOn || [];
      adj.set(step.id, deps);
      for (const dep of deps) {
        if (!stepIds.has(dep)) {
          missingDeps.push(`${step.id} depends on missing step ${dep}`);
        }
      }
    }

    // Cycle detection using DFS
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const path: string[] = [];

    const findCycles = (u: string) => {
      visited.add(u);
      recStack.add(u);
      path.push(u);

      const neighbors = adj.get(u) || [];
      for (const v of neighbors) {
        if (!visited.has(v)) {
          findCycles(v);
        } else if (recStack.has(v)) {
          // Cycle found
          const cycleStart = path.indexOf(v);
          cycles.push([...path.slice(cycleStart), v]);
        }
      }

      recStack.delete(u);
      path.pop();
    };

    for (const step of steps) {
      if (!visited.has(step.id)) {
        findCycles(step.id);
      }
    }

    return {
      valid: cycles.length === 0 && missingDeps.length === 0,
      cycles,
      missingDeps,
    };
  }
}
