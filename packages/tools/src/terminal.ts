import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class TerminalTool {
  async execute(command: string): Promise<{ stdout: string; stderr: string }> {
    try {
      console.log(`[Terminal] Executing command: ${command}`);
      const { stdout, stderr } = await execAsync(command, { 
        cwd: process.cwd(), 
        env: { ...process.env, CI: 'true' }, // Add basic CI env variable
        timeout: 30000 // 30 second timeout for safety
      });
      return { stdout, stderr };
    } catch (error: any) {
      console.error(`[Terminal] Execution failed: ${error.message}`);
      return { 
        stdout: error.stdout || '', 
        stderr: error.stderr || error.message 
      };
    }
  }
}
