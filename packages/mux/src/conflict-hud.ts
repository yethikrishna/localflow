import { FileAccess, ConflictReport } from '@nexus/core';

export class ConflictHUD {
  private accessLog: FileAccess[] = [];

  recordAccess(agentId: string, filePath: string, type: 'read' | 'write') {
    this.accessLog.push({
      agentId,
      path: filePath,
      type,
      timestamp: Date.now()
    });
    
    // Check for potential conflicts immediately
    this.detectConflicts();
  }

  detectConflicts(): ConflictReport[] {
    const conflicts: ConflictReport[] = [];
    const fileToAgents: Record<string, Set<string>> = {};
    const writeFiles: Record<string, string[]> = {};

    for (const log of this.accessLog) {
      if (!fileToAgents[log.path]) fileToAgents[log.path] = new Set();
      fileToAgents[log.path].add(log.agentId);

      if (log.type === 'write') {
        if (!writeFiles[log.path]) writeFiles[log.path] = [];
        if (!writeFiles[log.path].includes(log.agentId)) {
          writeFiles[log.path].push(log.agentId);
        }
      }
    }

    // Write-Write or Read-Write conflicts
    for (const [path, agents] of Object.entries(fileToAgents)) {
      if (agents.size > 1) {
        const writerAgents = writeFiles[path] || [];
        if (writerAgents.length > 0) {
          // If there's at least one writer and multiple agents accessing it
          conflicts.push({
            path,
            agents: Array.from(agents),
            type: writerAgents.length > 1 ? 'write-write' : 'read-write'
          });
        }
      }
    }

    if (conflicts.length > 0) {
        console.warn(`[Conflict HUD] Detected ${conflicts.length} potential conflicts:`, conflicts);
    }
    
    return conflicts;
  }

  getAccessLog() {
    return this.accessLog;
  }
}

export const conflictHUD = new ConflictHUD();
