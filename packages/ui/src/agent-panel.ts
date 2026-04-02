import { NxBox, NxText } from './widgets';
import Yoga from 'yoga-layout';
import { catppuccinTheme } from './theme';

export interface AgentActivity {
  id: string;
  name: string;
  thought?: string;
  lastToolCall?: string;
  status: 'idle' | 'running' | 'success' | 'error';
}

export class NxAgentItem extends NxBox {
  private nameText: NxText;
  private thoughtText: NxText;
  private toolCallText: NxText;
  private statusIndicator: NxBox;

  constructor(public agent: AgentActivity) {
    super();
    this.borderRadius = 8;
    this.borderWidth = 1;
    this.borderColor = catppuccinTheme.surfaceHover;
    this.backgroundColor = catppuccinTheme.surface;
    this.yogaNode.setPadding(Yoga.EDGE_ALL, 12);
    this.yogaNode.setMargin(Yoga.EDGE_BOTTOM, 8);
    this.yogaNode.setFlexDirection(Yoga.FLEX_DIRECTION_COLUMN);

    // Header with status indicator
    const header = new NxBox();
    header.yogaNode.setFlexDirection(Yoga.FLEX_DIRECTION_ROW);
    header.yogaNode.setAlignItems(Yoga.ALIGN_CENTER);
    header.backgroundColor = 'transparent';

    this.statusIndicator = new NxBox();
    this.statusIndicator.yogaNode.setWidth(10);
    this.statusIndicator.yogaNode.setHeight(10);
    this.statusIndicator.borderRadius = 5;
    this.statusIndicator.yogaNode.setMargin(Yoga.EDGE_RIGHT, 8);
    this.updateStatusIndicator(agent.status);
    header.addChild(this.statusIndicator);

    this.nameText = new NxText(agent.name);
    this.nameText.fontSize = 14;
    this.nameText.fontWeight = 'bold';
    header.addChild(this.nameText);
    this.addChild(header);

    // Thought
    this.thoughtText = new NxText(agent.thought || 'Waiting...');
    this.thoughtText.fontSize = 12;
    this.thoughtText.color = catppuccinTheme.textMuted;
    this.thoughtText.yogaNode.setMargin(Yoga.EDGE_TOP, 6);
    this.addChild(this.thoughtText);

    // Tool Call
    this.toolCallText = new NxText(agent.lastToolCall ? `🛠 ${agent.lastToolCall}` : '');
    this.toolCallText.fontSize = 11;
    this.toolCallText.color = catppuccinTheme.accent;
    this.toolCallText.yogaNode.setMargin(Yoga.EDGE_TOP, 4);
    this.addChild(this.toolCallText);
  }

  update(activity: Partial<AgentActivity>) {
    if (activity.thought) this.thoughtText.content = activity.thought;
    if (activity.lastToolCall) this.toolCallText.content = `🛠 ${activity.lastToolCall}`;
    if (activity.status) {
      this.updateStatusIndicator(activity.status);
      this.state = activity.status;
    }
  }

  private updateStatusIndicator(status: AgentActivity['status']) {
    switch (status) {
      case 'running':
        this.statusIndicator.backgroundColor = catppuccinTheme.running;
        break;
      case 'success':
        this.statusIndicator.backgroundColor = catppuccinTheme.success;
        break;
      case 'error':
        this.statusIndicator.backgroundColor = catppuccinTheme.error;
        break;
      default:
        this.statusIndicator.backgroundColor = catppuccinTheme.textMuted;
    }
  }
}

export class NxAgentPanel extends NxBox {
  private agentItems: Map<string, NxAgentItem> = new Map();

  constructor() {
    super();
    this.yogaNode.setFlexDirection(Yoga.FLEX_DIRECTION_COLUMN);
    this.yogaNode.setPadding(Yoga.EDGE_ALL, 16);
    this.backgroundColor = catppuccinTheme.surface;
    this.yogaNode.setWidth(350);

    const title = new NxText('Agents Status');
    title.fontSize = 18;
    title.fontWeight = 'bold';
    title.yogaNode.setMargin(Yoga.EDGE_BOTTOM, 12);
    this.addChild(title);
  }

  upsertAgent(activity: AgentActivity) {
    let item = this.agentItems.get(activity.id);
    if (!item) {
      item = new NxAgentItem(activity);
      this.agentItems.set(activity.id, item);
      this.addChild(item);
    } else {
      item.update(activity);
    }
  }
}
