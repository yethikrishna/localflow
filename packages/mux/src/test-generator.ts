import { WorkflowGenerator } from './generator';
import { WorkflowRegistry } from '@nexus/core';

async function testGenerator() {
  const generator = new WorkflowGenerator();
  
  const prompts = [
    "Research the top 5 AI trends for 2026 using STORM, summarize them with llama3, and save the report to AppFlowy page 'trends-2026'.",
    "Navigate to GitHub releases for Ollama, extract version, and update NocoDB."
  ];

  console.log("--- Starting Workflow Registry Integration Tests ---");

  for (const prompt of prompts) {
    console.log(`\n[PROMPT] "${prompt}"`);
    try {
      // Generate and register
      const workflow = await generator.generate(prompt, true);
      console.log(`[SUCCESS] Generated: ${workflow.name} (ID: ${workflow.id})`);
    } catch (e) {
      console.error(`[FAILED] ${e.message}`);
    }
  }

  console.log("\n--- Workflow Registry Contents ---");
  const registered = WorkflowRegistry.list();
  registered.forEach(w => {
    console.log(`- ${w.name} (v${w.version}) by ${w.author}`);
    console.log(`  Description: ${w.description}`);
    console.log(`  Nodes: ${w.nodes.length}, Edges: ${w.edges.length}`);
    console.log(`  Tags: ${w.tags.join(', ')}`);
  });

  console.log("\n--- Tests Complete ---");
}

if (require.main === module) {
  testGenerator();
}

export { testGenerator };
