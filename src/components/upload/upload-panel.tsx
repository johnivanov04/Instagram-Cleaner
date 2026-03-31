"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { parseUploadedFiles } from "@/lib/parsers";
import { useAuditStore } from "@/store/use-audit-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { UploadDropzone } from "./upload-dropzone";

export function UploadPanel(): React.JSX.Element {
  const router = useRouter();
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
          <div className="rounded-xl border border-amber-200 bg-white/75 p-3 text-sm text-stone-700 dark:border-stone-700 dark:bg-stone-900/50 dark:text-amber-100/80">
            <p>
              Parsing progress: <strong>{progress.completed}</strong> / {progress.total}
            </p>
          </div>
        ) : null}

        {parsed?.issues.length ? (
          <div className="rounded-xl border border-amber-300 bg-amber-100/80 p-3 dark:border-amber-800/70 dark:bg-amber-900/20">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Parser notices</p>
            <ul className="mt-2 space-y-1 text-sm text-amber-800 dark:text-amber-100/90">
              {parsed.issues.map((issue, index) => (
                <li key={`${issue.fileName}-${index}`}>
                  {issue.fileName}: {issue.message}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => router.push("/how-to-export")}>
            How to export data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
