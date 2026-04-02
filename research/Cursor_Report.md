# AI Coding Tool Research: Cursor (AI-first IDE)

## 1. Core Architecture
- **Type**: Standalone AI IDE (Fork of VS Code).
- **Design Pattern**: Agent-centric IDE where AI is not just a sidebar but integrated into the core editor loop.
- **Composer**: A unified interface for multi-file edits and high-level project tasks.
- **Indexing**: High-performance local-first indexing of the entire codebase for RAG (Retrieval Augmented Generation).

## 2. Multi-Agent / Parallel Execution
- **Parallel Agents**: Cursor 2.0 supports running up to **8 parallel agents** simultaneously.
- **Specialization**: Each agent can tackle different parts of a prompt (e.g., one writing tests, one refactoring, one updating docs) in isolated "shadow" environments.
- **Shadow Workspaces**: Spawns hidden background windows to run lints and tests on AI-generated code before presenting it to the user.

## 3. LLM Provider Support
- **Proprietary**: **Composer** (Cursor's own frontier model optimized for coding).
- **External**: GPT-4o, Claude 3.5 Sonnet, and "Cursor-small" for fast, cheap tasks.
- **Custom**: Allows users to provide their own API keys for various providers.

## 4. Key Innovative Features (Worth Stealing)
- **Shadow Workspaces**: Running a "ghost" version of the IDE in the background to verify lints/errors without interrupting the developer.
- **Predictive Editing**: Guessing the next edit location based on current context.
- **Tab-to-Apply**: Seamlessly applying multi-file diffs with a single keystroke.
- **Context Pinning**: Explicitly pinning files or docs to the AI's context window.

## 5. Local vs. Remote Compute
- **Logic & IDE**: Local.
- **Inference**: Remote (OpenAI/Anthropic/Cursor servers).
- **Indexing**: Hybrid. Initial parsing is local, but embeddings and vector search can be offloaded to Cursor's cloud for speed and scale.
- **Execution**: Local. Shell commands and code execution happen on the user's machine.
