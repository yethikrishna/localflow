// Pretext-native widget primitives
// NxText, NxBox, NxButton, NxTextInput

import { NxWidget } from '@nexus/core';
import Yoga from 'yoga-layout';
import { catppuccinTheme } from './theme';

export class NxBox extends NxWidget {
  public backgroundColor: string = catppuccinTheme.surface;
  public borderColor: string = catppuccinTheme.surfaceHover;
  public borderWidth: number = 0;
  public borderRadius: number = 0;

  constructor() {
    super();
  }

  paint(ctx: CanvasRenderingContext2D) {
    const layout = this.yogaNode.getComputedLayout();
    
    ctx.save();
    ctx.translate(layout.left, layout.top);

    // Draw state-based glow/border
    if (this.state === 'running') {
      ctx.shadowBlur = 10;
      ctx.shadowColor = catppuccinTheme.running;
    } else if (this.state === 'success') {
      ctx.shadowBlur = 10;
      ctx.shadowColor = catppuccinTheme.success;
    } else if (this.state === 'error') {
      ctx.shadowBlur = 10;
      ctx.shadowColor = catppuccinTheme.error;
    }

    // Paint background
    ctx.fillStyle = this.backgroundColor;
    if (this.borderRadius > 0) {
      ctx.beginPath();
      ctx.roundRect(0, 0, layout.width, layout.height, this.borderRadius);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, layout.width, layout.height);
    }

    // Paint border (overriding shadow for sharp lines)
    ctx.shadowBlur = 0;
    const borderColor = this.state === 'success' ? catppuccinTheme.success : 
                        this.state === 'error' ? catppuccinTheme.error : 
                        this.state === 'running' ? catppuccinTheme.running : 
                        this.borderColor;
    const borderWidth = this.state !== 'idle' ? Math.max(this.borderWidth, 2) : this.borderWidth;

    if (borderWidth > 0) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth;
      if (this.borderRadius > 0) {
        ctx.beginPath();
        ctx.roundRect(0, 0, layout.width, layout.height, this.borderRadius);
        ctx.stroke();
      } else {
        ctx.strokeRect(0, 0, layout.width, layout.height);
      }
    }

    // Paint children
    for (const child of this.children) {
      child.paint(ctx);
    }

    ctx.restore();
  }
}

export class NxText extends NxWidget {
  public content: string = '';
  public fontSize: number = 14;
  public color: string = '#CDD6F4';
  public fontWeight: string = 'normal';

  constructor(content: string) {
    super();
    this.content = content;
    
    // Default text nodes should have flex-shrink: 0 or be measured
    // For now, we'll set a basic size or implement measurement
  }

  paint(ctx: CanvasRenderingContext2D) {
    const layout = this.yogaNode.getComputedLayout();
    
    ctx.save();
    ctx.translate(layout.left, layout.top);
    
    ctx.fillStyle = this.color;
    ctx.font = `${this.fontWeight} ${this.fontSize}px Inter, sans-serif`;
    ctx.textBaseline = 'top';
    ctx.fillText(this.content, 0, 0);
    
    ctx.restore();
  }
}

export class NxButton extends NxBox {
  private label: NxText;

  constructor(text: string, private onClick: () => void) {
    super();
    this.backgroundColor = '#89B4FA';
    this.borderRadius = 8;
    this.padding = 12;

    this.label = new NxText(text);
    this.label.color = '#1E1E2E';
    this.label.fontWeight = 'bold';
    this.addChild(this.label);
    
    // Configure Yoga for centering
    this.yogaNode.setPadding(Yoga.EDGE_ALL, 12);
    this.yogaNode.setJustifyContent(Yoga.JUSTIFY_CENTER);
    this.yogaNode.setAlignItems(Yoga.ALIGN_CENTER);
  }

  set padding(val: number) {
    this.yogaNode.setPadding(Yoga.EDGE_ALL, val);
  }

  onMouseDown() {
    this.onClick();
  }
}
