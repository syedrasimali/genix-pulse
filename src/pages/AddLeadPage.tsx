import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Target, Building2, MapPin, Users, Briefcase, Search, Copy, Check, Plus, Loader2, Mail, MessageSquare, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface GeneratedLead {
  company_name: string;
  company_website: string;
  industry: string;
  location: string;
  target_role: string;
  decision_maker_type: string;
  pain_point: string;
  why_they_need_service: string;
  where_to_find_them: string;
  linkedin_search_hint: string;
  personalized_outreach_message: string;
  email_subject: string;
  email_body: string;
}

const AddLeadPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"manual" | "ai">("manual");

  // Manual form state
  const [form, setForm] = useState({ name: "", title: "", company: "", linkedinUrl: "", location: "", notes: "" });
  const [loading, setLoading] = useState(false);

  // AI finder state
  const [industry, setIndustry] = useState("");
  const [role, setRole] = useState("");
  const [aiLocation, setAiLocation] = useState("");
  const [audience, setAudience] = useState("");
  const [service, setService] = useState("");
  const [leads, setLeads] = useState<GeneratedLead[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [savingIdx, setSavingIdx] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("leads").insert({
      user_id: user.id, name: form.name, title: form.title || null,
      company: form.company || null, linkedin_url: form.linkedinUrl || null,
      location: form.location || null, notes: form.notes || null,
    });
    setLoading(false);
    if (error) { toast.error("Failed to add lead: " + error.message); return; }
    toast.success("Lead added successfully!");
    navigate("/dashboard/leads");
  };

  const handleGenerate = async () => {
    if (!industry || !role || !service) { toast.error("Industry, Target Role, aur Service fill karo!"); return; }
    setAiLoading(true);
    setLeads([]);
    try {
      const { data, error } = await supabase.functions.invoke("generate-leads", {
        body: { industry, role, location: aiLocation, audience, service },
      });
      if (error) throw error;
      if (data?.leads) { setLeads(data.leads); toast.success(`${data.leads.length} leads generate ho gayi!`); }
      else toast.error("Koi leads generate nahi hui");
    } catch { toast.error("Lead generation fail. Dobara try karo."); }
    setAiLoading(false);
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success("Copied!");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const saveToLeads = async (lead: GeneratedLead, idx: number) => {
    if (!user) return;
    setSavingIdx(idx);
    const { error } = await supabase.from("leads").insert({
      user_id: user.id, name: lead.target_role, company: lead.company_name,
      title: lead.target_role, location: lead.location, linkedin_url: null,
      notes: `Pain Point: ${lead.pain_point}\n\nWhy they need us: ${lead.why_they_need_service}\n\nLinkedIn Hint: ${lead.linkedin_search_hint}\n\nOutreach: ${lead.personalized_outreach_message}`,
    });
    if (error) toast.error("Save fail ho gayi");
    else toast.success(`${lead.company_name} leads mein save ho gayi!`);
    setSavingIdx(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">Add Leads</h1>
        <p className="text-muted-foreground mb-6">Manually add karo ya AI se leads find karo.</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-muted/30 mb-8 w-fit">
        <button onClick={() => setTab("manual")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === "manual" ? "bg-primary/20 text-primary-glow shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
          <UserPlus className="w-4 h-4" /> Manual Add
        </button>
        <button onClick={() => setTab("ai")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === "ai" ? "bg-primary/20 text-primary-glow shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
          <Target className="w-4 h-4" /> AI Lead Finder
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === "manual" ? (
          <motion.form key="manual" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
            {([
              { key: "name", label: "Full Name", placeholder: "e.g. Sarah Chen", type: "text" },
              { key: "title", label: "Job Title", placeholder: "e.g. VP of Engineering", type: "text" },
              { key: "company", label: "Company", placeholder: "e.g. TechFlow", type: "text" },
              { key: "linkedinUrl", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/...", type: "url" },
              { key: "location", label: "Location", placeholder: "e.g. San Francisco, CA", type: "text" },
            ] as const).map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium mb-1.5">{field.label}</label>
                <input type={field.type} placeholder={field.placeholder} value={form[field.key]}
                  onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                  className="glass-input w-full" required={field.key === "name"} />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium mb-1.5">Notes</label>
              <textarea placeholder="Add notes about this lead..." value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="glass-input w-full min-h-[100px] resize-y" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
              <UserPlus className="w-4 h-4" /> {loading ? "Adding..." : "Add Lead"}
            </button>
          </motion.form>
        ) : (
          <motion.div key="ai" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <div className="glass-card p-6 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium mb-1.5">
                    <Building2 className="w-3.5 h-3.5 text-muted-foreground" /> Industry *
                  </label>
                  <input type="text" placeholder="e.g. SaaS, FinTech, Healthcare" value={industry} onChange={(e) => setIndustry(e.target.value)} className="glass-input w-full" />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium mb-1.5">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" /> Target Role *
                  </label>
                  <input type="text" placeholder="e.g. Marketing Manager, CEO" value={role} onChange={(e) => setRole(e.target.value)} className="glass-input w-full" />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> Location
                  </label>
                  <input type="text" placeholder="e.g. USA, London, Pakistan" value={aiLocation} onChange={(e) => setAiLocation(e.target.value)} className="glass-input w-full" />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium mb-1.5">
                    <Search className="w-3.5 h-3.5 text-muted-foreground" /> Target Audience
                  </label>
                  <input type="text" placeholder="e.g. Series B startups, SMBs" value={audience} onChange={(e) => setAudience(e.target.value)} className="glass-input w-full" />
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-1.5 text-sm font-medium mb-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-muted-foreground" /> Your Service/Product *
                  </label>
                  <input type="text" placeholder="e.g. AI-powered recruiting platform" value={service} onChange={(e) => setService(e.target.value)} className="glass-input w-full" />
                </div>
              </div>
              <button onClick={handleGenerate} disabled={aiLoading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                {aiLoading ? "Generating..." : "Find Leads with AI"}
              </button>
            </div>

            <AnimatePresence>
              {leads.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h2 className="text-lg font-display font-semibold">{leads.length} Leads Found</h2>
                  {leads.map((lead, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="glass-card p-5 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-lg">{lead.company_name}</h3>
                          <p className="text-sm text-muted-foreground">{lead.industry} · {lead.location}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2.5 py-1 rounded-full bg-primary/15 text-primary-glow font-medium">{lead.decision_maker_type}</span>
                          <button onClick={() => saveToLeads(lead, i)} disabled={savingIdx === i}
                            className="btn-outline-glow text-xs py-1.5 px-3 flex items-center gap-1.5 disabled:opacity-50">
                            {savingIdx === i ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />} Save Lead
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div><span className="text-muted-foreground">Target Role:</span> <span className="ml-1.5 font-medium">{lead.target_role}</span></div>
                        <div><span className="text-muted-foreground">Website:</span>
                          <a href={lead.company_website.startsWith("http") ? lead.company_website : `https://${lead.company_website}`}
                            target="_blank" rel="noopener noreferrer" className="ml-1.5 text-primary-glow hover:underline inline-flex items-center gap-1">
                            {lead.company_website} <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                      <div className="text-sm"><span className="text-muted-foreground">Pain Point:</span> <span className="ml-1.5">{lead.pain_point}</span></div>
                      <div className="text-sm"><span className="text-muted-foreground">LinkedIn Search:</span>
                        <span className="ml-1.5 font-mono text-xs bg-muted/30 px-2 py-0.5 rounded">{lead.linkedin_search_hint}</span>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                          className="text-xs flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                          <Mail className="w-3.5 h-3.5" /> {expandedIdx === i ? "Hide" : "View"} Outreach
                        </button>
                        <button onClick={() => copyToClipboard(lead.personalized_outreach_message, i)}
                          className="text-xs flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                          {copiedIdx === i ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedIdx === i ? "Copied" : "Copy Message"}
                        </button>
                      </div>
                      <AnimatePresence>
                        {expandedIdx === i && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="space-y-3 pt-3 border-t border-border/30">
                              <div>
                                <div className="flex items-center gap-1.5 mb-1"><MessageSquare className="w-3.5 h-3.5 text-primary-glow" /><span className="text-xs font-medium gradient-text">Outreach Message</span></div>
                                <p className="text-sm text-muted-foreground bg-muted/20 rounded-lg p-3">{lead.personalized_outreach_message}</p>
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5 mb-1"><Mail className="w-3.5 h-3.5 text-primary-glow" /><span className="text-xs font-medium gradient-text">Cold Email</span></div>
                                <div className="bg-muted/20 rounded-lg p-3 space-y-2">
                                  <p className="text-sm font-medium">Subject: {lead.email_subject}</p>
                                  <p className="text-sm text-muted-foreground whitespace-pre-line">{lead.email_body}</p>
                                </div>
                                <button onClick={() => copyToClipboard(`Subject: ${lead.email_subject}\n\n${lead.email_body}`, i + 100)}
                                  className="mt-2 text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground">
                                  {copiedIdx === i + 100 ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy Email
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddLeadPage;
