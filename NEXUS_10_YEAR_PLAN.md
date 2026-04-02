# NEXUS — 10-Year Development Plan
## Parallel Agentic Development Platform (Desktop & Browser)
### LLM Provider-Agnostic · Pretext-Rendered · Multi-Agent Orchestration

**Codename:** NEXUS  
**Team Size:** 30 members  
**Timeline:** 2026–2036  
**Rendering:** Pretext (@chenglou/pretext) — Zero CSS, Canvas/DOM/SVG hybrid  
**Architecture:** Desktop (Tauri/Electron) + Browser (WebAssembly + Canvas)  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Research Findings & Competitive Intelligence](#2-research-findings)
3. [Product Vision & Architecture](#3-product-vision)
4. [Team Structure (30 Members)](#4-team-structure)
5. [Technology Stack](#5-technology-stack)
6. [10-Year Roadmap — Phase Breakdown](#6-ten-year-roadmap)
7. [Version History — Release Plan](#7-version-history)
8. [Feature Matrix — Inspired by Competitors](#8-feature-matrix)
9. [Risk Analysis & Mitigations](#9-risk-analysis)
10. [Success Metrics & KPIs](#10-success-metrics)

---

## 1. Executive Summary

NEXUS is a **parallel agentic development environment** that enables developers to plan and execute tasks with multiple AI agents simultaneously, across local and remote compute. Unlike existing tools that are either IDE extensions (Cursor, Cline) or CLI agents (Claude Code, Codex), NEXUS is a **purpose-built platform** with:

- **Zero-CSS rendering** via Pretext for 300-600x faster text layout
- **LLM provider-agnostic** abstraction supporting 100+ providers
- **MUX-inspired multiplexer** for parallel agent workspaces
- **Desktop + Browser** parity through Tauri (native) and WebAssembly (browser)
- **Custom UI engine** built on Pretext + Yoga (flexbox) + Canvas, eliminating DOM layout reflow entirely

### Why Now?

The 2025-2026 explosion of AI coding tools has proven the market, but every tool has critical gaps:

| Gap | Tools That Miss It | NEXUS Solution |
|---|---|---|
| True parallelism | Most tools run single agent | MUX-style workspace multiplexer |
| Vendor lock-in | Cursor (OpenAI), Copilot (OpenAI/Azure) | LiteLLM + OpenRouter abstraction |
| Performance | All use DOM/CSS rendering | Pretext + Canvas rendering engine |
| Desktop + Browser | CLI-only or IDE-only | Tauri desktop + WASM browser |
| Agent specialization | Most use one "God model" | Factory Droid-style specialized agent army |
| Offline capability | Cloud-dependent tools | Ollama/LM Studio local inference |

---

## 2. Research Findings & Competitive Intelligence

### 2.1 — Tools Analyzed (22 Total)

#### Tier 1: Major Players — Key Features to Absorb

| Tool | Killer Feature | Absorb Into NEXUS |
|---|---|---|
| **Claude Code** | TeammateTool orchestration, MCP protocol, terminal-native | Agent orchestration protocol, MCP as universal tool bridge |
| **Cursor** | Shadow Workspaces (background lint/test), 8 parallel agents | Shadow execution engine, parallel agent limit lifting |
| **OpenAI Codex** | Bidirectional app server, async subagent protocol | Async task protocol between agents |
| **GitHub Copilot** | GitHub Actions offloading, multi-model orchestration | Cloud compute offloading, CI/CD agent integration |
| **Windsurf** | "Flow" state tracking, navigation history as context | Activity-aware context building |
| **Gemini CLI** | 1M+ token context, native search grounding | Massive context windows, web-search as first-class tool |
| **MUX/Coder** | Git worktree isolation, agent multiplexing, conflict detection | Core multiplexer architecture |

#### Tier 2: Specialized Tools — Unique Innovations

| Tool | Innovation | Absorb Into NEXUS |
|---|---|---|
| **OpenCode** | 100% provider-agnostic (Go), Memory File system | Provider abstraction layer, `.nexus/memory.md` |
| **Cline/RooCode** | Custom Modes (Ask/Code/Architect), MCP ecosystem | Role-based agent modes, marketplace |
| **Kilo Code** | ClawBytes (custom AI workflows), 500+ model support | Workflow automation, broad model registry |
| **Amazon Q** | Java transformation agent, AWS integration | Enterprise migration agents |
| **Factory Droid** | "Missions" (skill learning), droid army, 40hr autonomy | Skill persistence, long-running autonomous tasks |
| **Crush** | TUI glamour (Charm stack), permission-gated tools | Beautiful terminal UI, granular permissions |
| **Antigravity** | Agent-first IDE, dedicated agent manager | Agent management panel as core UI |

#### Tier 3: Emerging / Niche — Ideas Worth Stealing

| Tool | Idea | Absorb Into NEXUS |
|---|---|---|
| **Qwen Code** | 480B MoE, multimodal reasoning | Support for MoE models, image-to-code |
| **CodeBuddy** | Figma-to-code via MCP, "Craft mode" | Design-to-code pipeline |
| **Costrict** | Architecture Decision Records (ADR) enforcement | Quality governance system |
| **iFlow** | Sub-agent marketplace, lifecycle automation | Plugin/agent marketplace |
| **Pi** | High EQ interaction, "rubber ducking" | Supportive pair-programming persona |
| **blink.so** | Chat-to-deployed-app, instant infrastructure | One-click deploy integration |
| **Auggie CLI** | Deep Code Intelligence for large codebases | Semantic codebase indexing |
| **Qoder** | Unified IDE+CLI platform | Seamless desktop/terminal switching |

### 2.2 — Architecture Patterns Emerging Across Industry

1. **Parallelism is Standard**: Cursor (8 agents), Codex (subagent threads), MUX (N agents in worktrees)
2. **MCP is the Universal Protocol**: Claude Code, Cline, RooCode, CodeBuddy, iFlow all use MCP
3. **Cloud Offloading**: GitHub Copilot runs agents in Actions, Codex uses cloud sandboxes
4. **Context > RAG**: With 1M+ token windows, tools prefer loading full codebases over vector search
5. **Skill Persistence**: Factory Droid's "Missions" learn and reuse patterns across tasks
6. **Role Specialization**: Moving from one "God model" to specialized sub-agents (Auditor, Implementer, Researcher)

### 2.3 — Pretext as UI Foundation

Pretext replaces CSS for text measurement and layout:

- **300-600x faster** than DOM measurements
- **Render targets**: DOM, Canvas, SVG, WebGL
- **APIs**: `prepare()` → `layout()` for fast height; `layoutWithLines()` for manual rendering
- **Gap**: Only handles text. Need Yoga (C++ flexbox) for box layout, custom event system for interaction

**Building Full App UI on Pretext requires:**
1. Yoga (Flexbox engine) for box layout → compiled to WASM
2. Pretext for all text measurement/rendering
3. Canvas 2D / WebGL for painting
4. Custom hit-testing (R-tree) for mouse/touch events
5. Hidden mirror DOM for accessibility
6. Custom styling system (JS object styles, no CSS)

---

## 3. Product Vision & Architecture

### 3.1 — Core Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        NEXUS PLATFORM                            │
├──────────────────────┬──────────────────────────────────────────┤
│   DESKTOP (Tauri)    │          BROWSER (WASM + Canvas)         │
│   - Native file I/O  │          - Web Workers for agents        │
│   - Local git        │          - IndexedDB for state           │
│   - Process spawning │          - WebSocket to compute server   │
├──────────────────────┴──────────────────────────────────────────┤
│                     RENDERING ENGINE                             │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐  ┌───────────────┐  │
│  │ Pretext  │  │ Yoga     │  │ Canvas 2D  │  │ Accessibility │  │
│  │ (text)   │  │ (flexbox)│  │ (painting) │  │ (mirror DOM)  │  │
│  └─────────┘  └──────────┘  └────────────┘  └───────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                     AGENT ORCHESTRATOR                           │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │ Multiplexer  │  │ Task Router  │  │ Agent Registry     │    │
│  │ (MUX-style)  │  │ (delegation) │  │ (roles/skills)     │    │
│  └──────────────┘  └──────────────┘  └────────────────────┘    │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │ Workspace    │  │ Git Worktree │  │ Conflict Detector  │    │
│  │ Isolation    │  │ Manager      │  │ (merge preview)    │    │
│  └──────────────┘  └──────────────┘  └────────────────────┘    │
├─────────────────────────────────────────────────────────────────┤
│                     LLM ABSTRACTION LAYER                        │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ LiteLLM  │  │ AI SDK    │  │ Ollama   │  │ OpenRouter   │   │
│  │ (proxy)  │  │ (stream)  │  │ (local)  │  │ (aggregator) │   │
│  └──────────┘  └───────────┘  └──────────┘  └──────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                     TOOL SYSTEM                                  │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ MCP      │  │ File I/O  │  │ Terminal │  │ Extensions   │   │
│  │ Protocol │  │ (sandbox) │  │ (PTY)    │  │ (marketplace)│   │
│  └──────────┘  └───────────┘  └──────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 — Key Design Principles

1. **Agents First, Editor Second**: The IDE is a viewport into agent activity, not a text editor with AI bolted on
2. **Zero CSS**: All layout through Pretext (text) + Yoga (boxes), painted to Canvas
3. **Provider Agnostic**: Any LLM, any provider, local or cloud
4. **Parallel by Default**: Every task can spawn N agents in isolated workspaces
5. **Offline Capable**: Full functionality with local models (Ollama/LM Studio)
6. **Progressive Disclosure**: Simple for beginners, powerful for experts
7. **Extensible**: MCP protocol + plugin marketplace from day one

### 3.3 — Core Subsystems

| Subsystem | Description | Inspired By |
|---|---|---|
| **NexusCanvas** | Custom rendering engine (Pretext + Yoga + Canvas) | Flutter engine, Dear ImGui |
| **NexusMux** | Agent multiplexer with workspace isolation | MUX by Coder |
| **NexusLLM** | Provider-agnostic LLM abstraction | LiteLLM, OpenCode |
| **NexusTools** | MCP-based tool system with sandboxing | Claude Code MCP |
| **NexusFlow** | Visual workflow builder for multi-agent pipelines | iFlow, LangGraph |
| **NexusSkills** | Skill persistence and learning system | Factory Droid Missions |
| **NexusMarket** | Extension/agent/skill marketplace | Cline MCP marketplace |
| **NexusSync** | Real-time collaboration and state sync | Coder workspaces |

---

## 4. Team Structure (30 Members)

### Phase 1 Hiring (Year 1-2): 18 Members

| Squad | Members | Focus |
|---|---|---|
| **Rendering Engine** | 4 | Pretext integration, Yoga WASM, Canvas painter, accessibility mirror |
| **Agent Core** | 4 | Multiplexer, orchestrator, workspace isolation, git worktree management |
| **LLM Abstraction** | 2 | Provider adapters, streaming, tool calling, context management |
| **Desktop Shell** | 3 | Tauri app, native integrations, file system, terminal emulator |
| **Platform / Infra** | 2 | CI/CD, testing infrastructure, release engineering, telemetry |
| **Product / Design** | 2 | UX research, design system (Pretext-native), user testing |
| **Leadership** | 1 | CTO / Tech Lead — architecture decisions, code review |

### Phase 2 Hiring (Year 3-4): +6 Members → 24

| Squad | Members | Focus |
|---|---|---|
| **Browser Platform** | 3 | WASM build, Web Workers, IndexedDB, WebSocket transport |
| **Marketplace / Extensions** | 2 | Plugin SDK, marketplace backend, agent registry |
| **QA / Reliability** | 1 | E2E testing, performance benchmarks, chaos engineering |

### Phase 3 Hiring (Year 5-6): +6 Members → 30

| Squad | Members | Focus |
|---|---|---|
| **Enterprise** | 2 | SSO, RBAC, audit logs, compliance, on-prem deployment |
| **Cloud Infrastructure** | 2 | Remote compute orchestration, serverless agent runners |
| **Developer Relations** | 1 | Docs, tutorials, community, conference talks |
| **AI/ML Research** | 1 | Fine-tuning, agent evaluation, benchmark design |

### Organizational Chart

```
CTO (1)
├── VP Engineering (1) — hired Year 3
│   ├── Rendering Engine Lead + 3 engineers
│   ├── Agent Core Lead + 3 engineers
│   ├── Desktop Shell Lead + 2 engineers
│   ├── Browser Platform Lead + 2 engineers (Year 3+)
│   └── Platform/Infra Lead + 1 engineer
├── VP Product (1) — hired Year 3
│   ├── Product Manager
│   ├── UX Designer
│   └── Developer Relations (Year 5+)
├── LLM Abstraction Lead + 1 engineer
├── Marketplace Lead + 1 engineer (Year 3+)
├── Enterprise Lead + 1 engineer (Year 5+)
├── Cloud Infra Lead + 1 engineer (Year 5+)
├── QA Lead (Year 3+)
└── AI/ML Researcher (Year 5+)
```

---

## 5. Technology Stack

### 5.1 — Core Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Language** | TypeScript (primary), Rust (performance-critical), C++ (Yoga) | TS for productivity, Rust for WASM/native, C++ for Yoga bindings |
| **Desktop** | Tauri 2.0 | Smaller than Electron, Rust backend, native webview |
| **Browser** | Canvas 2D + WebAssembly + Web Workers | No DOM rendering = no reflow |
| **Text Layout** | @chenglou/pretext | 300-600x faster than DOM measurement |
| **Box Layout** | Yoga (compiled to WASM) | Battle-tested flexbox (React Native) |
| **Painting** | Canvas 2D (Year 1-4), WebGPU (Year 5+) | Canvas for compatibility, WebGPU for performance |
| **State** | Zustand (client) + SQLite (persistence) | Simple, fast, serializable |
| **Networking** | WebSocket + WebRTC (P2P) | Real-time agent communication |
| **LLM Gateway** | LiteLLM (self-hosted) + direct provider SDKs | 100+ provider support |
| **Tool Protocol** | MCP (Model Context Protocol) | Industry standard emerging |
| **Terminal** | xterm.js (browser) + PTY (native) | Full terminal emulation |
| **Git** | isomorphic-git (browser) + native git (desktop) | Cross-platform git |
| **Build** | Turbo + esbuild + wasm-pack | Monorepo with fast builds |
| **Testing** | Vitest + Playwright + custom agent eval harness | Unit, E2E, agent evaluation |

### 5.2 — Rendering Pipeline (No CSS)

```
User Input → State Update → Layout Pass → Paint Pass → Composite
                              │                │
                        ┌─────┴─────┐    ┌─────┴─────┐
                        │   Yoga    │    │ Canvas 2D │
                        │ (flexbox) │    │  / WebGPU │
                        └─────┬─────┘    └───────────┘
                              │
                        ┌─────┴─────┐
                        │  Pretext  │
                        │  (text)   │
                        └───────────┘
```

**Layout pass** (~0.1ms for 500 text blocks):
1. Yoga calculates box positions/sizes from flex constraints
2. Pretext measures text heights for each box's content
3. Yoga re-adjusts based on Pretext measurements
4. Final positions are computed

**Paint pass** (~1-3ms):
1. Clear dirty regions
2. Paint backgrounds/borders using Canvas rect/roundRect
3. Paint text using Canvas fillText with Pretext coordinates
4. Paint decorations (cursors, selections, highlights)

**Accessibility**:
- Hidden `<div>` tree mirrors the visual tree with ARIA attributes
- Updated after each layout pass
- Enables screen readers, browser find, keyboard navigation

---

## 6. Ten-Year Roadmap — Phase Breakdown

### PHASE 1: Foundation (Year 1, 2026)
**Theme: "Build the engine, prove the concept"**
**Status: ACCELERATED (Alpha v0.5.0 targeted for Q3 2026)**

#### Year 1 (2026): The Rendering Engine + Multi-Agent Core

**Q1-Q2 2026: Core Engine & NexusMux**
- [x] Set up monorepo (Turbo + TypeScript + Rust)
- [x] Integrate Pretext for text measurement
- [x] Compile Yoga to WASM, create TypeScript bindings
- [x] NexusMux v1: parallel agent orchestration (Isolation + Delegation + Simulation)
- [x] Atomic Worktree Transactions (AWT) - <150ms latency
- [ ] Build Canvas 2D painter (backgrounds, borders, text, cursors)
- [ ] Implement custom event system (hit testing via R-tree)
- [ ] Create Pretext-native widget primitives:
  - Text, TextInput, Button, ScrollView, Panel, Divider

**Q3-Q4 2026: Multi-Agent Alpha (v0.5.0)**
- [ ] MCP protocol integration (Tier 1: FS, Terminal, Git, Search)
- [ ] Shadow execution: background lint/test runs
- [ ] Agent Panel UI (Pretext-native)
- [ ] Parallel execution of 4+ agents
- [ ] Conflict HUD & Activity Heatmap

**Milestone v0.1.0 — "Hello Nexus"** (Dec 2026):
- Desktop app that can open a project, edit code, chat with one AI agent
- Zero CSS rendering — everything Pretext + Yoga + Canvas
- 3 LLM providers supported

#### Year 2 (2027-2028): Multi-Agent + MCP

**Q1-Q2 2027: Agent Multiplexer**
- [ ] NexusMux v1: parallel agent orchestration
  - Workspace isolation (git worktree per agent)
  - Task delegation protocol (parent → child agents)
  - Agent-to-agent communication (report/await pattern)
- [ ] Agent Registry with role definitions (YAML/Markdown config)
- [ ] Conflict detection: diff viewer for parallel agent changes
- [ ] MCP protocol integration (client + server)
- [ ] Agent panel UI: live view of all running agents, their status, token usage, outputs

**Q3-Q4 2027: Polish + Alpha Release**
- [ ] Memory system: `.nexus/memory.md` + per-project context (à la OpenCode)
- [ ] Shadow execution: background lint/test runs (à la Cursor)
- [ ] Keybindings system (Vim, Emacs, VS Code modes)
- [ ] File tree, search panel, diff viewer — all Pretext-rendered
- [ ] Settings UI (Pretext-native forms)
- [ ] Performance optimization: 60fps scrolling, <50ms input latency
- [ ] 10 LLM providers supported via LiteLLM
- [ ] Alpha testing with 50-100 developers

**Milestone v0.5.0 — "Multi-Agent Alpha"** (Dec 2027):
- Up to 4 parallel agents per session
- MCP tool protocol working
- Shadow linting/testing
- Memory system
- Usable as daily driver for small-medium projects

---

### PHASE 2: Product-Market Fit (Year 3–4, 2028–2030)
**Theme: "Ship the browser, build the ecosystem"**

#### Year 3 (2028-2029): Browser + Marketplace

**Q1-Q2 2028: Browser Platform**
- [ ] WASM build of entire rendering engine
- [ ] Web Workers for agent execution
- [ ] IndexedDB for project state persistence
- [ ] WebSocket transport to remote compute server
- [ ] isomorphic-git for browser-side git
- [ ] Progressive Web App (PWA) support
- [ ] Feature parity: Desktop ↔ Browser

**Q3-Q4 2028: Extension Ecosystem**
- [ ] Plugin SDK v1 (TypeScript):
  - Custom agents (system prompt + tool access)
  - Custom tools (MCP servers)
  - Custom UI panels (Pretext widget API)
  - Custom themes (JS style objects, not CSS)
- [ ] NexusMarket v1: marketplace for extensions/agents/skills
- [ ] Community agent library (pre-built specialists):
  - Code Reviewer, Test Writer, Documentation Generator
  - Security Auditor, Performance Optimizer, Accessibility Checker
  - Refactoring Specialist, Migration Agent, DevOps Agent
- [ ] Workflow builder v1 (visual DAG editor for agent pipelines)

**Milestone v1.0.0 — "NEXUS 1.0"** (Dec 2028):
- First stable release
- Desktop + Browser with full parity
- Up to 8 parallel agents
- Plugin marketplace with 50+ extensions
- 30+ LLM providers supported
- Workflow builder for multi-agent pipelines
- **Pricing**: Free tier (2 agents, local models) + Pro tier (unlimited agents, cloud compute)

#### Year 4 (2029-2030): Scale + Enterprise

**Q1-Q2 2029: Enterprise Features**
- [ ] SSO / SAML / OIDC authentication
- [ ] Role-Based Access Control (RBAC)
- [ ] Audit logging (every agent action tracked)
- [ ] Compliance: SOC 2 Type II preparation
- [ ] On-premises deployment option (Docker + Kubernetes)
- [ ] Team workspaces: shared agent configurations, skill libraries

**Q3-Q4 2029: Cloud Compute**
- [ ] Remote agent execution on managed infrastructure
  - Serverless agent runners (AWS Lambda / Fly.io)
  - GPU-accelerated for local model inference
- [ ] Background agents (run while you sleep, à la Factory Droid)
  - 40+ hour autonomous missions
  - Progress reports via email/Slack/webhook
- [ ] Cost optimization dashboard (token usage, compute costs per agent)

**Milestone v2.0.0 — "NEXUS Enterprise"** (Dec 2029):
- Enterprise-ready with SSO, RBAC, audit logs
- Cloud compute for remote agent execution
- Background autonomous agents
- 100+ marketplace extensions
- 50+ LLM providers
- SOC 2 compliance in progress

---

### PHASE 3: Platform (Year 5–6, 2030–2032)
**Theme: "From tool to platform"**

#### Year 5 (2030-2031): Intelligence Layer

**Q1-Q2 2030: Skill Persistence & Learning**
- [ ] NexusSkills v2: agents learn from completed tasks
  - Pattern extraction from successful missions
  - Skill library shared across team
  - Automatic skill suggestion based on task type
- [ ] Agent evaluation framework:
  - Benchmark suite for measuring agent quality
  - A/B testing different models per task type
  - Automatic model routing (best model for each task)
- [ ] Semantic codebase indexing (à la Auggie CLI Deep Code Intelligence)
  - Full-codebase graph: functions, types, dependencies
  - Impact analysis: "what breaks if I change X?"
  - Dead code detection

**Q3-Q4 2030: Advanced Rendering**
- [ ] WebGPU rendering backend (alongside Canvas 2D)
  - GPU-accelerated text rendering
  - Smooth 120fps on high-refresh displays
  - Custom shader effects for agent activity visualization
- [ ] Design-to-code pipeline (à la CodeBuddy Figma integration)
  - Import Figma/Sketch designs
  - AI generates Pretext widget code from design
- [ ] Collaborative editing: CRDT-based concurrent editing with agent awareness

**Milestone v3.0.0 — "NEXUS Intelligence"** (Dec 2030):
- Skill learning and persistence
- Agent evaluation and auto-routing
- WebGPU rendering option
- Design-to-code pipeline
- CRDT collaborative editing

#### Year 6 (2031-2032): Ecosystem Maturity

**Q1-Q2 2031: Multi-Language IDE**
- [ ] Full language server support (LSP via WASM):
  - TypeScript, Python, Rust, Go, Java, C++, Ruby, Swift, Kotlin
- [ ] Debugger integration (DAP protocol)
- [ ] Database viewer/query tool
- [ ] Docker/container management panel
- [ ] CI/CD pipeline visualization and management

**Q3-Q4 2031: Platform APIs**
- [ ] NEXUS API: programmatic access to agent orchestration
- [ ] Headless mode: run NEXUS as a service (CI/CD integration)
- [ ] Webhook system: trigger agents from external events
- [ ] White-label SDK: embed NEXUS agent panel in other apps
- [ ] Agent-to-agent federation: agents across different NEXUS instances collaborate

**Milestone v4.0.0 — "NEXUS Platform"** (Dec 2031):
- Full IDE feature parity with VS Code
- Headless/API mode for CI/CD
- White-label SDK
- 500+ marketplace extensions
- 1M+ users target

---

### PHASE 4: Innovation (Year 7–8, 2032–2034)
**Theme: "Beyond coding"**

#### Year 7 (2032-2033): Autonomous Engineering

- [ ] Project Manager Agent: breaks PRDs into tasks, assigns to specialist agents
- [ ] Full-stack agents: frontend + backend + database + deployment in one mission
- [ ] Auto-scaling agent pools: dynamically spin up/down agents based on workload
- [ ] Cross-repository agents: work across multiple repos simultaneously
- [ ] Autonomous PR review + merge pipeline
- [ ] Natural language infrastructure: "deploy this to production" → agent handles entire pipeline

**Milestone v5.0.0 — "NEXUS Autonomous"** (Dec 2032)

#### Year 8 (2033-2034): Multi-Modal & Beyond

- [ ] Voice-driven development: speak requirements, agents execute
- [ ] Visual debugging: agents explain code execution with animated diagrams
- [ ] AR/VR workspace prototype: spatial UI for agent orchestration
- [ ] Code generation from whiteboard sketches (camera → code)
- [ ] Multi-modal agents: understand screenshots, diagrams, design mockups

**Milestone v6.0.0 — "NEXUS Multimodal"** (Dec 2033)

---

### PHASE 5: Dominance (Year 9–10, 2034–2036)
**Theme: "The operating system for software development"**

#### Year 9 (2034-2035): Software Factory

- [ ] End-to-end product development: idea → requirements → code → test → deploy → monitor
- [ ] Self-improving agents: agents that improve their own prompts and tools
- [ ] Zero-human-intervention releases for well-defined features
- [ ] Compliance-as-code: agents that ensure GDPR, HIPAA, SOC2 compliance automatically
- [ ] Predictive engineering: agents that anticipate bugs/outages before they happen

**Milestone v7.0.0 — "NEXUS Factory"** (Dec 2034)

#### Year 10 (2035-2036): Open Platform

- [ ] Open-source core rendering engine (NexusCanvas)
- [ ] Open-source agent orchestration protocol
- [ ] NEXUS Foundation: community governance for standards
- [ ] Academic partnerships: agent behavior research, HCI studies
- [ ] Certification program for NEXUS developers
- [ ] Global developer conference: NexusCon

**Milestone v8.0.0 — "NEXUS Open"** (Dec 2035)

---

## 7. Version History — Release Plan

| Version | Date | Codename | Key Features | Stability |
|---|---|---|---|---|
| v0.1.0-dev | Dec 2026 | "Hello Nexus" | Pretext rendering, single agent, 3 LLM providers | Dev Preview |
| v0.2.0-dev | Mar 2027 | "Canvas" | Code editor, syntax highlighting, file tree | Dev Preview |
| v0.3.0-dev | Jun 2027 | "Multiply" | Multi-agent orchestration, git worktree isolation | Dev Preview |
| v0.4.0-dev | Sep 2027 | "Shadow" | Shadow execution, memory system, MCP | Dev Preview |
| v0.5.0-alpha | Dec 2027 | "Alpha" | 4 parallel agents, MCP, shadow lint/test | Alpha |
| v0.6.0-alpha | Mar 2028 | "Web" | Browser platform (WASM), PWA | Alpha |
| v0.7.0-beta | Jun 2028 | "Extend" | Plugin SDK, marketplace, custom agents | Beta |
| v0.8.0-beta | Sep 2028 | "Flow" | Workflow builder, agent pipelines | Beta |
| v0.9.0-rc | Nov 2028 | "Release Candidate" | Performance, stability, docs | RC |
| **v1.0.0** | **Dec 2028** | **"NEXUS"** | **First stable release** | **Stable** |
| v1.1.0 | Mar 2029 | "Team" | Team workspaces, shared configs | Stable |
| v1.2.0 | Jun 2029 | "Secure" | SSO, RBAC, audit logs | Stable |
| v1.5.0 | Sep 2029 | "Cloud" | Remote agent execution, serverless runners | Stable |
| **v2.0.0** | **Dec 2029** | **"Enterprise"** | **SOC 2, on-prem, background agents** | **Stable** |
| v2.5.0 | Jun 2030 | "Skills" | Skill persistence, agent evaluation | Stable |
| **v3.0.0** | **Dec 2030** | **"Intelligence"** | **WebGPU, design-to-code, CRDT collab** | **Stable** |
| v3.5.0 | Jun 2031 | "Polyglot" | Full LSP support, debugger, database viewer | Stable |
| **v4.0.0** | **Dec 2031** | **"Platform"** | **API, headless, white-label SDK** | **Stable** |
| v4.5.0 | Jun 2032 | "Manager" | Project manager agent, cross-repo | Stable |
| **v5.0.0** | **Dec 2032** | **"Autonomous"** | **Full-stack agents, auto-scaling** | **Stable** |
| **v6.0.0** | **Dec 2033** | **"Multimodal"** | **Voice, visual debug, AR/VR prototype** | **Stable** |
| **v7.0.0** | **Dec 2034** | **"Factory"** | **End-to-end product dev, self-improving** | **Stable** |
| **v8.0.0** | **Dec 2035** | **"Open"** | **Open-source core, foundation, NexusCon** | **Stable** |

### Versioning Policy
- **Semver** (Major.Minor.Patch)
- **Major**: Breaking API changes or fundamental architecture shifts
- **Minor**: New features, backward-compatible
- **Patch**: Bug fixes, security patches
- **Release cadence**: Major yearly, Minor quarterly, Patch bi-weekly
- **LTS**: Every major version gets 2 years of security patches

---

## 8. Feature Matrix — Inspired by Competitors

### 8.1 — Features Absorbed from Each Tool

| Feature | Source Inspiration | NEXUS Version | Priority |
|---|---|---|---|
| **Parallel agent execution (8+)** | Cursor | v0.3.0 | P0 |
| **Shadow workspace (lint/test in background)** | Cursor | v0.4.0 | P0 |
| **MCP tool protocol** | Claude Code, Cline | v0.4.0 | P0 |
| **LLM provider abstraction (100+)** | OpenCode, LiteLLM | v0.1.0 | P0 |
| **Memory file system** | OpenCode | v0.4.0 | P0 |
| **Agent multiplexer with worktree isolation** | MUX/Coder | v0.3.0 | P0 |
| **Git conflict detection across agents** | MUX/Coder | v0.3.0 | P0 |
| **TeammateTool orchestration** | Claude Code | v0.3.0 | P0 |
| **Async subagent protocol** | OpenAI Codex | v0.3.0 | P1 |
| **Custom agent modes (Ask/Code/Architect)** | RooCode | v0.5.0 | P1 |
| **ClawBytes (custom workflows)** | Kilo Code | v0.8.0 | P1 |
| **Flow state tracking** | Windsurf | v1.0.0 | P1 |
| **1M+ token context support** | Gemini CLI | v0.1.0 | P0 |
| **Skill persistence (Missions)** | Factory Droid | v2.5.0 | P1 |
| **40hr autonomous agents** | Factory Droid | v1.5.0 | P1 |
| **GitHub Actions offloading** | GitHub Copilot | v1.5.0 | P2 |
| **Native search grounding** | Gemini CLI | v0.5.0 | P1 |
| **Agent-first UI (agent manager panel)** | Antigravity | v0.3.0 | P0 |
| **Glamorous TUI rendering** | Crush (Charm) | v0.1.0 | P1 |
| **Figma-to-code via MCP** | CodeBuddy | v3.0.0 | P2 |
| **ADR enforcement (governance)** | Costrict | v2.0.0 | P2 |
| **Sub-agent marketplace** | iFlow | v0.7.0 | P1 |
| **Deep Code Intelligence** | Auggie CLI | v2.5.0 | P1 |
| **Chat-to-deployed-app** | blink.so | v4.0.0 | P3 |
| **MoE model support** | Qwen Code | v1.0.0 | P2 |
| **Java migration agent** | Amazon Q | v2.0.0 | P3 |
| **Rubber duck persona** | Pi | v1.0.0 | P3 |

### 8.2 — Unique NEXUS Features (Not in Any Competitor)

| Feature | Description | Version |
|---|---|---|
| **Zero-CSS Canvas Rendering** | Entire IDE rendered via Pretext + Yoga + Canvas, no DOM layout | v0.1.0 |
| **Cross-platform rendering parity** | Same pixel-perfect UI on desktop and browser | v1.0.0 |
| **Agent activity heatmap** | Visual overlay showing which files each agent is touching | v0.5.0 |
| **Merge simulation** | Preview what happens when parallel agent branches merge | v0.5.0 |
| **Agent replay** | Replay an agent's entire decision/action history step-by-step | v1.0.0 |
| **Cost predictor** | Estimate token/compute cost before launching a multi-agent task | v1.0.0 |
| **Agent genome** | Shareable agent configuration (prompt + tools + model + skills) | v1.0.0 |
| **Federated agents** | Agents across different NEXUS instances collaborate | v4.0.0 |

---

## 9. Risk Analysis & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Pretext library abandoned** | Medium | High | Fork and maintain internally; Pretext is small (~15KB). Contribute upstream. |
| **Zero-CSS approach too complex** | Medium | High | Fallback plan: DOM rendering mode with CSS for v1, canvas mode as progressive enhancement |
| **LLM API changes break adapters** | High | Medium | Abstraction layer with adapter pattern; automated compatibility testing |
| **Team scaling difficulties** | Medium | Medium | Strong documentation, pair programming, internal tech talks |
| **Market competition (Cursor/Copilot)** | High | Medium | Differentiate on parallelism, provider-agnosticism, and zero-CSS performance |
| **WebGPU adoption delays** | Low | Low | Canvas 2D is fallback; WebGPU is enhancement only |
| **Security vulnerabilities in agent execution** | Medium | High | Sandboxed execution, permission system, audit logging from v0.1 |
| **Open-source competitors** | High | Medium | Open core model: free basic + paid pro/enterprise |
| **Browser WASM performance** | Medium | Medium | Web Workers for computation, lazy loading, virtual scrolling |
| **Accessibility compliance** | Medium | High | Mirror DOM from v0.1, regular WCAG audits, accessibility expert hire |

---

## 10. Success Metrics & KPIs

### Year 1-2 (Foundation)
- [ ] Rendering engine: 60fps scrolling, <16ms frame budget
- [ ] Input latency: <50ms keystroke-to-pixel
- [ ] Text layout speed: <0.1ms per 500 text blocks (via Pretext)
- [ ] Alpha users: 100 developers
- [ ] Agent task success rate: >80%

### Year 3-4 (Product-Market Fit)
- [ ] v1.0 stable release
- [ ] 10,000 monthly active users
- [ ] 50+ marketplace extensions
- [ ] Browser load time: <3 seconds
- [ ] Desktop memory usage: <500MB idle
- [ ] Enterprise contracts: 5+ companies

### Year 5-6 (Platform)
- [ ] 100,000 monthly active users
- [ ] 500+ marketplace extensions
- [ ] 99.9% uptime for cloud services
- [ ] Agent evaluation benchmark published
- [ ] Academic citations: 10+ papers

### Year 7-10 (Dominance)
- [ ] 1M+ monthly active users
- [ ] Revenue: $100M ARR
- [ ] NexusCon: 5,000+ attendees
- [ ] Open-source community: 10,000+ contributors
- [ ] Industry standard for agentic development

---

## Appendix A: Pretext Integration Details

### A.1 — Widget Primitives (Year 1)

Every UI component is a `NexusWidget` that participates in the Yoga layout tree and uses Pretext for text:

```typescript
interface NexusWidget {
  // Yoga layout node
  yogaNode: YogaNode;
  
  // Pretext handle for text content (if any)
  textHandle?: PretextHandle;
  
  // Paint to canvas
  paint(ctx: CanvasRenderingContext2D, bounds: Rect): void;
  
  // Hit testing
  hitTest(x: number, y: number): NexusWidget | null;
  
  // Accessibility
  getAccessibilityNode(): AccessibilityNode;
  
  // Children
  children: NexusWidget[];
}
```

### A.2 — Built-in Widgets (Progressive Build Order)

| Widget | Quarter | Description |
|---|---|---|
| `NxText` | Q1 Y1 | Text rendering with Pretext, supports all languages, RTL |
| `NxBox` | Q1 Y1 | Container with background, border, padding |
| `NxButton` | Q1 Y1 | Clickable button with text label |
| `NxTextInput` | Q1 Y1 | Single-line text input with cursor |
| `NxTextArea` | Q2 Y1 | Multi-line text input (code editing base) |
| `NxScrollView` | Q2 Y1 | Scrollable container with virtual scrolling |
| `NxPanel` | Q2 Y1 | Resizable panel with drag handles |
| `NxSplitView` | Q2 Y1 | Split pane (horizontal/vertical) |
| `NxList` | Q2 Y1 | Virtualized list with Pretext-measured item heights |
| `NxTree` | Q3 Y1 | Tree view (file explorer) |
| `NxTabs` | Q3 Y1 | Tab bar with close buttons |
| `NxModal` | Q3 Y1 | Dialog overlay |
| `NxDropdown` | Q3 Y1 | Select/dropdown menu |
| `NxTooltip` | Q3 Y1 | Hover tooltip |
| `NxCodeEditor` | Q4 Y1 | Full code editor (tree-sitter + Pretext) |
| `NxTerminal` | Q4 Y1 | Terminal emulator |
| `NxDiffView` | Q4 Y1 | Side-by-side diff viewer |
| `NxMarkdown` | Q4 Y1 | Markdown renderer (agent responses) |
| `NxChat` | Q4 Y1 | Chat interface for agent interaction |

### A.3 — Styling System (No CSS)

```typescript
// Styles are plain JavaScript objects
const buttonStyle: NxStyle = {
  // Yoga layout
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 8,
  
  // Paint
  backgroundColor: '#1E1E2E',
  borderColor: '#45475A',
  borderWidth: 1,
  borderRadius: 8,
  
  // Text (Pretext)
  fontSize: 14,
  fontFamily: 'Inter',
  fontWeight: 500,
  color: '#CDD6F4',
};

// Themes are style overrides
const catppuccinTheme: NxTheme = {
  surface: '#1E1E2E',
  surfaceHover: '#313244',
  text: '#CDD6F4',
  textMuted: '#A6ADC8',
  accent: '#89B4FA',
  error: '#F38BA8',
  // ...
};
```

---

## Appendix B: Agent Orchestration Protocol

### B.1 — Agent Definition (`.nexus/agents/reviewer.md`)

```yaml
---
name: Code Reviewer
role: review
base: exec
model: auto  # best available model for task
tools:
  - file_read
  - file_search
  - git_diff
  - terminal
  - web_search
max_tokens: 200000
temperature: 0.3
---

You are a senior code reviewer. Your job is to:
1. Read the diff carefully
2. Check for bugs, security issues, and performance problems
3. Suggest improvements with specific code examples
4. Be constructive and encouraging

Focus on:
- Logic errors and edge cases
- Security vulnerabilities (injection, XSS, etc.)
- Performance anti-patterns
- Code readability and maintainability
```

### B.2 — Task Delegation Protocol

```typescript
// Parent agent spawns a child agent
const task = await nexus.mux.createTask({
  agent: 'reviewer',
  workspace: 'worktree',  // isolated git worktree
  prompt: 'Review the changes in PR #42',
  files: ['src/auth.ts', 'src/middleware.ts'],
  timeout: '30m',
  onProgress: (report) => {
    // Real-time updates from child agent
    ui.updateAgentPanel(task.id, report);
  },
});

// Wait for completion
const result = await task.wait();

// Or run multiple in parallel
const [review, tests, docs] = await Promise.all([
  nexus.mux.createTask({ agent: 'reviewer', ... }),
  nexus.mux.createTask({ agent: 'test-writer', ... }),
  nexus.mux.createTask({ agent: 'doc-generator', ... }),
]);
```

### B.3 — LLM Provider Configuration

```typescript
// .nexus/config.ts
export default {
  providers: {
    // Cloud providers
    anthropic: { apiKey: env.ANTHROPIC_KEY },
    openai: { apiKey: env.OPENAI_KEY },
    google: { apiKey: env.GOOGLE_KEY },
    
    // Local providers
    ollama: { baseUrl: 'http://localhost:11434' },
    lmstudio: { baseUrl: 'http://localhost:1234/v1' },
    
    // Aggregators
    openrouter: { apiKey: env.OPENROUTER_KEY },
    litellm: { baseUrl: 'http://localhost:4000' },
  },
  
  // Model routing: best model per task type
  routing: {
    'code-generation': 'anthropic:claude-opus-4-6',
    'code-review': 'anthropic:claude-sonnet-4-20250514',
    'quick-edit': 'ollama:qwen3:32b',
    'documentation': 'google:gemini-2.5-pro',
    'test-writing': 'openai:o3',
  },
};
```

---

## Appendix C: Research Files

All detailed research reports are available in the `/research` directory:

| File | Contents |
|---|---|
| `Claude_Code_Report.md` | Claude Code architecture and features |
| `Cursor_Report.md` | Cursor IDE shadow workspaces and parallel agents |
| `OpenAI_Codex_Report.md` | Codex async subagent protocol |
| `GitHub_Copilot_Report.md` | Copilot cloud offloading |
| `OpenCode_Report.md` | OpenCode provider-agnostic architecture |
| `Windsurf_Report.md` | Windsurf Flow state tracking |
| `Gemini_CLI_Report.md` | Gemini CLI 1M context and search grounding |
| `Antigravity_Research.md` | Antigravity agent-first IDE |
| `Cline_Research.md` | Cline MCP ecosystem |
| `RooCode_Research.md` | RooCode custom modes |
| `KiloCode_Research.md` | KiloCode ClawBytes workflows |
| `AmazonQ_Research.md` | Amazon Q enterprise features |
| `Qoder_Research.md` | Qoder unified platform |
| `Auggie_Research.md` | Auggie Deep Code Intelligence |
| `qwen_code_summary.md` | Qwen Code MoE architecture |
| `codebuddy_summary.md` | CodeBuddy Figma integration |
| `costrict_summary.md` | Costrict governance system |
| `crush_summary.md` | Crush TUI glamour |
| `factory_droid_summary.md` | Factory Droid missions and skills |
| `iflow_summary.md` | iFlow agent marketplace |
| `pi_summary.md` | Pi EQ-first design |
| `blink_summary.md` | blink.so instant deployment |
| `pretext_analysis.md` | Pretext library deep analysis |
| `MUX_Analysis.md` | MUX multiplexer and infrastructure |

---

*Document generated: March 31, 2026*  
*Research scope: 22 AI coding tools, 6 orchestration frameworks, 4 LLM abstraction layers, 1 rendering library*  
*Total research files: 25*
