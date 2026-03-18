"use client";

import * as React from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}

export function UploadDropzone({ onFiles, disabled }: UploadDropzoneProps): React.JSX.Element {
  const [dragging, setDragging] = React.useState(false);

  const onDrop = React.useCallback(
    (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      setDragging(false);
      if (disabled) {
        return;
      }
      const files = Array.from(event.dataTransfer.files);
      if (files.length > 0) {
        onFiles(files);
      }
    },
    [disabled, onFiles],
  );

  return (
    <label
      onDrop={onDrop}
      onDragEnter={(event) => {
        event.preventDefault();
        if (!disabled) {
          setDragging(true);
        }
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setDragging(false);
      }}
      onDragOver={(event) => event.preventDefault()}
      className={cn(
        "group flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center transition",
        "border-emerald-400/70 bg-emerald-50/70 hover:bg-emerald-100/80 dark:border-emerald-700 dark:bg-emerald-950/20",
        dragging && "scale-[1.01] bg-emerald-100 dark:bg-emerald-950/40",
        disabled && "cursor-not-allowed opacity-70",
      )}
    >
      <input
        type="file"
        className="hidden"
        accept=".json,.html,.htm,.txt"
        multiple
        disabled={disabled}
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          if (files.length > 0) {
            onFiles(files);
          }
          event.currentTarget.value = "";
        }}
      />
      <Upload className="h-8 w-8 text-emerald-700 dark:text-emerald-300" />
      <p className="mt-4 text-base font-semibold">Drop Instagram export files here</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Supports JSON, HTML, and TXT. You can upload multiple split files at once.
      </p>
    </label>
  );
}
