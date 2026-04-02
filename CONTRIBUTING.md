# Contributing to LocalFlow

First off, thank you for considering contributing to LocalFlow. It's people like you that make LocalFlow such a great tool.

## 🌈 Our Engineering Culture
LocalFlow is built on the **NEXUS Philosophy**:
1. **Performance is a Feature**: We avoid DOM-heavy layouts. We value 60fps and sub-50ms input latency.
2. **Local-First, Always**: Features should work offline unless explicitly cloud-dependent.
3. **Agency through Sovereignty**: We build tools that empower the developer, not lock them in.

## 🏗️ Technical Setup

### Prerequisites
- **Node.js**: v20+
- **pnpm**: v9+
- **Docker**: For tool discovery and orchestration tests.
- **Rust**: For performant rendering components.

### Installation
```bash
pnpm install
pnpm build
```

### Monorepo Structure
- `packages/core`: The NexusCanvas rendering engine and registry.
- `packages/mux`: Agent orchestration and memory management.
- `packages/tools`: MCP tool handlers and bridging layer.
- `packages/ui`: High-density visual components.

## 🧪 Testing
We use `vitest` for unit testing and a custom `agent-eval-harness` for validating agent behavior.

```bash
pnpm test
```

## 📮 Pull Request Process
1. Fork the repo and create your branch from `main`.
2. Ensure your code follows the existing style (we use Biome for linting/formatting).
3. Update the documentation if you are adding new features.
4. Ensure the test suite passes.
5. Submit your PR with a clear narrative of what changed and *why*.

## 💬 Community
Join our **Inner Circle** on Discord to discuss architecture decisions with the founding team.

---

*“The engine is built. The mission is a success. We are ready for the 2026 wave.”*
