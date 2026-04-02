# CodeBuddy (Tencent / Craft Code)

## Architecture Patterns
- **Dual-Model Architecture:** Uses a combination of specialized models for speed (completion) and reasoning (planning/review).
- **MCP Native:** Deeply integrates the Model Context Protocol (MCP) to connect the AI with external data and tools.
- **CloudStudio Integration:** Built on Tencent's earlier CloudStudio technology, providing a robust cloud-based IDE foundation.
- **Enterprise-Ready:** Designed with security and compliance layers for corporate environments.

## Key Features
- **Plan Mode:** A lightweight, interactive collaboration mode that weaves MCP, Skills, and SubAgents into a pluggable interface.
- **Craft Mode:** Specifically designed for "vibe coding" and agent-led development, where the agent takes more initiative in project creation.
- **Figma Design-to-Code:** Direct integration with Figma to convert design mockups into functional frontend code.
- **Intelligent Reviews:** Automated code review system that identifies bugs, performance bottlenecks, and security risks.
- **Slash Commands:** Pre-defined shortcuts (e.g., /explain, /fix) to streamline common developer tasks.

## How They Handle Agents
- **Agent Hooks:** Allows developers to "hook" agents into specific parts of the development lifecycle (e.g., post-commit checks).
- **Pluggable SubAgents:** Support for specialized sub-agents that can be called upon for specific tasks like database optimization or unit test generation.
- **MCP Orchestration:** Uses MCP as the primary bridge between the agent and the developer's local environment or cloud resources.

## LLM Support
- **Tencent Yuanbao:** Powered primarily by Tencent's proprietary Yuanbao Code Large Model.
- **External Model Support:** Via MCP, it can potentially interface with other models for specific tasks.

## Unique Innovations & Differentiators
- **Design-Centric Coding:** The Figma-to-code pipeline is more mature than most competitors, making it a favorite for frontend developers.
- **"Craft" Philosophy:** Emphasizes a more creative, "vibe-oriented" approach to software creation where the AI handles the heavy lifting of implementation while the human "directs."
- **Integrated Ecosystem:** Leverages the full Tencent Cloud ecosystem for hosting, databases, and deployment.
