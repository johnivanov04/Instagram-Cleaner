import * as React from "react";
import { cn } from "@/lib/utils";

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

export function Checkbox({ className, ...props }: CheckboxProps): React.JSX.Element {
  return (
    <input
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border-slate-400 text-emerald-600 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-900",
        className,
      )}
      {...props}
    />
  );
}
