// NxNodePalette: Visual Node Palette Implementation
// Based on NEXUS Design Language (NDL)

import { NxBox, NxText } from './widgets';
import Yoga from 'yoga-layout';
import { catppuccinTheme } from './theme';

export class NxPaletteItem extends NxBox {
  constructor(public type: string, public label: string) {
    super();
    this.yogaNode.setPadding(Yoga.EDGE_HORIZONTAL, 12);
    this.yogaNode.setPadding(Yoga.EDGE_VERTICAL, 8);
    this.yogaNode.setFlexDirection(Yoga.FLEX_DIRECTION_ROW);
    this.yogaNode.setAlignItems(Yoga.ALIGN_CENTER);
    this.backgroundColor = 'transparent';
    this.borderRadius = 6;
    
    const labelText = new NxText(label);
    labelText.fontSize = 13;
    labelText.color = catppuccinTheme.text;
    this.addChild(labelText);

    this.onMouseEnter(() => {
      this.backgroundColor = catppuccinTheme.surfaceHover;
    });

    this.onMouseLeave(() => {
      this.backgroundColor = 'transparent';
    });
  }
}

export class NxNodePalette extends NxBox {
  constructor() {
    super();
    this.yogaNode.setWidth(240);
    this.yogaNode.setFlexDirection(Yoga.FLEX_DIRECTION_COLUMN);
    this.backgroundColor = catppuccinTheme.surface;
    this.borderWidth = 1;
    this.borderColor = catppuccinTheme.surfaceHover; // Using surfaceHover as border color

    this.addCategory('Triggers', ['Schedule', 'Webhook', 'Manual']);
    this.addCategory('Agents', ['Researcher', 'Reviewer', 'Coder']);
    this.addCategory('Tools', ['Ollama', 'AppFlowy', 'NocoDB']);
    this.addCategory('Logic', ['If/Else', 'Switch', 'Merge']);
    this.addCategory('Outputs', ['File Save', 'Notification']);
  }

  private addCategory(title: string, nodes: string[]) {
    const categoryBox = new NxBox();
    categoryBox.yogaNode.setPadding(Yoga.EDGE_TOP, 16);
    categoryBox.yogaNode.setPadding(Yoga.EDGE_HORIZONTAL, 8);
    
    const categoryTitle = new NxText(title.toUpperCase());
    categoryTitle.fontSize = 11;
    categoryTitle.fontWeight = 'bold';
    categoryTitle.color = catppuccinTheme.textMuted;
    categoryTitle.yogaNode.setMargin(Yoga.EDGE_BOTTOM, 8);
    categoryBox.addChild(categoryTitle);

    nodes.forEach(node => {
      const item = new NxPaletteItem(node.toLowerCase(), node);
      categoryBox.addChild(item);
    });

    this.addChild(categoryBox);
  }
}
