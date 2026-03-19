import { cn } from "@/lib/utils";

export const Input = ({ className, label, error, ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="text-sm font-semibold text-muted-foreground ml-1">{label}</label>}
      <input
        className={cn(
          "w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
          error && "border-destructive focus:ring-destructive/20 focus:border-destructive",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-destructive font-medium ml-1">{error}</p>}
    </div>
  );
};
