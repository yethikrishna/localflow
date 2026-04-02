import * as fs from 'fs/promises';
import * as path from 'path';

export class FilesystemTool {
  async readFile(filePath: string): Promise<string> {
    try {
      const absolutePath = path.resolve(process.cwd(), filePath);
      return await fs.readFile(absolutePath, 'utf-8');
    } catch (error: any) {
      throw new Error(`Failed to read file ${filePath}: ${error.message}`);
    }
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    try {
      const absolutePath = path.resolve(process.cwd(), filePath);
      await fs.mkdir(path.dirname(absolutePath), { recursive: true });
      await fs.writeFile(absolutePath, content, 'utf-8');
    } catch (error: any) {
      throw new Error(`Failed to write file ${filePath}: ${error.message}`);
    }
  }

  async listFiles(dirPath: string): Promise<string[]> {
    try {
      const absolutePath = path.resolve(process.cwd(), dirPath);
      return await fs.readdir(absolutePath);
    } catch (error: any) {
      throw new Error(`Failed to list files in ${dirPath}: ${error.message}`);
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      const absolutePath = path.resolve(process.cwd(), filePath);
      await fs.unlink(absolutePath);
    } catch (error: any) {
      throw new Error(`Failed to delete file ${filePath}: ${error.message}`);
    }
  }
}
