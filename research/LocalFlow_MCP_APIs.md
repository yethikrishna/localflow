# LocalFlow MCP API Research & Design

## 1. Ollama API (Local LLM Infrastructure)

### Overview
Ollama provides a local REST API for running Large Language Models (LLMs) on-premise. It is a critical component of LocalFlow's local-first architecture.

### Key Endpoints
| Endpoint | Method | Description |
|---|---|---|
| `/api/generate` | `POST` | Generate a completion for a single prompt. |
| `/api/chat` | `POST` | Chat-based completion with message history support. |
| `/api/embeddings` | `POST` | Generate vector embeddings for a given text. |
| `/api/tags` | `GET` | List models available locally. |
| `/api/show` | `POST` | Show information about a specific model. |
| `/api/pull` | `POST` | Pull a model from the Ollama library. |
| `/api/ps` | `GET` | List models that are currently loaded in memory. |

### Tool Calling Support
Ollama (since v0.3.0) supports tool calling via the `/api/chat` endpoint, using a schema compatible with OpenAI's function calling.

### MCP Tool Design
```json
{
  "tools": [
    {
      "name": "ollama_chat",
      "description": "Send a chat message to a local model via Ollama.",
      "parameters": {
        "type": "object",
        "properties": {
          "model": { "type": "string", "description": "Model name (e.g., llama3, mistral)" },
          "messages": { "type": "array", "items": { "type": "object" }, "description": "Chat messages history" },
          "stream": { "type": "boolean", "default": false }
        },
        "required": ["model", "messages"]
      }
    },
    {
      "name": "ollama_list_models",
      "description": "List all models available on the local Ollama instance.",
      "parameters": { "type": "object", "properties": {} }
    }
  ]
}
```

---

## 2. AppFlowy API (Local-First Productivity)

### Overview
AppFlowy is an open-source alternative to Notion. For LocalFlow, it serves as a structured repository for notes, tasks, and project data.

### Architecture
LocalFlow will interface with the `appflowy-cloud` backend (which can be self-hosted) or directly with the local database if accessible via a bridge.

### Key Endpoints (AppFlowy Cloud/Self-Hosted)
| Endpoint | Method | Description |
|---|---|---|
| `/api/workspace` | `GET` | Retrieve workspace metadata. |
| `/api/database/{id}` | `GET` | Get schema and contents of a database (Grid/Board). |
| `/api/database/{id}/row` | `POST` | Create a new row in a database. |
| `/api/document/{id}` | `GET` | Retrieve the content of a document/page. |
| `/api/document/{id}` | `PATCH` | Update the content of a document/page. |

### MCP Tool Design
```json
{
  "tools": [
    {
      "name": "appflowy_read_page",
      "description": "Read the content of a document or page in AppFlowy.",
      "parameters": {
        "type": "object",
        "properties": {
          "page_id": { "type": "string" }
        },
        "required": ["page_id"]
      }
    },
    {
      "name": "appflowy_update_database_row",
      "description": "Update an existing row in an AppFlowy database.",
      "parameters": {
        "type": "object",
        "properties": {
          "database_id": { "type": "string" },
          "row_id": { "type": "string" },
          "data": { "type": "object", "description": "Key-value pairs for column updates" }
        },
        "required": ["database_id", "row_id", "data"]
      }
    }
  ]
}
```

---

## 3. NocoDB API (No-Code Database)

### Overview
NocoDB turns any database into a smart spreadsheet. In LocalFlow, it acts as the primary data orchestration layer for complex agentic workflows.

### Authentication
Uses `xc-token` header for API access.

### Key Endpoints
| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/db/data/noco/{projectName}/{tableName}` | `GET` | List records in a table. |
| `/api/v1/db/data/noco/{projectName}/{tableName}` | `POST` | Insert a new record. |
| `/api/v1/db/data/noco/{projectName}/{tableName}/{id}`| `PATCH`| Update a specific record. |
| `/api/v1/db/meta/projects` | `GET` | List all projects. |
| `/api/v1/db/meta/tables/{projectId}` | `GET` | List tables in a project. |

### MCP Tool Design
```json
{
  "tools": [
    {
      "name": "nocodb_list_tables",
      "description": "List all tables within a NocoDB project.",
      "parameters": {
        "type": "object",
        "properties": {
          "project_name": { "type": "string" }
        },
        "required": ["project_name"]
      }
    },
    {
      "name": "nocodb_query_data",
      "description": "Query records from a NocoDB table with filtering and sorting.",
      "parameters": {
        "type": "object",
        "properties": {
          "project_name": { "type": "string" },
          "table_name": { "type": "string" },
          "where": { "type": "string", "description": "Filter condition (e.g., '(Title,eq,HelloWorld)')" }
        },
        "required": ["project_name", "table_name"]
      }
    }
  ]
}
```

---

## 4. MCP Bridging Layer Design

### Standardized Tool Schema
LocalFlow agents will interact with these tools via a unified MCP server. The bridging layer will handle:
1.  **Authentication Proxying**: Securely storing and injecting API keys for AppFlowy/NocoDB.
2.  **Rate Limiting**: Ensuring local model inference (Ollama) doesn't overwhelm the system.
3.  **Context Injection**: Automatically enriching tool outputs with relevant metadata.
4.  **Error Normalization**: Converting diverse API errors into a standard format the agent can understand and act upon.
