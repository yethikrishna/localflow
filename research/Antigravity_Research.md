# AI Coding Tool Research: Google Antigravity

## (1) Core Architecture
Antigravity is a purpose-built, AI-native Integrated Development Environment (IDE). Unlike traditional IDEs that add AI as a plugin, Antigravity is architected from the ground up as an "agent-first" environment. It provides a dedicated workspace where the AI agent has primary control over the development lifecycle, abstracting high-level tasks into manageable units.

## (2) Multi-agent Capabilities
Antigravity features a sophisticated **Agent Manager**. This architecture allows the tool to spawn sub-agents to handle specific sub-tasks in parallel. For example, while one agent is refactoring a component, another can be writing unit tests for it. This parallel execution is a key differentiator from the sequential task-processing found in many other tools.

## (3) LLM Provider Support
While developed by Google (and thus optimized for Gemini models), Antigravity is designed to be model-agnostic. It allows developers to supply their own API keys for various models, including OpenAI and custom local models, providing flexibility in cost and performance management.

## (4) Key Innovative Features
- **High-Level Task Abstraction**: Users can provide broad goals (e.g., "Implement a new authentication flow"), and the IDE breaks this down into actionable steps.
- **Agent-First Workflow**: The environment is optimized for autonomous agents to navigate codebases, run commands, and verify changes without constant human oversight.
- **Integrated Environment**: Deep integration between the chat interface, file explorer, and terminal, allowing the AI to "see" and "act" across all facets of the IDE.

## (5) Plugin/Extension System
Antigravity supports the **Model Context Protocol (MCP)**, allowing it to integrate with external tools and data sources dynamically. This enables the IDE to expand its capabilities by connecting to specialized tool servers for tasks like database management, API testing, or cloud deployment.
