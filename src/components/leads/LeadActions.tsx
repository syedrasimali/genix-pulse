import { ExternalLink, Trash2, Pencil, Phone, MessageCircle, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

type LeadStatus = "Pending" | "Contacted" | "Replied" | "Closed";

interface LeadActionsProps {
  leadId: string;
  linkedinUrl: string | null;
  currentStatus: LeadStatus;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const LeadActions = ({ leadId, linkedinUrl, currentStatus, onStatusChange, onEdit, onDelete }: LeadActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onEdit(leadId)}>
          <Pencil className="w-4 h-4 mr-2" /> Edit Lead
        </DropdownMenuItem>
        {linkedinUrl && (
          <DropdownMenuItem asChild>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" /> View LinkedIn
            </a>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {currentStatus !== "Contacted" && (
          <DropdownMenuItem onClick={() => onStatusChange(leadId, "Contacted")}>
            <Phone className="w-4 h-4 mr-2" /> Mark Contacted
          </DropdownMenuItem>
        )}
        {currentStatus !== "Replied" && (
          <DropdownMenuItem onClick={() => onStatusChange(leadId, "Replied")}>
            <MessageCircle className="w-4 h-4 mr-2" /> Mark Replied
          </DropdownMenuItem>
        )}
        {currentStatus !== "Closed" && (
          <DropdownMenuItem onClick={() => onStatusChange(leadId, "Closed")}>
            <XCircle className="w-4 h-4 mr-2" /> Mark Closed
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDelete(leadId)} className="text-destructive focus:text-destructive">
          <Trash2 className="w-4 h-4 mr-2" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LeadActions;
