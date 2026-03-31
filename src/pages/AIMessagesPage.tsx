import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Copy, Check, RotateCw } from "lucide-react";
import { toast } from "sonner";

const sampleMessages = [
  "Hi Sarah, I noticed your impressive work leading engineering at TechFlow. We help engineering leaders like you streamline their hiring pipeline by 40% — would love to share how. Open to a quick chat this week?",
  "Hey Sarah, saw your recent post about scaling distributed teams at TechFlow — really resonated with our mission at LeadGenix. We're helping companies like yours find top-tier talent 3x faster. Worth a 15-min call?",
  "Hi Sarah, congrats on the Series B at TechFlow! As you scale your team, we've been helping similar-stage companies reduce time-to-hire by 60%. Would you be open to exploring how we could help?",
];

const AIMessagesPage = () => {
  const [service, setService] = useState("");
  const [audience, setAudience] = useState("");
  const [generated, setGenerated] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!service || !audience) {
      toast.error("Please fill in both fields.");
      return;
    }
    setIsGenerating(true);
    setGenerated("");
    // Simulate AI generation
    setTimeout(() => {
      setGenerated(sampleMessages[Math.floor(Math.random() * sampleMessages.length)]);
      setIsGenerating(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold mb-1">AI Message Generator</h1>
        <p className="text-muted-foreground mb-8">Generate personalized outreach messages powered by AI.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium mb-1.5">Your Service / Product</label>
          <input
            type="text"
            placeholder="e.g. AI-powered recruiting platform"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="glass-input w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Target Audience</label>
          <input
            type="text"
            placeholder="e.g. VP of Engineering at Series B startups"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="glass-input w-full"
          />
        </div>
        <button onClick={generate} disabled={isGenerating} className="btn-primary flex items-center gap-2 disabled:opacity-50">
          {isGenerating ? (
            <RotateCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {isGenerating ? "Generating..." : "Generate Message"}
        </button>
      </motion.div>

      {generated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mt-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium gradient-text">Generated Message</h3>
            <button onClick={copyToClipboard} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{generated}</p>
        </motion.div>
      )}
    </div>
  );
};

export default AIMessagesPage;
