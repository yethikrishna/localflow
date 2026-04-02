import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class SearchTool {
  async grep(pattern: string, path: string = '.'): Promise<string[]> {
    try {
      console.log(`[Search] Grep pattern: ${pattern} in ${path}`);
      // Simple grep for MVP, using shell grep for efficiency
      // Escape patterns to prevent command injection
      const escapedPattern = pattern.replace(/'/g, "'\\''");
      const { stdout } = await execAsync(`grep -rnE '${escapedPattern}' ${path}`, { cwd: process.cwd() });
      return stdout.trim().split('\n');
    } catch (error: any) {
      if (error.code === 1) { // 1 means no matches found
        return [];
      }
      console.error(`[Search] Error in grep: ${error.message}`);
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  async find(pattern: string, path: string = '.'): Promise<string[]> {
      try {
        console.log(`[Search] Find files matching: ${pattern} in ${path}`);
        const { stdout } = await execAsync(`find ${path} -name '${pattern}'`, { cwd: process.cwd() });
        return stdout.trim().split('\n').filter(Boolean);
      } catch (error: any) {
        console.error(`[Search] Error in find: ${error.message}`);
        throw new Error(`Search failed: ${error.message}`);
      }
  }
}
