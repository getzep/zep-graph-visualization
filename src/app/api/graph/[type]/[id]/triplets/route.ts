import { NextRequest, NextResponse } from "next/server";
import { Node, Edge, RawTriplet } from "@/lib/types/graph";
import { createTriplets } from "@/lib/utils/graph";
import { ZepClient } from "@getzep/zep-cloud";
import { EntityNode, EntityEdge } from "@getzep/zep-cloud/api";

const supportedResourceTypes = ["user", "group"] as const;
type ResourceType = (typeof supportedResourceTypes)[number];

const transformSDKNode = (node: EntityNode): Node => {
  return {
    uuid: node.uuid,
    name: node.name,
    summary: node.summary,
    labels: node.labels,
    created_at: node.createdAt,
    updated_at: "",
  };
};

const transformSDKEdge = (edge: EntityEdge): Edge => {
  return {
    uuid: edge.uuid,
    source_node_uuid: edge.sourceNodeUuid,
    target_node_uuid: edge.targetNodeUuid,
    type: "",
    name: edge.name,
    fact: edge.fact,
    episodes: edge.episodes,
    created_at: edge.createdAt,
    updated_at: "",
    valid_at: edge.validAt,
    expired_at: edge.expiredAt,
    invalid_at: edge.invalidAt,
  };
};

async function getNodes(
  type: ResourceType,
  id: string,
  zep: ZepClient
): Promise<Node[]> {
  if (type === "user") {
    const nodes = await zep.graph.node.getByUserId(id);
    return nodes.map(transformSDKNode);
  }
  const nodes = await zep.graph.node.getByGroupId(id);
  return nodes.map(transformSDKNode);
}

async function getEdges(type: ResourceType, id: string, zep: ZepClient) {
  if (type === "user") {
    const edges = await zep.graph.edge.getByUserId(id);
    return edges.map(transformSDKEdge);
  }
  const edges = await zep.graph.edge.getByGroupId(id);
  return edges.map(transformSDKEdge);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: ResourceType; id: string }> }
) {
  try {
    const ZEP_API_KEY = process.env.ZEP_API_KEY;

    if (!ZEP_API_KEY) {
      return NextResponse.json(
        { error: "ZEP_API_KEY is not set" },
        { status: 500 }
      );
    }

    const zep = new ZepClient({ apiKey: ZEP_API_KEY });

    const { type, id } = await params;

    if (!supportedResourceTypes.includes(type as ResourceType)) {
      return NextResponse.json(
        { error: "Invalid resource type" },
        { status: 400 }
      );
    }

    // Fetch both nodes and edges
    const [nodes, edges] = await Promise.all([
      getNodes(type, id, zep),
      getEdges(type, id, zep),
    ]);

    if (!nodes || !edges) {
      return NextResponse.json({ triplets: [] });
    }

    // Combine nodes and edges into triplets
    const triplets = createTriplets(edges, nodes);

    return NextResponse.json({ triplets });
  } catch (error) {
    console.error("Error fetching triplets:", error);
    return NextResponse.json(
      { error: "Failed to fetch graph data" },
      { status: 500 }
    );
  }
}
