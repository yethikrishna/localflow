# AI Coding Tool Research: GitHub Copilot (Agent Mode)

## 1. Core Architecture
- **Type**: IDE Extension (VS Code, JetBrains) with an "Agent Mode" toggle.
- **Architecture**: A multi-layered system: Extension (UI) -> GitHub Copilot Backend -> LLM Provider.
- **Agent Mode**: Distinct from simple chat; it acts as an autonomous orchestrator that can plan multi-step work and track progress across the workspace.

## 2. Multi-Agent / Parallel Execution
- **Multi-Model Orchestration**: Copilot can now run multiple agents (e.g., a "Claude agent" and a "Codex agent") simultaneously.
- **GitHub Actions Integration**: For truly autonomous tasks, Copilot can offload execution to a **GitHub Actions runner**, allowing it to work in the background without tying up the local machine.

## 3. LLM Provider Support
- **Multi-Provider**: Supports OpenAI (GPT-4o) and Anthropic (Claude 3.5 Sonnet).
- **Enterprise Control**: Organizations can specify which models are allowed.

## 4. Key Innovative Features (Worth Stealing)
- **Agent Mode UI**: A side-by-side view showing the "Plan" on one side and the "Execution Log" on the other.
- **Cross-Repo Context**: Can pull context from multiple repositories in the same organization.
- **Background Autonomy**: The "Agent Mode" can be sent to the cloud (GitHub Actions) to finish a task while the developer closes their IDE.

## 5. Local vs. Remote Compute
- **IDE Mode**: Local execution of terminal commands, remote LLM.
- **Autonomous Agent**: Remote compute. The entire agent loop (logic + execution) moves to a GitHub Actions runner, providing a sandboxed environment for code execution.
