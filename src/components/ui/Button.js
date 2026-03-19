import { cn } from "@/lib/utils";

export const Button = ({ className, variant = "primary", ...props }) => {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-border bg-transparent text-foreground hover:bg-muted",
    danger: "bg-destructive text-destructive-foreground hover:opacity-90",
    ghost: "bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground",
  };

  return (
    <button
      className={cn(
        "px-4 py-2 rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        className
      )}
      {...props}
    />
  );
};
