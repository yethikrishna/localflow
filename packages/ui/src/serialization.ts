import { Workflow, WorkflowNodeSchema, WorkflowEdgeSchema } from '@nexus/core';
import { NxWorkflowNode } from './workflow-node';

export class WorkflowSerializer {
  /**
   * Serialize a list of NxWorkflowNodes and Edges into a NEXUS Workflow object
   */
  static serialize(
    id: string,
    name: string,
    description: string,
    author: string,
    tags: string[],
    nodes: NxWorkflowNode[],
    edges: any[] = []
  ): Workflow {
    const now = new Date().toISOString();
    
    return {
      id,
      name,
      description,
      version: '0.1.0',
      author,
      tags,
      nodes: nodes.map(node => {
        const layout = node.yogaNode.getComputedLayout();
        return {
          id: node.nodeId,
          type: 'workflow-node',
          data: node.data, // Consistent with Registry data
          position: { x: layout.left, y: layout.top }
        };
      }),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label
      })),
      createdAt: now,
      updatedAt: now
    };
  }

  /**
   * Deserialize a NEXUS Workflow object back into NxWorkflowNode instances and Edges
   */
  static deserialize(data: Workflow): { nodes: NxWorkflowNode[], edges: any[] } {
    const nodes = data.nodes.map(nodeData => {
      const node = new NxWorkflowNode(nodeData.id, nodeData.type); // type is used as title for now
      node.data = nodeData.data || {};
      
      // Position is currently handled by Yoga, but in a free-form canvas we'd use nodeData.position
      return node;
    });

    return {
      nodes,
      edges: data.edges || []
    };
  }
}
