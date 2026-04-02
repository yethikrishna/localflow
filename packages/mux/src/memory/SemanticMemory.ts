import * as fs from 'fs/promises';
import * as path from 'path';

export interface SemanticMemoryRecord {
  section: string;
  content: string;
}

export class SemanticMemory {
  private baseDir: string;

  constructor(projectRoot: string) {
    this.baseDir = path.join(projectRoot, '.nexus');
  }

  async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.baseDir, { recursive: true });
      const files = ['memory.md', 'USER.md', 'SOUL.md', 'DECISIONS.md'];
      for (const file of files) {
        const filePath = path.join(this.baseDir, file);
        try {
          await fs.access(filePath);
        } catch {
          await fs.writeFile(filePath, `# ${file.split('.')[0]}\n\nInitialize with project context...`);
        }
      }
    } catch (error) {
      console.error('Failed to initialize SemanticMemory:', error);
      throw error;
    }
  }

  async read(file: string = 'memory.md'): Promise<string> {
    const filePath = path.join(this.baseDir, file);
    return await fs.readFile(filePath, 'utf-8');
  }

  async update(file: string, content: string, append: boolean = true): Promise<void> {
    const filePath = path.join(this.baseDir, file);
    if (append) {
      await fs.appendFile(filePath, `\n\n${content}`);
    } else {
      await fs.writeFile(filePath, content);
    }
  }

  /**
   * Records a discovery event in memory.md
   */
  async recordDiscovery(services: any[]): Promise<void> {
    const timestamp = new Date().toISOString();
    let discoveryContent = `### Discovery Event: ${timestamp}\n`;
    
    services.forEach(service => {
      discoveryContent += `- **${service.name}** (${service.type}): ${service.endpoint} [Status: ${service.status}]\n`;
    });

    await this.update('memory.md', discoveryContent, true);
  }

  /**
   * Records feedback from a Founding Architect in DECISIONS.md
   */
  async recordArchitectFeedback(architect: string, feedback: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const entry = `### Feedback from ${architect} (${timestamp})\n${feedback}\n`;
    await this.update('DECISIONS.md', entry, true);
  }

  /**
   * Updates or creates a specific markdown section in memory.md
   */
  async updateSection(sectionName: string, content: string): Promise<void> {
    const currentContent = await this.read('memory.md');
    const sections = await this.getSections('memory.md');
    const sectionIndex = sections.findIndex(s => s.section.toLowerCase() === sectionName.toLowerCase());

    if (sectionIndex !== -1) {
      // Replace existing section
      const oldSection = sections[sectionIndex];
      const sectionHeaderRegex = new RegExp(`^#+ ${sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'im');
      
      // Split content into before, target section, and after
      const lines = currentContent.split('\n');
      let startIdx = -1;
      let endIdx = lines.length;

      for (let i = 0; i < lines.length; i++) {
        if (sectionHeaderRegex.test(lines[i])) {
          startIdx = i;
          // Find next header or end of file
          for (let j = i + 1; j < lines.length; j++) {
            if (/^#+ /.test(lines[j])) {
              endIdx = j;
              break;
            }
          }
          break;
        }
      }

      if (startIdx !== -1) {
        lines.splice(startIdx + 1, endIdx - startIdx - 1, content);
        await this.update('memory.md', lines.join('\n'), false);
      }
    } else {
      // Append as new section
      await this.update('memory.md', `## ${sectionName}\n${content}`, true);
    }
  }

  /**
   * Simple parser for markdown sections
   */
  async getSections(file: string = 'memory.md'): Promise<SemanticMemoryRecord[]> {
    const content = await this.read(file);
    const sections: SemanticMemoryRecord[] = [];
    const sectionRegex = /^#+ (.*)$\n([\s\S]*?)(?=#+ |$)/gm;
    let match;
    while ((match = sectionRegex.exec(content)) !== null) {
      sections.push({
        section: match[1].trim(),
        content: match[2].trim()
      });
    }
    return sections;
  }
}
