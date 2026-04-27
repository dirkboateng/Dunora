"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { startUpload, type UploadHandle } from "@/lib/upload/tus-client";
import {
  buildStoragePath,
  generatePhotoId,
} from "@/lib/upload/path";
import {
  canPreviewMime,
  formatBytes,
} from "@/lib/upload/tus-config";
import { registerUploadedPhoto } from "@/lib/actions/uploads";

type Status = "queued" | "uploading" | "paused" | "done" | "error";

export interface UploadFileItem {
  key: string;
  file: File;
}

interface Props {
  item: UploadFileItem;
  workspaceId: string;
  projectId: string;
  supabaseUrl: string;
  autoStart: boolean;
  onComplete: (key: string) => void;
  onFailed: (key: string, msg: string) => void;
}

export function UploadFile({
  item,
  workspaceId,
  projectId,
  supabaseUrl,
  autoStart,
  onComplete,
  onFailed,
}: Props) {
  const [status, setStatus] = useState<Status>("queued");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const handleRef = useRef<UploadHandle | null>(null);
  const photoIdRef = useRef<string>(generatePhotoId());
  const previewUrlRef = useRef<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!canPreviewMime(item.file.type)) return;
    const url = URL.createObjectURL(item.file);
    previewUrlRef.current = url;
    setPreviewUrl(url);
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, [item.file]);

  async function start() {
    if (startedRef.current) return;
    startedRef.current = true;
    setStatus("uploading");
    setErrorMsg(null);

    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setStatus("error");
      setErrorMsg("Not signed in");
      onFailed(item.key, "Not signed in");
      return;
    }

    const photoId = photoIdRef.current;
    const storagePath = buildStoragePath({
      workspaceId,
      projectId,
      photoId,
      mimeType: item.file.type,
    });

    handleRef.current = startUpload({
      file: item.file,
      bucketName: "originals",
      objectName: storagePath,
      accessToken: session.access_token,
      supabaseUrl,
      onProgress: (uploaded, total) => {
        setProgress(Math.round((uploaded / total) * 100));
      },
      onSuccess: async () => {
        const result = await registerUploadedPhoto({
          photo_id: photoId,
          project_id: projectId,
          storage_path: storagePath,
          file_name: item.file.name,
          file_size_bytes: item.file.size,
          mime_type: item.file.type,
        });
        if (!result.ok) {
          setStatus("error");
          const msg = result.error ?? "Could not register photo";
          setErrorMsg(msg);
          onFailed(item.key, msg);
          return;
        }
        setProgress(100);
        setStatus("done");
        onComplete(item.key);
      },
      onError: (err) => {
        setStatus("error");
        setErrorMsg(err.message);
        onFailed(item.key, err.message);
      },
    });
  }

  function pause() {
    handleRef.current?.pause();
    setStatus("paused");
  }

  function resume() {
    if (!handleRef.current) {
      startedRef.current = false;
      void start();
      return;
    }
    handleRef.current.resume();
    setStatus("uploading");
  }

  function cancel() {
    handleRef.current?.abort(true).catch(() => undefined);
    setStatus("error");
    setErrorMsg("Cancelled");
    onFailed(item.key, "Cancelled");
  }

  useEffect(() => {
    if (autoStart && !startedRef.current) {
      void start();
    }
  }, [autoStart]);

  useEffect(() => {
    return () => {
      handleRef.current?.abort(true).catch(() => undefined);
    };
  }, []);

  const statusLabel =
    status === "queued"
      ? "Queued"
      : status === "uploading"
      ? `${progress}%`
      : status === "paused"
      ? "Paused"
      : status === "done"
      ? "Done"
      : "Error";

  const barColor =
    status === "error"
      ? "bg-error"
      : status === "done"
      ? "bg-accent"
      : "bg-accent";

  return (
    <div className="flex items-center gap-3 p-3 bg-surface border border-line rounded-xl">
      <div className="w-12 h-12 bg-surface-2 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-muted">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[10px] font-bold uppercase">
            {item.file.type.split("/")[1] || "img"}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-ink truncate">
          {item.file.name}
        </div>
        <div className="text-xs text-muted flex items-center gap-2">
          <span>{formatBytes(item.file.size)}</span>
          <span>·</span>
          <span
            className={
              status === "error"
                ? "text-error"
                : status === "done"
                ? "text-accent-deep"
                : ""
            }
          >
            {statusLabel}
          </span>
          {errorMsg && status === "error" && (
            <>
              <span>·</span>
              <span className="text-error truncate">{errorMsg}</span>
            </>
          )}
        </div>
        <div className="h-1.5 bg-surface-3 rounded-full mt-1.5 overflow-hidden">
          <div
            className={`h-full transition-all ${barColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        {status === "uploading" && (
          <button
            type="button"
            onClick={pause}
            className="text-xs font-medium text-ink-2 hover:text-ink px-2.5 py-1 rounded-lg hover:bg-surface-2 transition-colors"
          >
            Pause
          </button>
        )}
        {status === "paused" && (
          <button
            type="button"
            onClick={resume}
            className="text-xs font-medium text-accent-deep hover:text-accent px-2.5 py-1 rounded-lg hover:bg-accent-wash transition-colors"
          >
            Resume
          </button>
        )}
        {status === "error" && (
          <button
            type="button"
            onClick={() => {
              startedRef.current = false;
              setProgress(0);
              setErrorMsg(null);
              void start();
            }}
            className="text-xs font-medium text-accent-deep hover:text-accent px-2.5 py-1 rounded-lg hover:bg-accent-wash transition-colors"
          >
            Retry
          </button>
        )}
        {(status === "uploading" || status === "paused") && (
          <button
            type="button"
            onClick={cancel}
            className="text-xs font-medium text-muted hover:text-error px-2.5 py-1 rounded-lg hover:bg-surface-2 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
