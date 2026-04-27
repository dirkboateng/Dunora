"use client";

import * as tus from "tus-js-client";
import {
  TUS_CHUNK_SIZE,
  TUS_RETRY_DELAYS,
  getResumableEndpoint,
} from "./tus-config";

export interface UploadHandle {
  abort: (deletePartial: boolean) => Promise<void>;
  pause: () => void;
  resume: () => void;
  url: () => string | null;
}

export interface StartUploadOptions {
  file: File;
  bucketName: "originals";
  objectName: string;
  accessToken: string;
  supabaseUrl: string;
  onProgress: (bytesUploaded: number, bytesTotal: number) => void;
  onSuccess: () => void;
  onError: (err: Error) => void;
}

export function startUpload(opts: StartUploadOptions): UploadHandle {
  const upload = new tus.Upload(opts.file, {
    endpoint: getResumableEndpoint(opts.supabaseUrl),
    retryDelays: [...TUS_RETRY_DELAYS],
    headers: {
      authorization: `Bearer ${opts.accessToken}`,
      "x-upsert": "false",
    },
    uploadDataDuringCreation: true,
    removeFingerprintOnSuccess: true,
    metadata: {
      bucketName: opts.bucketName,
      objectName: opts.objectName,
      contentType: opts.file.type,
      cacheControl: "3600",
    },
    chunkSize: TUS_CHUNK_SIZE,
    onError: (err) => opts.onError(err as Error),
    onProgress: (uploaded, total) => opts.onProgress(uploaded, total),
    onSuccess: () => opts.onSuccess(),
  });

  upload.start();

  return {
    abort: async (deletePartial: boolean) => {
      try {
        await upload.abort(deletePartial);
      } catch {
        // already aborted
      }
    },
    pause: () => {
      upload.abort(false).catch(() => undefined);
    },
    resume: () => upload.start(),
    url: () => upload.url,
  };
}
