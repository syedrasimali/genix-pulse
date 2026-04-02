import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const AddLeadPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", title: "", company: "", linkedinUrl: "", location: "", notes: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("leads").insert({
      user_id: user.id,
      name: form.name,
      title: form.title || null,
      company: form.company || null,
      linkedin_url: form.linkedinUrl || null,
      location: form.location || null,
      notes: form.notes || null,
    });
    setLoading(false);
    if (error) {
      toast.error("Failed to add lead: " + error.message);
      return;
    }
    toast.success("Lead added successfully!");
    navigate("/dashboard/leads");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold mb-1">Add Lead</h1>
        <p className="text-muted-foreground mb-8">Add a new lead to your pipeline.</p>
      </motion.div>

      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
        {([
          { key: "name", label: "Full Name", placeholder: "e.g. Sarah Chen", type: "text" },
          { key: "title", label: "Job Title", placeholder: "e.g. VP of Engineering", type: "text" },
          { key: "company", label: "Company", placeholder: "e.g. TechFlow", type: "text" },
          { key: "linkedinUrl", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/...", type: "url" },
          { key: "location", label: "Location", placeholder: "e.g. San Francisco, CA", type: "text" },
        ] as const).map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium mb-1.5">{field.label}</label>
            <input type={field.type} placeholder={field.placeholder} value={form[field.key]} onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))} className="glass-input w-full" required={field.key === "name"} />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium mb-1.5">Notes</label>
          <textarea placeholder="Add notes about this lead..." value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className="glass-input w-full min-h-[100px] resize-y" />
        </div>
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
          <UserPlus className="w-4 h-4" />
          {loading ? "Adding..." : "Add Lead"}
        </button>
      </motion.form>
    </div>
  );
};

export default AddLeadPage;
