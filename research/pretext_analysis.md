# Pretext Library In-Depth Analysis

## 1. Overview
**Pretext** is a high-performance JavaScript/TypeScript library developed by [Cheng Lou](https://github.com/chenglou) (a foundational developer of React and Midjourney frontend) for multiline text measurement and layout. It is designed to side-step the browser's DOM layout engine, which is often the primary bottleneck in web UI performance due to "layout thrashing" (synchronous reflows triggered by reading properties like `getBoundingClientRect` or `offsetHeight`).

### Key Statistics:
- **Performance**: `prepare()` takes ~19ms for 500 texts; `layout()` takes ~0.09ms for the same batch (pure arithmetic).
- **Size**: ~15KB (minified/gzipped estimate based on "15KB Library" headlines).
- **Dependencies**: Zero.

---

## 2. API Surface
Pretext provides a two-tiered API for different use cases:

### Case 1: Fast Height Measurement (Virtualization & Layout)
Used for calculating how tall a text block will be without rendering it.
- `prepare(text, font, options)`: Performs one-time analysis (whitespace normalization, segmentation, glue rules, canvas measurement). Returns an opaque handle.
- `layout(prepared, maxWidth, lineHeight)`: Pure arithmetic pass. Returns `{ height, lineCount }`.

### Case 2: Manual Line Layout (Custom Rendering)
Used for rendering text to Canvas, SVG, or WebGL where the browser's native text wrapping is unavailable or insufficient.
- `prepareWithSegments(...)`: Returns a richer structure for manual layout.
- `layoutWithLines(...)`: Returns an array of lines with their text and widths.
- `walkLineRanges(...)`: Iterates over lines without building strings (highly efficient for "shrink-wrap" calculations).
- `layoutNextLine(prepared, cursor, maxWidth)`: An iterator-like API that allows for dynamic widths (e.g., flowing text around a circular obstacle).

---

## 3. Technical Implementation

### Text Measurement
Pretext uses the **Canvas `measureText` API** as its ground truth for glyph shaping and measurement. This allows it to stay in sync with the browser's font engine while avoiding the DOM. It caches these measurements internally to ensure that repeated layouts of the same text or same font characters are nearly instantaneous.

### Multiline Layout & Bidi
- **Segmentation**: It breaks text into segments (words, spaces, etc.) and uses a custom line-breaking algorithm.
- **Bidi Support**: It includes its own bidirectional text handling (inspired by `pdf.js`), allowing it to correctly layout mixed RTL/LTR languages.
- **Languages**: Supports complex scripts, emojis, and specific browser quirks.

### Rendering Support
Pretext itself is a **layout engine, not a renderer**. It calculates coordinates and segments, which can then be passed to any rendering target:
- **DOM**: Render via absolute positioning or `display: block` with pre-calculated heights.
- **Canvas**: Use `ctx.fillText` with the coordinates provided by Pretext.
- **SVG**: Generate `<text>` and `<tspan>` elements.
- **WebGL**: Pass text segments to a glyph-based shader.

---

## 4. Building a Full Application UI without CSS
Pretext's vision (as detailed in `thoughts.md`) is to move layout logic into "userland" (JavaScript) to circumvent the complexity and performance limitations of the CSS specification. To build a full application UI using Pretext instead of CSS, several additional systems would be required:

1. **Box Layout Engine**: Pretext only handles text. A system like **Flexbox** or **Grid** would need to be re-implemented in JS to handle the positioning of non-text elements (images, containers) and to provide the `maxWidth` constraints to Pretext.
2. **Widget System**: A library of reusable components (Buttons, Inputs, Modals) that use Pretext for internal text layout.
3. **Event Handling & Hit Testing**: Since elements wouldn't rely on the DOM's native flow, a custom hit-testing system (likely using a quadtree or R-tree) would be needed to map click/touch coordinates to UI elements.
4. **Accessibility (AOM)**: This is the biggest challenge. A hidden "mirror DOM" or full implementation of the **Accessibility Object Model (AOM)** would be necessary to ensure the UI is screen-reader friendly.
5. **Reactive State Management**: A way to trigger re-layouts when data changes (Pretext's speed makes this feasible at 60fps).

---

## 5. Comparison with Similar Projects

| Project | Rendering Target | Layout Paradigm | Note |
|---|---|---|---|
| **Flutter** | Skia / Impeller | Custom (Widget Tree) | Full OS-level engine; does not use browser's text layout at all. |
| **Dear ImGui** | Graphics API (GL/DX) | Immediate Mode | Designed for tools/overlays; very fast but non-standard for web. |
| **Yoga** | Any | Flexbox (C++) | A layout engine used by React Native; could be paired with Pretext. |
| **Pretext** | DOM/Canvas/SVG | Retained/Iterative | Specifically targets the "Text Layout" bottleneck on the web. |

---

## 6. Capabilities & Limitations

### Capabilities:
- **Extreme Speed**: Enables real-time text reflow and complex animations (see Editorial Engine demo).
- **Exact Shrink-wrap**: Can find the tightest possible width for multiline text (impossible with standard CSS `fit-content`).
- **Obstacle Awareness**: Text can flow around any shape, not just rectangles.
- **Predictable Virtualization**: Allows for perfectly smooth infinite scrolling by knowing exactly where every line ends before it enters the viewport.

### Limitations:
- **No Native Features**: Loses native text selection, copy-paste, and browser "Find in Page" unless explicitly re-implemented or mirrored in the DOM.
- **Font Loading**: Relies on fonts being fully loaded before measurement (though it can handle font-loading callbacks).
- **Complexity**: Requires developers to manage their own "paint" loop if using Canvas/WebGL.
