export type UploadProgressHandler = (percent: number) => void;

export type UploadWithProgressOptions = {
  url: string;
  file: Blob;
  contentType?: string;
  method?: "PUT" | "POST";
  onProgress?: UploadProgressHandler;
  headers?: Record<string, string>;
};

export async function uploadWithProgress({
  url,
  file,
  contentType,
  method = "PUT",
  onProgress,
  headers,
}: UploadWithProgressOptions): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);

    if (contentType) {
      xhr.setRequestHeader("Content-Type", contentType);
    }
    if (headers) {
      for (const [key, value] of Object.entries(headers)) {
        xhr.setRequestHeader(key, value);
      }
    }

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      const percent = Math.min(99, Math.round((event.loaded / event.total) * 100));
      onProgress(percent);
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100);
        resolve();
      } else {
        reject(new Error(`Upload failed (${xhr.status}).`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.onabort = () => reject(new Error("Upload cancelled."));

    xhr.send(file);
  });
}
