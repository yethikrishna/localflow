// NxWorkflowNode: Prototype for the NexusFlow Visual Editor
// Integrates MCP tools with Zero-CSS rendering

import { NxBox, NxText, NxButton } from './widgets';
import { NexusMCP } from '@nexus/tools';
import { NexusMux, workflowEngine } from '@nexus/mux'; // Added workflowEngine
import Yoga from 'yoga-layout';
import { catppuccinTheme } from './theme';

export class NxWorkflowNode extends NxBox {
  private statusText: NxText;
  private memoryText: NxText; // Added memory display
  private mcp: NexusMCP;
  private mux: NexusMux; // Added mux instance
  public data: any = {};

  constructor(public nodeId: string, public title: string) {
    super();
    this.mcp = new NexusMCP();
    this.mux = new NexusMux('./'); // Assume root for prototype
    this.borderRadius = 12;
    this.borderWidth = 1;
    this.borderColor = catppuccinTheme.surfaceHover;
    this.backgroundColor = catppuccinTheme.surface;
    this.yogaNode.setWidth(320); // Slightly wider
    this.yogaNode.setPadding(Yoga.EDGE_ALL, 16);

    // Header
    const header = new NxText(title);
    header.fontSize = 16;
    header.fontWeight = 'bold';
    header.color = catppuccinTheme.running; // Mauve
    this.addChild(header);

    // Status / Description
    this.statusText = new NxText('Idle - Ready to execute');
    this.statusText.fontSize = 12;
    this.statusText.color = catppuccinTheme.textMuted;
    this.statusText.yogaNode.setMargin(Yoga.EDGE_TOP, 8);
    this.addChild(this.statusText);

    // Memory Display Area
    this.memoryText = new NxText('🧠 Memories: No context yet...');
    this.memoryText.fontSize = 10;
    this.memoryText.color = catppuccinTheme.accent; // Blue
    this.memoryText.yogaNode.setMargin(Yoga.EDGE_TOP, 12);
    this.addChild(this.memoryText);

    // Action Button
    const runBtn = new NxButton('Run Workflow', () => this.executeWorkflow());
    runBtn.yogaNode.setMargin(Yoga.EDGE_TOP, 16);
    this.addChild(runBtn);
  }

  setError(message: string) {
    this.state = 'error';
    this.statusText.content = `Error: ${message}`;
    this.statusText.color = catppuccinTheme.error;
    
    // Add an alert icon or visual cue if needed
    console.error(`[Node ${this.nodeId}] Validation Error: ${message}`);
  }

  async executeWorkflow() {
    try {
      this.state = 'running';
      this.statusText.content = 'Running Ollama-to-AppFlowy workflow...';
      this.statusText.color = catppuccinTheme.running;
      
      // Update memory preview before task
      await this.updateMemoryUI();

      // Trigger WorkflowEngine
      const result = await workflowEngine.executeOllamaToAppFlowy(
        "Summarize the current project state for a technical README.",
        "doc-123"
      );

      this.state = 'success';
      this.statusText.content = `Workflow Complete! Summary: ${result.result.substring(0, 100)}...`;
      this.statusText.color = catppuccinTheme.success;

      // Update memory UI after task completion
      await this.updateMemoryUI();
      
    } catch (err: any) {
      this.state = 'error';
      this.statusText.content = `Error: ${err.message}`;
      this.statusText.color = catppuccinTheme.error;
    }
  }

  private async updateMemoryUI() {
    // In a real scenario, this would be reactive or event-driven
    const summary = await this.mux.getMemorySummary('default-session');
    const skillList = summary.procedural.length ? summary.procedural.join(', ') : 'None';
    const memoryKeys = summary.semantic.length ? summary.semantic.join(', ') : 'None';
    
    this.memoryText.content = `🧠 Memories: [${memoryKeys}] | 🛠 Skills: [${skillList}]`;
  }
}
