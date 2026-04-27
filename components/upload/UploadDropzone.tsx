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
