import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 active:scale-[0.99]",
  {
    variants: {
      variant: {
        default: "bg-stone-900 text-amber-50 shadow-[0_8px_20px_rgba(41,29,22,0.2)] hover:bg-stone-800 dark:bg-amber-200 dark:text-stone-900 dark:hover:bg-amber-100",
        secondary: "bg-amber-100 text-stone-900 hover:bg-amber-200 dark:bg-stone-700 dark:text-amber-50 dark:hover:bg-stone-600",
        ghost: "text-stone-700 hover:bg-amber-100 dark:text-amber-100 dark:hover:bg-stone-700",
        outline:
          "border border-amber-300/90 bg-white/70 text-stone-800 hover:bg-amber-50 dark:border-stone-500 dark:bg-stone-800/40 dark:text-amber-100 dark:hover:bg-stone-700",
        destructive: "bg-rose-600 text-white shadow-[0_8px_18px_rgba(190,24,93,0.22)] hover:bg-rose-500",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3",
        lg: "h-11 rounded-xl px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps): React.JSX.Element {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
