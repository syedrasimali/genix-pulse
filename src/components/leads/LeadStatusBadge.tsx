import { cn } from "@/lib/utils";

type LeadStatus = "Pending" | "Contacted" | "Replied" | "Closed";

const statusColors: Record<LeadStatus, string> = {
  Pending: "bg-muted text-muted-foreground",
  Contacted: "bg-primary/15 text-primary-glow",
  Replied: "bg-emerald-500/15 text-emerald-400",
  Closed: "bg-destructive/15 text-destructive",
};

const LeadStatusBadge = ({ status }: { status: LeadStatus }) => (
  <span className={cn("inline-block px-2.5 py-1 rounded-md text-xs font-medium", statusColors[status])}>
    {status}
  </span>
);

export default LeadStatusBadge;
