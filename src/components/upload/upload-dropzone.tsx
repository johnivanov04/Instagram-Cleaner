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
        "group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center transition duration-300",
        "border-amber-300/90 bg-white/70 hover:-translate-y-0.5 hover:bg-amber-50/80 dark:border-stone-600 dark:bg-stone-900/55",
        dragging && "scale-[1.01] border-amber-500 bg-amber-100/80 dark:bg-stone-800/80",
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
      <Upload className="h-8 w-8 text-amber-700 dark:text-amber-200" />
      <p className="mt-4 text-base font-semibold text-stone-900 dark:text-amber-50">Drop Instagram export files here</p>
      <p className="mt-1 text-sm text-stone-600 dark:text-amber-100/75">
        Supports JSON, HTML, and TXT. You can upload multiple split files at once.
      </p>
    </label>
  );
}
