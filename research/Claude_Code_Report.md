# AI Coding Tool Research: Claude Code (Anthropic)

## 1. Core Architecture
- **Type**: Agentic CLI tool.
- **Design Pattern**: Terminal-integrated agent that interacts directly with the local file system and shell.
- **Workflow**: Operates in a loop: Read (Context) -> Plan -> Act (Tool Use) -> Observe -> Iterate.
- **Integration**: Supports **Model Context Protocol (MCP)**, allowing it to connect to a wide ecosystem of external tools (databases, web search, etc.).

## 2. Multi-Agent / Parallel Execution
- **TeammateTool & Task System**: Claude Code uses a "Teammate" abstraction where a lead agent can spawn sub-tasks or coordinate with other "Claude instances."
- **Orchestration Patterns**: Supports **Supervisor** (one lead, many specialists), **Swarm** (peer-to-peer task handoff), and **Hierarchical** architectures.
- **Parallelism**: Can run multiple terminal sessions or background tasks simultaneously, using separate "thinking" contexts for each.

## 3. LLM Provider Support
- **Primary**: Anthropic Claude 3.5 Sonnet, Claude 3.7 Sonnet (optimized for tool-use and coding).
- **Flexibility**: While primarily tied to Anthropic's API, it can be used with **Ollama** or other local endpoints via MCP bridges or custom wrappers.

## 4. Key Innovative Features (Worth Stealing)
- **Agent Teams**: The ability for the CLI to coordinate multiple sessions where one acts as the "Team Lead."
- **TUI (Terminal User Interface)**: Rich interactive terminal experience with progress bars, diff previews, and permission dialogs.
- **Self-Correction**: High success rate in fixing its own errors by observing command output (e.g., build failures, test errors).
- **MCP Native**: Deep integration with Model Context Protocol for instant extensibility.

## 5. Local vs. Remote Compute
- **Logic & Execution**: Local. It runs on the user's machine, executes shell commands locally, and reads/writes local files.
- **Inference**: Remote. LLM processing happens on Anthropic's servers via API.
- **State**: Conversation history and checkpoints can be stored locally or cached in the cloud for session resumption.
