# Crush (by Charmbracelet)

## Architecture Patterns
- **TUI-Native (Terminal User Interface):** Built using the Charm stack (Lip Gloss, Bubbles), providing a "glamorous" and responsive terminal experience.
- **CLI-First Agent:** Designed to live in the terminal alongside existing tools like git, nix, and neovim.
- **Permission-Gated Tooling:** Architecture requires explicit user permission for tool execution (by default), ensuring safety in the terminal.
- **Modular Toolset:** Easily extensible through a plugin-like system for adding new CLI tools to the agent's repertoire.

## Key Features
- **Glamorous Aesthetic:** Features the signature high-quality design and "vibe" of Charmbracelet tools, making terminal coding visually appealing.
- **Granular Tool Access:** Allows the agent to run terminal commands, read files, and interact with the local OS with fine-grained control.
- **Nix Integration:** Strong support for Nix-based environments for reproducible development setups.
- **Playful UX:** Branded as a "coding bestie," with a tone and interface that reduces the friction of AI interaction.

## How They Handle Agents
- **Interactive Terminal Agent:** The agent operates directly in the command line, capable of executing complex multi-step workflows.
- **Human-in-the-loop:** Emphasizes a "companion" model where the user provides granular approvals for sensitive actions.
- **Context Management:** Uses terminal history and file-system awareness to build context for coding tasks.

## LLM Support
- **Claude Code Integration:** Deeply integrated with Claude's agentic capabilities.
- **Flexible Backend:** Supports various models via configuration, emphasizing high-reasoning models capable of terminal tool use.

## Unique Innovations & Differentiators
- **Design Excellence:** Brings world-class UI/UX design to a terminal-based AI agent, proving that CLIs don't have to be "boring."
- **Developer-Centric UX:** Built by developers for developers, focusing on the "vibe" and speed of the terminal workflow.
- **"AI Bestie" Persona:** Differentiates through a friendly, supportive personality compared to more "robotic" assistants.
