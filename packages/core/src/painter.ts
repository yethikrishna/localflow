// High-performance Canvas 2D Painter for backgrounds, borders, and text
// Part of the Canvas 2D Painter implementation

import { catppuccinTheme } from '../../ui/src/theme';

export type BackgroundStyle = string | CanvasGradient | CanvasPattern;

export interface BorderStyle {
  width: number;
  color: string;
  radius: number;
}

export class NexusPainter {
  static drawBox(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    background: BackgroundStyle,
    border?: BorderStyle
  ) {
    ctx.save();
    ctx.fillStyle = background;

    if (border && border.radius > 0) {
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, border.radius);
      ctx.fill();
      if (border.width > 0) {
        ctx.strokeStyle = border.color;
        ctx.lineWidth = border.width;
        ctx.stroke();
      }
    } else {
      ctx.fillRect(x, y, width, height);
      if (border && border.width > 0) {
        ctx.strokeStyle = border.color;
        ctx.lineWidth = border.width;
        ctx.strokeRect(x, y, width, height);
      }
    }
    ctx.restore();
  }

  static drawText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    color: string,
    fontWeight: string = 'normal'
  ) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = `${fontWeight} ${fontSize}px Inter, -apple-system, sans-serif`;
    ctx.textBaseline = 'top';
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  // Linear gradient helper
  static createLinearGradient(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    stops: { offset: number; color: string }[]
  ): CanvasGradient {
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    stops.forEach((stop) => gradient.addColorStop(stop.offset, stop.color));
    return gradient;
  }
}
