import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, MessageSquare, TrendingUp, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const DashboardHome = () => {
  const { user } = useAuth();
  const [leadCount, setLeadCount] = useState(0);
  const [statusCounts, setStatusCounts] = useState({ contacted: 0, replied: 0, closed: 0 });

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const { count } = await supabase.from("leads").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      setLeadCount(count ?? 0);

      const { data } = await supabase.from("leads").select("status").eq("user_id", user.id);
      if (data) {
        setStatusCounts({
          contacted: data.filter((l) => l.status === "Contacted").length,
          replied: data.filter((l) => l.status === "Replied").length,
          closed: data.filter((l) => l.status === "Closed").length,
        });
      }
    };
    fetchStats();
  }, [user]);

  const stats = [
    { label: "Total Leads", value: leadCount.toString(), icon: Users },
    { label: "Contacted", value: statusCounts.contacted.toString(), icon: MessageSquare },
    { label: "Replied", value: statusCounts.replied.toString(), icon: TrendingUp },
    { label: "Closed", value: statusCounts.closed.toString(), icon: Target },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold mb-1">Dashboard</h1>
        <p className="text-muted-foreground mb-8">Welcome back. Here's your pipeline overview.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground text-sm">{s.label}</span>
              <s.icon className="w-4 h-4 text-primary-glow" />
            </div>
            <div className="text-2xl font-display font-bold">{s.value}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
