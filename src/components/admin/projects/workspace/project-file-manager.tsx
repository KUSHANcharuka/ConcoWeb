"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DownloadIcon,
  FileIcon,
  FolderIcon,
  FolderPlusIcon,
  MoveRightIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/kibo-ui/dropzone";
import { Button } from "@/components/ui/button";
import { api } from "~/trpc/react";

type FolderRecord = {
  id: string;
  name: string;
  parentFolderId: string | null;
  visibility: "admin_only" | "client_visible";
};

type FileRecord = {
  id: string;
  folderId: string | null;
  title: string;
  description: string | null;
  visibility: "admin_only" | "client_visible";
  assetId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
};

export function ProjectFileManager({
  projectId,
  mode,
}: {
  projectId: string;
  mode: "admin" | "client-preview";
}) {
  const utils = api.useUtils();
  const filesQuery = api.admin.files.list.useQuery({ projectId });
  const createFolderMutation = api.admin.files.createFolder.useMutation();
  const renameFolderMutation = api.admin.files.renameFolder.useMutation();
  const deleteFolderMutation = api.admin.files.deleteFolder.useMutation();
  const moveFolderMutation = api.admin.files.moveFolder.useMutation();
  const createUploadMutation = api.admin.files.createUpload.useMutation();
  const renameFileMutation = api.admin.files.renameFile.useMutation();
  const deleteFileMutation = api.admin.files.deleteFile.useMutation();
  const moveFileMutation = api.admin.files.moveFile.useMutation();
  const getReadUrlMutation = api.admin.files.getReadUrl.useMutation();

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const folders = (filesQuery.data?.folders ?? []) as FolderRecord[];
  const files = (filesQuery.data?.files ?? []) as FileRecord[];

  useEffect(() => {
    if (selectedFolderId && !folders.find((folder) => folder.id === selectedFolderId)) {
      setSelectedFolderId(null);
    }
  }, [folders, selectedFolderId]);

  const visibleFolders = useMemo(() => {
    if (mode === "admin") return folders;
    return folders.filter((folder) => folder.visibility === "client_visible");
  }, [folders, mode]);

  const visibleFiles = useMemo(() => {
    if (mode === "admin") return files;
    return files.filter((file) => file.visibility === "client_visible");
  }, [files, mode]);

  const currentFiles = visibleFiles.filter((file) => file.folderId === selectedFolderId);
  const childFolders = visibleFolders.filter((folder) => folder.parentFolderId === selectedFolderId);

  async function refresh() {
    await utils.admin.files.list.invalidate({ projectId });
    await utils.admin.projectWorkspace.overview.invalidate({ projectId });
  }

  async function handleFolderCreate() {
    const name = window.prompt("Folder name");
    if (!name?.trim()) return;
    try {
      await createFolderMutation.mutateAsync({
        projectId,
        name: name.trim(),
        parentFolderId: selectedFolderId,
        visibility: "client_visible",
      });
      await refresh();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to create folder.");
    }
  }

  async function handleFolderRename(folder: FolderRecord) {
    const name = window.prompt("Rename folder", folder.name);
    if (!name?.trim()) return;
    try {
      await renameFolderMutation.mutateAsync({
        projectId,
        folderId: folder.id,
        name: name.trim(),
      });
      await refresh();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to rename folder.");
    }
  }

  async function handleFolderMove(folder: FolderRecord) {
    const target = window.prompt(
      "Move folder to parent folder id. Leave empty for root.",
      folder.parentFolderId ?? "",
    );
    const parentFolderId = target?.trim() ? target.trim() : null;
    try {
      await moveFolderMutation.mutateAsync({
        projectId,
        folderId: folder.id,
        parentFolderId,
      });
      await refresh();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to move folder.");
    }
  }

  async function handleFolderDelete(folder: FolderRecord) {
    if (!window.confirm(`Delete "${folder.name}" and its contents?`)) return;
    try {
      await deleteFolderMutation.mutateAsync({
        projectId,
        folderId: folder.id,
      });
      if (selectedFolderId === folder.id) {
        setSelectedFolderId(null);
      }
      await refresh();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to delete folder.");
    }
  }

  async function handleUpload(droppedFiles: File[]) {
    const file = droppedFiles[0];
    if (!file) return;

    setUploadingFiles([file]);
    setUploadError(null);
    try {
      const created = await createUploadMutation.mutateAsync({
        projectId,
        folderId: selectedFolderId,
        fileName: file.name,
        title: file.name,
        description: null,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
        visibility: "client_visible",
      });

      const response = await fetch(created.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Upload failed.");
      }

      setUploadingFiles(undefined);
      await refresh();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed.");
      setUploadingFiles(undefined);
    }
  }

  async function handleFileDownload(file: FileRecord) {
    try {
      const result = await getReadUrlMutation.mutateAsync({
        projectId,
        fileId: file.id,
      });
      window.open(result.url, "_blank", "noopener,noreferrer");
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to open file.");
    }
  }

  async function handleFileRename(file: FileRecord) {
    const title = window.prompt("Rename file", file.title);
    if (!title?.trim()) return;
    try {
      await renameFileMutation.mutateAsync({
        projectId,
        fileId: file.id,
        title: title.trim(),
        description: file.description ?? null,
      });
      await refresh();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to rename file.");
    }
  }

  async function handleFileMove(file: FileRecord) {
    const target = window.prompt(
      "Move file to folder id. Leave empty for root.",
      file.folderId ?? "",
    );
    const folderId = target?.trim() ? target.trim() : null;
    try {
      await moveFileMutation.mutateAsync({
        projectId,
        fileId: file.id,
        folderId,
      });
      await refresh();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to move file.");
    }
  }

  async function handleFileDelete(file: FileRecord) {
    if (!window.confirm(`Delete "${file.title}"?`)) return;
    try {
      await deleteFileMutation.mutateAsync({
        projectId,
        fileId: file.id,
      });
      await refresh();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to delete file.");
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="rounded-[28px] border border-black/5 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Folders</div>
            <div className="mt-1 text-lg font-semibold text-zinc-950">Project tree</div>
          </div>
          {mode === "admin" ? (
            <Button onClick={() => void handleFolderCreate()} size="sm" type="button" variant="outline">
              <FolderPlusIcon className="size-4" />
            </Button>
          ) : null}
        </div>

        <button
          className={`mt-5 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm ${
            selectedFolderId === null
              ? "bg-zinc-950 text-white"
              : "text-zinc-700 hover:bg-zinc-100"
          }`}
          onClick={() => setSelectedFolderId(null)}
          type="button"
        >
          <FolderIcon className="size-4" />
          Root
        </button>

        <div className="mt-2 space-y-1">
          {visibleFolders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-black/10 px-3 py-4 text-sm text-zinc-500">
              No folders yet
            </div>
          ) : (
            visibleFolders.map((folder) => (
              <div
                className={`rounded-xl border px-3 py-2 ${
                  selectedFolderId === folder.id
                    ? "border-zinc-950 bg-zinc-950 text-white"
                    : "border-transparent bg-zinc-50 text-zinc-700"
                }`}
                key={folder.id}
              >
                <button
                  className="flex w-full items-center gap-2 text-left text-sm"
                  onClick={() => setSelectedFolderId(folder.id)}
                  type="button"
                >
                  <FolderIcon className="size-4" />
                  <span className="flex-1 truncate">{folder.name}</span>
                </button>
                {mode === "admin" && selectedFolderId === folder.id ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <IconActionButton icon={<PencilIcon className="size-3.5" />} onClick={() => void handleFolderRename(folder)} />
                    <IconActionButton icon={<MoveRightIcon className="size-3.5" />} onClick={() => void handleFolderMove(folder)} />
                    <IconActionButton icon={<Trash2Icon className="size-3.5" />} onClick={() => void handleFolderDelete(folder)} />
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </aside>

      <section className="space-y-5">
        {mode === "admin" ? (
          <Dropzone
            accept={{ "*/*": [] }}
            className="min-h-[160px] rounded-[28px] border-dashed bg-white"
            maxFiles={1}
            maxSize={100 * 1024 * 1024}
            onDrop={(droppedFiles) => void handleUpload(droppedFiles)}
            src={uploadingFiles}
          >
            {uploadingFiles ? <DropzoneContent /> : <DropzoneEmptyState />}
          </Dropzone>
        ) : null}

        {uploadError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {uploadError}
          </div>
        ) : null}

        {actionError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </div>
        ) : null}

        <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                {selectedFolderId ? "Current folder" : "Project root"}
              </div>
              <div className="mt-1 text-xl font-semibold text-zinc-950">
                {selectedFolderId
                  ? visibleFolders.find((folder) => folder.id === selectedFolderId)?.name
                  : "Root"}
              </div>
            </div>
            <div className="text-sm text-zinc-500">
              {childFolders.length} folders • {currentFiles.length} files
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {childFolders.length === 0 && currentFiles.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-black/10 px-4 py-8 text-sm text-zinc-500">
                {selectedFolderId
                  ? "This folder is empty."
                  : "The project root is empty. Add a folder or upload the first file."}
              </div>
            ) : null}

            {childFolders.map((folder) => (
              <div
                className="flex items-center gap-3 rounded-2xl border border-black/5 bg-[#faf8f4] px-4 py-3"
                key={folder.id}
              >
                <FolderIcon className="size-4 text-zinc-500" />
                <button
                  className="flex-1 text-left text-sm font-medium text-zinc-900"
                  onClick={() => setSelectedFolderId(folder.id)}
                  type="button"
                >
                  {folder.name}
                </button>
                <span className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                  folder
                </span>
              </div>
            ))}

            {currentFiles.map((file) => (
              <div
                className="flex items-center gap-3 rounded-2xl border border-black/5 px-4 py-3"
                key={file.id}
              >
                <FileIcon className="size-4 text-zinc-500" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-zinc-950">{file.title}</div>
                  <div className="truncate text-xs text-zinc-500">
                    {file.fileName} • {formatBytes(file.sizeBytes)}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button onClick={() => void handleFileDownload(file)} size="sm" type="button" variant="outline">
                    <DownloadIcon className="size-4" />
                  </Button>
                  {mode === "admin" ? (
                    <>
                      <Button onClick={() => void handleFileRename(file)} size="sm" type="button" variant="outline">
                        <PencilIcon className="size-4" />
                      </Button>
                      <Button onClick={() => void handleFileMove(file)} size="sm" type="button" variant="outline">
                        <MoveRightIcon className="size-4" />
                      </Button>
                      <Button onClick={() => void handleFileDelete(file)} size="sm" type="button" variant="outline">
                        <Trash2Icon className="size-4" />
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function formatBytes(bytes: number) {
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function IconActionButton({
  icon,
  onClick,
}: {
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className="rounded-full border border-white/10 p-1.5 text-inherit hover:bg-white/10"
      onClick={onClick}
      type="button"
    >
      {icon}
    </button>
  );
}
