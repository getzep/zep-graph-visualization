import type {
  Node,
  Edge,
  GraphNode,
  GraphEdge,
  RawTriplet,
  GraphTriplet,
} from "@/lib/types/graph";

export function toGraphNode(node: Node): GraphNode {
  const primaryLabel =
    node.labels?.find((label) => label != "Entity") || "Entity";

  return {
    id: node.uuid,
    value: node.name,
    uuid: node.uuid,
    name: node.name,
    created_at: node.created_at,
    updated_at: node.updated_at,
    attributes: node.attributes,
    summary: node.summary,
    labels: node.labels,
    primaryLabel,
  };
}

export function toGraphEdge(edge: Edge): GraphEdge {
  return {
    id: edge.uuid,
    value: edge.name,
    ...edge,
  };
}

export function toGraphTriplet(triplet: RawTriplet): GraphTriplet {
  return {
    source: toGraphNode(triplet.sourceNode),
    relation: toGraphEdge(triplet.edge),
    target: toGraphNode(triplet.targetNode),
  };
}

export function toGraphTriplets(triplets: RawTriplet[]): GraphTriplet[] {
  return triplets.map(toGraphTriplet);
}

export function createTriplets(edges: Edge[], nodes: Node[]): RawTriplet[] {
  return edges
    .map((edge) => {
      const sourceNode = nodes.find(
        (node) => node.uuid === edge.source_node_uuid
      );
      const targetNode = nodes.find(
        (node) => node.uuid === edge.target_node_uuid
      );

      if (!sourceNode || !targetNode) return null;

      return {
        sourceNode,
        edge,
        targetNode,
      };
    })
    .filter(
      (t): t is RawTriplet =>
        t !== null && t.sourceNode !== undefined && t.targetNode !== undefined
    );
}
