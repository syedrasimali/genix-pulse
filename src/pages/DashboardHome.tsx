import { motion } from "framer-motion";
import { Users, MessageSquare, TrendingUp, Target } from "lucide-react";

const stats = [
  { label: "Total Leads", value: "1,248", change: "+12%", icon: Users },
  { label: "Messages Sent", value: "856", change: "+8%", icon: MessageSquare },
  { label: "Response Rate", value: "24.3%", change: "+3.2%", icon: TrendingUp },
  { label: "Conversions", value: "142", change: "+18%", icon: Target },
];

const DashboardHome = () => (
  <div className="p-8">
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-display font-bold mb-1">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome back. Here's your pipeline overview.</p>
    </motion.div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground text-sm">{s.label}</span>
            <s.icon className="w-4 h-4 text-primary-glow" />
          </div>
          <div className="text-2xl font-display font-bold">{s.value}</div>
          <span className="text-xs text-primary-glow">{s.change} this month</span>
        </motion.div>
      ))}
    </div>

    {/* Recent activity placeholder */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-6"
    >
      <h2 className="text-lg font-display font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-3">
        {["Sarah Chen contacted via LinkedIn", "New lead: Marcus Johnson at TechCorp", "AI message generated for Emma Williams", "Lead status updated: David Park → Replied"].map((activity, i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
            <div className="w-2 h-2 rounded-full bg-primary-glow/60" />
            <span className="text-sm text-muted-foreground">{activity}</span>
            <span className="ml-auto text-xs text-muted-foreground/60">{i + 1}h ago</span>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
);

export default DashboardHome;
