# AI Coding Tool Research: RooCode (Roo Cline)

## (1) Core Architecture
RooCode is a popular open-source fork of Cline, also delivered as a VS Code extension. It maintains the core philosophy of Cline but introduces more experimental features and a highly customizable user experience. It follows a similar client-side execution pattern.

## (2) Multi-agent Capabilities
RooCode expands on the agentic experience with **Custom Modes**. It provides specialized roles like:
- **Code Mode**: For implementation.
- **Ask Mode**: For code explanation and documentation.
- **Architect Mode**: For high-level design and planning.
Users can create their own custom roles with specific system prompts, effectively creating a specialized "team" of agents.

## (3) LLM Provider Support
Identical to Cline, it supports a broad spectrum of LLM providers:
- Anthropic, OpenAI, Google Gemini.
- OpenRouter, AWS Bedrock.
- Local execution via Ollama.

## (4) Key Innovative Features
- **Custom Modes/Roles**: Allows users to define specific personas for the AI, optimizing it for different phases of the SDLC.
- **Enhanced UI/UX**: Offers more granular control over token usage, context window management, and history.
- **Tool-Friendly Environment**: Improved handling of tool outputs and terminal feedback compared to the base Cline project.

## (5) Plugin/Extension System
RooCode fully supports the **Model Context Protocol (MCP)**, allowing for seamless integration with the growing ecosystem of MCP servers. It also allows for deep customization of the agent's behavior through the "Custom Modes" configuration.
