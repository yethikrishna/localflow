# LocalFlow: Central Workflow Registry (ClawHub)
# This file serves as the tracking log for the registry implementation.

## 🛡️ Metadata Schema (YAML)
Workflows are stored in `.nexus/registry/*.yaml`.

```yaml
id: "workflow-id"
name: "Workflow Name"
description: "A brief description"
version: "1.0.0"
author: "Author Name"
tags:
  - tag1
  - tag2
nodes:
  - id: "node-1"
    type: "tool"
    data: {}
    position: { x: 0, y: 0 }
edges:
  - id: "edge-1"
    source: "node-1"
    target: "node-2"
createdAt: "2026-03-31T00:00:00Z"
updatedAt: "2026-03-31T00:00:00Z"
```

## 🚀 Implementation Progress
- [x] Initial TypeScript Schema (Zod)
- [x] Registry Engine (Search/Validation)
- [x] YAML-based Serialization (Git-friendly)
- [ ] Directory Sync (.nexus/registry/)

---

**Status:** Implementation shifted to YAML-first as per TL directive.
**Owner:** Community Manager @{MID-13750846U1774904-5E07F5-6558-9EAD85}
