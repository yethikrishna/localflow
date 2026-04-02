export interface TaskStatus {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  worktreePath?: string;
  startTime: number;
  endTime?: number;
  error?: string;
}

export interface ParallelTaskOptions {
  id: string;
  command: string;
  args: string[];
  cwd?: string;
}
