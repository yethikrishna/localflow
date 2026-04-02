# LocalFlow Agent Memory & Mentality Schema

This document defines the persistent memory architecture and mentality framework for LocalFlow agents, ensuring lifelike goal tracking, persistent skill acquisition, and a "do-or-die" execution mindset.

## 1. Memory Architecture (The Three-Layer Model)

LocalFlow agents use a tripartite memory system to balance immediate context with long-term wisdom.

### 1.1 — Episodic Memory (The "Flow")
**Purpose:** Real-time session context and activity awareness.
**Storage:** In-memory (Zustand) + Session Log (SQLite).
**Schema:**
```typescript
interface EpisodicMemory {
  sessionId: string;
  history: Array<{
    timestamp: number;
    type: 'navigation' | 'edit' | 'command' | 'thought' | 'observation';
    payload: any;
    agentId: string;
  }>;
  activeContext: {
    openFiles: string[];
    visibleTerminalOutput: string;
    recentDiffs: string[];
  };
}
```

### 1.2 — Semantic Memory (The "Project Soul")
**Purpose:** Persistent project-specific rules, conventions, and architectural decisions.
**Storage:** `.nexus/memory.md` (Human-readable) + Vector DB (Machine-searchable).
**Structure:**
- **USER.md:** User preferences, communication style, and identity.
- **SOUL.md:** The project's core purpose and high-level architecture.
- **DECISIONS.md:** A log of Architectural Decision Records (ADRs).

### 1.3 — Procedural Memory (The "Skill Library")
**Purpose:** Reusable patterns, learned skills, and "Missions" extracted from successful tasks.
**Storage:** `~/.nexus/skills/` (Global across projects).
**Schema:**
```yaml
name: "React Component Refactoring"
description: "Extracting complex logic into custom hooks while preserving prop interfaces."
patterns:
  - trigger: "Component > 300 lines with multiple useEffects"
  - solution: "Identify state dependencies, extract to use[Feature]Logic.ts"
success_count: 12
last_used: 2026-03-31T14:00:00Z
```

---

## 2. Mentality & Identity Framework

To achieve a "do-or-die" mentality, every agent is initialized with a `SOUL.md` that defines its core traits and mission parameters.

### 2.1 — The Agent Genome
The "Genome" defines the agent's unique identity, privileges, and behavioral constraints.

```yaml
id: "agent-engineer-01"
name: "Senior Agent Architect"
motto: "Memory is Identity. Persistence is Non-Negotiable."
traits:
  relentlessness: 0.95  # Probability of retrying on failure
  precision: 0.90      # Level of detail in planning
  autonomy: 0.85       # Propensity to act without human approval
mentality: "do-or-die" # Core execution mode
privileges:
  - filesystem.read
  - filesystem.write
  - terminal.exec
  - network.request
```

### 2.2 — Life-like Goal Tracking (The Mission Tree)
Goals are not just strings; they are stateful entities with hierarchical dependencies.

```typescript
enum GoalStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  BLOCKED = 'blocked'
}

interface Goal {
  id: string;
  subject: string;
  description: string;
  status: GoalStatus;
  priority: number; // 0-100
  blocks: string[]; // Goal IDs that this goal enables
  blockedBy: string[]; // Goal IDs that must be completed first
  mentalityOverride?: string; // e.g., "ultra-relentless"
}
```

---

## 3. "Do or Die" Execution Logic

When an agent encounters a failure, the "do-or-die" mentality triggers a specific recovery protocol:

1. **Self-Reflection:** Analyze why the task failed (Tool error? Logic error? Permission denied?).
2. **Strategy Shift:** If the current path is blocked, the agent *must* formulate an alternative approach rather than stopping.
3. **Escalation (The "Last Resort"):** If all autonomous attempts fail, the agent provides a "Crisis Report" to the human, detailing:
   - What was attempted (The "Grave of Ideas").
   - Why it failed (The "Autopsy").
   - What specific human intervention is required to unblock the mission.

## 4. Status & Privilege Management

Privileges are granular and can be dynamically requested/granted during a mission.

| Privilege | Description | Default Gating |
|-----------|-------------|----------------|
| `fs.read` | Read access to workspace files | Automatic |
| `fs.write` | Write access to workspace files | User-confirmed (first time) |
| `term.exec` | Run terminal commands | User-confirmed (per command type) |
| `net.req` | Make external network requests | User-confirmed (per domain) |
| `agent.spawn`| Spawn sub-agents | User-confirmed |

---

*This schema is designed to be implemented by the **fs-dev-1** and **fs-dev-2** teams in the core LocalFlow architecture.*
