import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

export interface SkillDefinition {
  name: string;
  description: string;
  patterns: Array<{
    trigger: string;
    solution: string;
  }>;
  success_count: number;
  last_used: string;
}

export class ProceduralMemory {
  private skillsDir: string;

  constructor() {
    this.skillsDir = path.join(os.homedir(), '.nexus', 'skills');
  }

  public async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.skillsDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create skills directory:', error);
    }
  }

  public async loadSkills(): Promise<SkillDefinition[]> {
    try {
      const files = await fs.readdir(this.skillsDir);
      const skillFiles = files.filter(f => f.endsWith('.json') || f.endsWith('.yaml'));
      const skills: SkillDefinition[] = [];

      for (const file of skillFiles) {
        const filePath = path.join(this.skillsDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        // Assume JSON for now, can add YAML support later
        try {
          skills.push(JSON.parse(content));
        } catch (e) {
          console.warn(`Failed to parse skill file: ${file}`, e);
        }
      }
      return skills;
    } catch (e) {
      console.error('Failed to load skills:', e);
      return [];
    }
  }

  public async saveSkill(skill: SkillDefinition): Promise<void> {
    const filename = `${skill.name.toLowerCase().replace(/\s+/g, '_')}.json`;
    const filePath = path.join(this.skillsDir, filename);
    await fs.writeFile(filePath, JSON.stringify(skill, null, 2));
  }

  /**
   * Records a successful execution of a workflow as a reinforced skill.
   */
  public async recordExecution(name: string, success: boolean, details: any): Promise<void> {
    const timestamp = new Date().toISOString();
    const skills = await this.loadSkills();
    let skill = skills.find(s => s.name.toLowerCase() === name.toLowerCase());

    if (!skill) {
      skill = {
        name,
        description: `Generated skill from execution: ${name}`,
        patterns: [],
        success_count: 0,
        last_used: timestamp
      };
    }

    if (success) {
      skill.success_count++;
      if (details.prompt && details.result) {
        // Keep only last 5 patterns to avoid bloating
        skill.patterns.push({
          trigger: details.prompt,
          solution: typeof details.result === 'string' ? details.result.substring(0, 500) : 'Complex result'
        });
        if (skill.patterns.length > 5) skill.patterns.shift();
      }
    }
    
    skill.last_used = timestamp;
    await this.saveSkill(skill);
  }
}
