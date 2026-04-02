// NxDemoNode: Rendering Engine Stress-Test Spec
// Implementation for NEXUS platform

import { NxBox, NxText, NxButton } from './widgets';
import Yoga from 'yoga-layout';
import { catppuccinTheme } from './theme';

class NxGradientBox extends NxBox {
  constructor(private colors: string[]) {
    super();
  }

  paint(ctx: CanvasRenderingContext2D) {
    const layout = this.yogaNode.getComputedLayout();
    
    ctx.save();
    ctx.translate(layout.left, layout.top);

    const gradient = ctx.createLinearGradient(0, 0, layout.width, 0);
    this.colors.forEach((color, i) => {
      gradient.addColorStop(i / (this.colors.length - 1), color);
    });
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, layout.width, layout.height);

    // Paint children (like the Title text)
    for (const child of this.children) {
      child.paint(ctx);
    }

    ctx.restore();
  }
}

export class NxDemoNode extends NxBox {
  private status: 'idle' | 'running' | 'success' | 'error' = 'idle';

  constructor(private id: string, title: string, description: string) {
    super();

    this.borderWidth = 2;
    this.borderColor = 'transparent';
    this.borderRadius = 12;

    // 1. Header (The Gradient Test)
    const header = new NxGradientBox(['#74C7EC', '#CBA6F7']);
    header.yogaNode.setHeight(32);
    header.yogaNode.setPadding(Yoga.EDGE_HORIZONTAL, 8);
    header.yogaNode.setFlexDirection(Yoga.FLEX_DIRECTION_ROW);
    header.yogaNode.setAlignItems(Yoga.ALIGN_CENTER);

    const titleText = new NxText(title);
    titleText.fontSize = 12;
    titleText.fontWeight = 'bold';
    header.addChild(titleText);
    this.addChild(header);

    // 2. Body (The Text & Flex Test)
    const body = new NxBox();
    body.backgroundColor = '#313244'; // Surface0
    body.yogaNode.setPadding(Yoga.EDGE_ALL, 12);
    body.yogaNode.setFlexDirection(Yoga.FLEX_DIRECTION_ROW);

    // Column A (Left) - 40%
    const colA = new NxBox();
    colA.yogaNode.setFlexBasis('40%');
    const avatar = new NxBox();
    avatar.backgroundColor = '#45475A'; // Surface1
    avatar.yogaNode.setWidth(64);
    avatar.yogaNode.setHeight(64);
    avatar.borderRadius = 8;
    colA.addChild(avatar);
    body.addChild(colA);

    // Column B (Right) - 60%
    const colB = new NxBox();
    colB.yogaNode.setFlexBasis('60%');
    const descText = new NxText(description);
    descText.fontSize = 13;
    descText.color = '#A6ADC8'; // Subtext
    colB.addChild(descText);
    body.addChild(colB);

    this.addChild(body);

    // 3. Data Visualizer (The Canvas Paint Test)
    const dataViz = new NxBox();
    dataViz.yogaNode.setHeight(40);
    dataViz.yogaNode.setMargin(Yoga.EDGE_TOP, 8);
    dataViz.backgroundColor = '#1E1E2E'; // Base
    dataViz.borderWidth = 1;
    dataViz.borderColor = '#45475A'; // Surface1
    this.addChild(dataViz);

    // 4. Interactive Footer (The Hit-Test Test)
    const footer = new NxBox();
    footer.yogaNode.setFlexDirection(Yoga.FLEX_DIRECTION_ROW);
    footer.yogaNode.setJustifyContent(Yoga.JUSTIFY_SPACE_BETWEEN);
    footer.yogaNode.setPadding(Yoga.EDGE_ALL, 8);

    const actionBtn = new NxButton('Run Task', () => {
      this.setStatus('running');
      setTimeout(() => {
        this.setStatus('success');
      }, 2000);
    });
    footer.addChild(actionBtn);

    this.addChild(footer);
  }

  setStatus(status: 'idle' | 'running' | 'success' | 'error') {
    this.status = status;
    switch (status) {
      case 'idle':
        this.borderColor = 'transparent';
        break;
      case 'running':
        this.borderColor = catppuccinTheme.running;
        break;
      case 'success':
        this.borderColor = catppuccinTheme.success;
        break;
      case 'error':
        this.borderColor = catppuccinTheme.error;
        break;
    }
  }

  paint(ctx: CanvasRenderingContext2D) {
    if (this.status === 'running') {
      // Glow effect for running status
      const layout = this.yogaNode.getComputedLayout();
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = catppuccinTheme.running;
      super.paint(ctx);
      ctx.restore();
    } else {
      super.paint(ctx);
    }
  }
}
