# AI Coding Tool Research: Gemini CLI (Google)

## 1. Core Architecture
- **Type**: Open-source CLI (Node.js).
- **Design**: Minimalist and lightweight, designed for direct terminal-to-model interaction.
- **Extensibility**: Uses **MCP (Model Context Protocol)** for tool extensions.

## 2. Multi-Agent / Parallel Execution
- **Proposed Architecture**: Moving toward a "Team Lead" and "Specialized Developer" model where the CLI orchestrates multiple Gemini sessions.
- **Parallel Sub-tasks**: Can trigger parallel background tasks for things like code reviews or PR triage.

## 3. LLM Provider Support
- **Primary**: Google Gemini 2.0 Flash, Gemini 1.5 Pro/Flash.
- **Context Window**: Key advantage is the **1M+ token context window**, reducing the need for complex RAG/indexing for medium-sized projects.

## 4. Key Innovative Features (Worth Stealing)
- **Google Search Grounding**: Native integration with Google Search for real-time library documentation and troubleshooting.
- **GitHub Actions Native**: Deeply integrated into the GitHub ecosystem for automated PR reviews and issue triaging.
- **Checkpointing**: Ability to "snapshot" a session and resume it later, or share the state with a teammate.

## 5. Local vs. Remote Compute
- **Logic**: Local CLI.
- **Inference**: Remote (Google Vertex AI / AI Studio).
- **Execution**: Local shell (with "Trusted Folders" security policy).
- **Automated Workflow**: Can run entirely in Google Cloud for CI/CD tasks.
