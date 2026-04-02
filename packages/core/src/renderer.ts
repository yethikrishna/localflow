// Core renderer for NEXUS
// Pretext + Yoga + Canvas 2D

import { NxWidget } from './widget';
import { RTree } from './rtree';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class NexusRenderer {
  private rootWidget: NxWidget | null = null;
  private ctx: CanvasRenderingContext2D;
  private rTree: RTree = new RTree();
  private dirtyRects: Rect[] = [];
  private hoveredWidget: NxWidget | null = null;
  private focusedWidget: NxWidget | null = null;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.setupEvents();
  }

  setRoot(widget: NxWidget) {
    this.rootWidget = widget;
    this.requestRender();
  }

  requestRender() {
    requestAnimationFrame(() => this.render());
  }

  private updateRTree(widget: NxWidget) {
    this.rTree.insert(widget);
    for (const child of widget.children) {
      this.updateRTree(child);
    }
  }

  private render() {
    if (!this.rootWidget) return;

    // 1. Layout pass (could be optimized to only run if layout is dirty)
    this.rootWidget.layout(this.canvas.width, this.canvas.height);

    // 2. Spatial Index update (always fresh for events)
    this.rTree.clear();
    this.updateRTree(this.rootWidget);

    // 3. Paint pass
    if (this.rootWidget.isDirty) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.rootWidget.paint(this.ctx);
      this.rootWidget.clearDirty();
    }
  }

  private setupEvents() {
    const handleEvent = (e: MouseEvent, type: 'mousedown' | 'mouseup' | 'mousemove') => {
      if (!this.rootWidget) return;
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const targets = this.rTree.search(x, y);
      const target = targets[targets.length - 1] || null;
      
      if (type === 'mousemove') {
        if (target !== this.hoveredWidget) {
          if (this.hoveredWidget && this.hoveredWidget.onMouseLeave) {
            this.hoveredWidget.onMouseLeave();
          }
          if (target && target.onMouseEnter) {
            target.onMouseEnter();
          }
          this.hoveredWidget = target;
          this.requestRender();
        }
      } else if (type === 'mousedown') {
        if (this.focusedWidget && this.focusedWidget !== target && (this.focusedWidget as any).onBlur) {
          (this.focusedWidget as any).onBlur();
        }
        if (target) {
          if (target.onMouseDown) target.onMouseDown(x, y);
          this.focusedWidget = target;
        } else {
          this.focusedWidget = null;
        }
        this.requestRender();
      } else if (type === 'mouseup' && target && target.onMouseUp) {
        target.onMouseUp(x, y);
        this.requestRender();
      }
    };

    this.canvas.addEventListener('mousedown', (e) => handleEvent(e, 'mousedown'));
    this.canvas.addEventListener('mouseup', (e) => handleEvent(e, 'mouseup'));
    this.canvas.addEventListener('mousemove', (e) => handleEvent(e, 'mousemove'));

    window.addEventListener('keydown', (e) => {
      if (this.focusedWidget && (this.focusedWidget as any).onKeyDown) {
        (this.focusedWidget as any).onKeyDown(e.key);
        this.requestRender();
      }
    });
  }
}
