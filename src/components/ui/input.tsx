import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>): React.JSX.Element {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xl border border-amber-300/90 bg-white/85 px-3 text-sm text-stone-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] outline-none transition placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-amber-400/30 dark:border-stone-600 dark:bg-stone-900/70 dark:text-amber-50 dark:placeholder:text-stone-400",
        className,
      )}
      {...props}
    />
  );
}
