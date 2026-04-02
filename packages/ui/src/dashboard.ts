import { NxBox, NxText } from './widgets';
import Yoga from 'yoga-layout';
import { catppuccinTheme } from './theme';
import { NxAgentPanel } from './agent-panel';
import { NxActivityHeatmap } from './activity-heatmap';

export class NxDashboard extends NxBox {
  private agentPanel: NxAgentPanel;
  private heatmap: NxActivityHeatmap;

  constructor() {
    super();
    this.yogaNode.setFlexDirection(Yoga.FLEX_DIRECTION_ROW);
    this.yogaNode.setPadding(Yoga.EDGE_ALL, 20);
    this.backgroundColor = catppuccinTheme.surface;
    this.yogaNode.setWidth(800);
    this.yogaNode.setHeight(600);

    // Left Side: Agent Panel
    this.agentPanel = new NxAgentPanel();
    this.agentPanel.yogaNode.setFlexBasis('45%');
    this.agentPanel.yogaNode.setMargin(Yoga.EDGE_RIGHT, 10);
    this.addChild(this.agentPanel);

    // Right Side: Heatmap and other info
    const rightSide = new NxBox();
    rightSide.yogaNode.setFlexBasis('55%');
    rightSide.yogaNode.setFlexDirection(Yoga.FLEX_DIRECTION_COLUMN);
    
    this.heatmap = new NxActivityHeatmap();
    this.heatmap.yogaNode.setMargin(Yoga.EDGE_BOTTOM, 10);
    rightSide.addChild(this.heatmap);

    // Add some placeholder for "System Status"
    const sysStatus = new NxBox();
    sysStatus.backgroundColor = catppuccinTheme.surfaceHover;
    sysStatus.borderRadius = 12;
    sysStatus.yogaNode.setPadding(Yoga.EDGE_ALL, 16);
    sysStatus.yogaNode.setFlexGrow(1);
    
    const sysTitle = new NxText('System Performance');
    sysTitle.fontSize = 16;
    sysTitle.fontWeight = 'bold';
    sysStatus.addChild(sysTitle);

    const sysDesc = new NxText('Latency: 45ms | Memory: 1.2GB / 4.0GB');
    sysDesc.fontSize = 12;
    sysDesc.color = catppuccinTheme.textMuted;
    sysDesc.yogaNode.setMargin(Yoga.EDGE_TOP, 8);
    sysStatus.addChild(sysDesc);

    rightSide.addChild(sysStatus);
    this.addChild(rightSide);

    // Initial data
    this.populateInitialData();
  }

  private populateInitialData() {
    this.agentPanel.upsertAgent({
      id: 'agent-1',
      name: 'Architect',
      thought: 'Analyzing project structure...',
      status: 'running',
      lastToolCall: 'glob("src/**/*.ts")'
    });

    this.agentPanel.upsertAgent({
      id: 'agent-2',
      name: 'Coder',
      thought: 'Waiting for task assignment',
      status: 'idle'
    });

    this.heatmap.updateActivity([
      { path: 'src/main.ts', activityLevel: 0.9 },
      { path: 'src/utils.ts', activityLevel: 0.4 },
      { path: 'src/api.ts', activityLevel: 0.7 },
      { path: 'package.json', activityLevel: 0.1 },
      { path: 'README.md', activityLevel: 0.2 },
      { path: 'src/components/button.ts', activityLevel: 0.5 },
      { path: 'src/components/input.ts', activityLevel: 0.3 },
      { path: 'src/styles.css', activityLevel: 0.05 },
    ]);
  }
}
