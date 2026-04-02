export * from './client.js';
export * from './normalization.js';

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { normalizeToolOutput, createErrorBundle } from './normalization.js';
import { BrowserUseTool } from './browser-use.js';
import { STORMTool } from './storm.js';
import { FilesystemTool } from './filesystem.js';
import { TerminalTool } from './terminal.js';
import { GitTool } from './git.js';
import { SearchTool } from './search.js';

/**
 * LocalFlow MCP Bridge Server
 * Exposes local-first tools (Ollama, AppFlowy, NocoDB) to NEXUS agents.
 */
const browserTool = new BrowserUseTool();
const stormTool = new STORMTool();
const filesystemTool = new FilesystemTool();
const terminalTool = new TerminalTool();
const gitTool = new GitTool();
const searchTool = new SearchTool();

const server = new Server(
  {
    name: "localflow-bridge",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Tool Definitions
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "ollama_chat",
        description: "Send a chat message to a local model via Ollama.",
        inputSchema: {
          type: "object",
          properties: {
            model: { type: "string", description: "Model name (e.g., llama3, mistral)" },
            messages: { 
              type: "array", 
              items: { 
                type: "object",
                properties: {
                    role: { type: "string", enum: ["user", "assistant", "system"] },
                    content: { type: "string" }
                },
                required: ["role", "content"]
              }, 
              description: "Chat messages history" 
            },
            stream: { type: "boolean", default: false }
          },
          required: ["model", "messages"]
        }
      },
      {
        name: "ollama_list_models",
        description: "List all models available on the local Ollama instance.",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "appflowy_read_page",
        description: "Read the content of a document or page in AppFlowy.",
        inputSchema: {
          type: "object",
          properties: {
            page_id: { type: "string" }
          },
          required: ["page_id"]
        }
      },
      {
        name: "appflowy_update_page",
        description: "Update the content of a document or page in AppFlowy.",
        inputSchema: {
          type: "object",
          properties: {
            page_id: { type: "string" },
            content: { type: "string" }
          },
          required: ["page_id", "content"]
        }
      },
      {
        name: "nocodb_query_data",
        description: "Query records from a NocoDB table with filtering and sorting.",
        inputSchema: {
          type: "object",
          properties: {
            project_name: { type: "string" },
            table_name: { type: "string" },
            where: { type: "string", description: "Filter condition (e.g., '(Title,eq,HelloWorld)')" }
          },
          required: ["project_name", "table_name"]
        }
      },
      {
        name: "browser_navigate",
        description: "Navigate to a URL and optionally perform basic interaction or extraction.",
        inputSchema: {
          type: "object",
          properties: {
            url: { type: "string" },
            action: { type: "string", enum: ["click", "type", "extract"] },
            selector: { type: "string" },
            text: { type: "string" }
          },
          required: ["url"]
        }
      },
      {
        name: "browser_extract_text",
        description: "Fetch a URL and return cleaned text content.",
        inputSchema: {
          type: "object",
          properties: {
            url: { type: "string" }
          },
          required: ["url"]
        }
      },
      {
        name: "storm_research",
        description: "Perform comprehensive topic research using STORM agent simulation.",
        inputSchema: {
          type: "object",
          properties: {
            topic: { type: "string" },
            depth: { type: "string", enum: ["quick", "deep"] },
            output_format: { type: "string", enum: ["markdown", "json"] }
          },
          required: ["topic"]
        }
      },
      {
        name: "fs_read_file",
        description: "Read the contents of a file from the local filesystem.",
        inputSchema: {
          type: "object",
          properties: {
            path: { type: "string", description: "Path to the file relative to the workspace root." }
          },
          required: ["path"]
        }
      },
      {
        name: "fs_write_file",
        description: "Write content to a file on the local filesystem.",
        inputSchema: {
          type: "object",
          properties: {
            path: { type: "string" },
            content: { type: "string" }
          },
          required: ["path", "content"]
        }
      },
      {
        name: "fs_list_files",
        description: "List files in a directory.",
        inputSchema: {
          type: "object",
          properties: {
            path: { type: "string", default: "." }
          }
        }
      },
      {
        name: "fs_delete_file",
        description: "Delete a file from the local filesystem.",
        inputSchema: {
          type: "object",
          properties: {
            path: { type: "string" }
          },
          required: ["path"]
        }
      },
      {
        name: "terminal_execute",
        description: "Execute a command in the local terminal.",
        inputSchema: {
          type: "object",
          properties: {
            command: { type: "string" }
          },
          required: ["command"]
        }
      },
      {
        name: "git_list_branches",
        description: "List all git branches.",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "git_create_branch",
        description: "Create a new git branch.",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string" }
          },
          required: ["name"]
        }
      },
      {
        name: "git_list_worktrees",
        description: "List all git worktrees.",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "search_grep",
        description: "Search for a pattern in files (grep).",
        inputSchema: {
          type: "object",
          properties: {
            pattern: { type: "string" },
            path: { type: "string", default: "." }
          },
          required: ["pattern"]
        }
      },
      {
        name: "search_find",
        description: "Find files by name pattern.",
        inputSchema: {
          type: "object",
          properties: {
            pattern: { type: "string", description: "File name pattern (e.g., '*.ts')" },
            path: { type: "string", default: "." }
          },
          required: ["pattern"]
        }
      }
    ],
  };
});

/**
 * Tool Call Handlers
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;
    switch (name) {
      case "ollama_chat":
        result = await handleOllamaChat(args as any);
        break;
      case "ollama_list_models":
        result = await handleOllamaListModels();
        break;
      case "appflowy_read_page":
        result = await handleAppFlowyReadPage(args as any);
        break;
      case "appflowy_update_page":
        result = await handleAppFlowyUpdatePage(args as any);
        break;
      case "nocodb_query_data":
        result = await handleNocoDBQueryData(args as any);
        break;
      case "browser_navigate":
        result = await handleBrowserNavigate(args as any);
        break;
      case "browser_extract_text":
        result = await handleBrowserExtractText(args as any);
        break;
      case "storm_research":
        result = await handleStormResearch(args as any);
        break;
      case "fs_read_file":
        result = await filesystemTool.readFile((args as any).path);
        break;
      case "fs_write_file":
        await filesystemTool.writeFile((args as any).path, (args as any).content);
        result = { success: true };
        break;
      case "fs_list_files":
        result = await filesystemTool.listFiles((args as any).path || ".");
        break;
      case "fs_delete_file":
        await filesystemTool.deleteFile((args as any).path);
        result = { success: true };
        break;
      case "terminal_execute":
        result = await terminalTool.execute((args as any).command);
        break;
      case "git_list_branches":
        result = await gitTool.listBranches();
        break;
      case "git_create_branch":
        result = await gitTool.createBranch((args as any).name);
        break;
      case "git_list_worktrees":
        result = await gitTool.listWorktrees();
        break;
      case "search_grep":
        result = await searchTool.grep((args as any).pattern, (args as any).path);
        break;
      case "search_find":
        result = await searchTool.find((args as any).pattern, (args as any).path);
        break;
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
    const normalized = normalizeToolOutput(name, result);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(normalized),
        },
      ],
    };
  } catch (error: any) {
    const errorBundle = createErrorBundle(name, error);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(errorBundle),
        },
      ],
      isError: true,
    };
  }
});

/**
 * Ollama Handlers
 */
async function handleOllamaChat(args: { model: string; messages: any[]; stream?: boolean }) {
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });

  if (!response.ok) throw new Error(`Ollama API error: ${response.statusText}`);
  const data = await response.json();
  
  return {
    content: [{ type: "text", text: JSON.stringify(data.message) }],
  };
}

async function handleOllamaListModels() {
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const response = await fetch(`${baseUrl}/api/tags`);

  if (!response.ok) throw new Error(`Ollama API error: ${response.statusText}`);
  const data = await response.json();

  return {
    content: [{ type: "text", text: JSON.stringify(data.models) }],
  };
}

/**
 * AppFlowy Handlers
 */
async function handleAppFlowyReadPage(args: { page_id: string }) {
  const baseUrl = process.env.APPFLOWY_BASE_URL || "http://localhost:8080";
  const apiKey = process.env.APPFLOWY_API_KEY;

  const response = await fetch(`${baseUrl}/api/document/${args.page_id}`, {
    headers: { "Authorization": `Bearer ${apiKey}` },
  });

  if (!response.ok) throw new Error(`AppFlowy API error: ${response.statusText}`);
  const data = await response.json();

  return {
    content: [{ type: "text", text: JSON.stringify(data) }],
  };
}

async function handleAppFlowyUpdatePage(args: { page_id: string; content: string }) {
  const baseUrl = process.env.APPFLOWY_BASE_URL || "http://localhost:8080";
  const apiKey = process.env.APPFLOWY_API_KEY;

  const response = await fetch(`${baseUrl}/api/document/${args.page_id}`, {
    method: "PATCH",
    headers: { 
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ content: args.content }),
  });

  if (!response.ok) throw new Error(`AppFlowy API error: ${response.statusText}`);
  const data = await response.json();

  return {
    content: [{ type: "text", text: JSON.stringify(data) }],
  };
}

/**
 * NocoDB Handlers
 */
async function handleNocoDBQueryData(args: { project_name: string; table_name: string; where?: string }) {
  const baseUrl = process.env.NOCODB_BASE_URL || "http://localhost:8080";
  const apiKey = process.env.NOCODB_API_KEY;

  let url = `${baseUrl}/api/v1/db/data/noco/${args.project_name}/${args.table_name}`;
  if (args.where) {
    url += `?where=${encodeURIComponent(args.where)}`;
  }

  const response = await fetch(url, {
    headers: { "xc-token": apiKey || "" },
  });

  if (!response.ok) throw new Error(`NocoDB API error: ${response.statusText}`);
  const data = await response.json();

  return {
    content: [{ type: "text", text: JSON.stringify(data.list) }],
  };
}

/**
 * Browser Use Handlers
 */
async function handleBrowserNavigate(args: { url: string; action?: 'click'|'type'|'extract'; selector?: string; text?: string }) {
  const page = await browserTool.navigate(args.url);
  
  if (args.action === 'click' && args.selector) {
    await browserTool.click(args.url, args.selector);
  } else if (args.action === 'type' && args.selector && args.text) {
    await browserTool.type(args.selector, args.text);
  }

  return {
    content: [{ 
      type: "text", 
      text: JSON.stringify({
        title: page.title,
        url: page.url,
        snippet: page.text.substring(0, 500) + "...",
        links: page.links
      }) 
    }],
  };
}

async function handleBrowserExtractText(args: { url: string }) {
  const text = await browserTool.extractText(args.url);
  return {
    content: [{ type: "text", text: JSON.stringify({ url: args.url, text: text }) }],
  };
}

async function handleBrowserInteract(args: { action: string; selector?: string; value?: string }) {
  // Keeping this for compatibility if internal calls use it
  if (args.action === 'click' && args.selector) {
    await browserTool.click("current_url", args.selector);
  } else if (args.action === 'type' && args.selector && args.value) {
    await browserTool.type(args.selector, args.value);
  }
  return { content: [{ type: "text", text: "Interaction successful" }] };
}

/**
 * STORM Handlers
 */
async function handleStormResearch(args: { topic: string; depth?: 'quick'|'deep'; output_format?: 'markdown'|'json' }) {
  const result = await stormTool.research(args.topic, args.depth || 'quick');
  
  let formattedContent: string;
  if (args.output_format === 'markdown') {
    formattedContent = `# ${result.topic}\n\n${result.summary}\n\n` + 
      result.sections.map(s => `## ${s.title}\n${s.content}`).join('\n\n') +
      `\n\n### Sources\n` + result.sources.map(src => `- ${src}`).join('\n');
  } else {
    formattedContent = JSON.stringify(result, null, 2);
  }

  return {
    content: [{ type: "text", text: formattedContent }]
  };
}

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("LocalFlow MCP Bridge running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
