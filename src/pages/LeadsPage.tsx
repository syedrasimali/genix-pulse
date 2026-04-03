import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Download, Filter, Trash2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type LeadStatus = "Pending" | "Contacted" | "Replied" | "Closed";

interface Lead {
  id: string;
  name: string;
  title: string | null;
  company: string | null;
  linkedin_url: string | null;
  status: LeadStatus;
  location: string | null;
}

const statusColors: Record<LeadStatus, string> = {
  Pending: "bg-muted text-muted-foreground",
  Contacted: "bg-primary/15 text-primary-glow",
  Replied: "bg-emerald-500/15 text-emerald-400",
  Closed: "bg-violet-500/15 text-violet-400",
};

const LeadsPage = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "All">("All");
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("leads")
      .select("id, name, title, company, linkedin_url, status, location")
      .order("created_at", { ascending: false });
    if (!error && data) setLeads(data as Lead[]);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, [user]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    setLeads((prev) => prev.filter((l) => l.id !== id));
    toast.success("Lead deleted");
  };

  const filtered = leads.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || (l.company ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const exportCSV = () => {
    const header = "Name,Title,Company,Status,Location\n";
    const rows = filtered.map((l) => `${l.name},${l.title ?? ""},${l.company ?? ""},${l.status},${l.location ?? ""}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "leads.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">Leads</h1>
            <p className="text-muted-foreground">{filtered.length} leads in your pipeline</p>
          </div>
          <button onClick={exportCSV} className="btn-outline-glow flex items-center gap-2 text-sm py-2 px-4">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)} className="glass-input w-full pl-10" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {(["All", "Pending", "Contacted", "Replied", "Closed"] as const).map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === s ? "bg-primary/20 text-primary-glow" : "text-muted-foreground hover:bg-muted/50"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No leads yet. Add your first lead!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">Name</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">Title</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">Company</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => (
                  <motion.tr key={lead.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4 font-medium">{lead.name}</td>
                    <td className="px-5 py-4 text-muted-foreground">{lead.title ?? "-"}</td>
                    <td className="px-5 py-4 text-muted-foreground">{lead.company ?? "-"}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${statusColors[lead.status]}`}>{lead.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {lead.linkedin_url && (
                          <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary-glow transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button onClick={() => handleDelete(lead.id)} className="text-muted-foreground hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LeadsPage;
