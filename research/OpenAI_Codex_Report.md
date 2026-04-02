# AI Coding Tool Research: OpenAI Codex (CLI Agent)

## 1. Core Architecture
- **Type**: CLI Agent / Terminal-based assistant.
- **Protocol**: Built on the **Codex App Server** (a bidirectional protocol that decouples the agent logic from the interface).
- **Workflow**: High-level goal-oriented tasks. The agent plans a sequence of file operations and shell commands.

## 2. Multi-Agent / Parallel Execution
- **Subagents**: Natively handles **Manager-Subagent** patterns. The main agent can spawn sub-tasks that run in parallel sessions.
- **Thread Management**: Codex manages session state across multiple threads, allowing it to "wait" for a sub-task (like a long-running test) while continuing other work.

## 3. LLM Provider Support
- **Primary**: OpenAI Codex and GPT-4 series models.
- **Specialization**: Uses models fine-tuned specifically for the "Agentic" loop of Plan-Execute-Observe.

## 4. Key Innovative Features (Worth Stealing)
- **Bidirectional Protocol**: The agent doesn't just "chat"; it has a structured protocol for requesting file reads, terminal access, and user confirmation.
- **Interactive Mode**: A full-screen TUI that allows real-time intervention and "resuming" of long-running agent flows.
- **Reasoning Effort Control**: Allows users to toggle "Reasoning Effort" (low/med/high) for different sub-tasks to save costs/latency.

## 5. Local vs. Remote Compute
- **Logic**: Local (CLI client).
- **Inference**: Remote (OpenAI cloud).
- **Execution**: Local. All file writes and bash commands are executed on the user's local hardware after approval.
