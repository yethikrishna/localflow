# AI Coding Tool Research: OpenCode (Open-Source CLI)

## 1. Core Architecture
- **Type**: Open-source CLI (Go-based).
- **Modular Design**: Separates the CLI (Cobra), Core logic (app), LLM integration, and TUI (Bubble Tea).
- **LSP Integration**: Directly talks to Language Servers (like `gopls` or `tsserver`) to get diagnostics and code intelligence without LLM overhead.

## 2. Multi-Agent / Parallel Execution
- **Role-Based Agents**: Uses a team of specialized agents (`_arch` for planning, `builder` for code, etc.).
- **Session Compaction**: Automatically summarizes long conversations to stay within context windows while maintaining "memory."

## 3. LLM Provider Support
- **Agnostic**: Supports OpenAI, Anthropic, Gemini, Groq, AWS Bedrock, Azure, and local models (Ollama/Llama.cpp).
- **BYOK (Bring Your Own Key)**: Users can swap providers mid-session.

## 4. Key Innovative Features (Worth Stealing)
- **100% Open Source**: Fully transparent architecture; easy to audit and fork.
- **TUI-First**: Built with Go's Bubble Tea framework, providing a highly responsive and "hacker-friendly" interface.
- **Named Arguments**: Custom commands can have placeholders (e.g., `/fix_bug --issue=$ID`), making it a scriptable "agent framework."
- **Memory File (OpenCode.md)**: A project-specific persistent memory file that the agent updates and reads to maintain long-term state.

## 5. Local vs. Remote Compute
- **Logic & TUI**: Local.
- **Inference**: Optional (Local via Ollama or Remote via API).
- **Execution**: Local shell.
- **Cloud Integration**: Can be triggered via GitHub Actions (/opencode comment in PRs).
