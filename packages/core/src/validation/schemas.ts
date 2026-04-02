export type NodeType = 'ollama_chat' | 'ollama_list_models' | 'appflowy_read_page' | 'appflowy_update_page' | 'nocodb_query_data' | 'trigger' | 'browser_navigate' | 'browser_interact' | 'storm_research';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  data: Record<string, any>;
}

export interface WorkflowEdge {
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface WorkflowDefinition {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export const NODE_SCHEMAS: Record<NodeType, { required: string[]; optional: string[] }> = {
  ollama_chat: {
    required: ['model', 'messages'],
    optional: ['stream']
  },
  ollama_list_models: {
    required: [],
    optional: []
  },
  appflowy_read_page: {
    required: ['page_id'],
    optional: []
  },
  appflowy_update_page: {
    required: ['page_id', 'content'],
    optional: []
  },
  nocodb_query_data: {
    required: ['project_name', 'table_name'],
    optional: ['where']
  },
  trigger: {
    required: ['type'],
    optional: ['schedule']
  },
  browser_navigate: {
    required: ['url'],
    optional: []
  },
  browser_interact: {
    required: ['action'],
    optional: ['selector', 'value']
  },
  storm_research: {
    required: ['topic'],
    optional: ['depth']
  }
};
