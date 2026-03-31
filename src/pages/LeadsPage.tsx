import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Download, Filter, MoreHorizontal, ExternalLink } from "lucide-react";

type LeadStatus = "Pending" | "Contacted" | "Replied" | "Closed";

interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  linkedinUrl: string;
  status: LeadStatus;
  location: string;
}

const statusColors: Record<LeadStatus, string> = {
  Pending: "bg-muted text-muted-foreground",
  Contacted: "bg-primary/15 text-primary-glow",
  Replied: "bg-emerald-500/15 text-emerald-400",
  Closed: "bg-violet-500/15 text-violet-400",
};

const mockLeads: Lead[] = [
  { id: "1", name: "Sarah Chen", title: "VP of Engineering", company: "TechFlow", linkedinUrl: "#", status: "Contacted", location: "San Francisco, CA" },
  { id: "2", name: "Marcus Johnson", title: "CTO", company: "DataPulse", linkedinUrl: "#", status: "Pending", location: "New York, NY" },
  { id: "3", name: "Emma Williams", title: "Head of Growth", company: "ScaleUp AI", linkedinUrl: "#", status: "Replied", location: "Austin, TX" },
  { id: "4", name: "David Park", title: "Director of Sales", company: "CloudNine", linkedinUrl: "#", status: "Closed", location: "Seattle, WA" },
  { id: "5", name: "Lisa Rodriguez", title: "CEO", company: "FinTech Labs", linkedinUrl: "#", status: "Pending", location: "Miami, FL" },
  { id: "6", name: "James Kim", title: "Product Manager", company: "NexGen", linkedinUrl: "#", status: "Contacted", location: "Chicago, IL" },
];

const LeadsPage = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "All">("All");

  const filtered = mockLeads.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const exportCSV = () => {
    const header = "Name,Title,Company,Status,Location\n";
    const rows = filtered.map((l) => `${l.name},${l.title},${l.company},${l.status},${l.location}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
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
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input w-full pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {(["All", "Pending", "Contacted", "Replied", "Closed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterStatus === s ? "bg-primary/20 text-primary-glow" : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Name</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Title</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Company</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Location</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border/20 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-5 py-4 font-medium">{lead.name}</td>
                  <td className="px-5 py-4 text-muted-foreground">{lead.title}</td>
                  <td className="px-5 py-4 text-muted-foreground">{lead.company}</td>
                  <td className="px-5 py-4 text-muted-foreground">{lead.location}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${statusColors[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <a href={lead.linkedinUrl} className="text-muted-foreground hover:text-primary-glow transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default LeadsPage;
