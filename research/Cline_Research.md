# AI Coding Tool Research: Cline (formerly Claude Dev)

## (1) Core Architecture
Cline is an open-source VS Code extension built with a client-side architecture. It operates directly within the developer's local environment, meaning code stays local (unless sent to the LLM provider for processing). It leverages the VS Code API to interact with the file system, terminal, and editor.

## (2) Multi-agent Capabilities
Cline utilizes a **Dual-Mode System** consisting of "Plan" and "Act" modes. 
- **Plan Mode**: The agent analyzes the task and outlines the steps without making changes.
- **Act Mode**: The agent executes the plan by writing code, running terminal commands, and reading files. 
While primarily a single-agent system per task, it manages complex workflows through iterative feedback loops.

## (3) LLM Provider Support
Cline is highly model-agnostic, supporting a wide range of providers including:
- Anthropic (Claude 3.5 Sonnet is the recommended model)
- OpenAI
- AWS Bedrock
- Google Vertex AI / Gemini
- OpenRouter (for accessing hundreds of open-source models)
- Local models via Ollama or LM Studio

## (4) Key Innovative Features
- **Terminal Integration**: Can run commands, monitor output, and react to build errors or test failures autonomously.
- **Interactive File Management**: Can create, delete, and modify files with user approval at each step.
- **Browser Capabilities**: Can launch a headless browser to test web applications or research documentation.

## (5) Plugin/Extension System
Cline is a pioneer in adopting the **Model Context Protocol (MCP)**. This allows users to extend Cline's capabilities by adding "MCP Servers" that provide the agent with new tools (e.g., a GitHub MCP server, a Slack MCP server, or custom internal tools).
