import { execSync, spawn } from 'child_process';
import { NexusWorktree } from './worktree';
import * as path from 'path';

export class ShadowEngine {
  private worktree: NexusWorktree;
  private projectRoot: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.worktree = new NexusWorktree(projectRoot);
  }

  async runBackgroundJob(jobId: string, command: string, args: string[]): Promise<void> {
    const worktreePath = await this.worktree.create(jobId, 'shadow-branch');
    
    console.log(`[ShadowEngine] Starting background job ${jobId} at ${worktreePath}`);
    
    const child = spawn(command, args, {
      cwd: worktreePath,
      stdio: 'pipe',
      shell: true
    });

    child.stdout.on('data', (data) => {
      console.log(`[ShadowEngine ${jobId} stdout]: ${data}`);
    });

    child.stderr.on('data', (data) => {
      console.error(`[ShadowEngine ${jobId} stderr]: ${data}`);
    });

    child.on('close', (code) => {
      console.log(`[ShadowEngine ${jobId}] Job finished with code ${code}`);
      // Clean up the worktree when finished
      this.worktree.remove(jobId);
    });
  }

  /**
   * Run background linting and testing
   */
  async runShadowExecution(jobId: string): Promise<void> {
    // 1. Run lint
    await this.runBackgroundJob(`${jobId}-lint`, 'npm', ['run', 'lint']);
    
    // 2. Run test
    await this.runBackgroundJob(`${jobId}-test`, 'npm', ['test']);
  }
}
