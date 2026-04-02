# Node Palette: Design & Interface Spec

The Node Palette is the primary interface for users to discover and add new functionality to their workflows.

## 1. UI Structure
- **Container**: `width: 240px`, `background: Surface0 (#313244)`, `border-right: 1px solid Surface1 (#45475A)`.
- **Search Bar**: `NxTextInput` at the top for filtering nodes.
- **Categories**: Accordion-style lists (Triggers, Agents, Tools, Logic, Outputs).
- **Node Item**: A draggable list item representing a node template.

## 2. Node Item Component (`NxPaletteItem`)
- **Layout**: `padding: 8px 12px`, `flex-direction: row`, `align-items: center`.
- **Icon**: Small 16x16 icon on the left.
- **Label**: `NxText` with the node name.
- **Hover State**: Background changes to `Surface1`, cursor changes to `grab`.

## 3. Categories & Initial Node Set
| Category | Nodes |
|---|---|
| **Triggers** | Schedule, Webhook, File Watcher, Manual |
| **Agents** | Researcher, Reviewer, Architect, Coder |
| **Tools** | Ollama, AppFlowy, NocoDB, WebSearch, Terminal |
| **Logic** | If/Else, Switch, Merge, Loop |
| **Outputs** | File Save, Desktop Notify, Webhook Out |

## 4. Technical Interface

```typescript
interface NxPaletteItemProps {
  type: string;
  category: string;
  label: string;
  icon: string;
}

class NxNodePalette extends NxBox {
  constructor() {
    super();
    this.yogaNode.setWidth(240);
    this.yogaNode.setFlexDirection(Yoga.FLEX_DIRECTION_COLUMN);
    this.backgroundColor = catppuccinTheme.surface0;
    
    // Add Search
    // Add Scrollable Categories
  }
  
  // Drag & Drop logic
  onMouseDown(e: MouseEvent) {
    // Identify which item was clicked
    // Initiate drag-shadow
  }
}
```

## 5. Visual implementation Tasks
- [ ] Implement `NxPaletteItem` widget.
- [ ] Implement `NxNodePalette` container with category headers.
- [ ] Implement hover and active states for items.
- [ ] Integrate with the core hit-testing system.
