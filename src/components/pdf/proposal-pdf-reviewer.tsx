"use client";

import { SpecialZoomLevel, Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import {
  type HighlightArea,
  type RenderHighlightContentProps,
  type RenderHighlightTargetProps,
  Trigger,
  highlightPlugin,
} from "@react-pdf-viewer/highlight";
import { HighlighterIcon, MessageSquarePlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const PDF_WORKER_URL = "https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js";

type ProposalCommentRecord = {
  id: string;
  body: string;
  anchorJson: unknown;
};

function readHighlightAreas(anchorJson: unknown): HighlightArea[] {
  if (!anchorJson || typeof anchorJson !== "object") return [];

  const rawAreas = (anchorJson as Record<string, unknown>).highlightAreas;
  if (!Array.isArray(rawAreas)) return [];

  return rawAreas.flatMap((area) => {
    if (!area || typeof area !== "object") return [];
    const record = area as Record<string, unknown>;
    if (
      typeof record.height !== "number" ||
      typeof record.left !== "number" ||
      typeof record.pageIndex !== "number" ||
      typeof record.top !== "number" ||
      typeof record.width !== "number"
    ) {
      return [];
    }

    return [
      {
        height: record.height,
        left: record.left,
        pageIndex: record.pageIndex,
        top: record.top,
        width: record.width,
      },
    ];
  });
}

export function ProposalPdfReviewer({
  comments,
  fileUrl,
  onCreateComment,
  readOnly,
}: {
  comments: ProposalCommentRecord[];
  fileUrl: string | null;
  onCreateComment?: (input: {
    anchorJson: Record<string, unknown>;
    body: string;
    pageNumber: number;
    selectedText: string;
  }) => Promise<void>;
  readOnly?: boolean;
}) {
  const [draftBody, setDraftBody] = useState("");
  const [saving, setSaving] = useState(false);

  const defaultLayout = defaultLayoutPlugin();
  const highlight = highlightPlugin({
        renderHighlightTarget: (props: RenderHighlightTargetProps) =>
          readOnly || !onCreateComment ? <></> : (
            <div
              style={{
                left: `${props.selectionRegion.left}%`,
                top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
              }}
              className="absolute z-20 -translate-y-1/2"
            >
              <Button
                className="h-8 rounded-full px-3 shadow-sm"
                onClick={props.toggle}
                size="sm"
                type="button"
              >
                <MessageSquarePlusIcon className="size-4" />
                Comment
              </Button>
            </div>
          ),
        renderHighlightContent: (props: RenderHighlightContentProps) => {
          if (readOnly || !onCreateComment) return <></>;

          return (
            <div
              style={{
                left: `${props.selectionRegion.left}%`,
                top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
              }}
              className="absolute z-30 mt-2 w-80 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl"
            >
              <div className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                Highlighted excerpt
              </div>
              <div className="mt-2 max-h-24 overflow-auto rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
                {props.selectedText}
              </div>
              <Textarea
                className="mt-3"
                onChange={(event) => setDraftBody(event.target.value)}
                placeholder="Add the requested change or feedback for this selection"
                rows={4}
                value={draftBody}
              />
              <div className="mt-3 flex justify-end gap-2">
                <Button
                  onClick={() => {
                    setDraftBody("");
                    props.cancel();
                  }}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  disabled={saving || !draftBody.trim()}
                  onClick={async () => {
                    if (!draftBody.trim()) return;

                    setSaving(true);
                    try {
                      await onCreateComment({
                        anchorJson: {
                          highlightAreas: props.highlightAreas,
                          selectionData: props.selectionData ?? null,
                          selectedText: props.selectedText,
                        },
                        body: draftBody.trim(),
                        pageNumber: props.selectionRegion.pageIndex + 1,
                        selectedText: props.selectedText,
                      });
                      setDraftBody("");
                      props.cancel();
                    } finally {
                      setSaving(false);
                    }
                  }}
                  size="sm"
                  type="button"
                >
                  Save comment
                </Button>
              </div>
            </div>
          );
        },
        renderHighlights: (props) => (
          <>
            {comments.flatMap((comment) =>
              readHighlightAreas(comment.anchorJson)
                .filter((area) => area.pageIndex === props.pageIndex)
                .map((area, index) => (
                  <div
                    className="group absolute cursor-pointer rounded-sm bg-amber-300/40 ring-1 ring-amber-400/40 transition hover:bg-amber-300/60"
                    key={`${comment.id}-${index}`}
                    style={props.getCssProperties(area, props.rotation)}
                    title={comment.body}
                  >
                    <div className="absolute -top-2 left-0 hidden rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-medium text-white group-hover:block">
                      <HighlighterIcon className="mr-1 inline size-3" />
                      Comment
                    </div>
                  </div>
                )),
            )}
          </>
        ),
        trigger: readOnly ? Trigger.None : Trigger.TextSelection,
      });

  if (!fileUrl) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-sm text-zinc-500">
        Upload a proposal PDF to preview and review it inline.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <Worker workerUrl={PDF_WORKER_URL}>
        <div className="h-[78vh] min-h-[720px]">
          <Viewer
            defaultScale={SpecialZoomLevel.PageFit}
            fileUrl={fileUrl}
            plugins={[defaultLayout, highlight]}
          />
        </div>
      </Worker>
    </div>
  );
}
