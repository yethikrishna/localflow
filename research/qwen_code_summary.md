# Qwen Code (Alibaba AI Coding)

## Architecture Patterns
- **Mixture-of-Experts (MoE):** The flagship Qwen 3 models utilize a massive MoE architecture with 480B total parameters, of which only 35B are active during inference. This allows for high-tier reasoning capabilities with efficient computation.
- **Unified Agent Interface:** Qwen-Agent provides a standard framework for building applications, integrating instruction following, tool usage, planning, and memory.
- **Hybrid Reasoning Modes:** Supports multiple reasoning paths including traditional CoT (Chain of Thought) and more advanced agentic planning.
- **Native Multimodal Integration:** Qwen 3.5 features native multimodal reasoning, allowing the agent to "see" and "understand" UI/UX elements and diagrams alongside code.

## Key Features
- **Massive Context Window:** Capable of handling extremely long contexts for large codebase analysis.
- **Advanced Function Calling:** High accuracy in selecting and executing external tools and APIs.
- **Modular Memory System:** Manages document storage and retrieval (RAG) and session context to maintain long-term project awareness.
- **Multi-language Excellence:** Strong performance across a wide range of programming languages, not just the most popular ones.

## How They Handle Agents
- **Qwen-Agent Framework:** A dedicated library that equips models with a "working memory" and a "planner."
- **Autonomous Multi-step Planning:** Agents can break down complex requirements into smaller tasks and execute them sequentially without constant user prompting.
- **Tool Orchestration:** Built-in support for agents to discover and use external tools via standardized function calling.

## LLM Support
- **Qwen Series:** Optimized specifically for Alibaba's Qwen models (Qwen 2, Qwen 2.5, Qwen 3, Qwen 3.5).
- **Open-Source Friendly:** Many variants are open-weights, allowing for local deployment and fine-tuning.

## Unique Innovations & Differentiators
- **Scale:** One of the largest open-weights MoE models available for coding.
- **Native Multimodal Agents:** Moving beyond text-only coding to understand visual context (e.g., screenshots of bugs or design mockups) directly within the model architecture.
- **Agent-First Design:** The framework is built from the ground up to support agentic workflows rather than just chat-based code generation.
