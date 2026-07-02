"use client";

import Link from "next/link";
import { type ChangeEvent, useMemo, useRef, useState } from "react";
import { Building2Icon, LoaderCircleIcon, LockKeyholeIcon, PaperclipIcon, SendIcon, UserRoundPlusIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useUploadProgress } from "~/components/upload/upload-progress-provider";
import { uploadWithProgress } from "~/lib/upload-with-progress";
import { api } from "~/trpc/react";

type ClientPortalAccessPageClientProps = {
  isSignedIn: boolean;
  signedInWithoutPortalAccess: boolean;
  initialMode?: "signin" | "guest";
};

type SubmissionState = "form" | "success";

export function ClientPortalAccessPageClient({
  isSignedIn,
  signedInWithoutPortalAccess,
  initialMode = "signin",
}: ClientPortalAccessPageClientProps) {
  const uploadProgress = useUploadProgress();
  const prepareUpload = api.portalAccess.prepareGuestAttachmentUpload.useMutation();
  const createGuestIntake = api.portalAccess.createGuestIntake.useMutation();

  const [mode, setMode] = useState<"signin" | "guest">(
    signedInWithoutPortalAccess ? "guest" : initialMode,
  );
  const [submissionState, setSubmissionState] = useState<SubmissionState>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [summary, setSummary] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const signInHref = useMemo(() => {
    const redirect = encodeURIComponent("/client-portal/access");
    return `/sign-in?redirect_url=${redirect}`;
  }, []);

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (selectedFiles.length === 0) return;

    setFiles((current) => {
      const next = [...current];
      for (const file of selectedFiles) {
        const duplicate = next.some(
          (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified,
        );
        if (!duplicate) {
          next.push(file);
        }
      }
      return next.slice(0, 10);
    });

    event.target.value = "";
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  async function handleGuestSubmit() {
    setErrorMessage(null);

    try {
      const attachmentIds: string[] = [];

      for (const file of files) {
        const tracker = uploadProgress.startUpload({ label: file.name });
        try {
          const prepared = await prepareUpload.mutateAsync({
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

          tracker.succeed("Attachment uploaded");
          attachmentIds.push(prepared.attachmentId);
        } catch (uploadError) {
          const message =
            uploadError instanceof Error ? uploadError.message : `Failed to upload ${file.name}.`;
          tracker.fail(message);
          throw new Error(message);
        }
      }

      await createGuestIntake.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        company: company.trim(),
        summary: summary.trim(),
        attachmentIds,
      });

      setSubmissionState("success");
      toast.success("Your onboarding request has been sent.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to submit your onboarding request.";
      setErrorMessage(message);
      toast.error(message);
    }
  }

  if (submissionState === "success") {
    return (
      <main className="min-h-screen bg-[#f6f4ef] px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-zinc-200 bg-white p-10 text-center shadow-sm">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
            Guest Onboarding Received
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-zinc-950">
            Your request is with the Concolabs team.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600">
            We have your brief and will review it real soon. If you want to keep exploring in the meantime, continue to the out AI chat bot.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/chat">Open Chat</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Back to site</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f4ef] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1fr)]">
          <section className="rounded-[28px] border border-zinc-200 bg-zinc-950 p-10 text-white shadow-sm">
            <h1 className="mt-5 font-serif text-5xl leading-[0.95] text-white">
              One entry point for invited clients and new prospects.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300">
              Existing client members can sign in and continue straight into their organization workspace. New customers can brief Concolabs here and continue into chat while your onboarding request is reviewed.
            </p>

            <div className="mt-10 grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3 text-sm font-medium text-white">
                  <LockKeyholeIcon className="size-4" />
                  Existing client path
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  Sign in with the invited account that belongs to your client organization in Clerk. Valid members are redirected into client portal.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3 text-sm font-medium text-white">
                  <UserRoundPlusIcon className="size-4" />
                  New customer path
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  Share your company, project need, and supporting files. The request lands with the Concolabs team and then you can continue into the public chat.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-zinc-200 bg-white p-8 shadow-sm">
            <Tabs
              className="gap-6"
              onValueChange={(value) => setMode(value as "signin" | "guest")}
              value={mode}
            >
              <TabsList className="grid h-auto grid-cols-2">
                <TabsTrigger value="signin">Existing Client</TabsTrigger>
                <TabsTrigger value="guest">New to Concolabs</TabsTrigger>
              </TabsList>

              <TabsContent className="space-y-5" value="signin">
                <div>
                 
                  <h2 className="mt-2 text-2xl font-semibold text-zinc-950">
                    Continue into your client workspace.
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-zinc-600">
                    Use the invited email account attached to your client organization. If your account is not linked to a client org yet, use the guest onboarding path instead.
                  </p>
                </div>

                {signedInWithoutPortalAccess ? (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                    You are signed in, but this account does not have an active client organization in the portal yet. Continue with guest onboarding so the team can review your request.
                  </div>
                ) : null}

                <div className="rounded-2xl border border-zinc-200 bg-[#faf8f4] p-5">
                  <div className="flex items-start gap-3">
                    
                    <div>
                      <div className="text-sm font-medium text-zinc-950">Invited client members only</div>
                      <p className="mt-2 text-sm leading-6 text-zinc-600">
                        The Client portal access can only be provided by concolabs. Please sign in to continue to your client portal.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href={signInHref}>{isSignedIn ? "Refresh portal access" : "Sign in with Clerk"}</Link>
                  </Button>
                  <Button onClick={() => setMode("guest")} type="button" variant="outline">
                    Continue as guest
                  </Button>
                </div>
              </TabsContent>

              <TabsContent className="space-y-5" value="guest">
                <div>
                
                  <h2 className="mt-2 text-2xl font-semibold text-zinc-950">
                    Tell us how we can help you 10x
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-zinc-600">
                    Share your dream project with us, and we’ll take care of the rest.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-zinc-800">Your name</span>
                    <Input onChange={(event) => setName(event.target.value)} value={name} />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-zinc-800">Work email</span>
                    <Input onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
                  </label>
                </div>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-zinc-800">Company</span>
                  <Input onChange={(event) => setCompany(event.target.value)} value={company} />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-zinc-800">Project request</span>
                  <Textarea
                    className="min-h-[156px] resize-none"
                    onChange={(event) => setSummary(event.target.value)}
                    placeholder="Describe the project, the outcome you need, any references, and the context the Concolabs team should know."
                    value={summary}
                  />
                </label>

                <div className="space-y-3">
                  <div className="text-sm font-medium text-zinc-800">Attachments</div>
                  <input
                    accept=".pdf,.doc,.docx,.txt,image/*"
                    className="hidden"
                    multiple
                    onChange={handleFileInputChange}
                    ref={fileInputRef}
                    type="file"
                  />
                  <Button onClick={() => fileInputRef.current?.click()} type="button" variant="outline">
                    <PaperclipIcon className="size-4" />
                    Add supporting files
                  </Button>

                  {files.length > 0 ? (
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div
                          className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 px-4 py-3"
                          key={`${file.name}-${file.size}-${file.lastModified}`}
                        >
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-zinc-900">{file.name}</div>
                            <div className="mt-1 text-xs text-zinc-500">{formatFileSize(file.size)}</div>
                          </div>
                          <Button
                            className="h-8 w-8 px-0"
                            onClick={() => removeFile(index)}
                            type="button"
                            variant="ghost"
                          >
                            <XIcon className="size-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                {errorMessage ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3">
                  <Button
                    disabled={
                      !name.trim() ||
                      !email.trim() ||
                      !company.trim() ||
                      !summary.trim() ||
                      createGuestIntake.isPending ||
                      prepareUpload.isPending
                    }
                    onClick={() => void handleGuestSubmit()}
                    type="button"
                  >
                    {createGuestIntake.isPending || prepareUpload.isPending ? (
                      <LoaderCircleIcon className="size-4 animate-spin" />
                    ) : (
                      <SendIcon className="size-4" />
                    )}
                    Submit onboarding request
                  </Button>
                  <Button asChild type="button" variant="outline">
                    <Link href="/chat">Open chat instead</Link>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </div>
    </main>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
