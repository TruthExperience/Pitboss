import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-2 text-white",
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";
