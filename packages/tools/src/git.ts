import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class GitTool {
  private async runGitCommand(args: string[]): Promise<string> {
    const command = `git ${args.join(' ')}`;
    try {
      console.log(`[Git] Executing git command: ${command}`);
      const { stdout } = await execAsync(command, { cwd: process.cwd() });
      return stdout.trim();
    } catch (error: any) {
      console.error(`[Git] command failed: ${error.message}`);
      throw new Error(`Git error: ${error.stderr || error.message}`);
    }
  }

  async listBranches(): Promise<string[]> {
    const output = await this.runGitCommand(['branch', '--all']);
    return output.split('\n').map(b => b.trim());
  }

  async createBranch(branchName: string): Promise<string> {
    return await this.runGitCommand(['checkout', '-b', branchName]);
  }

  async deleteBranch(branchName: string): Promise<string> {
    return await this.runGitCommand(['branch', '-D', branchName]);
  }

  async listWorktrees(): Promise<string[]> {
    const output = await this.runGitCommand(['worktree', 'list']);
    return output.split('\n').map(w => w.trim());
  }

  async addWorktree(path: string, branch: string): Promise<string> {
    return await this.runGitCommand(['worktree', 'add', path, branch]);
  }

  async removeWorktree(path: string): Promise<string> {
    return await this.runGitCommand(['worktree', 'remove', path]);
  }
}
