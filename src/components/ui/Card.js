import { cn } from "@/lib/utils";

export const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground rounded-[2rem] shadow-sm border border-border overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
