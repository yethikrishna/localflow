// Base widget class for NEXUS
// All UI components must extend this class

import Yoga, { YogaNode } from 'yoga-layout';

export type WidgetState = 'idle' | 'running' | 'success' | 'error';

export abstract class NxWidget {
  public yogaNode: YogaNode;
  public children: NxWidget[] = [];
  public parent: NxWidget | null = null;
  public state: WidgetState = 'idle';

  constructor() {
    this.yogaNode = Yoga.Node.create();
  }

  // Base paint function
  abstract paint(ctx: CanvasRenderingContext2D): void;

  // Hit testing
  hitTest(x: number, y: number): NxWidget | null {
    const layout = this.yogaNode.getComputedLayout();
    
    // Check if point is inside current widget bounds
    if (
      x >= layout.left &&
      x <= layout.left + layout.width &&
      y >= layout.top &&
      y <= layout.top + layout.height
    ) {
      // Check children in reverse order (top to bottom)
      for (let i = this.children.length - 1; i >= 0; i--) {
        const child = this.children[i];
        const relativeX = x - layout.left;
        const relativeY = y - layout.top;
        const result = child.hitTest(relativeX, relativeY);
        if (result) return result;
      }
      return this;
    }
    return null;
  }

  // Event handlers (to be overridden)
  onMouseDown?(x: number, y: number): void;
  onMouseUp?(x: number, y: number): void;
  onMouseEnter?(): void;
  onMouseLeave?(): void;

  // Layout calculation
  layout(width: number, height: number) {
    this.yogaNode.calculateLayout(width, height);
  }

  // Helper to add children
  addChild(child: NxWidget) {
    child.parent = this;
    this.children.push(child);
    this.yogaNode.insertChild(child.yogaNode, this.children.length - 1);
  }

  // Common layout properties
  setPadding(edge: number, value: number) {
    this.yogaNode.setPadding(edge, value);
  }

  setMargin(edge: number, value: number) {
    this.yogaNode.setMargin(edge, value);
  }

  setWidth(value: number | string) {
    this.yogaNode.setWidth(value);
  }

  setHeight(value: number | string) {
    this.yogaNode.setHeight(value);
  }
}
