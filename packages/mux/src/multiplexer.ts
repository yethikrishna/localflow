// Agent multiplexer with workspace isolation
// Inspired by MUX (Coder)

import { MemoryManager } from './memory';
import { workflowEngine } from './workflows';
import { EnvDiscoveryBridge } from '@nexus/discovery';
import { NexusWorktree } from './worktree';
import { ShadowEngine } from './shadow-engine';
import { conflictHUD } from './conflict-hud';
import { TaskStatus, ParallelTaskOptions } from '@nexus/core';

export class NexusMux {
  private memoryManager: MemoryManager;
  private discoveryBridge: EnvDiscoveryBridge;
  private worktree: NexusWorktree;
  private shadowEngine: ShadowEngine;
  private tasks: Map<string, TaskStatus> = new Map();

  constructor(projectRoot: string) {
    this.memoryManager = new MemoryManager(projectRoot);
    this.worktree = new NexusWorktree(projectRoot);
    this.shadowEngine = new ShadowEngine(projectRoot);
    
    // Wire up memory to workflow engine
    workflowEngine.setMemory(this.memoryManager.getAgentMemory('system').procedural);

    // Initialize discovery bridge with semantic memory
    this.discoveryBridge = new EnvDiscoveryBridge(this.memoryManager.getAgentMemory('system').semantic);
  }

  async initialize() {
    await this.memoryManager.initialize();
    
    // Run auto-discovery
    await this.discoveryBridge.populateEnv();
  }

  async recordDiscovery(services: any[]) {
    await this.memoryManager.recordDiscovery(services);
  }

  async getMemorySummary(sessionId: string) {
    return await this.memoryManager.getAgentContextSummary(sessionId);
  }

  async createTask(options: ParallelTaskOptions) {
    const sessionId = options.id || 'default-session';
    const memory = this.memoryManager.getAgentMemory(sessionId);
    
    console.log('Creating parallel agent task:', options);
    
    const status: TaskStatus = {
      id: sessionId,
      status: 'pending',
      startTime: Date.now()
    };
    this.tasks.set(sessionId, status);

    try {
      // 1. Create a worktree for this agent
      const worktreePath = await this.worktree.create(sessionId, 'agent-task');
      status.worktreePath = worktreePath;
      status.status = 'running';

      // 2. Track access (initially just the worktree creation)
      conflictHUD.recordAccess(sessionId, worktreePath, 'write');

      // 3. (Mock) Launch agent task in background
      // In a real system, this would spawn a new process or container
      console.log(`[NexusMux] Agent ${sessionId} started in ${worktreePath}`);

      // 4. Trigger Shadow Execution for this agent (lint/test in background)
      await this.shadowEngine.runShadowExecution(sessionId);
      
      return status;
    } catch (error) {
      status.status = 'failed';
      status.error = (error as Error).message;
      throw error;
    }
  }

  async reportFileAccess(agentId: string, filePath: string, type: 'read' | 'write') {
    conflictHUD.recordAccess(agentId, filePath, type);
  }

  getConflictReport() {
    return conflictHUD.detectConflicts();
  }
}
