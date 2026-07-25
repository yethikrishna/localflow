<!--
SEO Keywords: local development workflow, local-first development, agentic workflow orchestration, parallel task execution, developer tools, TypeScript monorepo, local AI agents, workflow automation, pnpm monorepo, turbo monorepo, desktop development, sovereignty of agency
-->

<div align="center">

# LocalFlow

**Local-First Parallel Agentic Hub — The Sovereignty of Agency**

*Local Development Workflow Orchestration · Zero-Cloud Dependency · Parallel Agent Execution*

[![TypeScript](https://img.shields.io/badge/typescript-5.4-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9.0-orange?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Turbo](https://img.shields.io/badge/turbo-2.0-gray?logo=turbo&logoColor=white)](https://turbo.build/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green?logo=opensourceinitiative)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-blue?logo=docker&logoColor=white)](https://www.docker.com/)

<p align="center">
  <strong>Local-First</strong> | <strong>Parallel Agents</strong> | <strong>Workflow Orchestration</strong> | <strong>Desktop App</strong> | <strong>Zero-CSS Performance</strong>
</p>

</div>

---

## Overview

**LocalFlow** is a local-first development workflow orchestration tool that empowers developers with parallel agentic capabilities without cloud lock-in. Built on the principle of agentic sovereignty, LocalFlow runs AI-powered workflows entirely on your local machine, orchestrating multiple agents in parallel to accelerate development tasks while maintaining complete control over your code and data.

In an era where AI coding is dominated by cloud-locked IDE extensions, LocalFlow provides a sovereign alternative — a high-performance, extensible hub for local agent workflows that respects your privacy and puts you in control.

---

## Features

### Local-First Architecture
- **Zero Cloud Dependency** — All processing happens locally; no data leaves your machine
- **Offline-Capable** — Works without internet connection for core workflows
- **Data Sovereignty** — Complete control over your codebase and agent interactions
- **Fast Local Execution** — Zero network latency, instant feedback loops

### Parallel Agent Orchestration
- **Multi-Agent Parallelism** — Run multiple AI agents simultaneously on different tasks
- **Agent Discovery** — Dynamic discovery and registration of available agents
- **Mux (Multiplexer)** — Intelligent routing and coordination of agent workflows
- **Tool Integration** — Extensible tool system for file operations, shell commands, and code manipulation
- **LLM Integration** — Pluggable LLM backend support

### Developer Experience
- **Desktop Application** — Native desktop app for workflow management
- **Core Engine** — Robust orchestration engine with task scheduling
- **UI Components** — React-based component library for building interfaces
- **Zero-CSS Performance** — Optimized rendering with minimal CSS overhead
- **Docker Support** — Containerized development and deployment

### Workflow Management
- **Workflow Discovery** — Auto-discover workflows and agents in your project
- **Custom Workflows** — Define and compose your own agentic workflows
- **Task Parallelization** — Automatically parallelize independent tasks
- **Progress Tracking** — Real-time monitoring of agent execution

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Language | TypeScript 5.4 |
| Package Manager | pnpm 9.0 |
| Build System | Turborepo 2.0 |
| Framework | React (desktop app) |
| Containerization | Docker, Docker Compose |
| Code Quality | ESLint, Prettier |
| Monorepo Structure | pnpm workspaces |
| License | MIT |

---

## Quick Start

### Prerequisites

- Node.js >= 18
- pnpm >= 9.0
- Docker (optional, for containerized development)

### Installation

```bash
git clone https://github.com/yethikrishna/localflow.git
cd localflow

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start development
pnpm dev
```

### Docker Development

```bash
# Start with docker compose
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose -f docker-compose.prod.yml up -d
```

### Using LocalFlow

```bash
# Start the desktop app
pnpm dev:desktop

# Run a workflow
localflow run <workflow-name>

# List available agents
localflow agents list

# Orchestrate parallel tasks
localflow mux run --parallel task1 task2 task3
```

---

## Project Structure

```
localflow/
├── apps/
│   └── desktop/                 # Desktop application
├── packages/
│   ├── core/                    # Core orchestration engine
│   ├── discovery/               # Agent & workflow discovery
│   ├── llm/                     # LLM integration layer
│   ├── mux/                     # Multiplexer for parallel agent routing
│   ├── tools/                   # Tool system (file, shell, code ops)
│   └── ui/                      # Shared UI component library
├── scripts/                     # Build & utility scripts
├── docs/                        # Documentation
├── research/                    # Research notes & experiments
├── Dockerfile                   # Production Dockerfile
├── Dockerfile.dev               # Development Dockerfile
├── docker-compose.yml           # Base Docker Compose
├── docker-compose.dev.yml       # Development Compose
├── docker-compose.prod.yml      # Production Compose
├── pnpm-workspace.yaml          # pnpm workspace config
├── turbo.json                   # Turborepo config
├── tsconfig.base.json           # Base TypeScript config
├── package.json                 # Root package config
├── LICENSE                      # MIT License
└── README.md                    # This file
```

---

## Packages

| Package | Description |
|---------|-------------|
| `@localflow/core` | Core workflow orchestration engine |
| `@localflow/discovery` | Agent and workflow auto-discovery |
| `@localflow/llm` | LLM backend integration |
| `@localflow/mux` | Parallel agent multiplexer and router |
| `@localflow/tools` | Extensible tool system |
| `@localflow/ui` | React component library |

---

## Deployment

### Docker Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Building from Source

```bash
pnpm build
pnpm --filter desktop start
```

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting (`pnpm test && pnpm lint`)
5. Submit a pull request

---

## Community & Planning

- [Community Plan](COMMUNITY_PLAN.md)
- [Discovery Strategy](DISCOVERY_STRATEGY.md)
- [Recruitment Strategy](RECRUITMENT_STRATEGY.md)
- [Nexus 10 Year Plan](NEXUS_10_YEAR_PLAN.md)

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**[LocalFlow](https://github.com/yethikrishna/localflow)** — The Sovereignty of Agency. Local-first, parallel, powerful.

[Get Started](#quick-start) · [Report Bug](https://github.com/yethikrishna/localflow/issues) · [Request Feature](https://github.com/yethikrishna/localflow/issues)

</div>
