import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type LeadStatus = "Pending" | "Contacted" | "Replied" | "Closed";

interface Lead {
  id: string;
  name: string;
  title: string | null;
  company: string | null;
  linkedin_url: string | null;
  status: LeadStatus;
  location: string | null;
  notes: string | null;
}

interface EditLeadDialogProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const EditLeadDialog = ({ lead, open, onClose, onSaved }: EditLeadDialogProps) => {
  const [form, setForm] = useState({ name: "", title: "", company: "", linkedin_url: "", location: "", notes: "", status: "Pending" as LeadStatus });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name,
        title: lead.title ?? "",
        company: lead.company ?? "",
        linkedin_url: lead.linkedin_url ?? "",
        location: lead.location ?? "",
        notes: lead.notes ?? "",
        status: lead.status,
      });
    }
  }, [lead]);

  const handleSave = async () => {
    if (!lead) return;
    setSaving(true);
    const { error } = await supabase.from("leads").update({
      name: form.name,
      title: form.title || null,
      company: form.company || null,
      linkedin_url: form.linkedin_url || null,
      location: form.location || null,
      notes: form.notes || null,
      status: form.status,
    }).eq("id", lead.id);
    setSaving(false);
    if (error) { toast.error("Failed to update"); return; }
    toast.success("Lead updated!");
    onSaved();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="glass-card border-border/40 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Edit Lead</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {([
            { key: "name", label: "Name" },
            { key: "title", label: "Title" },
            { key: "company", label: "Company" },
            { key: "linkedin_url", label: "LinkedIn URL" },
            { key: "location", label: "Location" },
          ] as const).map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium mb-1">{f.label}</label>
              <input
                value={form[f.key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                className="glass-input w-full"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as LeadStatus }))}
              className="glass-input w-full"
            >
              {(["Pending", "Contacted", "Replied", "Closed"] as const).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              className="glass-input w-full min-h-[80px] resize-y"
            />
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary w-full disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditLeadDialog;
