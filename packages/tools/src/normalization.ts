export type BundleType = 'text' | 'table' | 'image' | 'file' | 'error' | 'json';

export interface NexusDataBundle {
  type: BundleType;
  content: any;
  metadata?: Record<string, any>;
  timestamp: number;
}

/**
 * Normalizes tool output into a standardized NexusDataBundle.
 */
export function normalizeToolOutput(toolName: string, output: any): NexusDataBundle {
  const timestamp = Date.now();
  
  // If it's already a bundle, return it
  if (output && typeof output === 'object' && 'type' in output && 'content' in output) {
    return { ...output, timestamp };
  }

  let type: BundleType = 'text';
  let content = output;

  // Inference logic based on tool name and content structure
  if (toolName.includes('ollama_chat') || toolName.includes('summarize')) {
    type = 'text';
    content = typeof output === 'string' ? output : (output.content || JSON.stringify(output));
  } else if (toolName.includes('nocodb_query') || Array.isArray(output)) {
    type = 'table';
    content = Array.isArray(output) ? output : (output.content ? JSON.parse(output.content) : output);
  } else if (toolName.includes('appflowy_read')) {
    type = 'text';
    content = typeof output === 'string' ? output : (output.content || JSON.stringify(output));
  } else if (typeof output === 'object') {
    type = 'json';
    content = output;
  }

  return {
    type,
    content,
    metadata: {
      sourceTool: toolName
    },
    timestamp
  };
}

/**
 * Creates an error bundle.
 */
export function createErrorBundle(toolName: string, error: Error | string): NexusDataBundle {
  return {
    type: 'error',
    content: typeof error === 'string' ? error : error.message,
    metadata: {
      sourceTool: toolName,
      stack: error instanceof Error ? error.stack : undefined
    },
    timestamp: Date.now()
  };
}
