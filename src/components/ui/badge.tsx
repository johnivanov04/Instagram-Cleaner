import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide", {
  variants: {
    variant: {
      default: "bg-emerald-100/90 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100",
      neutral: "bg-amber-100 text-stone-800 dark:bg-stone-700 dark:text-amber-100",
      warning: "bg-amber-200 text-amber-900 dark:bg-amber-900/50 dark:text-amber-100",
      danger: "bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-100",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps): React.JSX.Element {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
