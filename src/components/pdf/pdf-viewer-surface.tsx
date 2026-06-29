"use client";

import { SpecialZoomLevel, Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { FileTextIcon } from "lucide-react";

const PDF_WORKER_URL = "https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js";

export function PdfViewerSurface({
  fileUrl,
  title,
}: {
  fileUrl: string | null;
  title: string;
}) {
  const defaultLayout = defaultLayoutPlugin();

  if (!fileUrl) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-sm text-zinc-500">
        <div className="flex items-center gap-2 text-zinc-600">
          <FileTextIcon className="size-4" />
          PDF preview unavailable
        </div>
        <p className="mt-3 leading-6">
          Upload a PDF to preview it inline in this workspace.
        </p>
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
            plugins={[defaultLayout]}
            renderError={(error) => (
              <div className="flex h-full items-center justify-center px-6 text-sm text-red-600">
                Failed to load {title}: {error.message}
              </div>
            )}
          />
        </div>
      </Worker>
    </div>
  );
}
