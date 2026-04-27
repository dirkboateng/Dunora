"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ALLOWED_PHOTO_MIME,
  formatBytes,
  isAllowedMime,
  isAllowedSize,
  MAX_FILE_BYTES,
  MAX_PARALLEL_UPLOADS,
} from "@/lib/upload/tus-config";
import { checkUploadQuota } from "@/lib/actions/uploads";
import { Button } from "@/components/ui/Button";
import { UploadFile, type UploadFileItem } from "./UploadFile";

interface RejectedFile {
  name: string;
  reason: string;
}

interface Props {
  workspaceId: string;
  projectId: string;
  projectName: string;
  supabaseUrl: string;
  availableBytes: number;
}

let keyCounter = 0;
function nextKey(): string {
  keyCounter += 1;
  return `f${Date.now().toString(36)}-${keyCounter}`;
}

export function UploadDropzone({
  workspaceId,
  projectId,
  projectName,
  supabaseUrl,
  availableBytes,
}: Props) {
  const [items, setItems] = useState<UploadFileItem[]>([]);
  const [rejected, setRejected] = useState<RejectedFile[]>([]);
  const [completedKeys, setCompletedKeys] = useState<Set<string>>(new Set());
  const [failedKeys, setFailedKeys] = useState<Set<string>>(new Set());
  const [quotaError, setQuotaError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalBytes = useMemo(
    () => items.reduce((sum, i) => sum + i.file.size, 0),
    [items],
  );

  const completedCount = completedKeys.size;
  const failedCount = failedKeys.size;
  const activeCount = Math.min(
    MAX_PARALLEL_UPLOADS,
    Math.max(0, items.length - completedCount - failedCount),
  );

  function classifyFiles(fileList: FileList | File[]): {
    accepted: UploadFileItem[];
    rejected: RejectedFile[];
  } {
    const accepted: UploadFileItem[] = [];
    const rejectedList: RejectedFile[] = [];
    for (const file of Array.from(fileList)) {
      if (!isAllowedMime(file.type)) {
        rejectedList.push({
          name: file.name,
          reason: "Unsupported type — accepts JPG, PNG, HEIC, HEIF",
        });
        continue;
      }
      if (!isAllowedSize(file.size)) {
        rejectedList.push({
          name: file.name,
          reason: `Too large — max ${formatBytes(MAX_FILE_BYTES)}`,
        });
        continue;
      }
      accepted.push({ key: nextKey(), file });
    }
    return { accepted, rejected: rejectedList };
  }

  const handleFiles = useCallback(
    (fileList: FileList | File[]) => {
      if (hasStarted) return;
      const { accepted, rejected: rej } = classifyFiles(fileList);
      setItems((prev) => [...prev, ...accepted]);
      if (rej.length) {
        setRejected((prev) => [...prev, ...rej]);
      }
      setQuotaError(null);
    },
    [hasStarted],
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files?.length) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles],
  );

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (!isDragging) setIsDragging(true);
  }

  function onDragLeave() {
    setIsDragging(false);
  }

  function onPick() {
    inputRef.current?.click();
  }

  async function startAll() {
    if (!items.length) return;
    setQuotaError(null);
    const quota = await checkUploadQuota({ total_bytes: totalBytes });
    if (!quota.ok) {
      setQuotaError(quota.error ?? "Storage quota exceeded");
      return;
    }
    setHasStarted(true);
  }

  function clearAll() {
    setItems([]);
    setRejected([]);
    setCompletedKeys(new Set());
    setFailedKeys(new Set());
    setQuotaError(null);
    setHasStarted(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleComplete(key: string) {
    setCompletedKeys((prev) => {
      const n = new Set(prev);
      n.add(key);
      return n;
    });
  }

  function handleFailed(key: string) {
    setFailedKeys((prev) => {
      const n = new Set(prev);
      n.add(key);
      return n;
    });
  }

  const canAutoStart = (idx: number): boolean => {
    if (!hasStarted) return false;
    let inFlight = 0;
    for (let i = 0; i < idx; i += 1) {
      const k = items[i]?.key;
      if (!k) continue;
      if (!completedKeys.has(k) && !failedKeys.has(k)) inFlight += 1;
    }
    if (inFlight >= MAX_PARALLEL_UPLOADS) return false;
    return true;
  };

  const allDone =
    items.length > 0 && completedCount + failedCount === items.length;

  const aggregatePercent =
    items.length === 0
      ? 0
      : Math.round(((completedCount + failedCount) / items.length) * 100);
  return (
    <div className="space-y-5">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ALLOWED_PHOTO_MIME.join(",")}
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
        }}
      />

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={onPick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onPick();
          }
        }}
        className={`bg-surface border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-accent bg-accent-wash/40"
            : "border-line hover:border-accent/40 hover:bg-surface-2/40"
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-accent-wash text-accent inline-flex items-center justify-center text-2xl mb-4">
          ↑
        </div>
        <div className="text-base font-semibold text-ink mb-1">
          Drop photos here or click to browse
        </div>
        <p className="text-sm text-ink-2 max-w-md mx-auto leading-relaxed">
          JPG, PNG, HEIC, HEIF · Up to {formatBytes(MAX_FILE_BYTES)} per file ·{" "}
          {formatBytes(availableBytes)} available in this workspace
        </p>
      </div>

      {rejected.length > 0 && (
        <div className="bg-error/5 border border-error/20 rounded-xl p-4">
          <div className="text-sm font-semibold text-error mb-2">
            {rejected.length} file{rejected.length === 1 ? "" : "s"} skipped
          </div>
          <ul className="space-y-1 text-xs text-ink-2">
            {rejected.slice(0, 5).map((r, i) => (
              <li key={`${r.name}-${i}`}>
                <span className="font-medium text-ink">{r.name}</span> —{" "}
                {r.reason}
              </li>
            ))}
            {rejected.length > 5 && (
              <li className="text-muted">…and {rejected.length - 5} more</li>
            )}
          </ul>
          <button
            type="button"
            onClick={() => setRejected([])}
            className="text-xs text-muted hover:text-ink mt-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {quotaError && (
        <div className="bg-error/5 border border-error/20 rounded-xl p-4">
          <div className="text-sm font-semibold text-error mb-1">
            Cannot start upload
          </div>
          <p className="text-xs text-ink-2">{quotaError}</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="bg-surface border border-line rounded-2xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <div className="text-sm font-semibold text-ink">
                {items.length} file{items.length === 1 ? "" : "s"} selected ·{" "}
                {formatBytes(totalBytes)}
              </div>
              <div className="text-xs text-muted mt-0.5">
                Adding to project: {projectName}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!hasStarted && (
                <>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-sm font-medium text-ink-2 hover:text-ink px-3 py-2 rounded-lg hover:bg-surface-2 transition-colors"
                  >
                    Clear
                  </button>
                  <Button onClick={startAll} variant="primary">
                    Start upload
                  </Button>
                </>
              )}
              {hasStarted && allDone && (
                <Link
                  href={`/dashboard/projects/${projectId}`}
                  className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Back to project
                </Link>
              )}
              {hasStarted && !allDone && (
                <span className="text-sm text-muted">
                  {completedCount} done · {activeCount} active ·{" "}
                  {Math.max(
                    0,
                    items.length - completedCount - failedCount - activeCount,
                  )}{" "}
                  queued
                </span>
              )}
            </div>
          </div>

          {hasStarted && (
            <div className="h-1.5 bg-surface-3 rounded-full mb-5 overflow-hidden">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${aggregatePercent}%` }}
              />
            </div>
          )}

          <div className="space-y-2.5">
            {items.map((item, idx) => (
              <UploadFile
                key={item.key}
                item={item}
                workspaceId={workspaceId}
                projectId={projectId}
                supabaseUrl={supabaseUrl}
                autoStart={canAutoStart(idx)}
                onComplete={handleComplete}
                onFailed={handleFailed}
              />
            ))}
          </div>

          {hasStarted && allDone && (
            <div className="mt-5 pt-5 border-t border-line text-sm">
              {failedCount === 0 ? (
                <div className="text-accent-deep font-medium">
                  ✓ All {completedCount} photo{completedCount === 1 ? "" : "s"}{" "}
                  uploaded successfully.
                </div>
              ) : (
                <div className="text-ink-2">
                  <span className="text-accent-deep font-medium">
                    {completedCount} succeeded
                  </span>
                  {", "}
                  <span className="text-error font-medium">
                    {failedCount} failed
                  </span>
                  . Use Retry above to try again.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
