# NexusFlow: Workflow Serialization Architecture

To enable the "ClawHub" vision, we have implemented a high-performance, JSON-based serialization layer for our visual workflows.

## 1. JSON Schema (v0.1.0)
Workflows are serialized into a lightweight, versioned JSON format.

```json
{
  "version": "0.1.0",
  "name": "My AI Workflow",
  "nodes": [
    {
      "id": "research-node-1",
      "type": "workflow-node",
      "title": "Topic Researcher",
      "config": {
        "model": "ollama:llama3",
        "tools": ["web-search", "appflowy-read"]
      },
      "position": { "x": 100, "y": 200 }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "trigger-1",
      "target": "research-node-1"
    }
  ]
}
```

## 2. Implementation: `WorkflowSerializer`
Located in `packages/ui/src/serialization.ts`, this utility provides:
- **`serialize(name, nodes, edges)`**: Converts live `NxWorkflowNode` instances and a list of edges into a `WorkflowData` object. It automatically captures computed layout positions from the **Yoga** engine.
- **`deserialize(data)`**: Re-instantiates the nodes from a JSON object and returns the nodes and edge data, ready to be added to the `NexusCanvas`.
- **`stringify()` / `parse()`**: Standard JSON helpers for file I/O operations.

## 3. Integration Plan
- **Save/Load**: The `apps/desktop` layer (Tauri) will use these utilities to persist workflows to `.nexus/workflows/*.json`.
- **Sharing**: The "Community Workflow Hub" (ClawHub) will ingest these JSON files to enable one-click imports.

## 4. Next Steps
- Implement Edge (Connection) serialization once the `NxEdge` component is finalized.
- Add validation logic to ensure that deserialized nodes are compatible with the current tool bridge version.
