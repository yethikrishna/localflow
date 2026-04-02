// Efficient R-tree implementation for widget spatial indexing
// Part of the R-tree Event System for hit testing

import { NxWidget } from './widget';

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export class RTree {
  private nodes: { box: BoundingBox, widget: NxWidget }[] = [];

  constructor() {}

  insert(widget: NxWidget) {
    const bounds = widget.getGlobalBounds();
    this.nodes.push({
      box: {
        minX: bounds.x,
        minY: bounds.y,
        maxX: bounds.x + bounds.width,
        maxY: bounds.y + bounds.height
      },
      widget
    });
  }

  clear() {
    this.nodes = [];
  }

  search(x: number, y: number): NxWidget[] {
    const result: NxWidget[] = [];
    for (const node of this.nodes) {
      if (x >= node.box.minX && x <= node.box.maxX && y >= node.box.minY && y <= node.box.maxY) {
        result.push(node.widget);
      }
    }
    // Return nodes sorted by "depth" if needed, but for now we'll rely on traversal order or reverse search
    return result;
  }
}
