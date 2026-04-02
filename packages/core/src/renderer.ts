// Core renderer for NEXUS
// Pretext + Yoga + Canvas 2D

import { NxWidget } from './widget';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class NexusRenderer {
  private rootWidget: NxWidget | null = null;
  private ctx: CanvasRenderingContext2D;

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

  private render() {
    if (!this.rootWidget) return;

    // 1. Layout pass
    this.rootWidget.layout(this.canvas.width, this.canvas.height);

    // 2. Paint pass
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.rootWidget.paint(this.ctx);
  }

  private setupEvents() {
    this.canvas.addEventListener('mousedown', (e) => {
      if (!this.rootWidget) return;
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const target = this.rootWidget.hitTest(x, y);
      if (target && target.onMouseDown) {
        target.onMouseDown(x, y);
        this.requestRender();
      }
    });
  }
}
