import { useState } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Copy, Check, RotateCw, Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type TradingType = "Export" | "Import" | "Trading" | "General";

interface GeneratedLead {
  name: string;
  company: string;
  title: string;
  message: string;
  trading_type: TradingType;
}

const sampleLeads: GeneratedLead[] = [
  { name: "Sarah Chen", company: "TechFlow", title: "VP of Engineering", message: "Hi Sarah, I noticed your impressive work leading engineering at TechFlow. We help engineering leaders like you streamline their hiring pipeline by 40% — would love to share how. Open to a quick chat this week?", trading_type: "General" },
  { name: "John Martinez", company: "GlobalTrade Inc", title: "Export Director", message: "Hey John, saw your recent post about scaling distributed teams at GlobalTrade — really resonated with our mission. We're helping companies like yours streamline export operations 3x faster. Worth a 15-min call?", trading_type: "Export" },
  { name: "Emma Williams", company: "ImportHub", title: "Operations Manager", message: "Hi Emma, congrats on the Series B milestone! As you scale your import logistics, we've been helping similar-stage companies reduce processing time by 60%. Would you be open to exploring how we could help?", trading_type: "Import" },
  { name: "David Park", company: "TradeFlow Solutions", title: "CEO", message: "Hi David, your trading platform caught our attention. We're helping B2B trading platforms like yours increase transaction volume by 45%. Interested in a quick discussion?", trading_type: "Trading" },
];

const AIMessagesPage = () => {
  const { user } = useAuth();
  const [service, setService] = useState("");
  const [audience, setAudience] = useState("");
  const [generated, setGenerated] = useState<GeneratedLead | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedLeads, setGeneratedLeads] = useState<GeneratedLead[]>([]);
  const [isSavingLead, setIsSavingLead] = useState(false);
  const [isSavingAll, setIsSavingAll] = useState(false);

  const generate = () => {
    if (!service || !audience) { toast.error("Please fill in both fields."); return; }
    setIsGenerating(true);
    setGenerated(null);
    setTimeout(() => {
      const randomLead = sampleLeads[Math.floor(Math.random() * sampleLeads.length)];
      setGenerated(randomLead);
      setIsGenerating(false);
    }, 1500);
  };

  const saveLead = async (lead: GeneratedLead) => {
    if (!user) {
      toast.error("You must be logged in to save leads");
      return;
    }
    setIsSavingLead(true);
    try {
      const { error } = await supabase.from("leads").insert({
        user_id: user.id,
        name: lead.name,
        company: lead.company,
        title: lead.title,
        trading_type: lead.trading_type,
        status: "Pending",
        notes: lead.message || null,
      });
      if (error) { toast.error(`Failed to save: ${error.message}`); }
      else {
        toast.success(`Lead "${lead.name}" saved!`);
        setGeneratedLeads([...generatedLeads, lead]);
        setGenerated(null);
      }
    } catch (err) {
      toast.error("Error saving lead");
    }
    setIsSavingLead(false);
  };

  const saveAllGeneratedLeads = async () => {
    if (!user || generatedLeads.length === 0) return;
    setIsSavingAll(true);
    try {
      const leadsToInsert = generatedLeads.map(lead => ({
        user_id: user.id,
        name: lead.name,
        company: lead.company,
        title: lead.title,
        trading_type: lead.trading_type,
        status: "Pending",
        notes: lead.message || null,
      }));
      const { error } = await supabase.from("leads").insert(leadsToInsert);
      if (error) { toast.error(`Failed to save: ${error.message}`); }
      else {
        toast.success(`${generatedLeads.length} leads saved!`);
        setGeneratedLeads([]);
      }
    } catch (err) {
      toast.error("Error saving leads");
    }
    setIsSavingAll(false);
  };

  const copyToClipboard = () => {
    if (generated) {
      navigator.clipboard.writeText(generated.message);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold mb-1">AI Lead Finder</h1>
        <p className="text-muted-foreground mb-8">Generate personalized leads and outreach messages powered by AI.</p>
      </motion.div>

      {/* Generate Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 space-y-5 mb-8">
        <div>
          <label className="block text-sm font-medium mb-1.5">Your Service / Product</label>
          <input type="text" placeholder="e.g. AI-powered recruiting platform" value={service} onChange={(e) => setService(e.target.value)} className="glass-input w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Target Audience</label>
          <input type="text" placeholder="e.g. VP of Engineering at Series B startups" value={audience} onChange={(e) => setAudience(e.target.value)} className="glass-input w-full" />
        </div>
        <button onClick={generate} disabled={isGenerating} className="btn-primary flex items-center gap-2 disabled:opacity-50">
          {isGenerating ? <RotateCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {isGenerating ? "Generating..." : "Generate Lead"}
        </button>
      </motion.div>

      {/* Generated Lead Display */}
      {generated && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-8">
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-muted-foreground">Name</label>
              <p className="font-medium text-lg">{generated.name}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Company</label>
              <p className="font-medium text-lg">{generated.company}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Title</label>
              <p className="font-medium text-base">{generated.title}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Trading Type</label>
              <p className="font-medium text-base">{generated.trading_type}</p>
            </div>
          </div>
          <div className="border-t border-border/40 pt-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium gradient-text">Suggested Message</h3>
              <button onClick={copyToClipboard} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{generated.message}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => generate()} className="flex-1 btn-outline-glow flex items-center justify-center gap-2 py-2">
              <RotateCw className="w-4 h-4" /> Generate Another
            </button>
            <button onClick={() => saveLead(generated)} disabled={isSavingLead} className="flex-1 btn-primary flex items-center justify-center gap-2 py-2 disabled:opacity-50">
              <Sparkles className="w-4 h-4" /> {isSavingLead ? "Saving..." : "Save Lead"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Saved Leads Preview */}
      {generatedLeads.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium gradient-text">Generated Leads ({generatedLeads.length})</h3>
            <button onClick={saveAllGeneratedLeads} disabled={isSavingAll} className="btn-primary flex items-center gap-2 text-sm py-2 px-4 disabled:opacity-50">
              <Download className="w-4 h-4" /> {isSavingAll ? "Saving..." : "Save All"}
            </button>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {generatedLeads.map((lead, i) => (
              <div key={i} className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.title} at {lead.company}</p>
                    <p className="text-xs text-primary-glow mt-1">{lead.trading_type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AIMessagesPage;
