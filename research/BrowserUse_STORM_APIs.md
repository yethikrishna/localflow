# LocalFlow Integration Research: Browser Use & STORM

## 1. Browser Use (AI-Driven Web Interaction)

### Overview
Browser Use is a Python/Playwright-based library that allows LLMs to control a web browser. It provides a set of high-level actions (click, type, scroll, extract) that an agent can invoke to perform complex web-based tasks.

### Key Capabilities
- **Navigation**: Open URLs, go back, refresh.
- **Interactions**: Click elements, type into inputs, scroll (pixel-based or percentage).
- **Data Extraction**: Extract text, links, or structured information from the current view.
- **State Perception**: The agent receives a simplified representation of the DOM or a screenshot to make decisions.

### MCP Tool Design
```json
{
  "tools": [
    {
      "name": "browser_navigate",
      "description": "Navigate to a specific URL in the browser.",
      "parameters": {
        "type": "object",
        "properties": {
          "url": { "type": "string" }
        },
        "required": ["url"]
      }
    },
    {
      "name": "browser_interact",
      "description": "Perform an action (click, type, scroll) on the page.",
      "parameters": {
        "type": "object",
        "properties": {
          "action": { "type": "string", "enum": ["click", "type", "scroll"] },
          "selector": { "type": "string", "description": "CSS selector or element description" },
          "value": { "type": "string", "description": "Text to type or scroll amount" }
        },
        "required": ["action"]
      }
    },
    {
      "name": "browser_extract",
      "description": "Extract text or structured data from the current page.",
      "parameters": {
        "type": "object",
        "properties": {
          "type": { "type": "string", "enum": ["all_text", "links", "structured"] },
          "query": { "type": "string", "description": "Search query or extraction schema" }
        },
        "required": ["type"]
      }
    }
  ]
}
```

---

## 2. STORM (Automated Knowledge Exploration)

### Overview
STORM (Synthesis of Topic-centric Research through Model) is a research system that generates comprehensive articles by iteratively searching the web and synthesizing findings.

### Integration Points
LocalFlow will trigger STORM as a high-level research "skill." The output (Markdown articles) can then be stored in AppFlowy or summarized by Ollama.

### Key API/Interaction Patterns
- **Trigger Research**: Input a topic and receive a structured research report.
- **Incremental Retrieval**: Retrieve individual citations or findings related to a query.

### MCP Tool Design
```json
{
  "tools": [
    {
      "name": "storm_research",
      "description": "Start a deep research task on a specific topic using STORM.",
      "parameters": {
        "type": "object",
        "properties": {
          "topic": { "type": "string" },
          "depth": { "type": "string", "enum": ["standard", "deep"], "default": "standard" }
        },
        "required": ["topic"]
      }
    },
    {
      "name": "storm_get_status",
      "description": "Check the progress of an ongoing research task.",
      "parameters": {
        "type": "object",
        "properties": {
          "task_id": { "type": "string" }
        },
        "required": ["task_id"]
      }
    }
  ]
}
```

---

## 3. Implementation Plan
1. **Bridge Server**: Update `packages/tools/src/index.ts` to include the new tool definitions and routing.
2. **Handlers**: Implement the `handleBrowserUse` and `handleSTORM` logic. Since these are often Python-based, the bridge will interface with their respective local servers or provide a Docker-based executor.
3. **Environment Setup**: Add `BROWSER_USE_URL` and `STORM_API_URL` to the `EnvDiscoveryBridge` for auto-configuration.
