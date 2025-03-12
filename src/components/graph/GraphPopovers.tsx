"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { NodePopupContent, EdgePopupContent } from "@/lib/types/graph";
import dayjs from "dayjs";

interface GraphPopoversProps {
  showNodePopup: boolean;
  showEdgePopup: boolean;
  nodePopupContent: NodePopupContent | null;
  edgePopupContent: EdgePopupContent | null;
  onOpenChange?: (open: boolean) => void;
}

export function GraphPopovers({
  showNodePopup,
  showEdgePopup,
  nodePopupContent,
  edgePopupContent,
  onOpenChange,
}: GraphPopoversProps) {
  return (
    <>
      <Popover open={showNodePopup} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <div className="fixed top-0 right-0 pointer-events-none" />
        </PopoverTrigger>
        <PopoverContent
          className="w-80"
          side="right"
          align="end"
          sideOffset={20}
        >
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Node Details</h4>
            <div>
              <p className="text-sm text-muted-foreground break-all">
                <span className="text-sm text-black font-medium dark:text-white">
                  Name:
                </span>
                {nodePopupContent?.node.name || "Unknown"}
              </p>
              <p className="text-sm text-muted-foreground break-words">
                <span className="text-sm text-black font-medium dark:text-white">
                  UUID:
                </span>
                {nodePopupContent?.node.uuid || "Unknown"}
              </p>
              <p className="text-sm text-muted-foreground break-words">
                <span className="text-sm text-black font-medium dark:text-white">
                  Created:
                </span>
                {dayjs(nodePopupContent?.node.created_at).format("MMM D, YYYY")}
              </p>
              {nodePopupContent?.node.summary && (
                <p className="text-sm text-muted-foreground mt-1 break-words">
                  <span className="text-sm text-black font-medium dark:text-white">
                    Summary:
                  </span>
                  {nodePopupContent.node.summary}
                </p>
              )}
              {nodePopupContent?.node.labels?.length ? (
                <div>
                  <p className="text-sm font-medium text-black dark:text-white">
                    Labels:
                  </p>
                  <div className="flex gap-2 mt-1">
                    {nodePopupContent.node.labels.map((label) => (
                      <span
                        key={label}
                        className="text-xs bg-muted px-2 py-1 rounded-md"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover open={showEdgePopup} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <div className="fixed top-0 right-0 pointer-events-none" />
        </PopoverTrigger>
        <PopoverContent
          className="w-80"
          side="right"
          align="end"
          sideOffset={20}
        >
          <div className="mb-4 p-2 bg-muted rounded-md">
            <p className="text-sm break-all">
              {edgePopupContent?.source.name || "Unknown"} →{" "}
              <span className="font-medium">
                {edgePopupContent?.relation.name || "Unknown"}
              </span>{" "}
              → {edgePopupContent?.target.name || "Unknown"}
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Relationship</h4>
            <div className="grid gap-2">
              <p className="text-sm text-muted-foreground break-all">
                <span className="text-sm font-medium text-black dark:text-white">
                  UUID:
                </span>
                {edgePopupContent?.relation.uuid || "Unknown"}
              </p>
              <p className="text-sm text-muted-foreground break-all">
                <span className="text-sm font-medium text-black dark:text-white">
                  Type:
                </span>
                {edgePopupContent?.relation.name || "Unknown"}
              </p>
              {edgePopupContent?.relation.fact && (
                <p className="text-sm text-muted-foreground break-all">
                  <span className="text-sm font-medium text-black dark:text-white">
                    Fact:
                  </span>
                  {edgePopupContent.relation.fact}
                </p>
              )}
              {edgePopupContent?.relation.episodes?.length ? (
                <div>
                  <p className="text-sm font-medium text-black dark:text-white">
                    Episodes:
                  </p>
                  <div className="flex gap-2 mt-1">
                    {edgePopupContent.relation.episodes.map((episode) => (
                      <span
                        key={episode}
                        className="text-xs bg-muted px-2 py-1 rounded-md"
                      >
                        {episode}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              <p className="text-sm text-muted-foreground break-all">
                <span className="text-sm font-medium text-black dark:text-white">
                  Created:
                </span>
                {dayjs(edgePopupContent?.relation.created_at).format(
                  "MMM D, YYYY"
                )}
              </p>
              {edgePopupContent?.relation.valid_at && (
                <p className="text-sm text-muted-foreground break-all">
                  <span className="text-sm font-medium text-black dark:text-white">
                    Valid From:
                  </span>
                  {dayjs(edgePopupContent.relation.valid_at).format(
                    "MMM D, YYYY"
                  )}
                </p>
              )}
              {edgePopupContent?.relation.expired_at && (
                <p className="text-sm text-muted-foreground break-all">
                  <span className="text-sm font-medium text-black dark:text-white">
                    Expired At:
                  </span>
                  {dayjs(edgePopupContent.relation.expired_at).format(
                    "MMM D, YYYY"
                  )}
                </p>
              )}
              {edgePopupContent?.relation.invalid_at && (
                <p className="text-sm text-muted-foreground break-all">
                  <span className="text-sm font-medium text-black dark:text-white">
                    Invalid At:
                  </span>
                  {dayjs(edgePopupContent.relation.invalid_at).format(
                    "MMM D, YYYY"
                  )}
                </p>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
