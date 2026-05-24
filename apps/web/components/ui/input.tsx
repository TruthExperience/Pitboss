import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-2 text-white",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
