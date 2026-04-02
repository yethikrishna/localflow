# NxDemoNode: Rendering Engine Stress-Test Spec

The `NxDemoNode` is a specialized widget designed to exercise all major features of the **NexusCanvas** rendering engine. It serves as the primary integration test for `fs-dev-1`.

## 1. Visual Structure

### 1.1 Header (The Gradient Test)
- **Layout**: `height: 32px`, `padding: 0 8px`, `flex-direction: row`, `align-items: center`.
- **Background**: Linear gradient from `Sapphire (#74C7EC)` to `Mauve (#CBA6F7)`.
- **Content**: Left-aligned icon (Path) + Center-aligned title (NxText, 12px Bold) + Right-aligned close button (NxBox + NxText).

### 1.2 Body (The Text & Flex Test)
- **Container**: `padding: 12px`, `background: Surface0 (#313244)`.
- **Nested Columns**:
  - **Column A (Left)**: 40% width. Contains a small `NxBox` (64x64) with a rounded border and a placeholder avatar.
  - **Column B (Right)**: 60% width. Contains three paragraphs of `NxText` with varying fonts, sizes, and line heights. This tests **Pretext** measurement and **Yoga** box-wrapping.

### 1.3 Data Visualizer (The Canvas Paint Test)
- **Box**: `height: 40px`, `margin-top: 8px`, `background: Base (#1E1E2E)`, `border: 1px solid Surface1 (#45475A)`.
- **Content**: A single Canvas-painted `path` representing a live sparkline. This tests the engine's ability to handle raw drawing commands within a layout box.

### 1.4 Interactive Footer (The Hit-Test Test)
- **Layout**: `flex-direction: row`, `justify-content: space-between`, `padding: 8px`.
- **Widgets**:
  - `NxButton` (Filled): Primary action.
  - `NxToggle`: Custom widget using two nested `NxBox`es. Clicking the outer box should toggle the inner box's position and color.

## 2. Technical Interface (For `fs-dev-1`)

```typescript
interface NxDemoNodeProps {
  id: string;
  title: string;
  description: string;
  sparklineData: number[]; // Array of values to paint as a path
  isActive: boolean;        // Toggles glowing border
  onAction: () => void;
}

/**
 * NxDemoNode Implementation Blueprint
 * 1. layout(): Uses Yoga to define the tree:
 *    Node (Box) -> Header (Box) -> Title (Text)
 *               -> Body (Box) -> [ColA, ColB]
 *               -> Footer (Box) -> [Button, Toggle]
 * 2. paint(): 
 *    - Uses ctx.createLinearGradient for header.
 *    - Uses ctx.beginPath / lineTo for sparkline.
 *    - Uses Pretext for layoutWithLines in the body.
 * 3. hitTest(): 
 *    - Must correctly identify sub-clicks on Button and Toggle.
 */
```

## 3. Success Criteria
- [ ] Text in Column B wraps correctly based on Yoga's box width.
- [ ] Gradient in header renders without artifacts.
- [ ] Sparkline path stays within the bounds of its container.
- [ ] Toggle state changes visually on click (150ms transition).
- [ ] Frame time stays below 16ms during interaction.
