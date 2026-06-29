"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, FC, KeyboardEvent, ReactNode } from "react";
import {
  ChevronRightIcon,
  DownloadIcon,
  FileIcon,
  FolderIcon,
  FolderPlusIcon,
  LoaderCircleIcon,
  UploadIcon,
} from "lucide-react";
import {
  DropPosition,
  LazyTreeView,
  type BaseNodeProps,
  type BranchNode,
  type BranchProps,
  type DropData,
  type LazyTreeViewHandle,
  type TreeNode,
} from "lazy-tree-view";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadWithProgress } from "~/lib/upload-with-progress";
import { useUploadProgress } from "~/components/upload/upload-progress-provider";
import { api } from "~/trpc/react";

const ROOT_NODE_ID = "project-root";

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

type DeleteTarget =
  | { kind: "folder"; id: string; name: string }
  | { kind: "file"; id: string; name: string };

type RenameState =
  | {
      kind: "folder";
      id: string;
      value: string;
      original: string;
    }
  | {
      kind: "file";
      id: string;
      value: string;
      original: string;
    };

type TreeMeta = {
  kind: "root" | "folder" | "file";
  folderId?: string | null;
  fileId?: string;
  recordName?: string;
};

type TreeNodeWithMeta = TreeNode<TreeMeta>;
type BranchNodeWithMeta = BranchNode<TreeMeta>;

type TreeSharedProps = {
  mode: "admin" | "client-preview" | "client";
  activeNodeId: string;
  renameState: RenameState | null;
  treeMutationPending: boolean;
  onSelectRoot: () => void;
  onSelectFolder: (folderId: string) => void;
  onOpenFile: (fileId: string) => void;
  onBeginRename: (node: TreeMeta) => void;
  onRenameValueChange: (value: string) => void;
  onRenameKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onRenameBlur: () => void;
  onRequestDelete: (node: TreeMeta) => void;
};

export function ProjectFileManager({
  projectId,
  mode,
}: {
  projectId: string;
  mode: "admin" | "client-preview" | "client";
}) {
  const utils = api.useUtils();
  const uploadProgress = useUploadProgress();
  const filesQuery = api.admin.files.list.useQuery(
    { projectId },
    { enabled: mode !== "client" },
  );
  const clientFilesQuery = api.clientPortal.files.list.useQuery(
    { projectId },
    { enabled: mode === "client" },
  );
  const createFolderMutation = api.admin.files.createFolder.useMutation();
  const renameFolderMutation = api.admin.files.renameFolder.useMutation();
  const deleteFolderMutation = api.admin.files.deleteFolder.useMutation();
  const moveFolderMutation = api.admin.files.moveFolder.useMutation();
  const prepareUploadMutation = api.admin.files.prepareUpload.useMutation();
  const finalizeUploadMutation = api.admin.files.finalizeUpload.useMutation();
  const renameFileMutation = api.admin.files.renameFile.useMutation();
  const deleteFileMutation = api.admin.files.deleteFile.useMutation();
  const moveFileMutation = api.admin.files.moveFile.useMutation();
  const getReadUrlMutation = api.admin.files.getReadUrl.useMutation();
  const clientGetReadUrlMutation = api.clientPortal.files.getReadUrl.useMutation();

  const treeRef = useRef<LazyTreeViewHandle | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [activeNodeId, setActiveNodeId] = useState(ROOT_NODE_ID);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [renameState, setRenameState] = useState<RenameState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [treeMutationPending, setTreeMutationPending] = useState(false);

  const activeFilesQuery = mode === "client" ? clientFilesQuery : filesQuery;
  const folders = (activeFilesQuery.data?.folders ?? []) as FolderRecord[];
  const files = (activeFilesQuery.data?.files ?? []) as FileRecord[];

  const visibleFolders = useMemo(() => {
    if (mode === "admin") return folders;
    return folders.filter((folder) => folder.visibility === "client_visible");
  }, [folders, mode]);

  const visibleFiles = useMemo(() => {
    if (mode === "admin") return files;
    return files.filter((file) => file.visibility === "client_visible");
  }, [files, mode]);

  const folderById = useMemo(
    () => new Map(visibleFolders.map((folder) => [folder.id, folder])),
    [visibleFolders],
  );

  const fileById = useMemo(
    () => new Map(visibleFiles.map((file) => [file.id, file])),
    [visibleFiles],
  );

  const treeData = useMemo(
    () => buildProjectTree(visibleFolders, visibleFiles),
    [visibleFiles, visibleFolders],
  );
  const fileUploadPending =
    prepareUploadMutation.isPending || finalizeUploadMutation.isPending;

  const currentFiles = visibleFiles.filter((file) => file.folderId === selectedFolderId);
  const childFolders = visibleFolders.filter((folder) => folder.parentFolderId === selectedFolderId);

  useEffect(() => {
    if (selectedFolderId && !folderById.has(selectedFolderId)) {
      setSelectedFolderId(null);
      setActiveNodeId(ROOT_NODE_ID);
    }
  }, [folderById, selectedFolderId]);

  useEffect(() => {
    if (!renameState) return;
    if (renameState.kind === "folder" && !folderById.has(renameState.id)) {
      setRenameState(null);
    }
    if (renameState.kind === "file" && !fileById.has(renameState.id)) {
      setRenameState(null);
    }
  }, [fileById, folderById, renameState]);

  useEffect(() => {
    treeRef.current?.setTree(treeData);
  }, [treeData]);

  async function refresh() {
    if (mode === "client") return;
    await utils.admin.files.list.invalidate({ projectId });
    await utils.admin.projectWorkspace.overview.invalidate({ projectId });
  }

  function syncTreeToServerState() {
    treeRef.current?.setTree(treeData);
  }

  function resetErrors() {
    setUploadError(null);
    setActionError(null);
  }

  async function handleFolderCreate() {
    const name = folderName.trim();
    if (!name) return;
    resetErrors();

    try {
      await createFolderMutation.mutateAsync({
        projectId,
        name,
        parentFolderId: selectedFolderId,
        visibility: "client_visible",
      });
      setFolderName("");
      setCreateFolderOpen(false);
      await refresh();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to create folder.");
    }
  }

  function beginRename(node: TreeMeta) {
    if (mode !== "admin" || node.kind === "root") return;

    if (node.kind === "folder" && node.folderId) {
      const folder = folderById.get(node.folderId);
      if (!folder) return;
      setActiveNodeId(folder.id);
      setRenameState({
        kind: "folder",
        id: folder.id,
        value: folder.name,
        original: folder.name,
      });
      return;
    }

    if (node.kind === "file" && node.fileId) {
      const file = fileById.get(node.fileId);
      if (!file) return;
      setActiveNodeId(file.id);
      setRenameState({
        kind: "file",
        id: file.id,
        value: file.title,
        original: file.title,
      });
    }
  }

  function cancelRename() {
    setRenameState(null);
  }

  async function commitRename() {
    if (!renameState) return;
    const value = renameState.value.trim();

    if (!value || value === renameState.original) {
      setRenameState(null);
      return;
    }

    resetErrors();
    setTreeMutationPending(true);

    try {
      if (renameState.kind === "folder") {
        await renameFolderMutation.mutateAsync({
          projectId,
          folderId: renameState.id,
          name: value,
        });
      } else {
        const file = fileById.get(renameState.id);
        if (!file) {
          setRenameState(null);
          return;
        }

        await renameFileMutation.mutateAsync({
          projectId,
          fileId: renameState.id,
          title: value,
          description: file.description ?? null,
        });
      }

      setRenameState(null);
      await refresh();
    } catch (error) {
      syncTreeToServerState();
      setActionError(error instanceof Error ? error.message : "Failed to rename item.");
    } finally {
      setTreeMutationPending(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    resetErrors();
    setTreeMutationPending(true);

    try {
      if (deleteTarget.kind === "folder") {
        await deleteFolderMutation.mutateAsync({
          projectId,
          folderId: deleteTarget.id,
        });
        if (selectedFolderId === deleteTarget.id) {
          setSelectedFolderId(null);
          setActiveNodeId(ROOT_NODE_ID);
        }
      } else {
        await deleteFileMutation.mutateAsync({
          projectId,
          fileId: deleteTarget.id,
        });
      }

      setDeleteTarget(null);
      await refresh();
    } catch (error) {
      syncTreeToServerState();
      setActionError(error instanceof Error ? error.message : "Failed to delete item.");
    } finally {
      setTreeMutationPending(false);
    }
  }

  async function handleUpload(uploadedFiles: File[]) {
    const file = uploadedFiles[0];
    if (!file) return;

    setUploadError(null);
    setActionError(null);

    const tracker = uploadProgress.startUpload({ label: file.name });
    try {
      const prepared = await prepareUploadMutation.mutateAsync({
        projectId,
        folderId: selectedFolderId,
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
      });

      await uploadWithProgress({
        url: prepared.uploadUrl,
        file,
        contentType: file.type || "application/octet-stream",
        onProgress: tracker.update,
      });

      await finalizeUploadMutation.mutateAsync({
        projectId,
        assetId: prepared.assetId,
        folderId: selectedFolderId,
        fileName: file.name,
        title: file.name,
        description: null,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
        visibility: "client_visible",
      });

      tracker.succeed("File uploaded");
      await refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed.";
      tracker.fail(message);
      setUploadError(message);
    }
  }

  function handleUploadButtonClick() {
    fileInputRef.current?.click();
  }

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (selectedFiles.length > 0) {
      void handleUpload(selectedFiles);
    }
    event.target.value = "";
  }

  async function openFile(fileId: string) {
    const file = fileById.get(fileId);
    if (!file) return;

    setActiveNodeId(file.id);
    setActionError(null);

    try {
      const result =
        mode === "client"
          ? await clientGetReadUrlMutation.mutateAsync({
              projectId,
              fileId,
            })
          : await getReadUrlMutation.mutateAsync({
              projectId,
              fileId,
            });
      window.open(result.url, "_blank", "noopener,noreferrer");
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to open file.");
    }
  }

  function selectRoot() {
    cancelRename();
    setSelectedFolderId(null);
    setActiveNodeId(ROOT_NODE_ID);
  }

  function selectFolder(folderId: string) {
    cancelRename();
    setSelectedFolderId(folderId);
    setActiveNodeId(folderId);
  }

  async function handleTreeDrop(data: DropData) {
    if (mode !== "admin") return;

    const source = data.source as TreeNodeWithMeta;
    const nextParent = resolveTargetParentId(data, ROOT_NODE_ID);

    if (source.kind === "folder") {
      const folderId = source.folderId;
      if (!folderId) return;
      await moveFolderMutation.mutateAsync({
        projectId,
        folderId,
        parentFolderId: nextParent,
      });
      return;
    }

    if (source.kind === "file") {
      const fileId = source.fileId;
      if (!fileId) return;
      await moveFileMutation.mutateAsync({
        projectId,
        fileId,
        folderId: nextParent,
      });
    }
  }

  function canDrop(data: DropData) {
    if (mode !== "admin") return false;

    const source = data.source as TreeNodeWithMeta;
    const target = data.target as TreeNodeWithMeta;

    if (source.kind === "root") return false;
    if (target.kind === "root" && data.position !== DropPosition.Inside) return false;
    if (data.position === DropPosition.Inside && target.kind === "file") return false;

    if (source.kind === "folder" && source.folderId) {
      if (target.kind === "folder" && target.folderId === source.folderId) {
        return false;
      }

      const nextParentId = resolveTargetParentId(data, ROOT_NODE_ID);
      if (nextParentId === source.folderId) return false;

      if (nextParentId && isDescendantFolder(nextParentId, source.folderId, folderById)) {
        return false;
      }
    }

    return true;
  }

  const treeSharedProps: TreeSharedProps = {
    mode,
    activeNodeId,
    renameState,
    treeMutationPending,
    onSelectRoot: selectRoot,
    onSelectFolder: selectFolder,
    onOpenFile: (fileId) => void openFile(fileId),
    onBeginRename: beginRename,
    onRenameValueChange: (value) =>
      setRenameState((current) => (current ? { ...current, value } : current)),
    onRenameKeyDown: (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        void commitRename();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        cancelRename();
      }
    },
    onRenameBlur: () => {
      void commitRename();
    },
    onRequestDelete: (node) => {
      if (mode !== "admin" || node.kind === "root") return;
      if (node.kind === "folder" && node.folderId) {
        const folder = folderById.get(node.folderId);
        if (!folder) return;
        setDeleteTarget({ kind: "folder", id: folder.id, name: folder.name });
      }
      if (node.kind === "file" && node.fileId) {
        const file = fileById.get(node.fileId);
        if (!file) return;
        setDeleteTarget({ kind: "file", id: file.id, name: file.title });
      }
    },
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="border border-black/5 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Folders</div>
            <div className="mt-1 text-lg font-semibold text-zinc-950">Project tree</div>
          </div>
          {mode === "admin" ? (
            <Button
              onClick={() => {
                setFolderName("");
                setCreateFolderOpen(true);
              }}
              size="sm"
              type="button"
              variant="outline"
            >
              <FolderPlusIcon className="size-4" />
            </Button>
          ) : null}
        </div>

        <div className="mt-5 border border-black/5 bg-[#faf8f4] p-2">
          <LazyTreeView
            allowDragAndDrop={mode === "admin" && !treeMutationPending}
            branch={FolderBranchNode as unknown as FC<BranchProps>}
            branchProps={treeSharedProps}
            canDrop={canDrop}
            className="project-file-tree"
            disableAnimations
            initialTree={treeData}
            item={FileLeafNode as unknown as FC<BaseNodeProps>}
            itemProps={treeSharedProps}
            loadChildren={async (branch) => branch.children}
            onDrop={(data) => {
              setRenameState(null);
              setTreeMutationPending(true);
              void handleTreeDrop(data)
                .then(refresh)
                .catch((error) => {
                  syncTreeToServerState();
                  setActionError(error instanceof Error ? error.message : "Failed to move item.");
                })
                .finally(() => {
                  setTreeMutationPending(false);
                });
            }}
            ref={treeRef}
            style={
              {
                "--tree-item-indentation": "14px",
              } as CSSProperties
            }
            useDragHandle={false}
          />
        </div>
      </aside>

      <section className="space-y-5">
        {uploadError ? (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {uploadError}
          </div>
        ) : null}

        {actionError ? (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </div>
        ) : null}

        <div className="border border-black/5 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                {selectedFolderId ? "Current folder" : "Project root"}
              </div>
              <div className="mt-1 text-xl font-semibold text-zinc-950">
                {selectedFolderId ? folderById.get(selectedFolderId)?.name ?? "Folder" : "Root"}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-zinc-500">
                {childFolders.length} folders • {currentFiles.length} files
              </div>
              {mode === "admin" ? (
                <>
                  <input
                    accept="*/*"
                    className="hidden"
                    onChange={handleFileInputChange}
                    ref={fileInputRef}
                    type="file"
                  />
                  <Button
                    disabled={fileUploadPending}
                    onClick={handleUploadButtonClick}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <UploadIcon className="size-4" />
                    {fileUploadPending ? "Uploading..." : "Upload file"}
                  </Button>
                </>
              ) : null}
            </div>
          </div>

          <div className="mt-6 space-y-2">
            {childFolders.length === 0 && currentFiles.length === 0 ? (
              <div className="border border-dashed border-black/10 px-4 py-8 text-sm text-zinc-500">
                {selectedFolderId
                  ? "This folder is empty."
                  : "The project root is empty. Add a folder or upload the first file."}
              </div>
            ) : null}

            {childFolders.map((folder) => (
              <ExplorerRow
                active={activeNodeId === folder.id}
                editingValue={
                  renameState?.kind === "folder" && renameState.id === folder.id
                    ? renameState.value
                    : null
                }
                key={folder.id}
                label={folder.name}
                meta={`folder${folder.visibility === "admin_only" ? " • admin only" : ""}`}
                onClick={() => selectFolder(folder.id)}
                onDelete={
                  mode === "admin"
                    ? () => setDeleteTarget({ kind: "folder", id: folder.id, name: folder.name })
                    : undefined
                }
                onEditBlur={() => void commitRename()}
                onEditChange={(value) =>
                  setRenameState((current) => (current ? { ...current, value } : current))
                }
                onEditKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void commitRename();
                  }
                  if (event.key === "Escape") {
                    event.preventDefault();
                    cancelRename();
                  }
                }}
                onRename={
                  mode === "admin"
                    ? () => beginRename({ kind: "folder", folderId: folder.id })
                    : undefined
                }
                startIcon={<FolderIcon className="size-4 text-zinc-500" />}
                type="folder"
              />
            ))}

            {currentFiles.map((file) => (
              <ExplorerRow
                active={activeNodeId === file.id}
                editingValue={
                  renameState?.kind === "file" && renameState.id === file.id
                    ? renameState.value
                    : null
                }
                key={file.id}
                label={file.title}
                meta={`${file.fileName} • ${formatBytes(file.sizeBytes)}`}
                onClick={() => void openFile(file.id)}
                onDelete={
                  mode === "admin"
                    ? () => setDeleteTarget({ kind: "file", id: file.id, name: file.title })
                    : undefined
                }
                onEditBlur={() => void commitRename()}
                onEditChange={(value) =>
                  setRenameState((current) => (current ? { ...current, value } : current))
                }
                onEditKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void commitRename();
                  }
                  if (event.key === "Escape") {
                    event.preventDefault();
                    cancelRename();
                  }
                }}
                onRename={
                  mode === "admin"
                    ? () => beginRename({ kind: "file", fileId: file.id })
                    : undefined
                }
                startIcon={<FileIcon className="size-4 text-zinc-500" />}
                type="file"
              />
            ))}
          </div>
        </div>
      </section>

      <Dialog
        onOpenChange={(open) => {
          setCreateFolderOpen(open);
          if (!open) {
            setFolderName("");
          }
        }}
        open={createFolderOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create folder</DialogTitle>
            <DialogDescription>
              Add a new folder inside {selectedFolderId ? "the current folder" : "the project root"}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="new-folder-name">Folder name</Label>
            <Input
              autoFocus
              id="new-folder-name"
              onChange={(event) => setFolderName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void handleFolderCreate();
                }
              }}
              placeholder="Contracts, Assets, Approvals..."
              value={folderName}
            />
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                setCreateFolderOpen(false);
                setFolderName("");
              }}
              type="button"
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              disabled={!folderName.trim() || createFolderMutation.isPending}
              onClick={() => void handleFolderCreate()}
              type="button"
            >
              Create folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog onOpenChange={(open) => !open && setDeleteTarget(null)} open={Boolean(deleteTarget)}>
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.kind === "folder" ? "folder" : "file"}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.kind === "folder"
                ? `Delete "${deleteTarget.name}" and everything inside it. This cannot be undone.`
                : `Delete "${deleteTarget?.name}". This cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-none bg-black text-white hover:bg-black/90"
              onClick={() => void confirmDelete()}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function buildProjectTree(folders: FolderRecord[], files: FileRecord[]): TreeNodeWithMeta[] {
  const children = buildChildren(null, folders, files);

  return [
    {
      id: ROOT_NODE_ID,
      name: "Root",
      kind: "root",
      children,
      isOpen: true,
      hasFetched: true,
    },
  ];
}

function buildChildren(
  parentFolderId: string | null,
  folders: FolderRecord[],
  files: FileRecord[],
): TreeNodeWithMeta[] {
  const nextFolders = folders
    .filter((folder) => folder.parentFolderId === parentFolderId)
    .sort((left, right) => left.name.localeCompare(right.name))
    .map<TreeNodeWithMeta>((folder) => ({
      id: folder.id,
      name: folder.name,
      kind: "folder",
      folderId: folder.id,
      recordName: folder.name,
      children: buildChildren(folder.id, folders, files),
      hasFetched: true,
    }));

  const nextFiles = files
    .filter((file) => file.folderId === parentFolderId)
    .sort((left, right) => left.title.localeCompare(right.title))
    .map<TreeNodeWithMeta>((file) => ({
      id: file.id,
      name: file.title,
      kind: "file",
      fileId: file.id,
      folderId: file.folderId,
      recordName: file.title,
    }));

  return [...nextFolders, ...nextFiles];
}

function isDescendantFolder(
  folderId: string,
  ancestorId: string,
  folderById: Map<string, FolderRecord>,
) {
  let current = folderById.get(folderId) ?? null;

  while (current?.parentFolderId) {
    if (current.parentFolderId === ancestorId) return true;
    current = folderById.get(current.parentFolderId) ?? null;
  }

  return false;
}

function resolveTargetParentId(data: DropData, rootId: string) {
  const target = data.target as TreeNodeWithMeta;

  if (data.position === DropPosition.Inside) {
    if (target.kind === "root") return null;
    return target.kind === "folder" ? target.folderId ?? null : null;
  }

  const nextParent = data.nextParent as TreeNodeWithMeta | null;
  if (!nextParent || nextParent.id === rootId || nextParent.kind === "root") {
    return null;
  }

  return nextParent.kind === "folder" ? nextParent.folderId ?? null : null;
}

function FolderBranchNode(rawProps: BranchProps<object> & TreeSharedProps) {
  const props = rawProps as BranchProps<TreeMeta> & TreeSharedProps;
  const isRenaming =
    props.renameState?.kind === "folder" && props.renameState.id === props.folderId;
  const isRoot = props.kind === "root";
  const isActive = props.activeNodeId === props.id;
  const isAdmin = props.mode === "admin";

  const triggerSelect = () => {
    if (isRoot) {
      props.onSelectRoot();
      return;
    }
    if (props.folderId) {
      props.onSelectFolder(props.folderId);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className={`flex min-h-10 items-center gap-2 border px-2 py-2 text-sm ${
            isActive ? "border-zinc-300 bg-zinc-100 text-zinc-950" : "border-transparent text-zinc-700 hover:bg-white"
          }`}
        >
          {!isRoot ? (
            <button
              className="flex size-7 items-center justify-center text-zinc-400 hover:text-zinc-700"
              onClick={props.onToggleOpen}
              type="button"
            >
              <ChevronRightIcon
                className={`size-4 transition-transform ${props.isOpen ? "rotate-90" : ""}`}
              />
            </button>
          ) : (
            <div className="flex size-7 items-center justify-center text-zinc-400">
              <FolderIcon className="size-4" />
            </div>
          )}

          <button
            className="min-w-0 flex-1 text-left"
            onClick={triggerSelect}
            type="button"
          >
            {!isRenaming ? (
              <span className="truncate font-medium">{props.name}</span>
            ) : null}
          </button>

          {isRenaming ? (
            <div className="min-w-0 flex-1">
              <Input
                autoFocus
                className="h-8 rounded-none border-black/10 bg-white text-sm"
                onBlur={props.onRenameBlur}
                onChange={(event) => props.onRenameValueChange(event.target.value)}
                onKeyDown={props.onRenameKeyDown}
                value={props.renameState?.value ?? ""}
              />
            </div>
          ) : null}

          {props.treeMutationPending ? (
            <LoaderCircleIcon className="size-4 animate-spin text-zinc-400" />
          ) : null}

        </div>
      </ContextMenuTrigger>

      {isAdmin && !isRoot ? (
        <ContextMenuContent className="rounded-none">
          <ContextMenuItem onClick={() => triggerSelect()}>Open</ContextMenuItem>
          <ContextMenuItem onClick={() => props.onBeginRename(props)}>Rename</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => props.onRequestDelete(props)} variant="destructive">
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      ) : null}
    </ContextMenu>
  );
}

function FileLeafNode(rawProps: BaseNodeProps<object> & TreeSharedProps) {
  const props = rawProps as BaseNodeProps<TreeMeta> & TreeSharedProps;
  const isRenaming =
    props.renameState?.kind === "file" && props.renameState.id === props.fileId;
  const isActive = props.activeNodeId === props.id;
  const isAdmin = props.mode === "admin";

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className={`flex min-h-10 items-center gap-2 border px-2 py-2 text-sm ${
            isActive ? "border-zinc-300 bg-zinc-100 text-zinc-950" : "border-transparent text-zinc-700 hover:bg-white"
          }`}
        >
          <div className="flex size-7 items-center justify-center text-zinc-400">
            <FileIcon className="size-4" />
          </div>

          <button
            className="min-w-0 flex-1 text-left"
            onClick={() => props.fileId && props.onOpenFile(props.fileId)}
            type="button"
          >
            {!isRenaming ? (
              <span className="truncate">{props.name}</span>
            ) : null}
          </button>

          {isRenaming ? (
            <div className="min-w-0 flex-1">
              <Input
                autoFocus
                className="h-8 rounded-none border-black/10 bg-white text-sm"
                onBlur={props.onRenameBlur}
                onChange={(event) => props.onRenameValueChange(event.target.value)}
                onKeyDown={props.onRenameKeyDown}
                value={props.renameState?.value ?? ""}
              />
            </div>
          ) : null}

          {props.treeMutationPending ? (
            <LoaderCircleIcon className="size-4 animate-spin text-zinc-400" />
          ) : null}
        </div>
      </ContextMenuTrigger>

      {isAdmin ? (
        <ContextMenuContent className="rounded-none">
          <ContextMenuItem onClick={() => props.fileId && props.onOpenFile(props.fileId)}>
            Open
          </ContextMenuItem>
          <ContextMenuItem onClick={() => props.onBeginRename(props)}>Rename</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => props.onRequestDelete(props)} variant="destructive">
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      ) : null}
    </ContextMenu>
  );
}

function ExplorerRow({
  active,
  editingValue,
  label,
  meta,
  onClick,
  onRename,
  onDelete,
  onEditBlur,
  onEditChange,
  onEditKeyDown,
  startIcon,
  type,
}: {
  active: boolean;
  editingValue: string | null;
  label: string;
  meta: string;
  onClick: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  onEditBlur?: () => void;
  onEditChange?: (value: string) => void;
  onEditKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  startIcon: ReactNode;
  type: "folder" | "file";
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className={`flex w-full items-center gap-3 border px-4 py-3 text-left ${
            active ? "border-zinc-300 bg-zinc-100" : "border-black/5 bg-white hover:bg-[#faf8f4]"
          }`}
          onClick={onClick}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onClick();
            }
          }}
          role="button"
          tabIndex={0}
        >
          {startIcon}
          <div className="min-w-0 flex-1">
            {editingValue !== null ? (
              <Input
                autoFocus
                className="h-8 rounded-none border-black/10 bg-white text-sm"
                onBlur={onEditBlur}
                onChange={(event) => onEditChange?.(event.target.value)}
                onKeyDown={onEditKeyDown}
                value={editingValue}
              />
            ) : (
              <div className="truncate text-sm font-medium text-zinc-950">{label}</div>
            )}
            <div className="truncate text-xs text-zinc-500">{meta}</div>
          </div>
        </div>
      </ContextMenuTrigger>
      {onRename || onDelete ? (
        <ContextMenuContent className="rounded-none">
          <ContextMenuItem onClick={onClick}>{type === "folder" ? "Open" : "Download"}</ContextMenuItem>
          {onRename ? <ContextMenuItem onClick={onRename}>Rename</ContextMenuItem> : null}
          {onDelete ? (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={onDelete} variant="destructive">
                Delete
              </ContextMenuItem>
            </>
          ) : null}
        </ContextMenuContent>
      ) : null}
    </ContextMenu>
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
