# NexusFlow: Visual Workflow Editor Specs

## 1. Interaction Model
- **Infinite Canvas**: Draggable with middle-click/space-drag, zoomable with scroll.
- **Node-Based**: Drag-and-drop from a node palette (left sidebar).
- **Selection**: Click to select, Cmd/Ctrl-Click for multi-select.
- **Configuration**: Right sidebar opens when a node is selected.
- **Mini-Map**: Bottom-right corner for quick navigation.

## 2. Node Types

### Trigger (Entry Points)
- **Schedule**: Cron-based triggers (e.g., "Every Monday at 9 AM").
- **Webhook**: External HTTP requests.
- **File Watcher**: Trigger on local file creation/modification.
- **Manual**: Button to start the workflow.

### Agent (Intelligence)
- **Select Role**: Reference a role from `.nexus/agents/`.
- **Model Override**: Change the LLM provider/model for this specific step.
- **Prompt Input**: Define the specific task for the agent.
- **Parallel Mode**: Option to spawn multiple instances of the agent.

### Tool (Action)
- **MCP Tool**: Connect to any registered Model Context Protocol server.
- **Native Tool**: Built-in tools like `file_read`, `terminal_exec`.
- **Custom Script**: Run a local Python or TypeScript snippet.

### Logic (Control Flow)
- **Condition (If/Else)**: Route based on agent output or tool result.
- **Switch**: Multi-branch routing.
- **Merge (Sync)**: Wait for multiple parallel paths to complete.
- **Loop**: Iterate over a list of items.

### Output (Destination)
- **File Save**: Write result to the local project.
- **AppFlowy/NocoDB**: Send data to self-hosted productivity tools.
- **Notification**: Desktop notify or webhook out.

## 3. Data Flow & Type Safety
- **Schema Validation**: Each node defines its output schema (JSON).
- **Auto-Mapping**: Connecting nodes automatically suggests mapping compatible fields.
- **Type Checking**: Visual indicators for incompatible connections (red edges).

## 4. Visual Execution (Observability)
- **Active Edge**: Flowing dots on edges representing data moving.
- **Node State**:
  - `Idle`: Static, Base color.
  - `Running`: Pulsing, Green glow.
  - `Completed`: Solid Green border.
  - `Error`: Static Red border with alert icon.
- **Live Output Console**: Floating window showing real-time agent/tool logs.

## 5. UI Layout Mockup (ASCII Representation)
```
+-----------------------------------------------------------------------+
|  [NEXUS] | Project: LocalFlow | v0.1.0-alpha          [User Profile]  |
+-----------------------------------------------------------------------+
| Palette |             Infinite Workflow Canvas            | Config  |
|---------|                                                 |---------|
| Triggers|     +------------+      +------------+          | Node:   |
| [ ] [ ] |     | Trigger    |----->| Agent      |          | Review  |
| Agents  |     | Schedule   |      | Researcher |          |---------|
| [ ] [ ] |     +------------+      +------------+          | Model:  |
| Tools   |                               |                 | Sonnet  |
| [ ] [ ] |     +------------+      +-----V------+          |         |
| Logic   |     | Output     |<-----| Tool       |          | Role:   |
| [ ] [ ] |     | AppFlowy   |      | WebSearch  |          | Senior  |
| Outputs |     +------------+      +------------+          |         |
| [ ] [ ] |                                                 | [Save]  |
|---------|-------------------------------------------------|---------|
| [Status: All systems running] | [Mini-Map] | [Zoom: 100%] | [Run]   |
+-----------------------------------------------------------------------+
```
