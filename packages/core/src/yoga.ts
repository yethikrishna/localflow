// Yoga layout bindings for NEXUS
// Pretext handles text measurement, Yoga handles box layout

import Yoga from 'yoga-layout';

export class NexusLayout {
  private root: any;

  constructor() {
    this.root = Yoga.Node.create();
  }

  calculate() {
    this.root.calculateLayout();
  }
}
