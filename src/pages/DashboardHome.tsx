import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, MessageSquare, TrendingUp, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

type TradingType = "Export" | "Import" | "Trading" | "General";
type LeadStatus = "Pending" | "Contacted" | "Replied" | "Closed" | "Understood";

interface LeadData {
  status: LeadStatus;
  trading_type: TradingType;
}

const DashboardHome = () => {
  const { user } = useAuth();
  const [leadCount, setLeadCount] = useState(0);
  const [statusCounts, setStatusCounts] = useState({ pending: 0, contacted: 0, replied: 0, closed: 0, understood: 0 });
  const [tradingTypeCounts, setTradingTypeCounts] = useState({ export: 0, import: 0, trading: 0, general: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const { count } = await supabase.from("leads").select("*", { count: "exact", head: true });
      setLeadCount(count ?? 0);

      const { data } = await supabase.from("leads").select("status, trading_type");
      if (data) {
        setStatusCounts({
          pending: data.filter((l) => l.status === "Pending").length,
          contacted: data.filter((l) => l.status === "Contacted").length,
          replied: data.filter((l) => l.status === "Replied").length,
          closed: data.filter((l) => l.status === "Closed").length,
          understood: data.filter((l) => l.status === "Understood").length,
        });
        
        setTradingTypeCounts({
          export: data.filter((l) => l.trading_type === "Export").length,
          import: data.filter((l) => l.trading_type === "Import").length,
          trading: data.filter((l) => l.trading_type === "Trading").length,
          general: data.filter((l) => l.trading_type === "General").length,
        });
      }
      setLoading(false);
    };
    fetchStats();
  }, [user]);

  const stats = [
    { label: "Total Leads", value: leadCount.toString(), icon: Users },
    { label: "Contacted", value: statusCounts.contacted.toString(), icon: MessageSquare },
    { label: "Replied", value: statusCounts.replied.toString(), icon: TrendingUp },
    { label: "Closed", value: statusCounts.closed.toString(), icon: Target },
  ];

  const statusData = [
    { name: "Pending", value: statusCounts.pending, fill: "#6b7280" },
    { name: "Contacted", value: statusCounts.contacted, fill: "#3b82f6" },
    { name: "Replied", value: statusCounts.replied, fill: "#10b981" },
    { name: "Closed", value: statusCounts.closed, fill: "#ef4444" },
    { name: "Understood", value: statusCounts.understood, fill: "#8b5cf6" },
  ];

  const tradingTypeData = [
    { name: "Export", value: tradingTypeCounts.export, fill: "#f59e0b" },
    { name: "Import", value: tradingTypeCounts.import, fill: "#6366f1" },
    { name: "Trading", value: tradingTypeCounts.trading, fill: "#ec4899" },
    { name: "General", value: tradingTypeCounts.general, fill: "#14b8a6" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold mb-1">Dashboard</h1>
        <p className="text-muted-foreground mb-8">Welcome back. Here's your pipeline overview.</p>
      </motion.div>

      {loading ? (
        <div className="text-center text-muted-foreground">Loading...</div>
      ) : (
        <>
          {/* Stats Cards */}
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

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Status Distribution Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
              <h2 className="text-lg font-medium gradient-text mb-4">Lead Status Distribution</h2>
              {statusData.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No leads yet. Start generating leads to see the distribution.
                </div>
              )}
            </motion.div>

            {/* Trading Type Distribution Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
              <h2 className="text-lg font-medium gradient-text mb-4">Trading Type Distribution</h2>
              {tradingTypeData.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tradingTypeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" name="Count" radius={[8, 8, 0, 0]}>
                      {tradingTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No leads yet. Start generating leads to see the distribution.
                </div>
              )}
            </motion.div>
          </div>

          {/* Status Breakdown Row */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6 mt-8">
            <h2 className="text-lg font-medium gradient-text mb-6">Status Breakdown</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {statusData.map((status) => (
                <div key={status.name} className="p-4 bg-muted/20 rounded-lg border border-border/40">
                  <p className="text-sm text-muted-foreground mb-2">{status.name}</p>
                  <p className="text-2xl font-bold" style={{ color: status.fill }}>{status.value}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {leadCount > 0 ? `${((status.value / leadCount) * 100).toFixed(1)}%` : "0%"}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default DashboardHome;
