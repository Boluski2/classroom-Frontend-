import { AlertCircle, Inbox, LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatusStateProps = {
  kind: "loading" | "empty" | "error";
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

const icons = {
  loading: LoaderCircle,
  empty: Inbox,
  error: AlertCircle,
};

export function StatusState({
  kind,
  title,
  description,
  action,
  className,
}: StatusStateProps) {
  const Icon = icons[kind];

  return (
    <section
      aria-live={kind === "loading" ? "polite" : "assertive"}
      className={cn(
        "flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/30 px-6 py-8 text-center",
        className
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn(
          "size-6 text-muted-foreground",
          kind === "loading" && "animate-spin"
        )}
      />
      <div className="space-y-1">
        <h2 className="font-semibold text-foreground">{title}</h2>
        {description ? (
          <p className="max-w-md text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </section>
  );
}
