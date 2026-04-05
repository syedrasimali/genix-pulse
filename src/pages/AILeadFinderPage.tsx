import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Building2, MapPin, Users, Briefcase, Target, Copy, Check, Plus, Loader2, Mail, MessageSquare, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

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

const AILeadFinderPage = () => {
  const { user } = useAuth();
  const [industry, setIndustry] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [audience, setAudience] = useState("");
  const [service, setService] = useState("");
  const [leads, setLeads] = useState<GeneratedLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [savingIdx, setSavingIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!industry || !role || !service) {
      toast.error("Industry, Target Role, aur Service fill karo!");
      return;
    }
    setLoading(true);
    setLeads([]);
    try {
      const { data, error } = await supabase.functions.invoke("generate-leads", {
        body: { industry, role, location, audience, service },
      });
      if (error) throw error;
      if (data?.leads) {
        setLeads(data.leads);
        toast.success(`${data.leads.length} leads generate ho gayi!`);
      } else {
        toast.error("Koi leads generate nahi hui");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Lead generation fail ho gayi. Dobara try karo.");
    }
    setLoading(false);
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
      user_id: user.id,
      name: lead.target_role,
      company: lead.company_name,
      title: lead.target_role,
      location: lead.location,
      linkedin_url: null,
      notes: `Pain Point: ${lead.pain_point}\n\nWhy they need us: ${lead.why_they_need_service}\n\nLinkedIn Hint: ${lead.linkedin_search_hint}\n\nOutreach: ${lead.personalized_outreach_message}`,
    });
    if (error) {
      toast.error("Save fail ho gayi");
    } else {
      toast.success(`${lead.company_name} leads mein save ho gayi!`);
    }
    setSavingIdx(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Target className="w-7 h-7 text-primary-glow" />
          <h1 className="text-2xl sm:text-3xl font-display font-bold">AI Lead Finder</h1>
        </div>
        <p className="text-muted-foreground mb-8">Real companies aur decision makers AI se find karo — outreach messages ke saath.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 mb-8">
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
            <input type="text" placeholder="e.g. Marketing Manager, CEO, CTO" value={role} onChange={(e) => setRole(e.target.value)} className="glass-input w-full" />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> Location
            </label>
            <input type="text" placeholder="e.g. USA, London, Pakistan" value={location} onChange={(e) => setLocation(e.target.value)} className="glass-input w-full" />
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
            <input type="text" placeholder="e.g. AI-powered recruiting platform, SEO agency" value={service} onChange={(e) => setService(e.target.value)} className="glass-input w-full" />
          </div>
        </div>
        <button onClick={handleGenerate} disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
          {loading ? "Generating Leads..." : "Find Leads with AI"}
        </button>
      </motion.div>

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
                      {savingIdx === i ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                      Save Lead
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Target Role:</span>
                    <span className="ml-1.5 font-medium">{lead.target_role}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Website:</span>
                    <a href={lead.company_website.startsWith("http") ? lead.company_website : `https://${lead.company_website}`} target="_blank" rel="noopener noreferrer"
                      className="ml-1.5 text-primary-glow hover:underline inline-flex items-center gap-1">
                      {lead.company_website} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground">Pain Point:</span>
                  <span className="ml-1.5">{lead.pain_point}</span>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground">LinkedIn Search:</span>
                  <span className="ml-1.5 font-mono text-xs bg-muted/30 px-2 py-0.5 rounded">{lead.linkedin_search_hint}</span>
                </div>

                <div className="flex gap-2 pt-1">
                  <button onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                    className="text-xs flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                    {expandedIdx === i ? "Hide" : "View"} Outreach
                  </button>
                  <button onClick={() => copyToClipboard(lead.personalized_outreach_message, i)}
                    className="text-xs flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                    {copiedIdx === i ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedIdx === i ? "Copied" : "Copy Message"}
                  </button>
                </div>

                <AnimatePresence>
                  {expandedIdx === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <div className="space-y-3 pt-3 border-t border-border/30">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <MessageSquare className="w-3.5 h-3.5 text-primary-glow" />
                            <span className="text-xs font-medium gradient-text">Outreach Message</span>
                          </div>
                          <p className="text-sm text-muted-foreground bg-muted/20 rounded-lg p-3">{lead.personalized_outreach_message}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <Mail className="w-3.5 h-3.5 text-primary-glow" />
                            <span className="text-xs font-medium gradient-text">Cold Email</span>
                          </div>
                          <div className="bg-muted/20 rounded-lg p-3 space-y-2">
                            <p className="text-sm font-medium">Subject: {lead.email_subject}</p>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">{lead.email_body}</p>
                          </div>
                          <button onClick={() => copyToClipboard(`Subject: ${lead.email_subject}\n\n${lead.email_body}`, i + 100)}
                            className="mt-2 text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground">
                            {copiedIdx === i + 100 ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            Copy Email
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
    </div>
  );
};

export default AILeadFinderPage;
