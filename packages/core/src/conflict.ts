export interface FileAccess {
  agentId: string;
  path: string;
  type: 'read' | 'write';
  timestamp: number;
}

export interface ConflictReport {
  path: string;
  agents: string[];
  type: 'read-write' | 'write-write';
}
