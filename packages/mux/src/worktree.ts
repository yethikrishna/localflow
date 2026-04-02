import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

export class NexusWorktree {
  private baseDir: string;

  constructor(projectRoot: string) {
    this.baseDir = path.join(projectRoot, '.nexus', 'worktrees');
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  async create(id: string, branch: string): Promise<string> {
    const worktreePath = path.join(this.baseDir, id);
    console.log(`[Worktree] Creating worktree for ${id} on branch ${branch} at ${worktreePath}`);
    
    try {
      // Create a new branch from current HEAD if it doesn't exist, or just use it
      execSync(`git worktree add -b ${branch}-${id} ${worktreePath}`, { stdio: 'inherit' });
      return worktreePath;
    } catch (error) {
      console.error(`[Worktree] Failed to create worktree: ${error}`);
      throw error;
    }
  }

  async remove(id: string) {
    const worktreePath = path.join(this.baseDir, id);
    console.log(`[Worktree] Removing worktree for ${id}`);
    try {
      execSync(`git worktree remove ${worktreePath} --force`, { stdio: 'inherit' });
    } catch (error) {
      console.warn(`[Worktree] Warning: failed to remove worktree: ${error}`);
    }
  }
}
