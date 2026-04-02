import { NxBox, NxText } from './widgets';
import Yoga from 'yoga-layout';
import { catppuccinTheme } from './theme';

export interface FileActivity {
  path: string;
  activityLevel: number; // 0 to 1
}

export class NxActivityHeatmap extends NxBox {
  private items: Map<string, NxBox> = new Map();
  private grid: NxBox;

  constructor() {
    super();
    this.yogaNode.setFlexDirection(Yoga.FLEX_DIRECTION_COLUMN);
    this.yogaNode.setPadding(Yoga.EDGE_ALL, 16);
    this.backgroundColor = catppuccinTheme.surface;
    this.yogaNode.setWidth(350);

    const title = new NxText('Codebase Activity Heatmap');
    title.fontSize = 18;
    title.fontWeight = 'bold';
    title.yogaNode.setMargin(Yoga.EDGE_BOTTOM, 12);
    this.addChild(title);

    this.grid = new NxBox();
    this.grid.yogaNode.setFlexDirection(Yoga.FLEX_DIRECTION_ROW);
    this.grid.yogaNode.setFlexWrap(Yoga.WRAP_WRAP);
    this.grid.backgroundColor = 'transparent';
    this.addChild(this.grid);
  }

  updateActivity(activities: FileActivity[]) {
    activities.forEach(activity => {
      let item = this.items.get(activity.path);
      if (!item) {
        item = new NxBox();
        item.yogaNode.setWidth(24);
        item.yogaNode.setHeight(24);
        item.yogaNode.setMargin(Yoga.EDGE_ALL, 2);
        item.borderRadius = 4;
        this.items.set(activity.path, item);
        this.grid.addChild(item);
      }
      
      const intensity = Math.round(activity.activityLevel * 255);
      const color = this.getHeatmapColor(activity.activityLevel);
      item.backgroundColor = color;
      
      // Tooltip or text on hover could be added if supported
    });
  }

  private getHeatmapColor(level: number): string {
    // Basic heatmap color interpolation: surface -> success -> error/running
    // Just a simple scale for prototype
    if (level < 0.2) return catppuccinTheme.surfaceHover;
    if (level < 0.5) return catppuccinTheme.success;
    if (level < 0.8) return catppuccinTheme.warning;
    return catppuccinTheme.error;
  }
}
