import { cn } from "@/lib/utils";

export const Badge = ({ children, variant = "default", className }) => {
  const variants = {
    default: "bg-muted text-muted-foreground",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    danger: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
    primary: "bg-primary/10 text-primary border border-primary/20",
    indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20",
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};
