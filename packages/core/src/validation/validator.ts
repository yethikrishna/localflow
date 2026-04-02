import { WorkflowDefinition, ValidationResult, NODE_SCHEMAS, NodeType } from './schemas';

/**
 * Validates a workflow definition against its schema.
 */
export function validateWorkflow(workflow: WorkflowDefinition): ValidationResult {
  const errors: string[] = [];
  const nodeIds = new Set<string>();

  // 1. Validate Nodes
  for (const node of workflow.nodes) {
    if (nodeIds.has(node.id)) {
      errors.push(`Duplicate node ID: ${node.id}`);
    }
    nodeIds.add(node.id);

    const schema = NODE_SCHEMAS[node.type];
    if (!schema) {
      errors.push(`Unknown node type: ${node.type} (Node: ${node.id})`);
      continue;
    }

    // Check required fields
    for (const field of schema.required) {
      if (node.data[field] === undefined || node.data[field] === null || node.data[field] === '') {
        errors.push(`Missing required field: ${field} for node type ${node.type} (Node: ${node.id})`);
      }
    }

    // Check for unexpected fields (strict validation)
    for (const field of Object.keys(node.data)) {
      if (!schema.required.includes(field) && !schema.optional.includes(field)) {
        errors.push(`Unexpected field: ${field} for node type ${node.type} (Node: ${node.id})`);
      }
    }
  }

  // 2. Validate Edges
  for (const edge of workflow.edges) {
    if (!nodeIds.has(edge.source)) {
      errors.push(`Edge source node not found: ${edge.source}`);
    }
    if (!nodeIds.has(edge.target)) {
      errors.push(`Edge target node not found: ${edge.target}`);
    }
    if (edge.source === edge.target) {
      errors.push(`Self-loop detected: ${edge.source}`);
    }
  }

  // 3. Cycle Detection (DFS)
  const visited = new Set<string>();
  const stack = new Set<string>();

  function hasCycle(nodeId: string): boolean {
    visited.add(nodeId);
    stack.add(nodeId);

    const outgoingEdges = workflow.edges.filter(e => e.source === nodeId);
    for (const edge of outgoingEdges) {
      if (!visited.has(edge.target)) {
        if (hasCycle(edge.target)) return true;
      } else if (stack.has(edge.target)) {
        return true;
      }
    }

    stack.delete(nodeId);
    return false;
  }

  for (const node of workflow.nodes) {
    if (!visited.has(node.id)) {
      if (hasCycle(node.id)) {
        errors.push(`Workflow contains a cycle starting from node: ${node.id}`);
        break; 
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
