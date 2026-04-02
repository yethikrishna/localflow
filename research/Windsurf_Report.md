# AI Coding Tool Research: Windsurf (Codeium)

## 1. Core Architecture
- **Type**: Standalone AI IDE (Codeium).
- **Cascade**: The central agentic assistant.
- **Flow-based Architecture**: Focuses on "Engineering Flow" where the AI tracks every action (navigation, edits, commands) to maintain a "live" context.

## 2. Multi-Agent / Parallel Execution
- **Multi-perspective Approach**: While not as explicitly "multi-agent" as Cursor or Claude Code, Cascade uses multiple internal specialized sub-models to handle "thinking" vs "editing" vs "linting" in parallel.
- **Workflows**: Users can define sequential or parallel "Workflows" (e.g., deploy to dev, then run integration tests) for the agent to follow.

## 3. LLM Provider Support
- **Proprietary**: Optimized Codeium models.
- **Integration**: Deeply coupled with Codeium's context engine and remote indexing.

## 4. Key Innovative Features (Worth Stealing)
- **Flow Context**: The AI doesn't just see the code; it see *how you got there* (your navigation history and recent terminal output).
- **Memories**: Persistent long-term storage of project-specific rules and patterns that cross sessions.
- **Supercomplete**: An evolution of autocomplete that suggests whole multi-line blocks based on the "Flow" context.

## 5. Local vs. Remote Compute
- **IDE**: Local.
- **Inference**: Remote (Codeium Cloud).
- **Context Engine**: Hybrid. Large-scale indexing is remote, but real-time flow tracking is local.
- **Execution**: Local.
