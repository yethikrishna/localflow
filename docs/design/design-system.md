# Nexus Design Language (NDL)

## 1. Design Philosophy
- **Functional & High-Density**: Optimized for productivity and information density.
- **Agent-First**: Visual focus on agent activity, task state, and parallel workflows.
- **Zero-CSS Architecture**: Designed to be rendered via Pretext (text) + Yoga (layout) + Canvas (paint). No DOM/CSS bloat.
- **Local-First Esthetics**: Clean, dark, and reliable.

## 2. Color Palette
Based on "Catppuccin Mocha" for a high-performance dark mode that's easy on the eyes.

| Category | Name | HEX | Usage |
|---|---|---|---|
| **Surface** | Base | `#1E1E2E` | Primary window background |
| **Surface** | Surface0 | `#313244` | Sidebars, panels |
| **Surface** | Surface1 | `#45475A` | Border colors, inactive tabs |
| **Text** | Text | `#CDD6F4` | Primary body text |
| **Text** | Subtext | `#A6ADC8` | Muted labels, secondary info |
| **Accent** | Blue | `#89B4FA` | Selection, active highlights, links |
| **Status** | Green | `#A6E3A1` | Success, Running Agent (stable) |
| **Status** | Yellow | `#F9E2AF` | Warning, Pending, Agent Waiting |
| **Status** | Red | `#F38BA8` | Error, Failed Task |
| **Agent** | Mauve | `#CBA6F7` | Specialist Agent 1 |
| **Agent** | Sapphire | `#74C7EC` | Specialist Agent 2 |

## 3. Typography
- **UI Font**: `Inter`, `system-ui`, `-apple-system`.
- **Code Font**: `JetBrains Mono`, `Fira Code`, `monospace`.

| Variant | Size | Weight | Usage |
|---|---|---|---|
| **H1** | 20px | 600 | Page titles |
| **H2** | 16px | 600 | Section headers |
| **Body** | 14px | 400 | Primary interface text |
| **Small** | 12px | 400 | Secondary metadata, labels |
| **Code** | 13px | 400 | Editor content, terminal |

## 4. Components (NexusWidget Primitives)
All components follow the `NxWidget` interface: `layout()`, `paint()`, `hitTest()`.

### NxBox
- **Props**: `padding`, `margin`, `backgroundColor`, `borderColor`, `borderWidth`, `borderRadius`.
- **Yoga Node**: Flexbox layout.
- **Paint**: Canvas `roundRect` or `rect`.

### NxText
- **Props**: `content`, `fontSize`, `fontWeight`, `color`, `lineHeight`.
- **Engine**: Rendered via Pretext.
- **Paint**: Canvas `fillText`.

### NxButton
- **Variants**: Primary (Filled), Secondary (Ghost).
- **Interactions**: Hover (lighten background), Press (slight scale down).

### NxIcon
- **Engine**: Path-based SVG rendering directly to Canvas.
- **Primary Set**: Lucide-style (Minimalist, 1px stroke).

## 5. Grid & Spacing
- **Base Unit**: 4px.
- **Spacing Scale**: 4, 8, 12, 16, 24, 32, 48, 64.
- **Layout**: Flexible multi-pane system using Yoga's Flexbox engine.

## 6. Motion & Feedback
- **Transitions**: 150ms-200ms easing for panel opening/closing.
- **Agent Pulse**: Subtle breathing animation for active agents.
- **Zero Latency**: Input feedback must render in <16ms.
