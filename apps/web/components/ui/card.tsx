import { cn } from "@/lib/utils";

export function Card({ className, ...props }: any) {
  return (
    <div
      className={cn(
        "rounded-lg border border-neutral-700 bg-neutral-900 p-6",
        className
      )}
      {...props}
    />
  );
}
