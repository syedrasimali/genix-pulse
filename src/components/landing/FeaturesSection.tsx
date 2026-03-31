import { motion } from "framer-motion";
import { Search, MessageSquare, BarChart3, Download, Users, Sparkles } from "lucide-react";

const features = [
  { icon: Search, title: "Smart Lead Discovery", desc: "Find targeted LinkedIn prospects with intelligent filters and data enrichment." },
  { icon: Sparkles, title: "AI Message Generator", desc: "Generate hyper-personalized outreach messages that actually get replies." },
  { icon: Users, title: "Lead Management", desc: "Track, tag, and manage your entire pipeline with a powerful CRM-lite system." },
  { icon: BarChart3, title: "Analytics & Tracking", desc: "Monitor response rates, conversion metrics, and outreach performance." },
  { icon: Download, title: "CSV Export", desc: "Export your leads and data to CSV or Google Sheets in one click." },
  { icon: MessageSquare, title: "Outreach Workflows", desc: "Automate follow-ups and multi-step sequences for maximum engagement." },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Everything you need to <span className="gradient-text">close deals</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            A complete toolkit for modern sales teams and solopreneurs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass-card p-6 group cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-6 h-6 text-primary-glow" />
              </div>
              <h3 className="text-lg font-display font-semibold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
