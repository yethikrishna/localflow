# Factory Droid (Factory.ai)

## Architecture Patterns
- **Agent-Native Architecture:** Not a chatbot with tools, but a system built from the ground up as a collection of autonomous agents.
- **Orchestrator + specialized Droids:** A central orchestrator manages a "droid army" where each droid has a cognitive architecture tailored for specific tasks (Coding, Review, Testing, etc.).
- **Skill-Based Learning System:** Uses "Missions" to identify and capture patterns into reusable skills, allowing the droids to "learn" over time.
- **Local-to-Cloud Bridge:** Uses a local MCP bridge to connect the droids' intelligence with the developer's actual environment.

## Key Features
- **Missions:** A unique feature where the droid works on a long-running goal, interacting with the human for clarifications and constraints.
- **Specialized Personas:** Droids for Engineering, Reliability, Product, and Knowledge work.
- **Autonomous Execution:** Can work continuously for long periods (up to 40+ hours on complex tasks) without human supervision.
- **Agent-Native IDE:** Custom extensions for VS Code and JetBrains that are optimized for agent interactions rather than just code completion.

## How They Handle Agents
- **Cognitive Architecture:** Each droid mirrors human decision-making processes for its specific domain.
- **Skill Acquisition:** When a droid solves a new type of problem, the "Mission" system extracts the logic into a reusable "skill" for the whole droid army.
- **Multi-Agent Collaboration:** Different droids can collaborate on a single task (e.g., a Coding Droid writes code while a Reliability Droid checks for edge cases).

## LLM Support
- **Model-Agnostic but Optimized:** Built to work with the best-performing models, with internal tuning for agentic performance and multi-step reasoning.

## Unique Innovations & Differentiators
- **"Droid Army" Concept:** The shift from a single "assistant" to a team of specialized, autonomous agents.
- **Mission-Based Workflow:** Focuses on complete tasks and goals ("Missions") rather than just snippets of code.
- **Skill Persistence:** The ability for agents to "learn" from previous tasks and apply that knowledge to future ones across the team.
