"use client";

import * as React from "react";
import { parseUploadedFiles } from "@/lib/parsers";
import { useAuditStore } from "@/store/use-audit-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { UploadDropzone } from "./upload-dropzone";

export function UploadPanel(): React.JSX.Element {
  const setParsed = useAuditStore((s) => s.setParsed);
  const parsed = useAuditStore((s) => s.parsed);
  const [progress, setProgress] = React.useState<{ completed: number; total: number } | null>(null);
  const [isParsing, setIsParsing] = React.useState(false);
  const { toast } = useToast();

  async function handleFiles(files: File[]): Promise<void> {
    setIsParsing(true);
    setProgress({ completed: 0, total: files.length });

    const parsedData = await parseUploadedFiles(files, (completed, total) => {
      setProgress({ completed, total });
    });

    setParsed(parsedData);
    setIsParsing(false);

    if (parsedData.followers.length === 0 && parsedData.following.length === 0) {
      toast({
        kind: "error",
        title: "No valid accounts parsed",
        description: "Try uploading different export files or check your format.",
      });
      return;
    }

    toast({
      kind: "success",
      title: "Files parsed locally",
      description: `Followers: ${parsedData.followers.length} • Following: ${parsedData.following.length}`,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Instagram Export Files</CardTitle>
        <CardDescription>
          No login required. All parsing happens directly in your browser.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <UploadDropzone onFiles={handleFiles} disabled={isParsing} />

        {progress ? (
          <div className="rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-800">
            <p>
              Parsing progress: <strong>{progress.completed}</strong> / {progress.total}
            </p>
          </div>
        ) : null}

        {parsed?.issues.length ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/70 dark:bg-amber-950/20">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">Parser notices</p>
            <ul className="mt-2 space-y-1 text-sm text-amber-800 dark:text-amber-300">
              {parsed.issues.map((issue, index) => (
                <li key={`${issue.fileName}-${index}`}>
                  {issue.fileName}: {issue.message}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() =>
              toast({
                kind: "info",
                title: "Export help",
                description: "Instagram app: Settings > Your Activity > Download Your Information.",
              })
            }
          >
            How to export data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
