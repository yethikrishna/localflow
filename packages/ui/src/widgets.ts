// Pretext-native widget primitives for NEXUS
// Implementing Text, TextInput, Button, ScrollView, Panel, Divider

import { NxWidget, NexusPainter, Yoga, NexusRenderer } from '@nexus/core';
import { catppuccinTheme } from './theme';

// 1. NxText - Enhanced text rendering
export class NxText extends NxWidget {
  public content: string = '';
  public fontSize: number = 14;
  public color: string = catppuccinTheme.text;
  public fontWeight: string = 'normal';

  constructor(content: string) {
    super();
    this.content = content;
    this.markDirty();
  }

  paint(ctx: CanvasRenderingContext2D) {
    const layout = this.yogaNode.getComputedLayout();
    NexusPainter.drawText(
      ctx,
      this.content,
      layout.left,
      layout.top,
      this.fontSize,
      this.color,
      this.fontWeight
    );
  }
}

// 2. NxTextInput - Interactive text input
export class NxTextInput extends NxWidget {
  public value: string = '';
  public placeholder: string = 'Type here...';
  public isFocused: boolean = false;
  private cursorBlink: boolean = true;
  private blinkInterval: any;

  constructor() {
    super();
    this.markDirty();
    this.setWidth(200);
    this.setHeight(40);
  }

  onMouseDown() {
    this.isFocused = true;
    this.startBlinking();
    this.markDirty();
  }

  onBlur() {
    this.isFocused = false;
    if (this.blinkInterval) clearInterval(this.blinkInterval);
    this.markDirty();
  }

  onKeyDown(key: string) {
    if (key === 'Backspace') {
      this.value = this.value.slice(0, -1);
    } else if (key.length === 1) {
      this.value += key;
    }
    this.markDirty();
  }

  private startBlinking() {
    if (this.blinkInterval) clearInterval(this.blinkInterval);
    this.blinkInterval = setInterval(() => {
      this.cursorBlink = !this.cursorBlink;
      this.markDirty();
    }, 500);
  }

  paint(ctx: CanvasRenderingContext2D) {
    const layout = this.yogaNode.getComputedLayout();
    
    // Draw background
    NexusPainter.drawBox(
      ctx,
      layout.left,
      layout.top,
      layout.width,
      layout.height,
      catppuccinTheme.surface0,
      {
        width: this.isFocused ? 2 : 1,
        color: this.isFocused ? catppuccinTheme.blue : catppuccinTheme.surface2,
        radius: 6
      }
    );

    // Draw text
    const textToDraw = this.value || this.placeholder;
    const textColor = this.value ? catppuccinTheme.text : catppuccinTheme.subtext0;
    
    NexusPainter.drawText(
      ctx,
      textToDraw,
      layout.left + 8,
      layout.top + 10,
      14,
      textColor
    );

    // Draw cursor
    if (this.isFocused && this.cursorBlink) {
      const textWidth = ctx.measureText(this.value).width;
      NexusPainter.drawBox(
        ctx,
        layout.left + 8 + textWidth,
        layout.top + 8,
        2,
        layout.height - 16,
        catppuccinTheme.blue
      );
    }
  }
}

// 3. NxButton - State-based interactive button
export class NxButton extends NxWidget {
  public label: string;
  public isHovered: boolean = false;
  public isPressed: boolean = false;

  constructor(label: string, public onClick: () => void) {
    super();
    this.label = label;
    this.setPadding(Yoga.EDGE_ALL, 12);
    this.markDirty();
  }

  onMouseEnter() {
    this.isHovered = true;
    this.markDirty();
  }

  onMouseLeave() {
    this.isHovered = false;
    this.isPressed = false;
    this.markDirty();
  }

  onMouseDown() {
    this.isPressed = true;
    this.markDirty();
  }

  onMouseUp() {
    if (this.isPressed) {
      this.onClick();
    }
    this.isPressed = false;
    this.markDirty();
  }

  paint(ctx: CanvasRenderingContext2D) {
    const layout = this.yogaNode.getComputedLayout();
    const bg = this.isPressed ? catppuccinTheme.surface2 : 
               this.isHovered ? catppuccinTheme.surface1 : 
               catppuccinTheme.surface0;

    NexusPainter.drawBox(
      ctx,
      layout.left,
      layout.top,
      layout.width,
      layout.height,
      bg,
      { width: 1, color: catppuccinTheme.surface2, radius: 8 }
    );

    const textWidth = ctx.measureText(this.label).width;
    NexusPainter.drawText(
      ctx,
      this.label,
      layout.left + (layout.width - textWidth) / 2,
      layout.top + (layout.height - 14) / 2,
      14,
      catppuccinTheme.text
    );
  }
}

// 4. NxPanel - Container widget
export class NxPanel extends NxWidget {
  public backgroundColor: string = catppuccinTheme.base;

  constructor() {
    super();
    this.setPadding(Yoga.EDGE_ALL, 16);
    this.markDirty();
  }

  paint(ctx: CanvasRenderingContext2D) {
    const layout = this.yogaNode.getComputedLayout();
    NexusPainter.drawBox(
      ctx,
      layout.left,
      layout.top,
      layout.width,
      layout.height,
      this.backgroundColor,
      { width: 1, color: catppuccinTheme.surface0, radius: 12 }
    );

    for (const child of this.children) {
      child.paint(ctx);
    }
  }
}

// 5. NxDivider - Visual separator
export class NxDivider extends NxWidget {
  constructor() {
    super();
    this.setHeight(1);
    this.setMargin(Yoga.EDGE_VERTICAL, 8);
    this.markDirty();
  }

  paint(ctx: CanvasRenderingContext2D) {
    const layout = this.yogaNode.getComputedLayout();
    NexusPainter.drawBox(
      ctx,
      layout.left,
      layout.top,
      layout.width,
      1,
      catppuccinTheme.surface1
    );
  }
}

// 6. NxScrollView - Virtualized scroll container
export class NxScrollView extends NxWidget {
  private scrollOffset: number = 0;
  private totalHeight: number = 0;

  constructor() {
    super();
    this.markDirty();
  }

  // Simple virtualization: only paint children within view
  paint(ctx: CanvasRenderingContext2D) {
    const layout = this.yogaNode.getComputedLayout();
    
    ctx.save();
    // Clip to scroll view bounds
    ctx.beginPath();
    ctx.rect(layout.left, layout.top, layout.width, layout.height);
    ctx.clip();

    ctx.translate(0, -this.scrollOffset);

    for (const child of this.children) {
      const childLayout = child.yogaNode.getComputedLayout();
      // Simple frustum culling
      if (childLayout.top + childLayout.height >= this.scrollOffset && 
          childLayout.top <= this.scrollOffset + layout.height) {
        child.paint(ctx);
      }
    }

    ctx.restore();
  }
}
